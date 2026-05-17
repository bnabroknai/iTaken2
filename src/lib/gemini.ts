import { GoogleGenAI } from '@google/genai';
import { db } from './db';

const apiKey = process.env.GEMINI_API_KEY || 'dummy-key';
const ai = new GoogleGenAI({ apiKey });

export async function generateGoalPlan(goalTitle: string, targetDate: string) {
  if (apiKey === 'dummy-key') {
    return "AI Plan generation is disabled in this environment. Please set an API key.";
  }
  try {
    // Gather context from offline DB
    const rules = await db.rules.toArray();
    const recentLogs = await db.logs.orderBy('timestamp').reverse().limit(30).toArray();

    const restrictionsStr = rules.filter(r => r.ruleType === 'restriction')
      .map(r => `- ${r.type}: ${r.item} (Limit/Allergy: ${r.description})`).join('\n');
      
    const prescriptionsStr = rules.filter(r => r.ruleType === 'prescription')
      .map(r => `- ${r.type}: ${r.item} (Required/Prescribed: ${r.description})`).join('\n');

    const logsStr = recentLogs.map(l => {
      const moodStr = l.mood ? ` Mood: ${l.mood}, Energy: ${l.energy}` : '';
      return `- ${new Date(l.timestamp).toLocaleDateString()}: ${l.type} - ${l.amount} ${l.item}.${moodStr}`;
    }).join('\n');

    const prompt = `You are a helpful wellness and intake planning assistant.
The user has set a new goal: "${goalTitle}" with a target date of ${targetDate || 'None'}.

Here are their current restrictions/allergies:
${restrictionsStr || 'No restrictions logged.'}

Here are their prescribed/required intakes:
${prescriptionsStr || 'No prescriptions logged.'}

Here are their recent intake logs:
${logsStr || 'No recent logs yet.'}

Analyze the user's goal considering their specifically logged restrictions and prescriptions. Generate a safe, structured, and achievable daily plan or set of actionable guidelines. The plan should account for slow reductions where necessary (like safely tapering off specific foods, or if relevant, adhering closely to medication limitations) while strictly considering required prescriptions. Keep it encouraging, concise, and easy to read on a mobile device. Return the response as clean Markdown without unnecessary fluff.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a warm, empathetic health assistant. Prioritize safety and adherence to the user's stated restrictions and prescriptions."
      }
    });

    return response.text || "Could not generate a plan. Please try again.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error connecting to AI. Please check your internet connection as plan generation requires online access.";
  }
}
