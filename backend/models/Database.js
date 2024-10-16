import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createQuizModel } from "./Quiz.js";
import { createModel as createQuestionModel } from "./Question.js";
import { createModel as createResponseModel } from "./Response.js";
import { createModel as createResultModel } from "./Result.js";

import 'dotenv/config.js';  // Legge il file .env e lo rende disponibile in process.env

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

// Crea i modelli
createUserModel(database);
createQuizModel(database);
createQuestionModel(database);
createResponseModel(database);
createResultModel(database);

// Esporta i modelli
export const { User, Quiz, Question, Response, Result } = database.models;

// Associazioni tra i modelli
User.hasMany(Quiz);                  // Un utente può avere molti quiz
Quiz.belongsTo(User);                // Un quiz appartiene a un utente

Quiz.hasMany(Question);               // Un quiz può avere molte domande
Question.belongsTo(Quiz);             // Una domanda appartiene a un quiz

Question.hasMany(Response);           // Una domanda può avere molte risposte
Response.belongsTo(Question);         // Una risposta appartiene a una domanda

Quiz.hasMany(Response);               // Un quiz può avere molte risposte
Response.belongsTo(Quiz);             // Una risposta appartiene a un quiz

Quiz.hasMany(Result);                 // Un quiz può avere molti risultati (precedentemente statistiche)
Result.belongsTo(Quiz);               // Un risultato appartiene a un quiz

Result.hasMany(Response);              // Un risultato può avere molte risposte
Response.belongsTo(Result);            // Una risposta appartiene a un risultato

// Sincronizzazione del database
database.sync()
    .then(() => {
        console.log("Database sincronizzato correttamente");
    })
    .catch(err => {
        console.error("Errore nella sincronizzazione del database: " + err.message);
    });
