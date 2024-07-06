
import express from "express"
import { chat } from "../controllers/chat.controllers";

const router = express.Router();

router.post('/', chat)


export default router;