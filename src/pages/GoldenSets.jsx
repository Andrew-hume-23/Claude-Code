import { useState } from "react";
import { Plus, X, Search, ShoppingCart, Send, Save, ArrowUpRight, Play, Check, Sparkles } from "lucide-react";
import { C, FONT } from "../tokens";
import { GS_TABS, GS_VOICES, GS_PROMPTS, GS_PERSONAS, GS_ROLES, GS_USECASES, GS_DATA } from "../mock/goldenSets";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";
import Field from "../ui/Field";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Drawer from "../ui/Drawer";
import DrawerHeader from "../ui/DrawerHeader";

export default function GoldenSets() {
  const [tab, setTab] = useState("voices");
  const [selected, setSelected] = useState({ voices: [], prompts: [], users: [], roles: [], usecases: [], data: [] });
  const [search, setSearch] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const toggle = (kind, id) => {
    setSelected(s => ({
      ...s,
      [kind]: s[kind].includes(id) ? s[kind].filter(x => x !== id) : [...s[kind], id],
    }));
  };

  const currentTab = GS_TABS.find(t => t.id === tab);

  return (
    <div>
      <SectionHeader
        eyebrow="Asset library · 24,047 items"
        title="Golden Sets"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={Plus} onClick={() => setSuggestOpen(true)}>Suggest your own</Button>
            <Button primary icon={Send}>Build eval from selection</Button>
          </div>
        }
      />

      <div style={{ background: C.beige, borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkles size={16} color={C.orange} />
        <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
          Six asset types, growing toward 30,000. Mix and match across tabs to assemble a custom eval. Via API: <code style={{ background: C.white, padding: "1px 5px", borderRadius: 3, fontFamily: "ui-monospace, monospace", fontSize: 11 }}>POST /v1/evaluations</code> with selected asset IDs.
        </div>
      </div>

      <GSTabBar tab={tab} setTab={setTab} />

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 280px", gap: 16, marginTop: 18, alignItems: "flex-start" }}>
        <GSFilterSidebar tab={tab} />

        <div>
          <GSSearchBar search={search} setSearch={setSearch} currentTab={currentTab} />
          <GSCardGrid tab={tab} selected={selected[tab]} onToggle={(id) => toggle(tab, id)} onDetail={setDetail} search={search} />
        </div>

        <GSSelectionCart selected={selected} setSelected={setSelected} />
      </div>

      {suggestOpen && <GSSuggestModal tab={tab} onClose={() => setSuggestOpen(false)} />}
      <Drawer open={!!detail} onClose={() => setDetail(null)}>
        {detail && <GSAssetDetail asset={detail} onClose={() => setDetail(null)} />}
      </Drawer>
    </div>
  );
}

function GSTabBar({ tab, setTab }) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.line}`, overflowX: "auto" }}>
      {GS_TABS.map(t => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "12px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${active ? C.black : "transparent"}`, marginBottom: -1, fontFamily: FONT, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start", minWidth: 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon size={13} color={active ? C.black : C.gray} />
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.black : C.gray }}>{t.label}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.gray, background: active ? C.beige : C.lineSoft, padding: "1px 6px", borderRadius: 3 }}>
                {t.count.toLocaleString()}
              </span>
            </div>
            <span style={{ fontSize: 10, color: active ? C.gray : C.grayLight, fontWeight: 500 }}>{t.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function GSSearchBar({ search, setSearch, currentTab }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12 }}>
      <div style={{ flex: 1, position: "relative" }}>
        <Search size={13} color={C.gray} style={{ position: "absolute", top: 11, left: 12 }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${currentTab.label.toLowerCase()}…`}
          style={{ width: "100%", padding: "9px 12px 9px 32px", border: `1px solid ${C.line}`, borderRadius: 6, fontSize: 13, fontFamily: FONT, color: C.black, outline: "none", boxSizing: "border-box", background: C.white }} />
      </div>
      <div style={{ fontSize: 11, color: C.gray, whiteSpace: "nowrap" }}>
        Showing <strong style={{ color: C.black }}>{Math.min(24, currentTab.count)}</strong> of {currentTab.count.toLocaleString()}
      </div>
      <select style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.black, border: `1px solid ${C.line}`, borderRadius: 5, padding: "7px 10px", background: C.white, cursor: "pointer" }}>
        <option>Most used</option>
        <option>Recently added</option>
        <option>Alphabetical</option>
      </select>
    </div>
  );
}

function GSFilterSidebar({ tab }) {
  const filters = {
    voices: [
      { label: "Gender",  options: ["Female", "Male", "Non-binary"] },
      { label: "Age",     options: ["20-30", "30-40", "40-50", "50-60", "60+"] },
      { label: "Accent",  options: ["US", "UK", "Australian", "Spanish", "German", "Japanese", "Other"] },
      { label: "Style",   options: ["Professional", "Warm", "Energetic", "Calm", "Formal"] },
    ],
    prompts: [
      { label: "Language",   options: ["EN-US", "EN-GB", "ES-MX", "FR-FR", "DE-DE", "JA-JP"] },
      { label: "Scenario",   options: ["Billing", "Healthcare", "Sales", "Support", "Booking"] },
      { label: "Length",     options: ["Short (< 10 words)", "Medium (10-20)", "Long (20+)"] },
      { label: "Difficulty", options: ["1 · easy", "2 · medium", "3 · hard"] },
    ],
    users: [
      { label: "Age range",         options: ["Under 25", "25-40", "40-55", "55+"] },
      { label: "Gender",            options: ["Female", "Male", "Non-binary", "Any"] },
      { label: "Region",            options: ["Urban", "Suburban", "Rural"] },
      { label: "Emotional baseline", options: ["Calm", "Anxious", "Frustrated", "Curious", "Distressed"] },
    ],
    roles: [
      { label: "Domain",        options: ["Customer Service", "Healthcare", "Sales", "Education", "Financial"] },
      { label: "Skill emphasis", options: ["De-escalation", "Empathy", "Clarity", "Speed"] },
      { label: "Modality",      options: ["TTS", "S2S"] },
    ],
    usecases: [
      { label: "Industry",   options: ["Healthcare", "Financial", "Telecom", "Retail", "Insurance"] },
      { label: "Complexity", options: ["1 · low", "2-3 · medium", "4-5 · high"] },
      { label: "Modality",   options: ["TTS", "STT", "S2S"] },
    ],
    data: [
      { label: "Source",           options: ["Real (consented)", "Synthetic", "Commissioned"] },
      { label: "Language",         options: ["EN-US", "EN-GB", "ES-MX", "FR-FR", "DE-DE"] },
      { label: "Duration",         options: ["< 1 min", "1-5 min", "5+ min"] },
      { label: "Emotion coverage", options: ["Joy", "Anger", "Anxiety", "Confusion", "Surprise"] },
    ],
  };

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, position: "sticky", top: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.black, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>Filters</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(filters[tab] || []).map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.gray, marginBottom: 6 }}>{f.label}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {f.options.map((opt, j) => (
                <label key={j} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.ink, cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: C.purpleDeep, cursor: "pointer" }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 16, width: "100%", padding: "8px 12px", background: C.lineSoft, border: "none", borderRadius: 6, fontSize: 11, fontFamily: FONT, color: C.gray, fontWeight: 600, cursor: "pointer" }}>Clear all</button>
    </div>
  );
}

function GSCardGrid({ tab, selected, onToggle, onDetail, search }) {
  const getData = {
    voices: GS_VOICES, prompts: GS_PROMPTS, users: GS_PERSONAS,
    roles: GS_ROLES, usecases: GS_USECASES, data: GS_DATA,
  };
  const items = (getData[tab] || []).filter(item => {
    if (!search) return true;
    return JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
  });

  if (items.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: "center", background: C.lineSoft, borderRadius: 10 }}>
        <div style={{ fontSize: 13, color: C.gray }}>No matches for "{search}"</div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
      {items.map(item => {
        const isSelected = selected.includes(item.id);
        if (tab === "voices")   return <GSVoiceCard   key={item.id} v={item} sel={isSelected} onToggle={onToggle} onDetail={onDetail} />;
        if (tab === "prompts")  return <GSPromptCard  key={item.id} p={item} sel={isSelected} onToggle={onToggle} onDetail={onDetail} />;
        if (tab === "users")    return <GSPersonaCard key={item.id} u={item} sel={isSelected} onToggle={onToggle} onDetail={onDetail} />;
        if (tab === "roles")    return <GSRoleCard    key={item.id} r={item} sel={isSelected} onToggle={onToggle} onDetail={onDetail} />;
        if (tab === "usecases") return <GSUseCaseCard key={item.id} c={item} sel={isSelected} onToggle={onToggle} onDetail={onDetail} />;
        if (tab === "data")     return <GSDataCard    key={item.id} d={item} sel={isSelected} onToggle={onToggle} onDetail={onDetail} />;
        return null;
      })}
    </div>
  );
}

function GSCardWrap({ children, sel, onToggle, onDetail, item }) {
  return (
    <div style={{ position: "relative", background: C.white, border: `2px solid ${sel ? C.purpleDeep : C.line}`, borderRadius: 10, padding: 14, transition: "border-color .12s", cursor: "pointer" }}
      onClick={() => onToggle(item.id)}
      onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = C.black; }}
      onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = C.line; }}>
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
        <button onClick={(e) => { e.stopPropagation(); onDetail({ ...item }); }}
          style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${C.line}`, background: C.white, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.gray }}>
          <ArrowUpRight size={11} />
        </button>
        <div style={{ width: 22, height: 22, borderRadius: 4, border: `1.5px solid ${sel ? C.purpleDeep : C.line}`, background: sel ? C.purpleDeep : C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {sel && <Check size={12} color={C.white} strokeWidth={3} />}
        </div>
      </div>
      {children}
    </div>
  );
}

