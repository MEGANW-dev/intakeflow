import { z } from "zod";

export const FLAGS = [
    "out_of_service_area", "budget_mismatch", "wrong-service", 
    "urgent_opportunity", "high_value", "vague_request", 
    "possible_scam", "competitor_or_vendor",
] as const;

export const URGENCY = ["immediate", "weeks", "months", "exploring"] as const;
export const BUDGET_BAND = ["under_1k", "1k_5k", "5k_25k", "25k_plus", "unknown"] as const;

export const verdictSchema = z.object({
   fit_score:                z.number().int().min(1).max(10), 
   service_type:             z.string(),
   urgency:                  z.enum(URGENCY),
   budget_band:              z.enum(BUDGET_BAND),
   summary:                  z.string().max(400),
   reasoning:                z.string().max(600),
   flags:                    z.array(z.enum(FLAGS)),
   recommended_next_step:    z.string().max(200),
});


export type Verdict = z.infer<typeof verdictSchema>;

/**
 * JSON Schema for OpenAI Structured Outputs with strict: true.
 * strict mode requires EVERY property listed in `required` and
 * additionalProperties: false on every object.
 * It does NOT support minimum/maximum — the 1-10 range is enforced
 * by Zod after parsing, and stated in the description for the model.
 */

export const verdictJsonSchema= {
    type: "object",
    additionalProperties: false, 
    required: [ 
        "fit_score", "service_type", "urgency", "budget_band",
        "summary", "reasoning", "flags", "recommended_next_step",
    ],
    properties: {
        fit_score:{
            type: "integer",
            description:
            "Integer from 1 to 10. 9-10 =  in area, budget above minimum, service match, urgent." +
            "7-8 = in area, budget plausible, service match. 4-6 partial match or missing key info." +
            "1-3 = hits a disqualifier, wrong service, or out of area.",
        },
        service_type: {
            type: "string",
            description: "Which of the business's offered services this maps to, or 'other'.",
        },
        urgency:       { type: "string", enum: [...URGENCY] },
        budget_band:   { type: "string", enum: [...BUDGET_BAND] },
        summary: {
            type: "string",
            description: "At most 2 sentences, written for the business owner.",
        },
            reasoning: {
                type: "string",
                description: "Why this score. Must quote specific text from the submission."
            },
            flags: { type:"array", items: { type: "string", enum: [...FLAGS] } },
            recommended_next_step: {
                type: "string",
                description: "One concrete action for the business owner. Max 200 characters.",
            },
    },
} as const;