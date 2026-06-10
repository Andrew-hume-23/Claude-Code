export const EMOTIONS = [
  { id: "amusement",   label: "amusement",   color: "#E91E63" },
  { id: "anger",       label: "anger",       color: "#D32F2F" },
  { id: "anxiety",     label: "anxiety",     color: "#C2185B" },
  { id: "uncertainty", label: "uncertainty", color: "#9575CD" },
  { id: "confusion",   label: "confusion",   color: "#8B5E3C" },
  { id: "doubt",       label: "doubt",       color: "#607D8B" },
  { id: "boredom",     label: "boredom",     color: "#B8860B" },
  { id: "surprise",    label: "surprise",    color: "#FB8C00" },
  { id: "curiosity",   label: "curiosity",   color: "#00897B" },
  { id: "joy",         label: "joy",         color: "#43A047" },
];

export const DATASETS = [
  { id: "ds1", name: "Q1 Support Calls — Trust Bank",        samples: 12847, hours: 412, status: "labeled",  labeled: 12847, lang: ["EN-US"],                     tagger: "Octave-Tagger v2.1", updated: "2h ago"  },
  { id: "ds2", name: "Healthcare Triage Audio — Northwell",  samples: 4218,  hours: 187, status: "labeling", labeled: 2104,  lang: ["EN-US", "ES-MX"],             tagger: "Octave-Tagger v2.1", updated: "running" },
  { id: "ds3", name: "Sales Discovery Calls — Q4 2025",      samples: 8912,  hours: 298, status: "labeled",  labeled: 8912,  lang: ["EN-US"],                     tagger: "Octave-Tagger v2.0", updated: "5d ago"  },
  { id: "ds4", name: "Multilingual IVR Eval Set",            samples: 2104,  hours: 89,  status: "queued",   labeled: 0,     lang: ["EN-US","ES-MX","FR-FR","DE-DE"], tagger: "Octave-Tagger v2.1", updated: "in queue"},
];

function makeTimeline(seed = 1) {
  const segs = [];
  let t = 0;
  let r = seed;
  while (t < 60) {
    r = (r * 9301 + 49297) % 233280;
    const dur = 1 + ((r / 233280) * 6);
    r = (r * 9301 + 49297) % 233280;
    const speaker = (r / 233280) > 0.5 ? "L" : "R";
    r = (r * 9301 + 49297) % 233280;
    const emoIdx = Math.floor((r / 233280) * EMOTIONS.length);
    segs.push({ start: t, end: t + dur, speaker, emo: EMOTIONS[emoIdx].id });
    t += dur;
  }
  return segs;
}

export const SAMPLE = {
  id: "RM02ce9e0ad086c5a7ca6f43d5b425d352",
  shortId: "RM02ce9e…352",
  split: "train",
  lang: "EN-US",
  duration: 4482,
  description: "Conversation begins with introductions and discussion about participating in a study. First speaker recounts extensive travel and living experiences abroad. The second shares aspirations to live and travel internationally. They discuss favorite destinations enthusiastically, sharing personal anecdotes about cultural differences and the evolution of tourism.",
  speakers: {
    L: { label: "Left",  gender: "female", origin: "Netherlands", durationS: 1456, words: 3908, color: "#3B82C4" },
    R: { label: "Right", gender: "male",   origin: "Portugal",    durationS: 2542, words: 6385, color: "#A86BDB" },
  },
  events: { total: 1082, switches: 417, overlaps: 386, interruptions: 279 },
  radar: {
    L: { amusement: 0.62, anger: 0.18, anxiety: 0.34, uncertainty: 0.41, confusion: 0.28, doubt: 0.31, boredom: 0.22, surprise: 0.45, curiosity: 0.68, joy: 0.71 },
    R: { amusement: 0.48, anger: 0.22, anxiety: 0.41, uncertainty: 0.52, confusion: 0.39, doubt: 0.48, boredom: 0.31, surprise: 0.38, curiosity: 0.58, joy: 0.54 },
  },
  topTags: [
    { tag: "interest",    L: 0.94, R: 0.91 },
    { tag: "expressive",  L: 0.88, R: 0.79 },
    { tag: "amusement",   L: 0.84, R: 0.66 },
    { tag: "laughter",    L: 0.81, R: 0.58 },
    { tag: "engaged",     L: 0.77, R: 0.81 },
    { tag: "thoughtful",  L: 0.72, R: 0.74 },
    { tag: "warmth",      L: 0.71, R: 0.62 },
    { tag: "chuckling",   L: 0.68, R: 0.41 },
    { tag: "emphatic",    L: 0.64, R: 0.69 },
    { tag: "hesitant",    L: 0.48, R: 0.56 },
  ],
  scatter: [
    { speaker: "L", arousal: 0.62,  valence: 0.51,  size: 22 },
    { speaker: "L", arousal: 0.71,  valence: 0.42,  size: 18 },
    { speaker: "L", arousal: 0.45,  valence: 0.61,  size: 26 },
    { speaker: "L", arousal: 0.28,  valence: -0.21, size: 14 },
    { speaker: "L", arousal: -0.18, valence: -0.38, size: 12 },
    { speaker: "R", arousal: 0.54,  valence: 0.31,  size: 28 },
    { speaker: "R", arousal: 0.21,  valence: 0.18,  size: 20 },
    { speaker: "R", arousal: -0.32, valence: -0.51, size: 24 },
    { speaker: "R", arousal: 0.41,  valence: -0.12, size: 16 },
    { speaker: "R", arousal: 0.62,  valence: 0.48,  size: 22 },
  ],
  timeline: makeTimeline(7),
  transcript: [
    { id: 1, t: 18.4, speaker: "R", text: "Thank you for joining. Could you tell me a bit about the travel you've done?",                                        emo: "curiosity"    },
    { id: 2, t: 22.1, speaker: "L", text: "Sure — last year I went to Asia for the first time. It honestly opened my eyes. I went to Japan, China, Thailand, and Sri Lanka.", emo: "amusement"  },
    { id: 3, t: 38.5, speaker: "R", text: "Wow, that's quite a list. How long were you there?",                                                               emo: "surprise"     },
    { id: 4, t: 42.7, speaker: "L", text: "Three months total. I wish I'd had longer, honestly.",                                                             emo: "joy"          },
    { id: 5, t: 50.9, speaker: "L", text: "I think after three months I'd want to come home for a bit. Or maybe not. I don't know.",                          emo: "uncertainty"  },
    { id: 6, t: 56.4, speaker: "R", text: "Of course. The exchange program — how did that work?",                                                             emo: "curiosity"    },
    { id: 7, t: 62.1, speaker: "L", text: "It was structured around two to three months at each location. The first stop was the hardest — language barrier, everything new.", emo: "doubt" },
    { id: 8, t: 78.5, speaker: "R", text: "And you'd recommend it?",                                                                                         emo: "curiosity"    },
    { id: 9, t: 80.2, speaker: "L", text: "Absolutely. Without hesitation.",                                                                                  emo: "joy"          },
  ],
  heatmap: {
    L: EMOTIONS.map((e, i) => Array.from({ length: 24 }, (_, j) => {
      const seed = (i * 7 + j * 3 + 13) % 100;
      return Math.max(0, Math.sin((j / 24) * Math.PI * 2 + i) * 0.4 + (seed / 200) + (i === 9 ? 0.3 : 0));
    })),
    R: EMOTIONS.map((e, i) => Array.from({ length: 24 }, (_, j) => {
      const seed = (i * 11 + j * 5 + 7) % 100;
      return Math.max(0, Math.cos((j / 24) * Math.PI * 2 + i) * 0.4 + (seed / 200) + (i === 8 ? 0.25 : 0));
    })),
  },
};

