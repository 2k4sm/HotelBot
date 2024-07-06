import db from "../config/dbconn"

import { DataTypes } from "sequelize"

class Chat extends Model { }


Chat.init(
    {
        messages: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        date: {
            type: DataTypes.DATE
        }
    },
    {
        db,
        modelName: 'Chat'
    }
)

export default Chat;