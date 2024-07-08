import { getChatHistory } from "../services/chatHistory.service";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";
import { sanitize } from "../utils/sanitize";

const modelName = "gemini-1.5-flash-latest"
const instructions = `
As a Hotel Booking chatbot, you assist users with room bookings and handle their inquiries or complaints using booking IDs. 
Your interactions should start with a friendly greeting, followed by presenting all available rooms and their details in a courteous and informative manner. 
When providing room and booking details, use only the information obtained from API responses. 
For booking a room, create a booking through the API and return the booking details. 
Maintain a helpful and pleasant tone throughout the interaction.
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