import express from "express";
import { ResponseController } from "../controllers/ResponseController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const responseRouter = new express.Router();

responseRouter.post("/quiz-partecipation/:id/submit", async (req, res, next) => {
    try {
        console.log('Richiesta ricevuta:', req.body);
        await ResponseController.submitQuizResponse(req, res); 
    } catch (err) {
        next(err);
    }
});



responseRouter.get("/my-quizzes/:id/responses", enforceAuthentication, async (req, res, next) => {
    try {
        const result = await ResponseController.getQuizResponses(req); // Chiama solo con req
        return res.status(result.status).json(result.data || { error: result.error });
    } catch (err) {
        next(err);
    }
});




