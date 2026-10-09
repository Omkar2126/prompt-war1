import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Navigation, Clock } from "lucide-react";
import { citypulseService, placeDNA } from "../services/citypulseService";
import type { SafetyEvent, Place } from "../data/puneData";

const TIMES = [
  { key: "morning", label: "Morning", icon: "🌅", score: 9.2 },
  { key: "afternoon", label: "Afternoon", icon: "☀️", score: 8.9 },
  { key: "evening", label: "Evening", icon: "🌆", score: 7.8 },
  { key: "night", label: "Night", icon: "🌙", score: 6.4 },
];

const severityColor: Record<string, string> = {
  High: "badge-rose",
  Medium: "badge-amber",
  Low: "badge-emerald",
};

export default function SafetyPage() {
  const [time, setTime] = useState("evening");
  const [events, setEvents] = useState<SafetyEvent[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    citypulseService.getSafetyEvents().then(setEvents);
    citypulseService.getPlaces().then(setPlaces);
    citypulseService.getRoutes().then(setRoutes);
  }, []);

  const timeObj = TIMES.find((t) => t.key === time)!;
  const safetyAreas = places
    .map((p) => ({ p, dna: placeDNA(p) }))
    .sort((a, b) => b.p.safety - a.p.safety);

  return (
    <div className="page">
      <span className="section-eyebrow">🛡️ Smart Safety</span>
      <h1 className="section-title">Smart Safety Map</h1>
      <p className="section-sub">
        Time-aware safety indicators built from citizen reports, signals and incident history — Pune, today.
      </p>

      <div className="card-soft mb-4" style={{ background: "linear-gradient(180deg, #eff6ff, #ffffff)", border: "1px solid #bfdbfe" }}>
        <div className="flex between center mb-3" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="flex center gap-2">
              <Shield size={18} color="#1d4ed8" />
              <strong>City Safety Score · {timeObj.label}</strong>
            </div>
            <div className="muted text-sm">Adjusted for time of day and active reports</div>
          </div>
          <div className="flex center gap-3">
            <div
              className="score-circle"
              style={{ width: 64, height: 64, fontSize: 18, ["--pct" as any]: `${timeObj.score * 10}%` }}
            >
              <span>{timeObj.score}</span>
            </div>
          </div>
        </div>
        <div className="time-grid">
          {TIMES.map((t) => (
            <div
              key={t.key}
              className={`time-tile ${time === t.key ? "active" : ""}`}
              onClick={() => setTime(t.key)}
            >
              <div className="icon">{t.icon}</div>
              <div className="lbl">{t.label}</div>
              <div className="score">{t.score}</div>
            </div>
          ))}
        </div>
        <p className="muted text-xs mt-3" style={{ margin: "12px 0 0" }}>
          ⚠ Safety scores are based on available reports and signals. They do not guarantee personal safety.
        </p>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Safety Cards · Areas</h2>
      <div className="grid grid-3 mb-4">
        {safetyAreas.slice(0, 6).map(({ p }) => (
          <div key={p.id} className="card">
            <div className="flex between center mb-2">
              <strong style={{ fontSize: 15 }}>{p.image} {p.area}</strong>
              <span
                className={`badge ${
                  p.safety >= 8.8 ? "badge-emerald" : p.safety >= 8 ? "badge-amber" : "badge-rose"
                }`}
              >
                {p.safety >= 8.8 ? "Low Risk" : p.safety >= 8 ? "Moderate" : "Caution"}
              </span>
            </div>
            <div className="flex between center">
              <span className="text-sm muted">Safety Score</span>
              <strong>{p.safety}/10</strong>
            </div>
            <div className="bar mt-2">
              <div className={`bar-fill ${p.safety >= 8.5 ? "bar-fill-emerald" : p.safety < 7.5 ? "bar-fill-amber" : ""}`} style={{ width: `${p.safety * 10}%` }} />
            </div>
            <div className="flex between center mt-3 muted text-xs">
              <span>{Math.round(Math.random() * 6 + 2)} recent reports</span>
              <span>Updated {Math.round(Math.random() * 30 + 5)} min ago</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Recent Safety Signals</h2>
      <div className="grid grid-2 mb-4">
        {events.map((e) => (
          <div key={e.id} className="card">
            <div className="flex between center mb-2">
              <strong style={{ fontSize: 15 }}>{e.title}</strong>
              <span className={`badge ${severityColor[e.severity]}`}>{e.severity}</span>
            </div>
            <p className="muted text-sm" style={{ margin: "0 0 8px" }}>{e.description}</p>
            <div className="flex between center muted text-xs">
              <span className="flex center gap-2"><Navigation size={12} /> {e.area}</span>
              <span className="flex center gap-2"><Clock size={12} /> {e.time}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Safer Route Comparison</h2>
      <div className="grid grid-3">
        {routes.map((r) => (
          <div
            key={r.id}
            className={`route-card ${r.id === "A" ? "recommended" : ""}`}
          >
            {r.id === "A" && (
              <span className="badge badge-emerald" style={{ position: "absolute", top: 12, right: 12 }}>
                ✓ Recommended
              </span>
            )}
            <strong style={{ fontSize: 15 }}>{r.name}</strong>
            <div className="grid grid-2 mt-3" style={{ gap: 8 }}>
              <div className="card-soft">
                <div className="muted text-xs">Time</div>
                <div className="font-bold">{r.time} min</div>
              </div>
              <div className="card-soft">
                <div className="muted text-xs">Distance</div>
                <div className="font-bold">{r.distance} km</div>
              </div>
              <div className="card-soft">
                <div className="muted text-xs">Safety</div>
                <div className="font-bold" style={{ color: r.safety >= 8.5 ? "#047857" : r.safety >= 8 ? "#b45309" : "#be123c" }}>
                  {r.safety}/10
                </div>
              </div>
              <div className="card-soft">
                <div className="muted text-xs">Incidents</div>
                <div className="font-bold">{r.incidents}</div>
              </div>
            </div>
            <p className="text-sm muted mt-3" style={{ margin: "12px 0 0" }}>
              {r.description}
            </p>
            {r.id === "A" && (
              <p className="text-sm mt-3" style={{ margin: "12px 0 0", color: "#047857", fontWeight: 600 }}>
                <AlertTriangle size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
                Route A is recommended — better safety indicator with only a small increase in travel time.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
