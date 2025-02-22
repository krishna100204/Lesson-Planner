import { LessonPlan } from '@/types';

const STORAGE_KEY = 'lessonPlans';

export function saveLessonPlan(plan: LessonPlan) {
  try {
    const existingPlans = getLessonPlans();
    const updatedPlans = [...existingPlans, { ...plan, id: Date.now() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (error) {
    console.error('Error saving lesson plan:', error);
    return false;
  }
}

export function getLessonPlans(): LessonPlan[] {
  try {
    const plans = localStorage.getItem(STORAGE_KEY);
    return plans ? JSON.parse(plans) : [];
  } catch (error) {
    console.error('Error getting lesson plans:', error);
    return [];
  }
}

export function deleteLessonPlan(id: number) {
  try {
    const plans = getLessonPlans();
    const updatedPlans = plans.filter(plan => plan.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
    return true;
  } catch (error) {
    console.error('Error deleting lesson plan:', error);
    return false;
  }
}