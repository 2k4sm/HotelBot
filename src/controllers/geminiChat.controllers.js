import { checkAndDoFunctionCalling, createModel, createSession, sendMessage } from "../utils/gemini/createGeminiAssistant";

const modelName = "gemini-1.5-pro";
const instructions = "You are a Hotel Booking chatbot. You have to assist users in booking rooms in the hotel.";
const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
};

let history = [];
let model;
let session;

(async () => {
    model = createModel(modelName, instructions);
    session = await createSession(model, generationConfig, history);
})();

export const geminiChat = async (req, res) => {
    try {
        const { message } = req.body;

        const response = await sendMessage(session, message);

        const respAfterFunctionCall = await checkAndDoFunctionCalling(session, response);

        res.json({ respAfterFunctionCall });
    } catch (error) {
        console.error("Error in geminiChat:", error);
        res.status(500).json({ error: error.message });
    }
};