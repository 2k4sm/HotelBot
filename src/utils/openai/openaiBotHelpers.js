import { openai } from "../../config/apiconfig";
import { handleRequiresAction } from "../../services/botHandleActionService";
import { createAssistantIfNeeded } from "./createAssistant";
export async function createThread() {
    const thread = await openai.beta.threads.create();
    console.log(thread);
    return thread;
}

export async function createMessage(threadId, message) {
    await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
    });
}

export async function runAssistant(threadId) {
    const assistant = await createAssistantIfNeeded();

    console.log("Running assistant for threadId: " + threadId);
    const runObject = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistant.id,
    });

    console.log(runObject);

    return runObject;
}

export async function handleRunStatus(res, threadId, run) {

    const status = run.status;

    if (status === "completed") {
        let messageList = await openai.beta.threads.messages.list(threadId);
        let messages = [];

        messageList.body.data.forEach((message) => {
            messages.push(message.content);
        });

        const message = messages[0];
        console.log(messages.data);
        res.json({ message });

    } else if (status === "requires_action") {
        console.log(run.status);
        return await handleRequiresAction(res, threadId, run);
    } else {
        console.error("Run did not complete:", run.status);
        await openai.beta.threads.runs.cancel(
            threadId,
            run.id
        );
    }
}