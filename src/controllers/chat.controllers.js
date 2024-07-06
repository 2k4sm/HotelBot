import { openai } from "../config/apikey";
import { createThread, runAssistant, handleRunStatus, createMessage } from "../utils/createBotInstance";
import { createAssistantIfNeeded } from "../utils/createAssistant";


export const chatThread = await createThread();
export const assistant = await createAssistantIfNeeded();
export const chat = async (req, res) => {

    const { message } = req.body;

    await createMessage(chatThread, message);

    const runObject = await runAssistant(chatThread, assistant);

    await handleRunStatus(res, chatThread, runObject);
};

