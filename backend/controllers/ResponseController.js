import { Quiz, Question, Response, Result } from "../models/Database.js";

export class ResponseController {
    static async submitQuizResponse(req, res) {
        const { id } = req.params;  
        const { name, answers } = req.body;  
        
        // Troviamo il quiz corrispondente
        const quiz = await Quiz.findByPk(id, { include: [Question] });
        if (!quiz) {
            return res.status(404).json({ error: "Quiz non trovato" });
        }
        
        // Calcolo del punteggio
        let score = 0;
        
        console.log('Risposte ricevute dal frontend:', req.body); // Aggiunto per debug

        // Iteriamo su ogni risposta
        for (const answer of answers) {
            const { questionId, answer: responseText } = answer; 
            const question = quiz.Questions.find(q => q.id === questionId);
        
            if (!question) {
                return res.status(400).json({ error: `Domanda con ID ${questionId} non trovata.` });
            }
        
            let correct = false;
        
            // Verifica la risposta
            if (typeof responseText === 'string') {
                if (question.type === 'multiple') {
                    correct = (responseText === question.correctAnswer);
                } else if (question.type === 'open') {
                    correct = (responseText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase());
                }
            }
        
            if (correct) score++;

            // Creiamo la risposta nella tabella Responses per ogni risposta fornita
            // Nota: Non salviamo qui ancora la risposta, perché non abbiamo l'ID del risultato.
        }
        
        const maxScore = quiz.Questions.length;
        const passed = score >= (maxScore - quiz.maxErrors);  
        
        // Creiamo un record nella tabella Result
        const result = await Result.create({
            name: name || "Anonymous",
            QuizId: quiz.id,
            score,
            passed
        });
        
        // Ora che abbiamo l'ID del risultato, possiamo salvare le risposte
        for (const answer of answers) {
            const { questionId, answer: responseText } = answer; 
            const question = quiz.Questions.find(q => q.id === questionId);
        
            // Verifica se la domanda è valida
            if (!question) {
                continue; // Ignoriamo le risposte per domande non valide
            }
            
            let correct = false;

            // Verifica la risposta
            if (typeof responseText === 'string') {
                if (question.type === 'multiple') {
                    correct = (responseText === question.correctAnswer);
                } else if (question.type === 'open') {
                    correct = (responseText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase());
                }
            }

            // Creiamo la risposta associando il risultato
            await Response.create({
                name: name || "Anonymous",
                answer: responseText, // La risposta fornita
                correct,              // Se la risposta è corretta
                QuestionId: question.id, // Colleghiamo la risposta alla domanda
                QuizId: quiz.id,      // Colleghiamo la risposta al quiz
                ResultId: result.id   // Colleghiamo la risposta al risultato
            });
        }
        
        console.log('Risultato da restituire:', JSON.stringify({ score, passed }, null, 2));
        
        return res.status(200).json({ score, passed });
    }

    static async getQuizResponses(req) {
        try {
            const quizId = req.params.id; // Ottieni l'ID del quiz dai parametri
            console.log('ID quiz:', quizId); // Log per verificare l'ID
    
            const responses = await Response.findAll({
                where: {
                    QuizId: quizId // Filtra le risposte in base all'ID del quiz
                }
            });
    
            // Restituisci le risposte come oggetto JSON
            return {
                status: 200,
                data: responses
            };
        } catch (error) {
            console.error('Errore nel recupero delle risposte:', error);
            // Restituisci un errore
            return {
                status: 500,
                error: 'Errore nel recupero delle risposte'
            };
        }
    }
    
    
    
    
}
