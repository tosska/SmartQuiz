import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Question', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('multiple', 'open'),
            allowNull: false
        },
        questionText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        options: {
            type: DataTypes.JSONB,
            allowNull: true,  // Sarà `null` per le domande a risposta aperta
            validate: {
                isValidOptions(value) {
                    if (this.type === 'multiple' && (!Array.isArray(value) || value.length !== 4)) {
                        throw new Error("Le domande a risposta multipla devono avere esattamente 4 opzioni");
                    }
                }
            }
        },
        correctAnswer: {
            type: DataTypes.STRING,  
            allowNull: false
        }

    });
}