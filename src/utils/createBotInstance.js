import { openai } from "../config/apikey";
import { handleRequiresAction } from "../services/botHandleActionService";
export async function createThread() {
    const thread = await openai.beta.threads.create();
    console.log(thread);
    return thread;
}

export async function createMessage(thread, message) {
    await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message,
    });
}

export async function runAssistant(thread, assistant) {
    console.log("Running assistant for thread: " + thread.id);
    const runObject = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistant.id,
    });

    console.log(runObject);

    return runObject;
}

export async function handleRunStatus(res, thread, run) {

    const status = run.status;

    if (status === "completed") {
        let messageList = await openai.beta.threads.messages.list(thread.id);
        let messages = [];

        messageList.body.data.forEach((message) => {
            messages.push(message.content);
        });

        console.log(messages.data);
        res.json({ messages });

    } else if (status === "requires_action") {
        console.log(run.status);
        return await handleRequiresAction(res, thread, run);
    } else {
        console.error("Run did not complete:", run.status);
    }
}