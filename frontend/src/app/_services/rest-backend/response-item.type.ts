// Interface for the ResponseItem type
export interface ResponseItem {
    id?: number;                    // ID della risposta
    name: string;                   // Se l'utente non specifica un nome, verrà salvato come "Anonymous"
    answer: string;                 // Risposta fornita dall'utente
    correct: boolean;               // Indica se la risposta è corretta
    QuestionId: number; 
    QuizId: number; 
    ResultId: number;
    questionText?: string;  
    createdAt?: Date;               // Data di creazione della risposta
    updatedAt?: Date;               // Data di aggiornamento della risposta
}
