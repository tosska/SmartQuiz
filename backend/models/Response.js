import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Response', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Anonymous" // Se l'utente non specifica un nome, verrà salvato come "Anonymous"
        },
        answer: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        correct: {
            type: DataTypes.BOOLEAN, // Campo per indicare se la risposta è corretta
            allowNull: false
        }

    });
}