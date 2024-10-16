import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";


import { authenticationRouter } from "./routes/authenticationRouter.js";
import { quizRouter } from "./routes/quizRouter.js";
import { questionRouter } from "./routes/questionRouter.js";
import { responseRouter } from "./routes/responseRouter.js";
import { resultRouter } from "./routes/resultRouter.js";

const app = express(); // creates an express application
const PORT = 3000;

// Register the morgan logging middleware, use the 'dev' format
app.use(morgan('dev'));

app.use(cors()); 

// Parse incoming requests with a JSON payload
app.use(express.json());

//error handler
app.use( (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({
        code: err.status || 500,
        description: err.message || "An error occurred"
    });
});

// generate OpenAPI spec and show Swagger UI
// Initialize swagger-jsdoc -> returns validated Swagger spec in json format
const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.1.0',
        info: 'SmartQuiz REST API',
        version: '1.0.0',
    },
    apis: ['./routes/*Router.js'], // files containing annotations
});

// Swagger UI will be available at /api-docs
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.use(authenticationRouter);
app.use(questionRouter);
app.use(quizRouter);
app.use(responseRouter);
app.use(resultRouter);


app.listen(PORT);