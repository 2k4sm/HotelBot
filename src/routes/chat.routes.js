
import express from "express"
import { assistantChat } from "../controllers/openaiChat.controllers";

const router = express.Router();

router.post('/openai/chat', assistantChat);

export default router;