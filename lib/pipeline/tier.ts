import type { Verdict } from "../../lib/ai/verdict";

export type Tier = "qualified" | "nurture" | "disqualified";

export type QualificationConfig = {
  qualifiedThreshold: number;
  nurtureThreshold: number;
};

const HARD_DISQUALIFIERS: readonly string[] = [
  "out_of_service_area",
  "wrong_service",
  "possible_spam",
];

/** The model scores. This function decides. Pure, synchronous, testable. */
export function tierFor(v: Verdict, q: QualificationConfig): Tier {
  if (v.flags.some((f) => HARD_DISQUALIFIERS.includes(f))) return "disqualified";
  if (v.fit_score >= q.qualifiedThreshold) return "qualified";
  if (v.fit_score >= q.nurtureThreshold) return "nurture";
  return "disqualified";
}