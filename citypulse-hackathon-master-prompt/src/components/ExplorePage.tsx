import { useEffect, useMemo, useState } from "react";
import { citypulseService } from "../services/citypulseService";
import type { Place } from "../data/puneData";
import PlaceCard from "./PlaceCard";
import { Search, Activity, ShieldCheck } from "lucide-react";

const CATS = ["All", "Food", "Attractions", "Heritage", "Family", "Budget"];

export default function ExplorePage({ onPlaceClick }: { onPlaceClick: (id: string) => void }) {
  const [all, setAll] = useState<Place[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [health, setHealth] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    citypulseService.getPlaces().then(setAll);
    citypulseService.getCityHealth().then(setHealth);
    citypulseService.getWeather().then(setWeather);
  }, []);

  const filtered = useMemo(() => {
    return all.filter((p) => {
      if (cat === "All") {
        if (!q) return true;
        const l = q.toLowerCase();
        return p.name.toLowerCase().includes(l) || p.area.toLowerCase().includes(l) || p.tags.some((t) => t.toLowerCase().includes(l));
      }
      if (cat === "Food") return ["Restaurant", "Street Food", "Cafe"].includes(p.category);
      if (cat === "Attractions") return ["Attraction", "Family", "Heritage"].includes(p.category);
      if (cat === "Heritage") return p.category === "Heritage";
      if (cat === "Family") return p.category === "Family" || p.safety >= 8.8;
      if (cat === "Budget") return p.affordability >= 8.5;
      return true;
    });
  }, [all, q, cat]);

  return (
    <div className="page">
      <span className="section-eyebrow">🔍 Explore Pune</span>
      <h1 className="section-title">Where do you want to go today?</h1>
      <p className="section-sub">
        Browse 12 curated Pune places with full Place DNA — safety, cleanliness, affordability, accessibility, experience and popularity.
      </p>

      <div className="grid grid-3 mb-4">
        {weather && (
          <div className="card" style={{ background: "linear-gradient(135deg, #dbeafe, #ccfbf1)" }}>
            <div className="flex between center">
              <div>
                <div className="muted text-sm">Pune Weather</div>
                <div className="font-bold" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{weather.temp}°C</div>
                <div className="text-sm">{weather.condition}</div>
              </div>
              <div style={{ fontSize: 48 }}>🌦️</div>
            </div>
            <p className="text-sm mt-3" style={{ margin: "12px 0 0" }}>
              💡 {weather.recommendation}
            </p>
          </div>
        )}
        {health && (
          <>
            <div className="card">
              <div className="flex center gap-2 mb-2">
                <ShieldCheck size={16} color="#047857" />
                <strong>City Health</strong>
              </div>
              <div className="muted text-xs mb-2">Live indicators for Pune</div>
              {[
                { k: "Safety", v: health.safety, c: "#2563eb" },
                { k: "Cleanliness", v: health.cleanliness, c: "#0d9488" },
                { k: "Affordability", v: health.affordability, c: "#10b981" },
                { k: "Accessibility", v: health.accessibility, c: "#f59e0b" },
              ].map((d) => (
                <div key={d.k} className="mb-2">
                  <div className="flex between center text-xs mb-2">
                    <span>{d.k}</span>
                    <strong>{d.v}/10</strong>
                  </div>
                  <div className="bar"><div className="bar-fill" style={{ width: `${d.v * 10}%`, background: d.c }} /></div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="flex center gap-2 mb-2">
                <Activity size={16} color="#0d9488" />
                <strong>Live Activity</strong>
              </div>
              <div className="muted text-xs mb-3">CityPulse signals today</div>
              <div className="grid grid-2" style={{ gap: 10 }}>
                <div className="card-soft">
                  <div className="muted text-xs">Tourism Activity</div>
                  <div className="font-bold" style={{ fontSize: 22 }}>{health.tourism}/10</div>
                </div>
                <div className="card-soft">
                  <div className="muted text-xs">Citizen Reports</div>
                  <div className="font-bold" style={{ fontSize: 22 }}>{health.citizenReports.toLocaleString()}</div>
                </div>
                <div className="card-soft">
                  <div className="muted text-xs">Active Places</div>
                  <div className="font-bold" style={{ fontSize: 22 }}>{all.length}</div>
                </div>
                <div className="card-soft">
                  <div className="muted text-xs">Coverage</div>
                  <div className="font-bold" style={{ fontSize: 22 }}>12 areas</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex between center mb-3" style={{ flexWrap: "wrap", gap: 10 }}>
        <div className="hero-search" style={{ maxWidth: 420 }}>
          <Search size={16} style={{ alignSelf: "center", marginLeft: 8, color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search places, food, areas…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="seg" style={{ flexWrap: "wrap" }}>
          {CATS.map((c) => (
            <button key={c} className={cat === c ? "active" : ""} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-3">
        {filtered.map((p) => (
          <PlaceCard key={p.id} place={p} onClick={() => onPlaceClick(p.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card-soft text-sm muted" style={{ textAlign: "center", padding: 40 }}>
          No places match. Try a different search or category.
        </div>
      )}
    </div>
  );
}
