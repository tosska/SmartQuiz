import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Result', {
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
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        passed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    });
}
