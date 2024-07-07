import { createThread, runAssistant, handleRunStatus, createMessage } from "../utils/openai/openaiBotHelpers";
import { createAssistantIfNeeded } from "../utils/openai/createAssistant";

export const assistantChat = async (req, res) => {

    const { message, threadId } = req.body;

    await createMessage(threadId, message);

    const runObject = await runAssistant(threadId);

    await handleRunStatus(res, threadId, runObject);
};

export const getThread = async (_, res) => {
    try {
        const thread = await createThread();
        res.json({ thread: thread.id });
    } catch (error) {
        res.json({ error: error.message });
    }
}