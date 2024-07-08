import db from "../config/dbconn";
import { DataTypes } from "sequelize";

export const ChatMessage = db.define('ChatMessage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parts: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    timestamps: true
});


