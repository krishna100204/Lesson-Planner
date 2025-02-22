import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateLessonPlan(topic: string, gradeLevel: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Create a detailed lesson plan for teaching "${topic}" to ${gradeLevel} students. Include:
1. Main concept and key subtopics
2. List of required materials
3. Clear learning objectives
4. Detailed lesson outline with:
   - Introduction/Hook
   - Main activities
   - Assessment strategies
   - Closure
5. Suggested classroom activities
6. Assessment questions

Format the response in a clear, structured way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    throw new Error('Failed to generate lesson plan. Please try again.');
  }
}