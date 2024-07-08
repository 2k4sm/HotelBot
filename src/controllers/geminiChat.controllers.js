import { gemini } from "../config/apiconfig";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";

const modelName = "gemini-1.5-flash-latest"
const instructions = "As a Hotel Booking chatbot, You assist with room reservations and handle complaints using booking IDs"

const model = createModel(modelName, toolFunctions, instructions);
const history = [];
export const geminiChat = async (req, res) => {
    try {
        const { message } = req.body;

        const chat = createChat(model, history);

        const result = await sendMessageAndProcessCalls(chat, message, history);

        res.json({ result });
    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ error: 'Internal server error' + error.message });
    }
}