export const SCENARIO_PACKS = [
  { id: "p1", title: "Frustration Recovery", role: "Support Agent", scenario: "Repeat caller, billing dispute escalation", prompts: 32, modality: "s2s", goodLooks: "Lower vocal energy, validate, restate problem, propose path." },
  { id: "p2", title: "Healthcare Triage", role: "Care Coordinator", scenario: "Initial symptom intake, anxious patient", prompts: 47, modality: "s2s", goodLooks: "Warm pace, clarifying questions, no premature reassurance." },
  { id: "p3", title: "Cold Discovery", role: "SDR / Inside Sales", scenario: "First-touch outbound, gatekeeper present", prompts: 28, modality: "s2s", goodLooks: "Confident but not pushy, quick value framing, easy out." },
  { id: "p4", title: "IVR Replacement", role: "Front Desk Receptionist", scenario: "Appointment booking with reschedule", prompts: 41, modality: "s2s", goodLooks: "Crisp acknowledgment, no awkward pauses, accurate readback." },
  { id: "p5", title: "Tutoring — Concept Confusion", role: "K-12 Tutor", scenario: "Student stuck on fractions, frustration rising", prompts: 35, modality: "s2s", goodLooks: "Patience, encouragement signals, scaffolded re-explanation." },
  { id: "p6", title: "Long-form Narration", role: "Audiobook Narrator", scenario: "Multi-character dialogue, emotional arc", prompts: 22, modality: "tts", goodLooks: "Consistent character voicing, paragraph-level pacing." },
  { id: "p7", title: "Multilingual Code-switch", role: "Bilingual Concierge", scenario: "English–Spanish mid-utterance switching", prompts: 18, modality: "tts", goodLooks: "Native pronunciation in both, smooth transition." },
  { id: "p8", title: "Noisy Field Capture", role: "Field Technician", scenario: "Dictation in industrial environment", prompts: 24, modality: "stt", goodLooks: "WER under 8% at 10dB SNR, accurate domain terms." },
];
