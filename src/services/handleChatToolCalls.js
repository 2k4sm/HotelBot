import { bookRoom, fetchRooms } from "./roomBookingService";
import { openai } from "../config/apiconfig";
export async function handleToolCalling(response) {
    console.log(response)
    const responseMessage = response.choices[0].message;

    const toolCalls = responseMessage.tool_calls;
    if (responseMessage.tool_calls) {
        const availableFunctions = {
            getAvailableRooms: fetchRooms,
            bookRoom: bookRoom,
        };
        messages.push(responseMessage);
        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(
                functionArgs.id,
                functionArgs.fullName,
                functionArgs.email,
                functionArgs.nights,
            );
            messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: functionName,
                content: functionResponse,
            });
        }
        const secondResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k-0613",
            messages: messages,
        });
        return secondResponse.choices;
    }
} 