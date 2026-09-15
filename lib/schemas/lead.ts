import { z } from "zod";

export const leadInputSchema = z.object ({
orgSlug:            z.string().min(1),
fullName:           z.string().min(2, "Please enter your full name").max(120),
email:              z.string().email("That doesn't look like a valid email"),
phone:              z.string().max(40).optional().or(z.literal("")),
company:            z.string().max(160).optional().or(z.literal("")),
serviceWanted:      z.string().min(1, "Please choose a service"), 
description:        z.string().min(20, "Please give us a bit more detail").max(4000),
timelineStated:     z.enum(["asap", "1_4_weeks", "1_3_months", "just_exploring"]),
budgetStated:       z.enum(["under_1k", "1k_5k", "5k_25k", "25k_plus", "not_sure"]),
foundVia:           z.string().max(80).optional().or(z.literal("")),
consent:            z.literal(true, {message: "We need your consent to contact you"}),


//anti-spam -computed server-side, never trusted from the client
_elapsedMs:         z.number().min(3000, "Submitted too fast"),

});

export type LeadInput = z.infer<typeof leadInputSchema>;