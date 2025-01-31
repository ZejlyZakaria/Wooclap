import { Question } from './question.model';

export type Course = {
  code: string;
  title: string;
  description: string; // Step 1 - add a description
  questions: Question[]; 
};
