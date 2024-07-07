import { openai } from "../config/apiconfig";
import { createThread, runAssistant, handleRunStatus, createMessage } from "../utils/botHelpers";
import { createAssistantIfNeeded } from "../utils/createAssistant";
import { createChatBotTools, createChatMessage } from "../utils/createChatCompletions";
import { handleToolCalling } from "../services/handleChatToolCalls";


export const chatThread = await createThread();
export const assistant = await createAssistantIfNeeded();
export const assistantChat = async (req, res) => {

    const { message } = req.body;

    await createMessage(chatThread, message);

    const runObject = await runAssistant(chatThread, assistant);

    await handleRunStatus(res, chatThread, runObject);
};

export const completionsChat = async (req, res) => {
    const { message } = req.body;
    let chatMessage = await createChatMessage(message);
    let tools = await createChatBotTools();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k-0613",
        messages: chatMessage,
        tools: tools,
        tool_choice: "auto",
    });

    console.log(response.choices[0].message)

    let secondResponse = await handleToolCalling(response);
    res.json({ secondResponse })
}