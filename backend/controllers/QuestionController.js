import { Question } from "../models/Database.js";

export class QuestionController {
    
    static async getQuestionsForCurrentQuiz(req){
        return Question.findAll({
          where: {
            QuizId: req.params.quizId
          }
        })
    }

    static async saveQuestion(req) {
        let question = Question.build(req.body);
        question.QuizId = req.params.quizId;
        return question.save();
    }

    static async findById(questionId) {
        return Question.findByPk(questionId);
    }
    
    
    static async delete(req) {
        const questionId = req.params.id; // ID della domanda
        const quizId = req.params.quizId; // ID del quiz associato
    
        console.log('Tentativo di eliminare la domanda con ID:', questionId, 'del quiz con ID:', quizId);
        
        // Cerca la domanda
        const question = await this.findById(questionId);
        
        if (!question) {
            throw new Error('Question not found');
        }
    
        // Verifica che l'ID del quiz corrisponda
        if (question.QuizId !== parseInt(quizId)) {
            throw new Error('This question does not belong to the specified quiz');
        }
    
        // Elimina la domanda
        await question.destroy();
        return question; // Restituisci la domanda eliminata
    }
    
    



}