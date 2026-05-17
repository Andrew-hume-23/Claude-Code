export const STUDIES = [
  // Reliability
  { id: "lat", name: "Latency Consistency", dim: "Reliability", modality: "tts", scenarios: 6, runs: 142, desc: "P50/P95/P99 across regions, payload sizes, voice IDs." },
  { id: "rob", name: "Robustness to Noise", dim: "Reliability", modality: "stt", scenarios: 8, runs: 87, desc: "WER across 18 noise profiles at 4 SNR levels." },
  { id: "endp", name: "Endpointing Precision", dim: "Reliability", modality: "s2s", scenarios: 5, runs: 64, desc: "False cut-offs and barge-in latency on multi-turn." },
  { id: "rec", name: "Recovery from Interruption", dim: "Reliability", modality: "s2s", scenarios: 4, runs: 41, desc: "Graceful resumption after user overlap, model recovery rate." },
  { id: "pron", name: "Pronunciation Accuracy", dim: "Reliability", modality: "tts", scenarios: 12, runs: 96, desc: "Names, acronyms, code, numerics, multilingual mixing." },

  // Expressivity & Naturalness
  { id: "pros", name: "Prosodic Range", dim: "Expressivity", modality: "tts", scenarios: 7, runs: 118, desc: "Pitch, pace, and stress variation across emotional contexts." },
  { id: "mos", name: "Naturalness MOS", dim: "Expressivity", modality: "tts", scenarios: 10, runs: 203, desc: "5-point mean opinion score via calibrated rater pool." },
  { id: "infl", name: "Inflection Authenticity", dim: "Expressivity", modality: "s2s", scenarios: 6, runs: 52, desc: "Human-vs-model inflection preference, A/B paired." },

  // Emotional Intelligence
  { id: "emo", name: "Emotion Recognition", dim: "EQ", modality: "stt", scenarios: 9, runs: 71, desc: "Speaker affect detection across 28 emotional categories." },
  { id: "emp", name: "Empathic Response", dim: "EQ", modality: "s2s", scenarios: 11, runs: 156, desc: "REACT-graded response appropriateness in distress scenarios." },
  { id: "tone", name: "Tone Matching", dim: "EQ", modality: "s2s", scenarios: 8, runs: 89, desc: "Model tone adaptation to user emotional state shifts." },
  { id: "deesc", name: "De-escalation", dim: "EQ", modality: "s2s", scenarios: 6, runs: 47, desc: "Frustration-to-resolution arcs in support and care contexts." },
];
