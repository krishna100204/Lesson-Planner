export interface LessonPlan {
  id?: number;
  topic: string;
  gradeLevel: string;
  mainConcept: string;
  subtopics: string;
  materials: string;
  objectives: string;
  outline: string;
  generatedContent?: string;
}