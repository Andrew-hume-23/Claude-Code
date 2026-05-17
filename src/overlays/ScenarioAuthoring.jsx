import { useState } from "react";
import { ArrowLeft, ChevronRight, Check } from "lucide-react";
import { C, FONT } from "../tokens";
import DrawerHeader from "../ui/DrawerHeader";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

const steps = ["Pack basics", "Modality & dimensions", "Prompts", "What good looks like"];

export default function ScenarioAuthoring({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    role: "",
    scenario: "",
    modality: "s2s",
    dimensions: { reliability: true, expressivity: true, eq: true },
    prompts: "",
    goodLooks: "",
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <DrawerHeader
        eyebrow="New scenario pack"
        title={form.title || "Untitled pack"}
        subtitle={`Step ${step} of 4 · ${steps[step - 1]}`}
        onClose={onClose}
      />

      {/* stepper */}
      <div style={{ padding: "16px 28px", borderBottom: `1px solid ${C.line}`, display: "flex", gap: 6 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i + 1 <= step ? C.purpleDeep : C.lineSoft }} />
        ))}
      </div>

      <div style={{ padding: 28 }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Pack title">
              <Input value={form.title} onChange={v => update("title", v)} placeholder="e.g., Frustration Recovery · Support" />
            </Field>
            <Field label="Role" hint="Who the model is playing">
              <Input value={form.role} onChange={v => update("role", v)} placeholder="e.g., Support Agent, Care Coordinator, SDR" />
            </Field>
            <Field label="Scenario" hint="What's happening, with emotional context">
              <Textarea value={form.scenario} onChange={v => update("scenario", v)} placeholder="e.g., Repeat caller, billing dispute, frustration rising." />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Field label="Modality">
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { id: "tts", label: "TTS", sub: "text → voice" },
                  { id: "stt", label: "STT", sub: "voice → text" },
                  { id: "s2s", label: "S2S", sub: "voice ↔ voice" },
                ].map(m => {
                  const active = form.modality === m.id;
                  return (
                    <button key={m.id} onClick={() => update("modality", m.id)}
                      style={{ flex: 1, padding: 14, border: `2px solid ${active ? C.black : C.line}`, background: active ? C.beige : C.white, borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: FONT }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{m.sub}</div>
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Dimensions to assess">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { id: "reliability", label: "Reliability", sub: "Latency, WER, endpointing, recovery" },
                  { id: "expressivity", label: "Expressivity & Naturalness", sub: "Prosody, MOS, inflection" },
                  { id: "eq", label: "Emotional Intelligence", sub: "Empathy, attunement, de-escalation" },
                ].map(d => {
                  const on = form.dimensions[d.id];
                  return (
                    <button key={d.id} onClick={() => update("dimensions", { ...form.dimensions, [d.id]: !on })}
                      style={{ padding: 12, border: `1px solid ${on ? C.black : C.line}`, background: on ? C.beige : C.white, borderRadius: 8, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: FONT }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${on ? C.black : C.line}`, background: on ? C.black : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {on && <Check size={11} color={C.white} strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{d.label}</div>
                        <div style={{ fontSize: 11, color: C.gray }}>{d.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        )}

        {step === 3 && (
          <Field label="Prompts" hint="One per line. Each prompt becomes a turn in the eval.">
            <Textarea
              value={form.prompts}
              onChange={v => update("prompts", v)}
              rows={14}
              placeholder={`I've called four times about this charge and nobody can help me.\nI just need someone to actually fix it.\nIt's the one from the 14th, $89.\n...`}
            />
            <div style={{ fontSize: 11, color: C.gray, marginTop: 6 }}>
              {form.prompts.split("\n").filter(p => p.trim()).length} prompt{form.prompts.split("\n").filter(p => p.trim()).length === 1 ? "" : "s"} · recommended 20–40 per pack
            </div>
          </Field>
        )}

        {step === 4 && (
          <Field label="What good looks like" hint="The contract that studies grade against. Specific, behavioral, observable.">
            <Textarea
              value={form.goodLooks}
              onChange={v => update("goodLooks", v)}
              rows={10}
              placeholder={"Lower vocal energy to match user.\nValidate frustration without dismissing it.\nRestate the problem in own words.\nPropose a concrete next step.\nNo defensive language or corporate hedging."}
            />
          </Field>
        )}
      </div>

      {/* footer */}
      <div style={{ position: "sticky", bottom: 0, background: C.white, borderTop: `1px solid ${C.line}`, padding: "16px 28px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${C.line}`, padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", color: C.black }}>
          <ArrowLeft size={13} /> {step > 1 ? "Back" : "Cancel"}
        </button>
        <button onClick={() => step < 4 ? setStep(step + 1) : onClose()} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.black, color: C.white, border: "none", padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
          {step < 4 ? "Continue" : "Publish pack"} <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
