import { useState, useEffect, useMemo } from "react";
import { citypulseService, placeDNA } from "../services/citypulseService";
import type { Place } from "../data/puneData";
import { X, Sparkles, TrendingUp, TrendingDown, Award, Plus } from "lucide-react";

const DIMS = [
  { key: "safety", label: "Safety" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "affordability", label: "Affordability" },
  { key: "accessibility", label: "Accessibility" },
  { key: "experience", label: "Experience" },
  { key: "popularity", label: "Popularity" },
  { key: "trust", label: "Trust" },
] as const;

export default function ComparePage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [picked, setPicked] = useState<string[]>(["p1", "p4"]);
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    citypulseService.getPlaces().then(setPlaces);
  }, []);

  const comparePlaces = useMemo(
    () => places.filter((p) => picked.includes(p.id)),
    [places, picked]
  );

  const ranked = useMemo(
    () =>
      comparePlaces
        .map((p) => ({ p, dna: placeDNA(p) }))
        .sort((a, b) => b.dna.overall - a.dna.overall),
    [comparePlaces]
  );

  const best = ranked[0];

  const verdict = () => {
    if (comparePlaces.length < 2) return "Add at least two places to compare.";
    const winner = best.p;
    const winnerDNA = best.dna.overall;
    return `Best overall: ${winner.name} with a Place DNA of ${winnerDNA}/10. It provides the strongest balance of safety, affordability and experience among the selected places.`;
  };

  const top5 = useMemo(
    () => [...places].map((p) => ({ p, dna: placeDNA(p) })).sort((a, b) => b.dna.overall - a.dna.overall).slice(0, 5),
    [places]
  );

  const bottom5 = useMemo(
    () => [...places].map((p) => ({ p, dna: placeDNA(p) })).sort((a, b) => a.dna.overall - b.dna.overall).slice(0, 5),
    [places]
  );

  const addPlace = (id: string) => {
    if (picked.length >= 3) return;
    if (picked.includes(id)) return;
    setPicked([...picked, id]);
    setPicker(false);
  };
  const removePlace = (id: string) => setPicked(picked.filter((p) => p !== id));

  return (
    <div className="page">
      <span className="section-eyebrow">⚖️ Best vs Worst</span>
      <h1 className="section-title">Compare places side by side</h1>
      <p className="section-sub">
        Pick 2–3 places and CityPulse will surface the strongest signal across all six DNA dimensions.
      </p>

      <div className="flex between center mb-3" style={{ flexWrap: "wrap", gap: 10 }}>
        <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
          {comparePlaces.map((p) => (
            <div key={p.id} className="card-soft flex center gap-2" style={{ padding: "8px 12px" }}>
              <span style={{ fontSize: 18 }}>{p.image}</span>
              <strong className="text-sm">{p.name}</strong>
              <button className="close-btn" style={{ width: 22, height: 22 }} onClick={() => removePlace(p.id)}>
                <X size={11} />
              </button>
            </div>
          ))}
          {picked.length < 3 && (
            <button className="btn-ghost" onClick={() => setPicker(true)}>
              <Plus size={14} /> Add place
            </button>
          )}
        </div>
      </div>

      {comparePlaces.length >= 2 && (
        <div className="card mb-4">
          <div className="flex center gap-2 mb-3">
            <Sparkles size={18} color="#0d9488" />
            <strong>CityPulse Verdict</strong>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{verdict()}</p>
        </div>
      )}

      <div className="card mb-4">
        {DIMS.map((d) => (
          <div key={d.key} className="cmp-row">
            <div className="lbl">{d.label}</div>
            {comparePlaces.map((p) => {
              const v = (p as any)[d.key] || 0;
              return (
                <div key={p.id} className="cmp-cell">
                  <span className="v">{v}</span>
                  <div className="bar">
                    <div
                      className={`bar-fill ${v >= 8.5 ? "bar-fill-emerald" : v < 7.5 ? "bar-fill-amber" : ""}`}
                      style={{ width: `${v * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="cmp-row" style={{ borderTop: "1px solid #e5e8ee", marginTop: 6, paddingTop: 14 }}>
          <div className="lbl" style={{ color: "#0f172a" }}>Place DNA</div>
          {comparePlaces.map((p) => {
            const dna = placeDNA(p);
            return (
              <div key={p.id} className="cmp-cell">
                <span className="v" style={{ fontSize: 18 }}>{dna.overall}</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${dna.overall * 10}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-2">
        <div>
          <div className="flex center gap-2 mb-3">
            <Award size={18} color="#047857" />
            <strong>Top 5 Places in Pune</strong>
          </div>
          <div className="grid" style={{ gap: 10 }}>
            {top5.map(({ p, dna }, i) => (
              <div key={p.id} className="card-soft flex between center">
                <div className="flex center gap-3">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: i === 0 ? "#fef3c7" : "#f1f5f9",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      color: i === 0 ? "#b45309" : "#475569",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{p.image} {p.name}</div>
                    <div className="muted text-xs">{p.area}</div>
                  </div>
                </div>
                <div className="flex center gap-2">
                  <TrendingUp size={14} color="#047857" />
                  <strong>{dna.overall}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex center gap-2 mb-3">
            <TrendingDown size={18} color="#be123c" />
            <strong>Needs Improvement</strong>
          </div>
          <div className="grid" style={{ gap: 10 }}>
            {bottom5.map(({ p, dna }, i) => (
              <div key={p.id} className="card-soft flex between center">
                <div className="flex center gap-3">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#fee2e2",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      color: "#b91c1c",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{p.image} {p.name}</div>
                    <div className="muted text-xs">Improvement scope in {p.area.split(" ")[0]}</div>
                  </div>
                </div>
                <div className="flex center gap-2">
                  <strong>{dna.overall}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {picker && (
        <div className="modal-back" onClick={() => setPicker(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2 style={{ margin: 0, fontSize: 18 }}>Add a place to compare</h2>
              <button className="close-btn" onClick={() => setPicker(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="grid grid-2">
                {places
                  .filter((p) => !picked.includes(p.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="card card-hover flex between center"
                      onClick={() => addPlace(p.id)}
                    >
                      <div>
                        <div className="font-bold">{p.image} {p.name}</div>
                        <div className="muted text-xs">{p.area}</div>
                      </div>
                      <Plus size={16} color="#2563eb" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
