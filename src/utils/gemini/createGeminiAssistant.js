import { gemini } from "../../config/apiconfig";
import { createChatHistory } from "../../services/chatHistory.service";
import { functions } from "./geminiHelperFunctions";

export function createModel(modelName, toolFunctions, instructions) {
    const model = gemini.getGenerativeModel(
        { model: modelName, tools: toolFunctions, systemInstruction: instructions },
        { apiVersion: "v1beta" },
    );

    return model
}

export function createChat(model, history) {
    const chat = model.startChat({
        history: history
    });

    return chat;
}

export async function sendMessageAndProcessCalls(chat, message) {
    try {
        const result = await chat.sendMessage(message);

        const response = result.response

        await createChatHistory({
            role: "user",
            parts: [{ text: message }]
        })

        await createChatHistory({
            role: "model",
            parts: [{ text: response.text() }]
        })


        if (response.candidates.length === 0) {
            throw new Error("No candidates");
        }

        const content = result.response.candidates[0].content;

        if (content.parts.length === 0) {
            throw new Error("No parts");
        }

        let callToProcess = content.parts[0].functionCall;
        if (!callToProcess) {
            callToProcess = content.parts[1].functionCall;
        }
        if (callToProcess) {
            const { name, args } = callToProcess;
            const fn = functions[name];
            if (!fn) {
                throw new Error(`Unknown function "${name}"`);
            }
            const apiResp = [
                {
                    functionResponse: {
                        name,
                        response: JSON.parse(await functions[name](args)),
                    },
                },
            ]

            const request2 = JSON.stringify(apiResp)
            const response2 = await chat.sendMessage(request2);

            await createChatHistory({
                role: "model",
                parts: [{ text: response2.response.text() }]
            })

            const result2 = response2
            return result2;
        } else {
            return result;
        }
    } catch (error) {
        throw new Error(error);
    }

}