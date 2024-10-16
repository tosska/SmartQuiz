import express from "express";
import { QuestionController } from "../controllers/QuestionController.js";
import { enforceAuthentication, ensureUsersModifyOnlyOwnQuizzes } from "../middleware/authorization.js";

export const questionRouter = new express.Router();

questionRouter.get("/all-quizzes/:quizId/questions", (req, res, next) => {
    QuestionController.getQuestionsForCurrentQuiz(req).then(questionItems => {
      res.json(questionItems)
    }).catch(err => {
      next(err);
    });
});

questionRouter.post("/my-quizzes/:quizId/questions", enforceAuthentication, (req, res, next) => { 
    QuestionController.saveQuestion(req).then( result => {
        res.json(result);
    }).catch(err => {
        next(err);
    });
});

questionRouter.delete("/my-quizzes/:quizId/questions/:id", enforceAuthentication, ensureUsersModifyOnlyOwnQuizzes, (req, res, next) => {
    QuestionController.delete(req).then( (item) => {
        if (item)
            res.json(item);
        else
            next({status: 404, message: "Question not found"});
    }).catch( err => {
        next(err);
    })
  });


  