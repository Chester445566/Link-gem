
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Job, UserProfile, Alert, InteractionHistory, IntegrationState, InterviewQuestion } from "../types";
import { MOCK_LINKEDIN_DATA, MOCK_GMAIL_DATA } from "./mockData";

const getAiClient = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const MOCK_ANALYSIS: AnalysisResult = {
    matchScore: 88,
    pros: ["Strong React experience matches core requirements", "Local experience in KSA market", "Arabic speaker (Native)"],
    cons: ["No prior Fintech experience"],
    missingSkills: ["SAMA Regulations"],
    verdict: "Strong candidate. Local presence and language skills are a huge plus for this Riyadh role.",
    cultureFit: "High. Your background matches the fast-paced transformation culture typical of Vision 2030 projects."
};

export const analyzeJobMatch = async (job: Job, userProfile: UserProfile): Promise<AnalysisResult> => {
  const ai = getAiClient();
  
  if (!ai) {
      await new Promise(r => setTimeout(r, 1500));
      return MOCK_ANALYSIS;
  }
  
  const prompt = `
    Act as a professional recruiter specializing in the GCC market (Saudi Arabia, UAE). Analyze the fit between this candidate and this job.
    
    Candidate:
    Title: ${userProfile.title}
    Skills: ${userProfile.skills.join(', ')}
    Arabic Proficiency: ${userProfile.arabicProficiency}
    Visa Status: ${userProfile.visaStatus}
    
    Job:
    Title: ${job.title}
    Company: ${job.company}
    Location: ${job.location}
    Visa Req: ${job.visaRequirements}
    Arabic Req: ${job.arabicRequired}
    Details: ${job.description}
    
    Provide JSON.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            matchScore: { type: Type.INTEGER },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING },
            cultureFit: { type: Type.STRING, description: "Assessment of fit for GCC business culture" }
            },
            required: ["matchScore", "pros", "cons", "missingSkills", "verdict"]
        }
        }
    });

    if (response.text) {
        return JSON.parse(response.text) as AnalysisResult;
    }
  } catch (error) {
      console.error("Gemini API Error:", error);
  }

  return MOCK_ANALYSIS;
};

export const generateCoverEmail = async (job: Job, userProfile: UserProfile, analysis: AnalysisResult): Promise<{ subject: string; body: string }> => {
  const ai = getAiClient();

  if (!ai) {
      return {
          subject: `Application for ${job.title} - ${userProfile.name}`,
          body: `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job.title} position at ${job.company}. Based in ${userProfile.location || 'the region'}, I admire ${job.company}'s growth in the GCC.\n\nBest,\n${userProfile.name}`
      };
  }

  const prompt = `
    Write a professional email for a job application in the Middle East.
    Candidate: ${userProfile.name} (${userProfile.title})
    Job: ${job.title} at ${job.company} in ${job.location}.
    
    Tone: Professional, respectful, and ambitious.
    Return JSON {subject, body}.
  `;

  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }
        }
        }
    });

    if (response.text) return JSON.parse(response.text);
  } catch (error) { console.error(error); }
  
  throw new Error("Failed to generate email.");
};

// New Function: WhatsApp Generator
export const generateWhatsAppMessage = async (job: Job, userProfile: UserProfile): Promise<string> => {
    const ai = getAiClient();
    const fallback = `Salam, I hope you are doing well. I saw the ${job.title} role at ${job.company} and I believe my profile is a great match. Would love to connect. - ${userProfile.name}`;

    if (!ai) return fallback;

    const prompt = `
        Write a short, professional WhatsApp message to a recruiter in Dubai/Riyadh.
        Start with "Salam" or "Hi".
        Candidate: ${userProfile.name}
        Job: ${job.title} at ${job.company}
        Context: Found via LinkGen App.
        Tone: Professional but conversational, typical for WhatsApp business in GCC.
        Max length: 250 characters.
        Return strict text string.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text?.trim() || fallback;
    } catch (e) {
        return fallback;
    }
};

export const generateSmartAlerts = async (
  jobs: Job[], userProfile: UserProfile, history: InteractionHistory, integrations: IntegrationState
): Promise<Alert[]> => {
  const ai = getAiClient();
  
  const fallbackAlerts: Alert[] = [
      {
          id: 'fallback-1',
          title: 'Riyadh Role Match',
          message: 'SABIC Digital is looking for React devs. Fits your profile perfectly.',
          timestamp: Date.now(),
          read: false,
          type: 'SMART_MATCH',
          sourceContext: 'Learning',
          priority: 'high',
          emailedToUser: true,
          emailContent: {
              subject: 'Job Match: SABIC Digital',
              body: 'Found a great role in Riyadh matching your transferable Iqama status...'
          },
          whatsappContent: "Salam! found a high priority match at SABIC Riyadh for you."
      }
  ];

  if (!ai) return fallbackAlerts;

  const prompt = `
    You are a Recruiter Bot for the GCC market.
    User: ${userProfile.name}, Skills: ${userProfile.skills}, Location: ${userProfile.location}.
    Integrated: LinkedIn (${integrations.linkedinConnected}), Gmail (${integrations.gmailConnected}).
    
    Generate alerts for best matching jobs.
    If the job is in KSA and user has transferable Iqama/Citizen status, mark high priority.
    
    Return JSON array of Alert objects including 'whatsappContent'.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    message: { type: Type.STRING },
                    jobId: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["SMART_MATCH"] },
                    sourceContext: { type: Type.STRING, enum: ["LinkedIn", "Gmail", "Learning"] },
                    priority: { type: Type.STRING, enum: ["high", "normal"] },
                    emailContent: {
                        type: Type.OBJECT,
                        properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }
                    },
                    whatsappContent: { type: Type.STRING, description: "Short message for WhatsApp notification" }
                }
            }
        }
        }
    });

    if (response.text) {
        const rawAlerts = JSON.parse(response.text);
        return rawAlerts.map((a: any) => ({
            ...a,
            id: Date.now().toString() + Math.random(),
            timestamp: Date.now(),
            read: false,
            emailedToUser: true
        }));
    }
  } catch (e) { console.error(e); }
  
  return fallbackAlerts;
};

export const generateInterviewQuestions = async (job: Job): Promise<InterviewQuestion[]> => {
    // Keep existing logic but perhaps prompt for "Cultural Fit" questions related to GCC
    const ai = getAiClient();
    if (!ai) {
        return [
            { question: "How do you handle tight deadlines common in Vision 2030 projects?", type: "Behavioral", aiTip: "Emphasize agility." },
            { question: "Describe your experience with React state management.", type: "Technical", aiTip: "Mention Redux or Context API." },
            { question: "How do you approach localization (RTL) in frontend?", type: "Technical", aiTip: "Discuss CSS direction and i18n libraries." }
        ];
    }
    const prompt = `Generate interview questions for ${job.title} at ${job.company} (${job.location}). Include technical and regional culture fit questions.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["Technical", "Behavioral"] },
                            aiTip: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        if (response.text) return JSON.parse(response.text);
    } catch (e) { }
    return [];
};
