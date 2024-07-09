import { gemini } from "../../config/apiconfig";
import { createChatHistory, getChatHistory } from "../../services/chatHistory.service";
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

        let result = await chat.sendMessage(message);

        const response = result.response

        await createChatHistory({
            role: "user",
            parts: [{ text: message }]
        })

        try {
            if (result.response.candidates[0].content.parts[0].text) {
                await createChatHistory({
                    role: "model",
                    parts: [{ text: result.response.candidates[0].content.parts[0].text }]
                })
            }
        } catch (error) {
            return {
                response: {
                    candidates: [
                        {
                            content: {
                                parts: [
                                    {
                                        text: "I'm here to assist with professional inquiries related to hotel bookings and services. If you have any questions or need help with a booking, please let me know!"
                                    }
                                ],
                                role: "model"
                            }
                        }
                    ]
                }           
            }

        }



        if (response.candidates.length === 0) {
            throw new Error("No candidates");
        }

        const content = result.response.candidates[0].content;

        if (content.parts.length === 0) {
            throw new Error("No parts");
        }
        let callToProcess = result.response.functionCalls();

        while (callToProcess) {
            let apiResp = [];
            if (callToProcess) {
                for (let call of callToProcess) {
                    const { name, args } = call;
                    const fn = functions[name];
                    if (!fn) {
                        throw new Error(`Unknown function "${name}"`);
                    }
                    apiResp.push(
                        {
                            functionResponse: {
                                name,
                                response: JSON.parse(await functions[name](args)),
                            },
                        },
                    )
                }

                const message = JSON.stringify(apiResp)
                result = await chat.sendMessage(message);

                try {
                    if (result.response.candidates[0].content.parts[0].text) {
                        await createChatHistory({
                            role: "model",
                            parts: [{ text: result.response.candidates[0].content.parts[0].text }]
                        })
                    }
                } catch (error) {
                    return {
                        response: {
                            candidates: [
                                {
                                    content: {
                                        parts: [
                                            {
                                                text: "I'm here to assist with booking hotel rooms and addressing related inquiries or complaints. If you have any questions or need help with a booking, please let me know!"
                                            }
                                        ],
                                        role: "model"
                                    }
                                }
                            ]
                        }
                    }

                }

                console.log(callToProcess)
                callToProcess = result.response.functionCalls();
            }
        }
        return result;
    } catch (error) {
        throw new Error(error);
    }

}