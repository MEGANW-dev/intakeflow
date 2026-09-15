"use client";

import { useActionState } from "react";
import { submitLead, type SubmitState } from "./actions";

const initialState: SubmitState = { ok: false };

const TIMELINES = [
  { value: "asap",            label: "As soon as possible" },
  { value: "1_4_weeks",       label: "Next 1-4 weeks"  },
  { value: "1_3_months",      label: "1-3 months out" },
  { value: "just_exploring",  label: " Just exploring" },
];

const BUDGETS =[
  { value: "under_1k",        label: "Under $1,000" },
  { value: "1k_5k",           label: "$1,000 - $5,000" },
  { value: "5k_25k",          label: "$5,000 - $25,000" },
  { value: "25k_plus",        label: "$25,000+" },
  { value: "not_sure",        label: "Not sure yet" },
]; 

function FieldError({ messages }: { messages?: string[] }){
    if (!messages?.length) return null;
    return <p className="mt-1 text-sm text-red-600">{messages[0]}</p>;
}

const inputClass =
"mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" +
"focus:border-neutral-900 focus:outline-none";

export function LeadForm({
    orgSlug,
    services,
    renderedAt,
}: {
    orgSlug: string;
    services: string[];
    renderedAt: number;
}) {
  const [state, formAction, isPending] = useActionState(
    submitLead,
    initialState 
  );

  if (state.ok) {
    return (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
            <h2 className="font-semibold text-green-900">Thank you</h2>
            <p className="mt-1 text-sm text-green-800">{state.message}</p>
        </div>
    );
  }

return (
    <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="orgSlug" value={orgSlug} />
        <input type="hidden" name="renderedAt" value={renderedAt} />

        {/* Honeypot: invisbile to humans, irresistible to bots. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="_honey">Leave this field empty</label>
            <input id="_honey" name="_honey" type="text" tabIndex={-1}
            autoComplete="off" /> 
        </div>

        {state.message && !state.ok && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {state.message}
            </div>
        )}

        <div>
        <label htmlFor="fullName" className="text-sm font-medium">Full name *
    </label>
        <input id="fullName" name="fullName" required className={inputClass} />
        <FieldError messages={state.errors?.fullName} />
        </div>

        <div>
            <label htmlFor="email" className="text-sm font-medium">Email *</label>
            <input id="email" name="email" type="email" required className={inputClass}
    /> 
            <FieldError messages={state.errors?.email} />
        </div>

        <div className="grid grid-cols-2 gap-4">           
        <div>
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>        
            <input id="phone" name="phone" className={inputClass} />
            <FieldError messages={state.errors?.company} />
         </div>
         <div>
            <label htmlFor="company" className="text-sm font-medium">Company</label>
            <input id="company" name="company" className={inputClass} />
            <FieldError messages={state.errors?.company} />
            </div>
        </div>


      <div>
        <label htmlFor="serviceWanted" className="text-sm font-medium">
          What do you need help with? *
        </label>
        <select id="serviceWanted" name="serviceWanted" required defaultValue="" className={inputClass}>
          <option value="" disabled>Choose one…</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <FieldError messages={state.errors?.serviceWanted} />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Tell us more *
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={4000}
          required
          placeholder="A few sentences about your situation and what you're hoping to accomplish."
          className={inputClass}
        />
        <FieldError messages={state.errors?.description} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="timelineStated" className="text-sm font-medium">Timeline *</label>
          <select id="timelineStated" name="timelineStated" required defaultValue="" className={inputClass}>
            <option value="" disabled>Choose one…</option>
            {TIMELINES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <FieldError messages={state.errors?.timelineStated} />
        </div>
        <div>
          <label htmlFor="budgetStated" className="text-sm font-medium">Budget *</label>
          <select id="budgetStated" name="budgetStated" required defaultValue="" className={inputClass}>
            <option value="" disabled>Choose one…</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <FieldError messages={state.errors?.budgetStated} />
        </div>
      </div>

      <div>
        <label htmlFor="foundVia" className="text-sm font-medium">How did you find us?</label>
        <input id="foundVia" name="foundVia" className={inputClass} />
        <FieldError messages={state.errors?.foundVia} />
      </div>

      <div className="flex items-start gap-2">
        <input id="consent" name="consent" type="checkbox" required className="mt-1" />
        <label htmlFor="consent" className="text-sm text-neutral-700">
          I agree to be contacted about my inquiry. *
        </label>
      </div>
      <FieldError messages={state.errors?.consent} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit"}
      </button>

    </form>
)

} 