import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface HealthData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number;
  heartRate: number;
  sleepHours: number;
  isSmoking: boolean;
  exerciseFrequency: string;
  symptoms: string;
}

export interface PredictionResult {
  diabetesRisk: number;
  heartDiseaseRisk: number;
  hypertensionRisk: number;
  kidneyDiseaseRisk: number;
  healthScore: number;
  riskLevel: "Low" | "Medium" | "High";
  summary: string;
  recommendations: string[];
}

export async function predictHealthRisks(data: HealthData): Promise<PredictionResult> {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Analyze the following health data and predict the risk of Diabetes, Heart Disease, Hypertension, and Kidney Disease.
    Also calculate an overall Health Score from 0 to 100 where:
    - 90–100: Excellent
    - 70–89: Good
    - 50–69: Risk
    - Below 50: Critical

    Provide risk percentages (0-100), an overall risk level (Low, Medium, High), a brief summary, and specific health recommendations.

    Data:
    - Age: ${data.age}
    - Gender: ${data.gender}
    - BMI: ${(data.weight / ((data.height / 100) ** 2)).toFixed(1)} (Height: ${data.height}cm, Weight: ${data.weight}kg)
    - Blood Pressure: ${data.bloodPressureSystolic}/${data.bloodPressureDiastolic} mmHg
    - Blood Sugar: ${data.bloodSugar} mg/dL
    - Heart Rate: ${data.heartRate} bpm
    - Lifestyle: ${data.sleepHours}h sleep, Smoking: ${data.isSmoking ? 'Yes' : 'No'}, Exercise: ${data.exerciseFrequency}
    - Symptoms: ${data.symptoms || 'None'}

    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diabetesRisk: { type: Type.NUMBER },
          heartDiseaseRisk: { type: Type.NUMBER },
          hypertensionRisk: { type: Type.NUMBER },
          kidneyDiseaseRisk: { type: Type.NUMBER },
          healthScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["diabetesRisk", "heartDiseaseRisk", "hypertensionRisk", "kidneyDiseaseRisk", "healthScore", "riskLevel", "summary", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
}

export interface DrugInfo {
  name: string;
  manufacturer: string;
  dosage: string;
  uses: string[];
  sideEffects: string[];
  warnings: string;
}

export async function identifyDrug(base64Image: string): Promise<DrugInfo> {
  const model = "gemini-3-flash-preview";

  const prompt = "Identify this medicine from the image. Provide the name, manufacturer, typical dosage, uses, side effects, and any major warnings. Return the response in JSON format.";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      { text: prompt },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          manufacturer: { type: Type.STRING },
          dosage: { type: Type.STRING },
          uses: { type: Type.ARRAY, items: { type: Type.STRING } },
          sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.STRING },
        },
        required: ["name", "manufacturer", "dosage", "uses", "sideEffects", "warnings"],
      },
    },
  });

  return JSON.parse(response.text);
}
