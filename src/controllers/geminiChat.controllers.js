import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { getChatHistory } from "../services/chatHistory.service";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";
import { sanitize } from "../utils/sanitize";

const safetySettings = [

    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
]
const modelName = "gemini-1.5-flash-latest"
const instructions = `
As a Hotel Booking chatbot, your role is to assist users with booking rooms and addressing their inquiries or complaints.

While making conversation keep these things in check:
- Start each interaction with a friendly greeting.
- Present all available rooms and their details courteously and informatively, using details obtained from the provided getAvailableRooms function call.
- For booking a room, use the provided bookRoom function call and provide the booking details to the user after creating the booking.
- For getting the booking details, use the provided getBooking function call and the provided bookingId.
- For cancelling a booking, cancel the booking through the provided cancelBooking function call and using bookingId and provide booking details after cancellation.
- For generic and unknown questions, use generative text along with function calling to answer the questions accurately and properly.
- Maintain a helpful and pleasant tone throughout the interaction.
`

const model = createModel(modelName, toolFunctions, instructions, safetySettings);
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