import { FunctionDeclarationSchemaType } from "@google/generative-ai";
import { gemini as genAI } from "../../config/apiconfig";

export async function run(message) {
    const functions = {
        convertCtoF: ({ value }) => {
            const num = typeof value === "string" ? parseFloat(value) : value;
            if (!Number.isFinite(num)) {
                throw new Error("Value should finite number");
            }
            return (num * 9) / 5 + 32;
        },
    };
    const tools = [
        {
            functionDeclarations: [
                {
                    name: "convertCtoF",
                    description: "Convert temperature from Celsius to Fahrenheit",
                    parameters: {
                        type: FunctionDeclarationSchemaType.OBJECT,
                        properties: {
                            value: { type: FunctionDeclarationSchemaType.NUMBER },
                        },
                        required: ["value"],
                    },
                },
            ],
        },
    ];

    const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash-latest", tools },
        { apiVersion: "v1beta" },
    );

    const prompt = {
        role: "user",
        parts: [
            {
                text: message,
            },
        ],
    };

    const result = await model.generateContent({
        contents: [prompt],
    });
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
    const text = content.parts.map(({ text }) => text).join("");
    if (fc) {
        const { name, args } = fc;
        const fn = functions[name];
        if (!fn) {
            throw new Error(`Unknown function "${name}"`);
        }
        const fr = {
            role: "function",
            parts: [
                {
                    functionResponse: {
                        name,
                        response: {
                            name,
                            content: functions[name](args),
                        },
                    },
                },
            ],
        };
        const request2 = {
            contents: [prompt, content, fr],
        };
        const response2 = await model.generateContent(request2);
        const result2 = response2.response;
        return result2;
    } else if (text) {
        console.log(text);
    }
}