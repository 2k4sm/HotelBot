import { createThread, runAssistant, handleRunStatus, createMessage } from "../utils/openai/openaiBotHelpers";
import { createAssistantIfNeeded } from "../utils/openai/createAssistant";

export const chatThread = await createThread();
export const assistant = await createAssistantIfNeeded();
export const assistantChat = async (req, res) => {

    const { message } = req.body;

    await createMessage(chatThread, message);

    const runObject = await runAssistant(chatThread, assistant);

    await handleRunStatus(res, chatThread, runObject);
};