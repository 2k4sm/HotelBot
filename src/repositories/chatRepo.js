import { ChatMessage } from "../models/chat";

export const createChatMessage = async (messageData) => {
    try {
        const message = await ChatMessage.create(messageData);
        console.log('Chat message created:', message.toJSON());

        if (getAllChatMessages().length > 10) {
            deleteChatMessage(getAllChatMessages()[0].id);
        }
        return message;
    } catch (error) {
        console.error('Error creating chat message:', error);
    }
};

export const getAllChatMessages = async () => {
    try {
        const messages = await ChatMessage.findAll();
        console.log('All chat messages:', JSON.stringify(messages, null, 2));
        return messages;
    } catch (error) {
        console.error('Error fetching chat messages:', error);
    }
};


const deleteChatMessage = async (id) => {
    try {
        const deletedRows = await ChatMessage.destroy({
            where: { id: id }
        });
        if (deletedRows) {
            console.log('Chat message deleted');
        } else {
            console.log('Chat message not found');
        }
    } catch (error) {
        console.error('Error deleting chat message:', error);
    }
};

export const getChatMessagesByRole = async (role) => {
    try {
        const messages = await ChatMessage.findAll({
            where: { role: role }
        });
        console.log(`Chat messages with role ${role}:`, JSON.stringify(messages, null, 2));
        return messages;
    } catch (error) {
        console.error(`Error fetching chat messages with role ${role}:`, error);
    }
};

export const getChatMessagesByDate = async (date) => {
    try {
        const messages = await ChatMessage.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.gte]: new Date(date),
                    [Sequelize.Op.lt]: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
                }
            }
        });
        console.log(`Chat messages on date ${date}:`, JSON.stringify(messages, null, 2));
        return messages;
    } catch (error) {
        console.error(`Error fetching chat messages on date ${date}:`, error);
    }
};