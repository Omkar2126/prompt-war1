import { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  Map as MapIcon,
  Shield,
  GitCompare,
  Landmark,
  MessageSquareWarning,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import ExplorePage from "./components/ExplorePage";
import MapView from "./components/MapView";
import SafetyPage from "./components/SafetyPage";
import ComparePage from "./components/ComparePage";
import CulturePage from "./components/CulturePage";
import ReportsPage from "./components/ReportsPage";
import RecommendationsPage from "./components/RecommendationsPage";
import PlaceDetailModal from "./components/PlaceDetailModal";
import AssistantChat from "./components/AssistantChat";
import { citypulseService, placeDNA } from "./services/citypulseService";
import type { Place } from "./data/puneData";

type Page = "home" | "explore" | "map" | "safety" | "compare" | "culture" | "reports" | "assistant" | "modes";

const NAV = [
  { key: "explore", label: "Explore", icon: Search },
  { key: "map", label: "Map", icon: MapIcon },
  { key: "safety", label: "Safety", icon: Shield },
  { key: "compare", label: "Compare", icon: GitCompare },
  { key: "culture", label: "Culture", icon: Landmark },
  { key: "reports", label: "Reports", icon: MessageSquareWarning },
];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [place, setPlace] = useState<Place | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [heroPlace, setHeroPlace] = useState<Place | null>(null);

  useEffect(() => {
    citypulseService.getPlace("p1").then((p) => p && setHeroPlace(p));
  }, []);

  const onPlaceClick = (id: string) => {
    citypulseService.getPlace(id).then((p) => p && setPlace(p));
  };

  const toggleCompare = (id: string) => {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));
  };

  const go = (p: Page) => {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="nav-inner">
          <div className="brand" onClick={() => go("home")} style={{ cursor: "pointer" }}>
            <div className="brand-mark">CP</div>
            <span>CityPulse</span>
          </div>
          <div className="nav-links">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <button
                  key={n.key}
                  className={`nav-link ${page === n.key ? "active" : ""}`}
                  onClick={() => go(n.key as Page)}
                >
                  <Icon size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                  {n.label}
                </button>
              );
            })}
          </div>
          <div className="nav-right">
            <span className="city-chip">📍 Pune, India</span>
            <button className="icon-btn" title="Search" onClick={() => go("explore")}>
              <Search size={16} />
            </button>
            <button className="btn-primary" onClick={() => go("modes")}>
              <Sparkles size={14} /> Get Picks
            </button>
            <button className="icon-btn mobile-nav-btn" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <button key={n.key} className="nav-link" onClick={() => go(n.key as Page)}>
                <Icon size={16} style={{ marginRight: 8, verticalAlign: "-2px" }} />
                {n.label}
              </button>
            );
          })}
        </div>
      )}

      {page === "home" && (
        <>
          <section className="hero">
            <div className="hero-inner">
              <div>
                <span className="section-eyebrow">🏙️ City Intelligence · Pune MVP</span>
                <h1>
                  Explore smarter.<br />
                  Navigate safer.<br />
                  <span className="accent">Experience your city better.</span>
                </h1>
                <p className="lead">
                  AI-powered city intelligence combining places, safety, citizen reports, culture, affordability
                  and real-time local insights — all in one Pune-first platform.
                </p>
                <div className="hero-search">
                  <input type="text" placeholder="Search Pune places, food, attractions, hotels..." />
                  <button className="btn-primary" onClick={() => go("explore")}>
                    <Search size={14} /> Search
                  </button>
                </div>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => go("explore")}>
                    Explore Pune <ArrowRight size={14} />
                  </button>
                  <button className="btn-ghost" onClick={() => go("safety")}>
                    <Shield size={14} /> View Safety Map
                  </button>
                </div>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="v">12</div>
                    <div className="l">Places</div>
                  </div>
                  <div className="hero-stat">
                    <div className="v">6</div>
                    <div className="l">Safe Areas</div>
                  </div>
                  <div className="hero-stat">
                    <div className="v">5</div>
                    <div className="l">Heritage Sites</div>
                  </div>
                  <div className="hero-stat">
                    <div className="v">1,247</div>
                    <div className="l">Citizen Reports</div>
                  </div>
                </div>
              </div>
              <div className="hero-card">
                <div className="flex between center">
                  <div>
                    <div className="muted text-sm">Featured Place · Pune</div>
                    <h2 style={{ margin: "4px 0 0", fontSize: 22 }}>
                      {heroPlace ? `${heroPlace.image} ${heroPlace.name}` : "Loading…"}
                    </h2>
                  </div>
                  {heroPlace && (
                    <div
                      className="score-circle"
                      style={{ ["--pct" as any]: `${placeDNA(heroPlace).overall * 10}%` }}
                    >
                      <span>{placeDNA(heroPlace).overall}</span>
                    </div>
                  )}
                </div>
                {heroPlace && (
                  <>
                    <p className="muted text-sm" style={{ marginTop: 8 }}>
                      {heroPlace.description}
                    </p>
                    <div className="dna-grid">
                      {placeDNA(heroPlace).dims.map((d) => (
                        <div key={d.key} className="dim">
                          <div className="lbl">{d.key}</div>
                          <div className="val">{d.value}</div>
                          <div className="bar mt-2">
                            <div className="bar-fill" style={{ width: `${d.value * 10}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn-primary mt-3" style={{ width: "100%", justifyContent: "center" }} onClick={() => onPlaceClick(heroPlace.id)}>
                      View Place DNA <ArrowRight size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 56, color: "#94a3b8" }}>
              <ChevronDown size={20} />
            </div>
          </section>

          <div className="page">
            <div className="grid grid-4 mb-4">
              {[
                { icon: Search, title: "Explore", desc: "Browse 12 curated Pune places with full DNA.", key: "explore" as Page },
                { icon: Shield, title: "Smart Safety", desc: "Time-aware safety indicators and route comparison.", key: "safety" as Page },
                { icon: GitCompare, title: "Best vs Worst", desc: "Side-by-side place comparison with verdict.", key: "compare" as Page },
                { icon: Landmark, title: "Heritage & Culture", desc: "Then, today, nearby — story mode for every site.", key: "culture" as Page },
                { icon: MessageSquareWarning, title: "Citizen Reports", desc: "Real signals, transparent trust engine.", key: "reports" as Page },
                { icon: Sparkles, title: "Personalized Modes", desc: "Student, Tourist, Family, Budget picks.", key: "modes" as Page },
                { icon: MapIcon, title: "City Map", desc: "Heritage, food, safety and reports — all in one view.", key: "map" as Page },
                { icon: Shield, title: "AI Assistant", desc: "Ask anything about Pune in natural language.", key: "assistant" as Page },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="card card-hover" onClick={() => go(c.key)}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dbeafe", display: "grid", placeItems: "center", marginBottom: 10 }}>
                      <Icon size={20} color="#1d4ed8" />
                    </div>
                    <strong style={{ fontSize: 15 }}>{c.title}</strong>
                    <p className="muted text-sm" style={{ margin: "4px 0 0" }}>{c.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="card mb-4" style={{ background: "linear-gradient(135deg, #f8fafc, #eff6ff)" }}>
              <div className="flex center gap-2 mb-3">
                <Sparkles size={18} color="#0d9488" />
                <strong>Ask CityPulse · AI Assistant</strong>
              </div>
              <AssistantChat />
            </div>

            <div className="card-soft" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "white" }}>
              <div className="grid grid-2" style={{ gap: 24, alignItems: "center" }}>
                <div>
                  <span className="badge badge-teal" style={{ background: "rgba(13, 148, 136, 0.2)", color: "#5eead4" }}>
                    Collect → Verify → Analyze → Compare → Recommend → Navigate
                  </span>
                  <h2 style={{ margin: "10px 0 8px", color: "white", fontSize: 24, letterSpacing: "-0.02em" }}>
                    More than a map. A city intelligence layer.
                  </h2>
                  <p style={{ margin: 0, color: "#cbd5e1" }}>
                    Google Maps tells you where places are. CityPulse tells you which ones are worth visiting, safer, affordable, accessible, and right for you.
                  </p>
                </div>
                <div className="flex gap-3" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => go("explore")}>Try the Demo</button>
                  <button className="btn-ghost" onClick={() => go("safety")}>View Safety</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {page === "explore" && <ExplorePage onPlaceClick={onPlaceClick} />}
      {page === "map" && (
        <div className="page">
          <span className="section-eyebrow">🗺️ City Map</span>
          <h1 className="section-title">Pune Intelligence Map</h1>
          <p className="section-sub">
            Places, heritage, safety incidents and citizen reports — filter by what you want to see.
          </p>
          <MapView onPlaceClick={onPlaceClick} />
        </div>
      )}
      {page === "safety" && <SafetyPage />}
      {page === "compare" && <ComparePage />}
      {page === "culture" && <CulturePage />}
      {page === "reports" && <ReportsPage />}
      {page === "modes" && <RecommendationsPage onPlaceClick={onPlaceClick} />}
      {page === "assistant" && (
        <div className="page">
          <span className="section-eyebrow">🤖 CityPulse Assistant</span>
          <h1 className="section-title">Ask anything about Pune</h1>
          <p className="section-sub">A rule-based recommendation engine — no fake AI claims, just real database queries.</p>
          <AssistantChat />
        </div>
      )}

      {place && (
        <PlaceDetailModal
          place={place}
          onClose={() => setPlace(null)}
          onCompare={toggleCompare}
          inCompare={compare.includes(place.id)}
        />
      )}

      {compare.length > 0 && page !== "compare" && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "white",
            border: "1px solid #e5e8ee",
            borderRadius: 12,
            padding: "12px 16px",
            boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.25)",
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div className="text-xs muted">Compare list</div>
            <strong className="text-sm">{compare.length} place{compare.length > 1 ? "s" : ""} selected</strong>
          </div>
          <button className="btn-primary" onClick={() => go("compare")}>
            Compare <ArrowRight size={14} />
          </button>
        </div>
      )}

      <footer className="foot">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="flex center gap-2 mb-2" style={{ justifyContent: "center" }}>
            <div className="brand-mark" style={{ width: 24, height: 24, fontSize: 11 }}>CP</div>
            <strong>CityPulse</strong>
          </div>
          <div>Explore smarter. Navigate safer. Experience your city better.</div>
          <div style={{ marginTop: 6, color: "#94a3b8" }}>Pune MVP · Hackathon Demo · Standalone mode</div>
        </div>
      </footer>
    </div>
  );
}
