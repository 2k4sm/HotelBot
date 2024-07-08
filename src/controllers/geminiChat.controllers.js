import { getChatHistory } from "../services/chatHistory.service";
import { createModel, sendMessageAndProcessCalls, createChat } from "../utils/gemini/createGeminiAssistant";
import { toolFunctions } from "../utils/gemini/geminiHelperFunctions";
import { sanitize } from "../utils/sanitize";

const modelName = "gemini-1.5-flash-latest"
const instructions = `
As a Hotel Booking chatbot, You assist with room reservations and handle complaints using booking IDs. 
Greet users with presenting available rooms for their stay.
When generating content, adhere to the following tone and style guidelines:
- Use a friendly, conversational tone that is easy to understand
- Write in short, concise sentences and paragraphs
- Use active voice whenever possible
- Avoid jargon or technical terms unless absolutely necessary
- Use bullet points or numbered lists to break up long passages and improve readability
- Ensure all content is grammatically correct and free of spelling errors   
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

            res.json(content);
        } catch (error) {
            res.status(400).json({ error: 'Invalid Arguments Error' + error.message });

        }

    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ error: 'Internal server error' + error.message });
    }
}