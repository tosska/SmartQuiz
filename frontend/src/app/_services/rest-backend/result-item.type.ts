// Interface for the StatisticItem type
export interface ResultItem {
    id?: number;
    name: string;                   // Se l'utente non specifica un nome, verrà salvato come "Anonymous"
    score: number;
    passed: boolean;
    QuizId: number; 
    ResultId: number;
    createdAt?: Date;
    updatedAt?: Date;

}

