import "server-only";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("Missing env: OPENAI_API_KEY");

export const openai = new OpenAI({ apiKey });

export const CLASSIFY_MODEL = "gpt-4o-mini";

// Verify current rates at https://openai.com/api/pricing before quoting a client.
export const PRICE_PER_1M_INPUT = 0.15;
export const PRICE_PER_1M_OUTPUT = 0.60;