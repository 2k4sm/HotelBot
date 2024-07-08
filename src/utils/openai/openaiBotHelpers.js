import { openai } from "../../config/apiconfig";
import { createAssistantIfNeeded } from "./createOpenaiAssistant";
import { bookRoom, fetchRooms, cancelBooking, getBooking } from "../../services/roomBooking.service";
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

export async function handleRequiresAction(res, threadId, run) {
    if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
    ) {
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls;

        // Process tool calls and collect tool outputs
        const toolOutputs = await Promise.all(toolCalls.map(async (tool) => {
            const { name, arguments: args } = tool.function;
            let output;

            try {
                if (name === "getAvailableRooms") {
                    output = await fetchRooms();
                } else if (name === "bookRoom") {
                    const { id, fullName, email, nights } = JSON.parse(args);
                    output = await bookRoom(id, fullName, email, nights);
                } else if (name === "getBooking") {
                    const { bookingId } = JSON.parse(args);
                    output = await getBooking(bookingId);
                } else if (name === "cancelBooking") {
                    const { userName, bookingId } = JSON.parse(args);
                    output = await cancelBooking(userName, bookingId);
                }

                if (output) {
                    return {
                        tool_call_id: tool.id,
                        output,
                    };
                } else {
                    return null;
                }
            } catch (error) {
                console.error(`Error processing tool call ${name}:`, error);
                return null;
            }
        }));

        if (toolOutputs.length > 0) {
            try {
                run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
                    threadId,
                    run.id,
                    { tool_outputs: toolOutputs },
                );
                console.log("Tool outputs submitted successfully.");
            } catch (error) {
                console.error("Error submitting tool outputs:", error);
                res.status(500).json({ error: "Error submitting tool outputs." });
                return;
            }
        } else {
            console.log("No valid tool outputs to submit.");
        }

        return await handleRunStatus(res, threadId, run);
    } else {
        console.log("No required action for tool outputs.");
        res.status(400).json({ error: "No required action for tool outputs." });
    }
}
