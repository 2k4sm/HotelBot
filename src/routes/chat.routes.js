
import express from "express"
import { assistantChat, completionsChat } from "../controllers/chat.controllers";

const router = express.Router();

router.post('/assistant', assistantChat);
router.post('/completion', completionsChat);


export default router;