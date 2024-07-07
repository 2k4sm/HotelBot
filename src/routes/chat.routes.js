
import express from "express"
import { assistantChat, getThread } from "../controllers/openaiChat.controllers";

const router = express.Router();

router.post('/openai/chat', assistantChat);
router.get('/openai/thread', getThread);
export default router;