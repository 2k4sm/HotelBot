import { gemini } from "../../config/apiconfig";
import { toolFunctions, functions } from "./geminiFunctionCalling";

export function createModel() {
    const model = gemini.getGenerativeModel(
        { model: "gemini-1.5-pro-latest", tools: toolFunctions },
        { apiVersion: "v1beta" },
    );

    return model
}

export function createChatSession(model) {
    const chatSession = model.startChat({
        history: [],
    });

    return chatSession;
}

export async function sendMessageAndCheckForCalls(model, message) {

    const prompt = message

    const chat = createChatSession(model)

    const result = await chat.sendMessage(prompt);

    const response = result.response;
    console.dir(response, { depth: null });
    console.log(response.functionCalls())
    if (response.candidates.length === 0) {
        throw new Error("No candidates");
    }

    const content = result.response.candidates[0].content;

    if (content.parts.length === 0) {
        throw new Error("No parts");
    }

    const fc = content.parts[0].functionCall;
    if (fc) {
        const { name, args } = fc;
        const fn = functions[name];
        if (!fn) {
            throw new Error(`Unknown function "${name}"`);
        }
        const fr = [
            {
                functionResponse: {
                    name,
                    response: JSON.parse(await functions[name](args)),
                },
            },
        ]

        console.dir(fr, { depth: null });
        const request2 = JSON.stringify(fr)
        const response2 = await chat.sendMessage(request2);
        const result2 = response2.response;
        return result2;
    } else {
        return result;
    }
}