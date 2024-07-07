import { gemini } from "../../config/apiconfig";
import { getAvailableRoomsFunctionDeclaration, bookRoomFunctionDeclaration } from "./geminiFunctionCalling";
import { functions } from "./geminiFunctionCalling";
import { GoogleGenerativeAIError } from "@google/generative-ai";
export function createModel(modelname, systemInstruction) {
    return gemini.getGenerativeModel({
        model: modelname,
        systemInstruction: systemInstruction,
        tools: {
            functionDeclarations: [getAvailableRoomsFunctionDeclaration, bookRoomFunctionDeclaration],
        }
    });
}

export async function createSession(model, generationConfig, history) {
    return await model.startChat({
        generationConfig,
        history: history,
    });
}

export async function sendMessage(session, message) {
    try {
        const result = await session.sendMessage(message);
        session.history.push({ role: "user", parts: [{ text: message }] });
        session.history.push({ role: "model", parts: [{ text: result.response.text() }] });

        return result.response;
    } catch (error) {
        console.error("Error sending message:", error);
        throw new GoogleGenerativeAIError(`Error sending message: ${error.message}`);
    }
}

export async function checkAndDoFunctionCalling(session, response) {
    try {
        const calls = response.functionCalls();
        const funcs = [];
        let result2;

        if (calls.length !== 0) {
            for (const call of calls) {
                let apiResponse;

                if (call.name === 'getAvailableRooms') {
                    apiResponse = await functions[call.name](call.args);
                } else if (call.name === 'bookRoom') {
                    apiResponse = await functions[call.name](call.args);
                }

                funcs.push({
                    functionResponse: {
                        name: call.name,
                        response: apiResponse
                    }
                });
            }

            console.log("Function calls responses:", funcs);

            result2 = await session.sendMessage(funcs);
        } else {
            result2 = response;
        }

        return result2;
    } catch (error) {
        console.error("Error during function calling:", error);
        throw new GoogleGenerativeAIError(`Error during function calling: ${error.message}`);
    }
}
