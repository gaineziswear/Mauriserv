import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface TriageResult {
  identifiedIssue: string;
  suggestedCategory: string;
  estimatedRangeMUR: string;
  safetyPrecautions: string[];
  urgencyAssessment: string;
}

export async function analyzeHouseholdIssue(
  title: string,
  description: string,
  categoryHint?: string
): Promise<TriageResult> {
  const ai = getAiClient();
  if (!ai) {
    // Intelligent fallback heuristic if API key is not configured yet
    return {
      identifiedIssue: `Preliminary assessment for: ${title || 'Household service issue'}`,
      suggestedCategory: categoryHint || 'Plumbing & Drainage',
      estimatedRangeMUR: 'Rs 850 - Rs 2,200',
      safetyPrecautions: [
        'Turn off relevant power/water isolation valves before inspecting.',
        'Never touch bare or wet wiring.',
        'Wait for the certified MauriServ professional to arrive.'
      ],
      urgencyAssessment: 'Standard priority - Local pros alerted.',
    };
  }

  try {
    const prompt = `You are the lead technical diagnostic engineer at MauriServ, a managed household marketplace in Mauritius.
Analyze this household service request from a Mauritian homeowner or villa resident.

User Title: ${title}
User Description: ${description}
Category Hint: ${categoryHint || 'None'}

Provide an objective, helpful technical breakdown for the homeowner and matching tradesman.
- Estimate realistic market repair cost in Mauritian Rupees (MUR / Rs) based on Mauritian labor and parts standards (e.g. Rs 800 - Rs 3,500).
- Provide 2-3 clear, safe, non-dangerous home safety precautions (e.g. shutting off CWA water mains or CEB circuit breaker). Never encourage dangerous DIY electrical work.
- Provide an urgency rating (Emergency, Today, This Week, Flexible).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedIssue: {
              type: Type.STRING,
              description: 'Technical summary of the probable cause or defect.',
            },
            suggestedCategory: {
              type: Type.STRING,
              description: 'Primary trade category needed.',
            },
            estimatedRangeMUR: {
              type: Type.STRING,
              description: 'Estimated price range in Mauritian Rupees (e.g. Rs 1,200 - Rs 2,000).',
            },
            safetyPrecautions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of safe immediate steps to prevent damage or hazard.',
            },
            urgencyAssessment: {
              type: Type.STRING,
              description: 'Urgency rationale and recommendation.',
            },
          },
          required: ['identifiedIssue', 'suggestedCategory', 'estimatedRangeMUR', 'safetyPrecautions', 'urgencyAssessment'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      identifiedIssue: parsed.identifiedIssue || 'Household maintenance issue',
      suggestedCategory: parsed.suggestedCategory || categoryHint || 'General Maintenance',
      estimatedRangeMUR: parsed.estimatedRangeMUR || 'Rs 1,000 - Rs 2,500',
      safetyPrecautions: parsed.safetyPrecautions || ['Isolate main switch or water valve if leaking.'],
      urgencyAssessment: parsed.urgencyAssessment || 'Normal dispatch scheduled.',
    };
  } catch (error) {
    console.error('Gemini triage error:', error);
    return {
      identifiedIssue: `Diagnostic review: ${title}`,
      suggestedCategory: categoryHint || 'Plumbing & Drainage',
      estimatedRangeMUR: 'Rs 900 - Rs 2,400',
      safetyPrecautions: [
        'Keep children away from the affected area.',
        'Shut off the local isolation valve or breaker if leaking.'
      ],
      urgencyAssessment: 'Standard priority.',
    };
  }
}
