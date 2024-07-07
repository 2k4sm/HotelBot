import { openai } from "../config/apiconfig";
import { bookRoom, fetchRooms } from "./roomBookingService";
import { handleRunStatus } from "../utils/openai/openaiBotHelpers";

export async function handleRequiresAction(res, thread, run) {
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
                    thread.id,
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

        return await handleRunStatus(res, thread, run);
    } else {
        console.log("No required action for tool outputs.");
        res.status(400).json({ error: "No required action for tool outputs." });
    }
}
