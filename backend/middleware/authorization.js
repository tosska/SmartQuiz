import { AuthController } from "../controllers/AuthController.js";


export function enforceAuthentication(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        next({status: 401, message: "Unauthorized"});
        return;
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
        if (err) {
            next({status: 401, message: "Unauthorized"});
        } else {
            req.username = decodedToken.user;
            next();
        }
    });
}

export async function ensureUsersModifyOnlyOwnQuizzes(req, res, next) {
    const user = req.username;
    const quizId = req.params.quizId;
    const userHasPermission = await AuthController.canUserModifyQuiz(user, quizId);
    if (userHasPermission) {
        next();
    } else {
        next ({
            status: 403,
            message: "Forbidden! You do not have permission to view or modify this resource"
        });
    }
}