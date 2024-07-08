
import express from "express"
import { geminiChat } from "../controllers/geminiChat.controllers";
const router = express.Router();

router.post('/gemini/chat', geminiChat);
export default router;