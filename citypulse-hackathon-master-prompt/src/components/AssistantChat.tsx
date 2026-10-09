import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { citypulseService } from "../services/citypulseService";
import type { Place } from "../data/puneData";

interface Message {
  role: "user" | "bot";
  text: string;
  places?: Place[];
}

const SUGGESTIONS = [
  "Where should I eat in Pune tonight?",
  "Show affordable places near FC Road",
  "Best heritage spots for a tourist",
  "Family-friendly places with high safety",
  "Cafés good for working in Baner",
];

const respond = (q: string, all: Place[]): Message => {
  const lq = q.toLowerCase();
  let filtered: Place[] = [];
  let intro = "";

  if (lq.includes("eat") || lq.includes("food") || lq.includes("dinner") || lq.includes("lunch")) {
    filtered = all.filter((p) => ["Restaurant", "Street Food", "Cafe"].includes(p.category));
    intro = "Great food spots in Pune, ranked by CityPulse signal:";
  } else if (lq.includes("heritage") || lq.includes("history") || lq.includes("fort") || lq.includes("palace")) {
    filtered = all.filter((p) => p.category === "Heritage" || p.category === "Attraction");
    intro = "Pune's heritage gems, ranked by experience:";
  } else if (lq.includes("family") || lq.includes("kid") || lq.includes("children")) {
    filtered = all
      .filter((p) => p.safety >= 8.5 && p.cleanliness >= 8.0)
      .sort((a, b) => b.safety + b.cleanliness - (a.safety + a.cleanliness));
    intro = "Family picks balancing safety and cleanliness:";
  } else if (lq.includes("student") || lq.includes("budget") || lq.includes("affordable") || lq.includes("cheap")) {
    filtered = all.sort((a, b) => b.affordability - a.affordability).slice(0, 5);
    intro = "Most affordable places, perfect for students and budget travelers:";
  } else if (lq.includes("cafe") || lq.includes("coffee") || lq.includes("work")) {
    filtered = all.filter((p) => p.category === "Cafe");
    intro = "Cafés with strong ambience for working or meeting friends:";
  } else if (lq.includes("safe")) {
    filtered = all.sort((a, b) => b.safety - a.safety).slice(0, 5);
    intro = "Safest places right now, based on reports and signals:";
  } else if (lq.includes("baner") || lq.includes("koregaon") || lq.includes("fc road") || lq.includes("kothrud") || lq.includes("deccan")) {
    const area = lq.match(/baner|koregaon|fc road|kothrud|deccan|viman|peth/)?.[0] || "";
    filtered = all.filter((p) => p.area.toLowerCase().includes(area));
    intro = `Top picks in ${area}:`;
  } else {
    filtered = all
      .sort((a, b) => {
        const aS = a.safety + a.experience + a.popularity;
        const bS = b.safety + b.experience + b.popularity;
        return bS - aS;
      })
      .slice(0, 5);
    intro = "Here are top picks based on your query, weighted by safety, experience and popularity:";
  }

  filtered = filtered.slice(0, 5);

  if (filtered.length === 0) {
    return { role: "bot", text: "I couldn't find a great match yet. Try asking about food, heritage, family places, or budget picks." };
  }

  const verdict = `Verdict: ${filtered[0].name} leads with a balanced DNA score.`;
  return { role: "bot", text: `${intro}\n\n${verdict}`, places: filtered };
};

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi, I'm your CityPulse assistant 🌆. Ask me about food, heritage, family places, student budgets, or safer routes in Pune.",
    },
  ]);
  const [input, setInput] = useState("");
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    citypulseService.getPlaces().then(setAllPlaces);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const next: Message[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, respond(q, allPlaces)]);
    }, 350);
  };

  return (
    <div className="chat-shell">
      <div className="chat-msgs" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`} style={{ whiteSpace: "pre-line" }}>
            {m.text}
            {m.places && (
              <div className="bubble-places">
                {m.places.map((p) => (
                  <span key={p.id} className="place-chip">
                    {p.image} {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="suggested-qs">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="suggested-q" onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask CityPulse about Pune…"
        />
        <button className="btn-primary" onClick={() => send(input)}>
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
}
