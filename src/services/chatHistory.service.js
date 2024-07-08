import { getAllChatMessages } from "../repositories/chatRepo";
import { createChatMessage } from "../repositories/chatRepo";
export async function getChatHistory() {
    try {
        const chats = await getAllChatMessages();
        if (!chats) {
            return []
        }
        return chats;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return JSON.stringify({ error: error.message });
    }
}

export async function createChatHistory(messageData) {
    try {
        const chats = await createChatMessage(messageData);
        if (!chats) {
            throw new Error('No chat history found');
        }
        return chats;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return JSON.stringify({ error: error.message });
    }

}