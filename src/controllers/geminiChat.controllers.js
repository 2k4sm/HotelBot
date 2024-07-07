import { gemini } from "../config/apiconfig";
import { createModel, sendMessageAndCheckForCalls } from "../utils/gemini/createGeminiAssistant";

const model = createModel();
export const geminiChat = async (req, res) => {
    const { message } = req.body;

    const result = await sendMessageAndCheckForCalls(model, message);

    res.json({ result });
}