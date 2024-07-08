export function sanitize(client, message, threadId = null) {
    if (message === "" || typeof (message) != "string" || message === null) {
        return new Error("Invalid message passed.");
    }


    if (client = 'gemini') {

        return { cleanMessage: message };
    }

    if (threadId === "" || typeof threadId != "string") {
        return new Error("Invalid threadId passed.");
    }

    return { cleanMessage: message, cleanThreadId: threadId };
}