function GSVoiceCard({ v, sel, onToggle, onDetail }) {
  return (
    <GSCardWrap sel={sel} onToggle={onToggle} onDetail={onDetail} item={v}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingRight: 48 }}>
        <button style={{ width: 36, height: 36, borderRadius: "50%", background: C.purple, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
          <Play size={14} fill={C.black} color={C.black} />
        </button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.black, letterSpacing: "-0.01em" }}>{v.name}</div>
          <div style={{ fontSize: 10, color: C.gray, fontFamily: "ui-monospace, monospace" }}>{v.id}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>{v.gender}</span>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{v.age}</span>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{v.accent}</span>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {v.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 6px", background: C.beige, color: C.black, borderRadius: 3, fontWeight: 600 }}>{t}</span>)}
      </div>
      <div style={{ fontSize: 10, color: C.gray }}>Used in <strong style={{ color: C.black }}>{v.usage.toLocaleString()}</strong> evals</div>
    </GSCardWrap>
  );
}

function GSPromptCard({ p, sel, onToggle, onDetail }) {
  return (
    <GSCardWrap sel={sel} onToggle={onToggle} onDetail={onDetail} item={p}>
      <div style={{ paddingRight: 48, marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: C.black, lineHeight: 1.5, fontWeight: 500, fontStyle: "italic" }}>"{p.text}"</div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.beige, color: C.black, borderRadius: 3, fontWeight: 600 }}>{p.scenario}</span>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>{p.lang}</span>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{p.len} words</span>
      </div>
      <div style={{ fontSize: 10, color: C.gray, display: "flex", alignItems: "center", gap: 4 }}>
        Difficulty: {[1, 2, 3].map(n => <span key={n} style={{ width: 6, height: 6, borderRadius: "50%", background: n <= p.difficulty ? C.orange : C.lineSoft }} />)}
      </div>
    </GSCardWrap>
  );
}

