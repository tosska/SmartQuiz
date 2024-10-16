import express from "express";
import { AuthController } from "../controllers/AuthController.js";



export const authenticationRouter = express.Router();

/**
 * @swagger
 *  /login:
 *      post:
 *          description: Authenticate user
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: user credentials to authenticate
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              usr:
 *                                  type: string
 *                                  example: Lorenzo
 *                              pwd:
 *                                  type: string
 *                                  example: p4ssw0rd
 *              responses:
 *                  200:
 *                      description: User authenticated
 *                  401:
 *                      description: Invalid credentials
 */
authenticationRouter.post("/login", async (req, res) => {
    let isAuthenticated = await AuthController.checkCredentials(req, res);
    if (isAuthenticated) {
        res.json(AuthController.issueToken(req.body.usr));
    } else {
        res.status(401);
        res.json( {error: "Invalid credentials. Try again."});
    }
});


/**
 * @swagger
 *  /signup:
 *      post:
 *          description: Register user
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: user credentials to authenticate
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              usr:
 *                                  type: string
 *                                  example: Lorenzo
 *                              pwd:
 *                                  type: string
 *                                  example: p4ssw0rd
 *              responses:
 *                  200:
 *                      description: User saved
 *                  401:
 *                      description: Invalid credentials
 */
authenticationRouter.post("/signup", (req, res, next) => {
    AuthController.saveUser(req, res).then((user) => {
        res.json(user);
    }).catch((err) => {
        console.error(err);
        next({status: 500, message: "Could not save user"});
    })
});