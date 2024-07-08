import { getChatHistory } from "../services/chatHistory.service";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";
import { sanitize } from "../utils/sanitize";

const modelName = "gemini-1.5-flash-latest"
const instructions = `
As a Hotel Booking chatbot, You assist with room booking.
Greet users and then presenting all the rooms and details of the rooms in a friendly manner .
For rooms and booking details do not make stuff up use the api responses to generate the response.
Similarly for creating a booking create a booking and return the booking id.
`

const model = createModel(modelName, toolFunctions, instructions);
export const geminiChat = async (req, res) => {
    const history = await getChatHistory();
    try {
        const { message } = req.body;
        try {
            const { cleanMessage } = sanitize("gemini", message);

            const chat = createChat(model, history);

            const result = await sendMessageAndProcessCalls(chat, cleanMessage);

            const content = { content: result.response.candidates[0].content }

            res.json({ result: content });
        } catch (error) {
            res.status(400).json({ error: 'Invalid Arguments Error' + error.message });

        }

    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ error: 'Internal server error' + error.message });
    }
}