import { Clock, MapPin, Compass } from "lucide-react";
import type { Heritage, Place } from "../data/puneData";
import { useEffect, useState } from "react";
import { citypulseService } from "../services/citypulseService";

export default function CulturePage() {
  const [heritage, setHeritage] = useState<Heritage[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [active, setActive] = useState<Heritage | null>(null);

  useEffect(() => {
    citypulseService.getHeritage().then(setHeritage);
    citypulseService.getPlaces().then(setPlaces);
  }, []);

  const nearby = (area: string) =>
    places.filter((p) => p.area.toLowerCase().includes(area.toLowerCase().split(" ")[0])).slice(0, 3);

  return (
    <div className="page">
      <span className="section-eyebrow">📚 Heritage & Culture</span>
      <h1 className="section-title">Pune's Living Heritage</h1>
      <p className="section-sub">
        Stories from forts, palaces and temples — paired with what you can experience today.
      </p>

      {!active ? (
        <div className="grid grid-3">
          {heritage.map((h) => (
            <div key={h.id} className="card card-hover heritage-card" onClick={() => setActive(h)}>
              <div className="heritage-emoji">{h.emoji}</div>
              <div className="heritage-period">{h.period}</div>
              <h3 style={{ margin: "4px 0 8px", fontSize: 18 }}>{h.name}</h3>
              <p className="muted text-sm" style={{ margin: 0, lineHeight: 1.5 }}>
                {h.today}
              </p>
              <div className="flex between center mt-3" style={{ borderTop: "1px dashed #e5e8ee", paddingTop: 10 }}>
                <span className="muted text-xs flex center gap-2">
                  <MapPin size={12} /> {h.area}
                </span>
                <span className="badge badge-amber">Story Mode →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button className="btn-ghost mb-3" onClick={() => setActive(null)}>
            ← Back to heritage
          </button>
          <div className="card">
            <div className="flex gap-3 mb-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
              <div className="heritage-emoji" style={{ width: 80, height: 80, fontSize: 48 }}>
                {active.emoji}
              </div>
              <div>
                <div className="heritage-period">{active.period}</div>
                <h2 style={{ margin: "4px 0 4px", fontSize: 26 }}>{active.name}</h2>
                <span className="muted text-sm flex center gap-2"><MapPin size={13} /> {active.area}</span>
              </div>
            </div>

            <div className="grid grid-3" style={{ marginTop: 18 }}>
              <div className="card-soft" style={{ background: "linear-gradient(180deg, #fef3c7, #fff)" }}>
                <div className="flex center gap-2 mb-2">
                  <Clock size={14} color="#b45309" />
                  <strong className="text-sm">Then</strong>
                </div>
                <p className="text-sm" style={{ margin: 0, lineHeight: 1.5 }}>{active.then}</p>
              </div>
              <div className="card-soft" style={{ background: "linear-gradient(180deg, #dbeafe, #fff)" }}>
                <div className="flex center gap-2 mb-2">
                  <Compass size={14} color="#1d4ed8" />
                  <strong className="text-sm">Today</strong>
                </div>
                <p className="text-sm" style={{ margin: 0, lineHeight: 1.5 }}>{active.today}</p>
              </div>
              <div className="card-soft" style={{ background: "linear-gradient(180deg, #ccfbf1, #fff)" }}>
                <div className="flex center gap-2 mb-2">
                  <MapPin size={14} color="#0f766e" />
                  <strong className="text-sm">Nearby Experiences</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14 }} className="muted">
                  {nearby(active.area).map((p) => (
                    <li key={p.id} style={{ marginBottom: 4 }}>{p.image} {p.name}</li>
                  ))}
                  {nearby(active.area).length === 0 && active.nearby.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
