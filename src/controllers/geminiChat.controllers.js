import { gemini } from "../config/apiconfig";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";
import { sanitize } from "../utils/sanitize";

const modelName = "gemini-1.5-flash-latest"
const instructions = "As a Hotel Booking chatbot, You assist with room reservations and handle complaints using booking IDs. Greet users with presenting available rooms for their stay."

const model = createModel(modelName, toolFunctions, instructions);
const history = [];
export const geminiChat = async (req, res) => {
    try {
        const { message } = req.body;
        try {
            const { cleanMessage } = sanitize("gemini", message);

            const chat = createChat(model, history);

            const result = await sendMessageAndProcessCalls(chat, cleanMessage, history);

            const content = { content: result.response.candidates[0].content }

            res.json(content);
        } catch (error) {
            res.status(400).json({ error: 'Invalid Arguments Error' + error.message });

        }

    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ error: 'Internal server error' + error.message });
    }
}