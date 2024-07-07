import { openai } from "../config/apiconfig";
import { bookRoom, fetchRooms } from "./roomBookingService";
import { handleRunStatus } from "../utils/botHelpers";
export async function handleRequiresAction(res, thread, run) {
    if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
    ) {
        const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(
            async (tool) => {
                const { name, arguments: args } = tool.function;
                if (name === "getAvailableRooms") {
                    return {
                        tool_call_id: tool.id,
                        output: await fetchRooms(),
                    };
                } else if (name === "bookRoom") {
                    const { id, fullName, email, nights } = JSON.parse(args);
                    return {
                        tool_call_id: tool.id,
                        output: await bookRoom(id, fullName, email, nights),
                    };
                }
            },
        );

        if (toolOutputs.length > 0) {
            run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
                thread.id,
                run.id,
                { tool_outputs: toolOutputs },
            );
            console.log("Tool outputs submitted successfully.");
        } else {
            console.log("No tool outputs to submit.");
        }

        return await handleRunStatus(res, thread, run);
    }
}