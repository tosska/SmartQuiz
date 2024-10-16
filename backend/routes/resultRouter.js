import express from "express";
import { ResultController } from "../controllers/ResultController.js";
import { enforceAuthentication } from "../middleware/authorization.js";

export const resultRouter = new express.Router();

resultRouter.get("/my-quizzes/:id/results", enforceAuthentication, async (req, res, next) => {
    ResultController.getQuizResult(req).then(result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
});
