import { describe, it, expect } from "vitest";
import { tierFor, type QualificationConfig } from "./tier";
import type { Verdict } from "../ai/verdict";

const config: QualificationConfig = { qualifiedThreshold: 7, nurtureThreshold: 4 };


const base: Verdict = {
    fit_score: 5,
    service_type: "HVAC",
    urgency: "weeks",
    budget_band: "5k_25k",
    summary: "s",
    reasoning: "r",
    flags: [],
    recommended_next_step: "n",
  };
  
  const v = (over: Partial<Verdict>): Verdict => ({ ...base, ...over });
  
  describe("tierFor", () => {
    it("scores at or above the qualified threshold are qualified", () => {
      expect(tierFor(v({ fit_score: 7 }), config)).toBe("qualified");
      expect(tierFor(v({ fit_score: 10 }), config)).toBe("qualified");
    });
  
    it("scores between the thresholds are nurture", () => {
      expect(tierFor(v({ fit_score: 4 }), config)).toBe("nurture");
      expect(tierFor(v({ fit_score: 6 }), config)).toBe("nurture");
    });
  
    it("scores below the nurture threshold are disqualified", () => {
      expect(tierFor(v({ fit_score: 3 }), config)).toBe("disqualified");
    });
  
    it("a hard disqualifier flag overrides a perfect score", () => {
      expect(tierFor(v({ fit_score: 10, flags: ["out_of_service_area"] }), config))
        .toBe("disqualified");
    });
  
    it("a soft flag does not override a qualifying score", () => {
      expect(tierFor(v({ fit_score: 9, flags: ["high_value", "urgent_opportunity"] }), config))
        .toBe("qualified");
    });
  
    it("thresholds come from config, not constants", () => {
      const strict: QualificationConfig = { qualifiedThreshold: 9, nurtureThreshold: 7 };
      expect(tierFor(v({ fit_score: 8 }), strict)).toBe("nurture");
      expect(tierFor(v({ fit_score: 8 }), config)).toBe("qualified");
    });
  });