function GSPersonaCard({ u, sel, onToggle, onDetail }) {
  return (
    <GSCardWrap sel={sel} onToggle={onToggle} onDetail={onDetail} item={u}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingRight: 48 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.beige, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: C.black }}>
          {u.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.black, lineHeight: 1.3 }}>{u.name}</div>
          <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{u.demo}</div>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.gray, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Emotional baseline</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {Object.entries(u.baseline).map(([k, v]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "60px 1fr 30px", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.gray }}>{k}</span>
              <div style={{ height: 4, background: C.lineSoft, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${v * 100}%`, background: C.purpleDeep }} />
              </div>
              <span style={{ fontSize: 9, color: C.gray, textAlign: "right" }}>{v.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {u.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{t}</span>)}
      </div>
    </GSCardWrap>
  );
}

function GSRoleCard({ r, sel, onToggle, onDetail }) {
  return (
    <GSCardWrap sel={sel} onToggle={onToggle} onDetail={onDetail} item={r}>
      <div style={{ paddingRight: 48, marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 4, lineHeight: 1.3 }}>{r.name}</div>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.beige, color: C.black, borderRadius: 3, fontWeight: 600 }}>{r.domain}</span>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {r.skills.map(s => <span key={s} style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{s}</span>)}
      </div>
      <div style={{ fontSize: 10, color: C.gray }}><strong style={{ color: C.black }}>{r.dialogs.toLocaleString()}</strong> reference dialogs</div>
    </GSCardWrap>
  );
}

function GSUseCaseCard({ c, sel, onToggle, onDetail }) {
  return (
    <GSCardWrap sel={sel} onToggle={onToggle} onDetail={onDetail} item={c}>
      <div style={{ paddingRight: 48, marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 6, lineHeight: 1.3 }}>{c.title}</div>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.beige, color: C.black, borderRadius: 3, fontWeight: 600 }}>{c.industry}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.lineSoft}` }}>
        <div style={{ fontSize: 10, color: C.gray, display: "flex", alignItems: "center", gap: 4 }}>
          Complexity: {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ width: 5, height: 5, borderRadius: "50%", background: n <= c.complexity ? C.orange : C.lineSoft }} />)}
        </div>
        <div style={{ fontSize: 10, color: C.gray }}><strong style={{ color: C.black }}>{c.evals}</strong> evals</div>
      </div>
    </GSCardWrap>
  );
}

