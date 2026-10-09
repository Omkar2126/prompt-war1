import { MapPin, Star } from "lucide-react";
import type { Place } from "../data/puneData";
import { placeDNA } from "../services/citypulseService";

interface Props {
  place: Place;
  onClick?: () => void;
}

const priceLabel = (n: number) => "₹".repeat(n);

export default function PlaceCard({ place, onClick }: Props) {
  const dna = placeDNA(place);
  return (
    <div className="card card-hover place-card" onClick={onClick}>
      <div className="place-thumb">
        <span className="cat-tag">{place.category}</span>
        <span>{place.image}</span>
      </div>
      <h3 className="place-name">{place.name}</h3>
      <div className="place-area flex between center">
        <span className="flex center gap-2">
          <MapPin size={13} /> {place.area}
        </span>
        <span className="flex center gap-2">
          <Star size={13} fill="#f59e0b" stroke="#f59e0b" /> {place.rating}
          <span className="muted text-xs">· {priceLabel(place.priceLevel)}</span>
        </span>
      </div>
      <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
        {place.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <div className="place-dna-mini">
        <div>
          <div className="dna-mini-score">{dna.overall}</div>
          <div className="dna-mini-label">Place DNA</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${dna.overall * 10}%` }} />
          </div>
          <div className="muted text-xs" style={{ marginTop: 4 }}>
            Safety {place.safety} · Clean {place.cleanliness} · Afford {place.affordability}
          </div>
        </div>
      </div>
    </div>
  );
}
