import { Quiz, Question, Response, Result } from "../models/Database.js";
import QRCode from 'qrcode';


export class QuizController {
  
  static async getQuizzesForCurrentUser(req){
    return Quiz.findAll({
      where: {
        UserUserName: req.username
      }
    })
  }

  static async getAllQuizzes(req){
    return Quiz.findAll()
  }
  
  static async saveQuiz(req){
    let quiz = Quiz.build(req.body);
    quiz.UserUserName = req.username;
    return quiz.save();
  }

  static async findById(req) {
    return Quiz.findByPk(req.params.quizId);
  }

  static async delete(req) {
    return new Promise(async (resolve, reject) => {
        try {
            // Trova il quiz per ID
            const item = await this.findById(req);
            if (!item) {
                return reject(new Error('Quiz not found'));
            }

            // Elimina tutte le domande associate a quel quiz
            await Question.destroy({ where: { QuizId: item.id } });

            // Elimina tutte le risposte associate a quel quiz
            await Response.destroy({ where: { QuizId: item.id } });

            await Result.destroy({ where: { QuizId: item.id } });

            // Elimina il quiz stesso
            await item.destroy();
            
            resolve(item);
        } catch (error) {
            reject(error);
        }
    });
  }

  static async generateQrCode(req) {
    const quizId = req.params.quizId; 

    // Trova il quiz dal database
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      // Se il quiz non viene trovato, lancia un errore che verrà catturato nel router
      throw new Error('Quiz non trovato');
    }

    // Crea l'URL del quiz
    const url = `http://localhost:4200/quiz-details/${quizId}`;
    
    // Genera il QR code
    const qrCodeUrl = await QRCode.toDataURL(url);
    
    // Restituisce il QR code 
    return qrCodeUrl;
  }

}