export const AGGREGATE = {
  emotionDistribution: [
    { emo: "amusement",   share: 0.18, samples: 2312 },
    { emo: "joy",         share: 0.16, samples: 2055 },
    { emo: "curiosity",   share: 0.14, samples: 1798 },
    { emo: "surprise",    share: 0.11, samples: 1413 },
    { emo: "uncertainty", share: 0.10, samples: 1284 },
    { emo: "confusion",   share: 0.09, samples: 1156 },
    { emo: "doubt",       share: 0.08, samples: 1027 },
    { emo: "boredom",     share: 0.06, samples: 770  },
    { emo: "anxiety",     share: 0.05, samples: 642  },
    { emo: "anger",       share: 0.03, samples: 390  },
  ],
  demographics: {
    language: [{ k: "EN-US", v: 7124 }, { k: "ES-MX", v: 2891 }, { k: "FR-FR", v: 1832 }, { k: "DE-DE", v: 1000 }],
    gender:   [{ k: "Female", v: 6428 }, { k: "Male", v: 5891 }, { k: "Non-binary", v: 528 }],
    region:   [{ k: "Urban", v: 7392 }, { k: "Suburban", v: 4218 }, { k: "Rural", v: 1237 }],
  },
  outliers: [
    { id: "SM4172", reason: "Extreme valence variance",            score: 0.94, dom: "rapid mood shifts"          },
    { id: "SM2089", reason: "Unusually high confusion baseline",   score: 0.89, dom: "tutorial scenario"          },
    { id: "SM7634", reason: "All-flat emotion signal",             score: 0.87, dom: "possible audio quality issue"},
    { id: "SM1283", reason: "Anger spike in friendly scenario",    score: 0.83, dom: "scripted training data"     },
    { id: "SM5912", reason: "Mismatched speaker labels",           score: 0.79, dom: "diarization error?"         },
  ],
  confidence: [
    { bin: ">0.95", count: 7842 },
    { bin: "0.90",  count: 2914 },
    { bin: "0.85",  count: 1294 },
    { bin: "0.80",  count: 542  },
    { bin: "0.70",  count: 218  },
    { bin: "<0.70", count: 37   },
  ],
};

export const BIG_FIVE = {
  axes: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
  L: { openness: 5.2, conscientiousness: 4.8, extraversion: 4.2, agreeableness: 5.6, neuroticism: 2.8 },
  R: { openness: 5.6, conscientiousness: 3.9, extraversion: 5.4, agreeableness: 4.1, neuroticism: 3.2 },
};

function makeInductionMatrix() {
  const m = {};
  EMOTIONS.forEach((eA, i) => {
    m[eA.id] = {};
    EMOTIONS.forEach((eB, j) => {
      const same = eA.id === eB.id ? 0.35 : 0;
      const seed = ((i * 17 + j * 13 + 7) % 100) / 100;
      m[eA.id][eB.id] = (seed - 0.5) * 0.5 + same;
    });
  });
  return m;
}

export const INDUCTION = makeInductionMatrix();
