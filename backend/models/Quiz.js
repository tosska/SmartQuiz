import { DataTypes } from "sequelize";

export function createModel(database) {
    database.define('Quiz', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        maxErrors: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    });
}