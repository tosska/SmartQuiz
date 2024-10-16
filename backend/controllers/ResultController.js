import { Result } from "../models/Database.js";

export class ResultController {

    static async getQuizResult(req) {
        return Result.findAll({
            where: {
                QuizId: req.params.id
            }
        });
    }

}