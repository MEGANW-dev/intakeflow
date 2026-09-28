import "server-only";
import { openai, CLASSIFY_MODEL, PRICE_PER_1M_INPUT, PRICE_PER_1M_OUTPUT } from "./client";
import { verdictSchema, verdictJsonSchema, type Verdict } from "./verdict";
import {
    SYSTEM_PROMPT, CLASSIFY_PROMPT_VERSION,
    buildContextMessage, buildInputMessage,
} from "../../prompts/classify.v1"; 

export type ClassifyResult =
| { ok: true; verdict: Verdict; usage: UsageInfo }
| { ok: false; error: string; usage: UsageInfo };

export type UsageInfo = {
    model: string;
    promptVersion: string;
    tokensIn:   number;
    tokensOut:  number;
    costUsd:    number;
    durationMs: number;
};

export async function classify(
    lead:  Parameters<typeof buildInputMessage>[0],
    org:   Parameters<typeof buildContextMessage>[0]
): Promise<ClassifyResult> {
    const startedAt = Date.now();
    let tokensIn = 0;
    let tokensOut = 0;

    try {
        const completion = await openai.chat.completions.create({
            model: CLASSIFY_MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "system", content: buildContextMessage(org) },
                { role: "user",   content: buildInputMessage(lead) }, 
            ],
                response_format: {
                    type: "json_schema",
                    json_schema: { name: "lead_verdict", strict: true, schema: verdictJsonSchema },
                },
        });

        tokensIn = completion.usage?.prompt_tokens ?? 0;
        tokensOut = completion.usage?.completion_tokens ?? 0;

        const raw = completion.choices[0]?.message?.content;
        if (!raw) {
            return { ok: false, error: "Empty response from model", usage: usage() };
        }

        // Structured Outputs guarantees shape. Zod guarantees the values. 
        const parsed = verdictSchema.safeParse(JSON.parse(raw));
        if (!parsed.success) {
            return {
                ok: false, 
                error: 'Verdict failed validation: ${parsed.error.message}',
                usage: usage (),
            };
        }

        return { ok: true, verdict: parsed.data, usage: usage() };
    }   catch (e) {
        return {
            ok: false,
            error: e instanceof Error ? e.message : String(e), 
            usage: usage(),
        };
    }

    function usage(): UsageInfo {
        return {
            model: CLASSIFY_MODEL,
            promptVersion: CLASSIFY_PROMPT_VERSION,
            tokensIn,
            tokensOut,
            costUsd:
                (tokensIn / 1_000_000) * PRICE_PER_1M_INPUT +
                (tokensOut / 1_000_000) *PRICE_PER_1M_OUTPUT,
                durationMs: Date.now() - startedAt,
        };
    }
}