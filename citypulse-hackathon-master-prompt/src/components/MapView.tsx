import { useState, useEffect } from "react";
import type { Place, SafetyEvent, CitizenReport } from "../data/puneData";
import { citypulseService } from "../services/citypulseService";

interface Props {
  onPlaceClick: (id: string) => void;
}

// Pune bounding box approx: 18.41–18.62, 73.74–73.95
const BOUNDS = { minLat: 18.36, maxLat: 18.62, minLng: 73.74, maxLng: 73.95 };

const project = (lat: number, lng: number) => {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
};

const FILTERS = ["All", "Food", "Hotels", "Attractions", "Heritage", "Safety", "Reports"];

const emojiFor = (cat: string) => {
  const m: Record<string, string> = {
    Heritage: "🏛️",
    Attraction: "🏰",
    Cafe: "☕",
    Restaurant: "🍽️",
    "Street Food": "🥘",
    Market: "🛍️",
    Family: "🌳",
  };
  return m[cat] || "📍";
};

export default function MapView({ onPlaceClick }: Props) {
  const [filter, setFilter] = useState("All");
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<SafetyEvent[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);

  useEffect(() => {
    citypulseService.getPlaces().then(setPlaces);
    citypulseService.getSafetyEvents().then(setEvents);
    citypulseService.getCitizenReports().then(setReports);
  }, []);

  const showPlaces = ["All", "Food", "Hotels", "Attractions", "Heritage"].includes(filter);
  const showEvents = ["All", "Safety"].includes(filter);
  const showReports = ["All", "Reports"].includes(filter);

  const filteredPlaces = places.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Food") return ["Restaurant", "Street Food", "Cafe"].includes(p.category);
    if (filter === "Hotels") return p.category === "Hotel";
    if (filter === "Attractions") return ["Attraction", "Family"].includes(p.category);
    if (filter === "Heritage") return p.category === "Heritage";
    return false;
  });

  return (
    <div className="map-shell">
      <div className="map-grid-bg" />
      <div className="map-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`map-filter ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {showPlaces &&
        filteredPlaces.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          return (
            <div
              key={p.id}
              className="map-pin"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onPlaceClick(p.id)}
            >
              <span className="pin-tooltip">{p.name}</span>
              {emojiFor(p.category)}
            </div>
          );
        })}

      {showEvents &&
        events.map((e) => {
          const { x, y } = project(e.lat, e.lng);
          const color = e.severity === "High" ? "#ef4444" : e.severity === "Medium" ? "#f59e0b" : "#10b981";
          return (
            <div
              key={e.id}
              className="map-pin"
              style={{ left: `${x}%`, top: `${y}%`, fontSize: 18 }}
            >
              <span className="pin-tooltip">{e.title}</span>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: color,
                  border: "2px solid white",
                  boxShadow: `0 0 0 4px ${color}22`,
                }}
              />
            </div>
          );
        })}

      {showReports &&
        reports.slice(0, 6).map((r) => {
          const { x, y } = project(r.lat, r.lng);
          return (
            <div
              key={r.id}
              className="map-pin"
              style={{ left: `${x}%`, top: `${y}%`, fontSize: 18 }}
            >
              <span className="pin-tooltip">{r.title}</span>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: "#2563eb",
                  border: "2px solid white",
                  transform: "rotate(45deg)",
                  boxShadow: "0 0 0 4px #2563eb22",
                }}
              />
            </div>
          );
        })}

      <div className="map-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: "#2563eb" }} /> Places</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#ef4444" }} /> High risk</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#f59e0b" }} /> Medium</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#10b981" }} /> Low</span>
      </div>
    </div>
  );
}
