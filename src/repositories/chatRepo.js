import { ChatMessage } from "../models/chat";

export const createChatMessage = async (messageData) => {
    try {
        const message = await ChatMessage.create(messageData);

        if (getAllChatMessages().length > 20) {
            deleteChatMessage(getAllChatMessages()[0].id);
        }
        return message;
    } catch (error) {
        console.error('Error creating chat message:', error);
    }
};

export const getAllChatMessages = async () => {
    try {
        const messages = await ChatMessage.findAll({
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
        });
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
        } else {
            console.log('Chat message not found');
        }
    } catch (error) {
        console.error('Error deleting chat message:', error);
    }
};