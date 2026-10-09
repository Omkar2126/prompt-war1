import { X, Shield, Sparkles, Heart, MapPin, Clock, Star, MessageSquare, ChevronRight } from "lucide-react";
import type { Place } from "../data/puneData";
import { placeDNA, whyThisScore, citypulseService } from "../services/citypulseService";
import { useEffect, useState } from "react";

interface Props {
  place: Place;
  onClose: () => void;
  onCompare: (id: string) => void;
  inCompare: boolean;
}

export default function PlaceDetailModal({ place, onClose, onCompare, inCompare }: Props) {
  const dna = placeDNA(place);
  const reasons = whyThisScore(place);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    citypulseService.getReviews(place.id).then(setReviews);
  }, [place.id]);

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="flex center gap-2 mb-2">
              <span className="badge badge-blue">{place.category}</span>
              <span className="muted text-sm">· {place.area}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
              {place.name}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ height: 140, borderRadius: 12, background: "linear-gradient(135deg, #e0e7ff, #ccfbf1)", display: "grid", placeItems: "center", fontSize: 64, marginBottom: 16 }}>
            {place.image}
          </div>
          <p className="muted" style={{ marginTop: 0 }}>{place.description}</p>

          <div className="flex gap-3 mb-3" style={{ flexWrap: "wrap" }}>
            <span className="flex center gap-2 text-sm muted"><MapPin size={14} /> {place.address}</span>
            <span className="flex center gap-2 text-sm muted"><Clock size={14} /> {place.hours}</span>
            <span className="flex center gap-2 text-sm muted"><Star size={14} fill="#f59e0b" stroke="#f59e0b" /> {place.rating} rating</span>
          </div>

          <div className="card-soft mb-4">
            <div className="flex between center mb-3">
              <div>
                <div className="flex center gap-2">
                  <Sparkles size={16} color="#0d9488" />
                  <strong>Place DNA</strong>
                </div>
                <div className="muted text-sm">Six-dimensional city intelligence</div>
              </div>
              <div
                className="score-circle"
                style={{ ["--pct" as any]: `${dna.overall * 10}%` }}
              >
                <span>{dna.overall}</span>
              </div>
            </div>
            {dna.dims.map((d) => (
              <div className="dna-dim" key={d.key}>
                <div className="lbl">{d.key}</div>
                <div className="bar">
                  <div
                    className={`bar-fill ${d.value >= 8.5 ? "bar-fill-emerald" : d.value < 7 ? "bar-fill-amber" : ""}`}
                    style={{ width: `${d.value * 10}%` }}
                  />
                </div>
                <div className="val">{d.value}</div>
              </div>
            ))}
            <div className="divider" />
            <div className="text-sm font-semi mb-2">Why this score?</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "#475569" }} className="text-sm">
              {reasons.map((r, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-2 mb-4">
            <div className="card-soft">
              <div className="flex center gap-2 mb-2">
                <Shield size={14} color="#2563eb" />
                <strong className="text-sm">Trust & Safety</strong>
              </div>
              <div className="font-bold" style={{ fontSize: 20 }}>{place.safety}/10</div>
              <div className="muted text-xs">Citizen trust: {place.trust}/10</div>
            </div>
            <div className="card-soft">
              <div className="flex center gap-2 mb-2">
                <Heart size={14} color="#0d9488" />
                <strong className="text-sm">Best For</strong>
              </div>
              <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                {place.bestFor.map((b) => (
                  <span key={b} className="badge badge-teal">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="mb-4">
              <div className="flex center gap-2 mb-3">
                <MessageSquare size={16} />
                <strong>Honest Reviews</strong>
                <span className="muted text-sm">· Aspect-based</span>
              </div>
              {reviews.slice(0, 2).map((r) => (
                <div key={r.id} className="card-soft mb-2">
                  <div className="flex between center mb-2">
                    <strong className="text-sm">{r.user}</strong>
                    <span className="muted text-xs">{r.date}</span>
                  </div>
                  <p className="text-sm muted" style={{ margin: "0 0 10px" }}>{r.text}</p>
                  <div className="grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                    {r.food > 0 && <div className="text-xs"><span className="muted">Food</span> <strong>{r.food}</strong></div>}
                    <div className="text-xs"><span className="muted">Service</span> <strong>{r.service}</strong></div>
                    <div className="text-xs"><span className="muted">Clean</span> <strong>{r.cleanliness}</strong></div>
                    <div className="text-xs"><span className="muted">Price</span> <strong>{r.price}</strong></div>
                    <div className="text-xs"><span className="muted">Access</span> <strong>{r.accessibility}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className={`btn-${inCompare ? "ghost" : "primary"}`}
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => onCompare(place.id)}
          >
            {inCompare ? "Remove from Compare" : "Add to Compare"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
