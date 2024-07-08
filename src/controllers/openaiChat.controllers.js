import { createThread, runAssistant, handleRunStatus, createMessage } from "../utils/openai/openaiBotHelpers";
import { sanitize } from "../utils/sanitize";
export const assistantChat = async (req, res) => {

    try {
        const { message, threadId } = req.body;

        const { cleanMessage, cleanThreadId } = sanitize("gpt", message, threadId);

        await createMessage(cleanThreadId, cleanMessage);

        const runObject = await runAssistant(threadId);

        await handleRunStatus(res, threadId, runObject);

    } catch (error) {
        res.json({ error: error.message });
    }
};

export const getThread = async (_, res) => {
    try {
        const thread = await createThread();
        res.json({ thread: thread.id });
    } catch (error) {
        res.json({ error: error.message });
    }
}