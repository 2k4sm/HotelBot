import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const openai = new OpenAI({ "apiKey": process.env.OPEN_API_KEY });
export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);