function GSDataCard({ d, sel, onToggle, onDetail }) {
  return (
    <GSCardWrap sel={sel} onToggle={onToggle} onDetail={onDetail} item={d}>
      <div style={{ paddingRight: 48, marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.black, lineHeight: 1.3, marginBottom: 6 }}>{d.title}</div>
        <div style={{ height: 18, display: "flex", alignItems: "center", gap: 2, marginBottom: 8 }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: `${30 + Math.sin(i * 0.5 + d.id.charCodeAt(2)) * 40 + Math.cos(i * 0.3) * 25}%`, minHeight: 3, background: C.purple, borderRadius: 1, opacity: 0.7 }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3 }}>{Math.floor(d.dur / 60)}:{(d.dur % 60).toString().padStart(2, "0")}</span>
        <span style={{ fontSize: 10, padding: "2px 6px", background: C.lineSoft, color: C.gray, borderRadius: 3, fontFamily: "ui-monospace, monospace" }}>{d.lang}</span>
        <span style={{ fontSize: 10, padding: "2px 6px", background: d.src === "real" ? "#EAF5EE" : "#F0E9FB", color: d.src === "real" ? "#2F7A52" : C.purpleDeep, borderRadius: 3, fontWeight: 600 }}>{d.src}</span>
      </div>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {d.emotions.map(e => <span key={e} style={{ fontSize: 9, padding: "2px 5px", background: C.beige, color: C.black, borderRadius: 2, fontWeight: 600 }}>{e}</span>)}
      </div>
    </GSCardWrap>
  );
}

