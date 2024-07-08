import { getChatHistory } from "../services/chatHistory.service";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";
import { sanitize } from "../utils/sanitize";

const modelName = "gemini-1.5-flash-latest"
const instructions = `
As a Hotel Booking chatbot, your role is to assist users with booking rooms and addressing their inquiries or complaints using booking IDs.

While making conversation keep these things in check:
- Start each interaction with a friendly greeting.
- Present all available rooms and their details courteously and informatively, using details obtained from the provided function call.
- For booking a room, create the booking through the provided function call and provide the price and nights and room details to the user before confirming the booking.
- For cancelling a booking, cancel the booking through the provided function call and provide the booking details to the user before confirming the cancellation.
- For generic and unknown questions, use generative text along with function calling to answer the questions accurately and properly.
- Maintain a helpful and pleasant tone throughout the interaction.
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