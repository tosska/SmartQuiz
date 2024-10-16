import { User, Quiz } from "../models/Database.js";
import { Op } from "sequelize";
import Jwt from "jsonwebtoken";

/**
 * Controller for handling authentication related operations.
 */
export class AuthController { 
    
    
    static async checkCredentials(req, res) {
        let user = new User({ //user data specified in the request
            userName: req.body.usr,
            password: req.body.pwd
        });

        let found = await User.findOne({
            where: {
                userName: user.userName,
                password: user.password // password was hashed when creating user
            }
        });

        return found !== null;
    }

    static async canUserModifyQuiz(user, quizId) {
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return quiz.UserUserName === user;
    }
    

    static async saveUser(req, res) {
        let user = new User({
            userName: req.body.usr,
            password: req.body.pwd
        });
        return user.save();
    }

    static issueToken(username) {
        return Jwt.sign({user:username}, process.env.TOKEN_SECRET, {expiresIn: `${24*60*60}s`});
    }

    static isTokenValid(token, callback) {
        Jwt.verify(token, process.env.TOKEN_SECRET, callback);
    }

}