function GSSelectionCart({ selected, setSelected }) {
  const total = Object.values(selected).reduce((a, b) => a + b.length, 0);

  return (
    <div style={{ background: C.white, border: `2px solid ${total > 0 ? C.purpleDeep : C.line}`, borderRadius: 10, padding: 16, position: "sticky", top: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <ShoppingCart size={15} color={total > 0 ? C.purpleDeep : C.gray} />
        <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>Selection</div>
        <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: total > 0 ? C.purpleDeep : C.gray, fontFamily: "ui-monospace, monospace" }}>{total}</div>
      </div>

      {total === 0 ? (
        <div style={{ fontSize: 11, color: C.gray, lineHeight: 1.5, padding: "20px 0", textAlign: "center" }}>
          Pick assets across tabs to build a custom evaluation. Mix voices, prompts, personas, and data.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {GS_TABS.map(t => {
              const count = selected[t.id].length;
              if (count === 0) return null;
              const Icon = t.icon;
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: C.lineSoft, borderRadius: 6 }}>
                  <Icon size={12} color={C.gray} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.black, flex: 1 }}>{t.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.black }}>{count}</span>
                  <button onClick={() => setSelected(s => ({ ...s, [t.id]: [] }))}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2, color: C.gray, display: "flex", alignItems: "center" }}>
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button style={{ background: C.black, color: C.white, border: "none", padding: "10px 12px", borderRadius: 6, fontSize: 12, fontFamily: FONT, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Send size={12} /> Build eval
            </button>
            <button style={{ background: C.white, color: C.black, border: `1px solid ${C.line}`, padding: "8px 12px", borderRadius: 6, fontSize: 11, fontFamily: FONT, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Save size={11} /> Save as preset
            </button>
          </div>
        </>
      )}

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}`, fontSize: 10, color: C.gray, lineHeight: 1.5 }}>
        API: <code style={{ background: C.lineSoft, padding: "1px 4px", borderRadius: 2, fontFamily: "ui-monospace, monospace" }}>POST /v1/evaluations</code> with selected IDs
      </div>
    </div>
  );
}

function GSSuggestModal({ tab, onClose }) {
  const t = GS_TABS.find(x => x.id === tab);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.4)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 540, maxWidth: "92vw", background: C.white, borderRadius: 12, zIndex: 51, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: FONT, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: C.gray, textTransform: "uppercase", marginBottom: 4 }}>Contribute to the library</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.black, letterSpacing: "-0.02em" }}>Suggest your own {t.label.toLowerCase()}</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: "none", background: C.lineSoft, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color={C.gray} />
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 18, lineHeight: 1.5 }}>
            Submissions are reviewed by Hume's research team. Approved items enter the public library and you're credited as a contributor.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label={`${t.label.slice(0, -1)} title`}>
              <Input placeholder="" onChange={() => {}} value="" />
            </Field>
            <Field label="Description / context">
              <Textarea rows={3} placeholder="What this asset captures, when to use it, what's distinctive…" onChange={() => {}} value="" />
            </Field>
            <Field label="Visibility">
              <div style={{ display: "flex", gap: 6 }}>
                {["Public library", "My workspace only", "Specific team"].map((v, i) => (
                  <button key={i} style={{ flex: 1, padding: "8px 10px", background: i === 0 ? C.beige : C.white, border: `2px solid ${i === 0 ? C.black : C.line}`, borderRadius: 6, fontSize: 11, fontFamily: FONT, fontWeight: 600, color: C.black, cursor: "pointer" }}>{v}</button>
                ))}
              </div>
            </Field>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.line}`, padding: "14px 24px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${C.line}`, padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", color: C.black }}>Cancel</button>
          <button style={{ background: C.black, color: C.white, border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Submit for review <Send size={12} />
          </button>
        </div>
      </div>
    </>
  );
}

function GSAssetDetail({ asset, onClose }) {
  return (
    <div>
      <DrawerHeader
        eyebrow="Asset detail"
        title={asset.name || asset.title || asset.text?.slice(0, 50) || asset.id}
        subtitle={asset.id}
        onClose={onClose}
      />
      <div style={{ padding: 28 }}>
        <div style={{ background: C.beige, borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 11, color: C.ink, lineHeight: 1.5 }}>
          Full metadata, sample preview, usage stats, contributor history, and per-eval performance. API-accessible at <code style={{ background: C.white, padding: "1px 4px", borderRadius: 2 }}>GET /v1/golden-sets/{asset.id}</code>.
        </div>
        <pre style={{ background: C.black, color: "#E8E8E8", padding: 16, borderRadius: 8, fontSize: 11, lineHeight: 1.6, fontFamily: "ui-monospace, monospace", overflow: "auto" }}>
{JSON.stringify(asset, null, 2)}
        </pre>
      </div>
    </div>
  );
}
