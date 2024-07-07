
import express from "express"
import { assistantChat, getThread } from "../controllers/openaiChat.controllers";
import { geminiChat } from "../controllers/geminiChat.controllers";
const router = express.Router();

router.post('/openai/chat', assistantChat);
router.get('/openai/thread', getThread);

router.post('/gemini/chat', geminiChat);
export default router;