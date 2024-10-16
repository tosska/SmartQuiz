// Interface for the QuestionItem type
export interface QuestionItem {
    id?: number;
    type: 'multiple' | 'open';   
    questionText: string;
    options?: string[];      
    correctAnswer: string;   
    QuizId: number;   
    createdAt?: Date;        
    updatedAt?: Date;        
  }
  