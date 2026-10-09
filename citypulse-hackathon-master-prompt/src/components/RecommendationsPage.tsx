import { useEffect, useMemo, useState } from "react";
import { citypulseService, placeDNA } from "../services/citypulseService";
import type { Place } from "../data/puneData";
import { Wallet, MapPin, Sparkles, Calculator } from "lucide-react";

const MODES = [
  { key: "Student", icon: "🎓", desc: "Affordable, accessible, popular" },
  { key: "Tourist", icon: "🧳", desc: "Experience and popularity first" },
  { key: "Family", icon: "👨‍👩‍👧", desc: "Safe, clean and accessible" },
  { key: "Budget", icon: "💸", desc: "Maximum value, low cost" },
  { key: "Accessibility", icon: "♿", desc: "Ramps, transit and signage" },
];

export default function RecommendationsPage({ onPlaceClick }: { onPlaceClick: (id: string) => void }) {
  const [mode, setMode] = useState("Student");
  const [recs, setRecs] = useState<{ place: Place; score: number }[]>([]);
  const [budget, setBudget] = useState({
    people: 2,
    food: 800,
    travel: 400,
    entry: 200,
    hotel: 1500,
    activities: 500,
  });

  useEffect(() => {
    citypulseService.getRecommendations(mode).then(setRecs);
  }, [mode]);

  const calc = useMemo(() => citypulseService.calculateBudget(budget), [budget]);

  return (
    <div className="page">
      <span className="section-eyebrow">✨ Personalized Modes</span>
      <h1 className="section-title">Pick your mode · get tailored picks</h1>
      <p className="section-sub">
        CityPulse re-weights the DNA dimensions based on your mode — what matters for a tourist isn't what matters for a student.
      </p>

      <div className="grid grid-3 mb-4">
        {MODES.map((m) => (
          <div
            key={m.key}
            className={`card card-hover ${mode === m.key ? "" : ""}`}
            style={{
              borderColor: mode === m.key ? "#2563eb" : "#e5e8ee",
              background: mode === m.key ? "linear-gradient(180deg, #dbeafe, white)" : "white",
            }}
            onClick={() => setMode(m.key)}
          >
            <div className="flex between center mb-2">
              <div style={{ fontSize: 28 }}>{m.icon}</div>
              {mode === m.key && <span className="badge badge-blue">Active</span>}
            </div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{m.key} Mode</h3>
            <p className="muted text-sm" style={{ margin: 0 }}>{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="card-soft mb-4" style={{ background: "linear-gradient(180deg, #eff6ff, white)", border: "1px solid #bfdbfe" }}>
        <div className="flex center gap-2 mb-2">
          <Sparkles size={16} color="#0d9488" />
          <strong>Top picks for {mode} mode</strong>
        </div>
        <p className="muted text-sm" style={{ margin: 0 }}>
          Ranked by weighting that maximizes what matters to a {mode.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-3 mb-4">
        {recs.slice(0, 6).map(({ place, score }, i) => {
          const dna = placeDNA(place);
          return (
            <div key={place.id} className="card card-hover" onClick={() => onPlaceClick(place.id)}>
              <div className="flex between center mb-2">
                <span className="badge badge-blue">#{i + 1} for {mode}</span>
                <span className="muted text-xs">Match {Math.round(score * 10) / 10}</span>
              </div>
              <div className="flex center gap-3 mb-2">
                <div style={{ fontSize: 36 }}>{place.image}</div>
                <div>
                  <div className="font-bold" style={{ fontSize: 16 }}>{place.name}</div>
                  <div className="muted text-xs flex center gap-2"><MapPin size={12} /> {place.area}</div>
                </div>
              </div>
              <div className="bar mb-2">
                <div className="bar-fill" style={{ width: `${dna.overall * 10}%` }} />
              </div>
              <div className="flex between center muted text-xs">
                <span>DNA {dna.overall}/10</span>
                <span>₹{place.priceLevel * 250}+ pp</span>
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, marginTop: 8 }}>
        <Calculator size={18} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
        Smart Budget Calculator
      </h2>
      <div className="grid grid-2">
        <div className="card">
          {[
            { k: "people", label: "Number of People", max: 10 },
            { k: "food", label: "Food (₹/day)", max: 5000 },
            { k: "travel", label: "Travel (₹)", max: 5000 },
            { k: "entry", label: "Entry Fees (₹)", max: 3000 },
            { k: "hotel", label: "Hotel (₹/night)", max: 8000 },
            { k: "activities", label: "Activities (₹)", max: 5000 },
          ].map((f) => (
            <div className="field" key={f.k}>
              <label className="flex between center">
                <span>{f.label}</span>
                <strong>{(budget as any)[f.k]}</strong>
              </label>
              <input
                type="range"
                min={f.k === "people" ? 1 : 0}
                max={f.max}
                value={(budget as any)[f.k]}
                onChange={(e) => setBudget({ ...budget, [f.k]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>
        <div>
          <div className="card-soft mb-3" style={{ background: "linear-gradient(135deg, #2563eb, #0d9488)", color: "white" }}>
            <div className="muted text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>Estimated Total</div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>₹{calc.total.toLocaleString()}</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>≈ ₹{Math.round(calc.perPerson).toLocaleString()} per person</div>
          </div>
          <div className="card-soft">
            <div className="flex between center mb-2">
              <strong>Budget Status</strong>
              <span
                className={`badge ${
                  calc.status === "Within Budget" ? "badge-emerald" : calc.status === "Slightly Over" ? "badge-amber" : "badge-rose"
                }`}
              >
                {calc.status}
              </span>
            </div>
            <p className="muted text-sm" style={{ margin: 0 }}>
              {calc.status === "Within Budget"
                ? "Comfortable budget — you can add a premium experience or hotel."
                : calc.status === "Slightly Over"
                ? "A bit over — consider trimming hotel or activities."
                : "Over budget — drop a category or shorten your stay."}
            </p>
            <div className="divider" />
            <div className="text-xs muted flex center gap-2">
              <Wallet size={12} /> CityPulse budget uses current Pune averages.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
