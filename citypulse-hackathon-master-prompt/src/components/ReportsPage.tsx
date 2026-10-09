import { useEffect, useState } from "react";
import { citypulseService, trustWhy } from "../services/citypulseService";
import type { CitizenReport } from "../data/puneData";
import { AlertTriangle, CheckCircle2, Clock, ThumbsUp, X } from "lucide-react";

const statusBadge: Record<string, string> = {
  Unverified: "badge-slate",
  Likely: "badge-amber",
  Verified: "badge-emerald",
  Resolved: "badge-blue",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [active, setActive] = useState<CitizenReport | null>(null);
  const [form, setForm] = useState({
    type: "Safety" as CitizenReport["type"],
    title: "",
    description: "",
    area: "",
    severity: 5,
  });
  const [submitted, setSubmitted] = useState<CitizenReport | null>(null);

  useEffect(() => {
    citypulseService.getCitizenReports().then(setReports);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.area) return;
    const r = await citypulseService.submitCitizenReport({
      type: form.type,
      title: form.title,
      description: form.description || form.title,
      area: form.area,
      lat: 18.52 + Math.random() * 0.1,
      lng: 73.84 + Math.random() * 0.1,
      severity: form.severity,
      emoji: "📍",
    });
    setReports((prev) => [r, ...prev]);
    setSubmitted(r);
    setForm({ type: "Safety", title: "", description: "", area: "", severity: 5 });
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="flex between center mb-3" style={{ flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="section-eyebrow">📣 Citizen Reports</span>
          <h1 className="section-title" style={{ marginBottom: 4 }}>Real signals from real Punekars</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Every report goes through CityPulse's Trust Engine — fresher, more-supported reports carry more weight.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Report an Issue
        </button>
      </div>

      {submitted && (
        <div className="card-soft mb-4" style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}>
          <div className="flex center gap-2 mb-2">
            <CheckCircle2 size={18} color="#047857" />
            <strong>Report received — thank you for helping Pune.</strong>
          </div>
          <div className="text-sm muted">
            "{submitted.title}" in {submitted.area}. Your report is now in the queue for community validation.
          </div>
          <button className="btn-ghost mt-3" onClick={() => setSubmitted(null)}>Dismiss</button>
        </div>
      )}

      <div className="grid grid-2">
        {reports.map((r) => (
          <div key={r.id} className="card card-hover" onClick={() => setActive(r)}>
            <div className="flex between center mb-2">
              <div className="flex center gap-2">
                <span style={{ fontSize: 22 }}>{r.emoji}</span>
                <span className={`badge ${statusBadge[r.status]}`}>{r.status}</span>
                <span className="badge badge-slate">{r.type}</span>
              </div>
              <span className="muted text-xs flex center gap-2"><Clock size={12} /> {r.freshness}</span>
            </div>
            <h3 style={{ margin: "4px 0 4px", fontSize: 16 }}>{r.title}</h3>
            <p className="muted text-sm" style={{ margin: "0 0 12px" }}>{r.description}</p>

            <div className="flex between center">
              <span className="muted text-xs">📍 {r.area}</span>
              <div className="flex center gap-2" style={{ minWidth: 160 }}>
                <span className="text-xs font-semi">Trust</span>
                <div className="trust-bar-wrap" style={{ flex: 1 }}>
                  <div className="trust-bar" style={{ width: `${r.trust}%` }} />
                </div>
                <span className="text-xs font-bold">{r.trust}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-back" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-head">
              <h2 style={{ margin: 0, fontSize: 18 }}>Report an Issue</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={submit}>
                <div className="field">
                  <label>Report Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                    <option>Safety</option>
                    <option>Accident</option>
                    <option>Road</option>
                    <option>Cleanliness</option>
                    <option>Accessibility</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Pothole near Karve Nagar"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Description</label>
                  <textarea
                    placeholder="What did you observe?"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Location / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. FC Road, Deccan"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Severity ({form.severity}/10)</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Submit Report
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {active && (
        <div className="modal-back" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-head">
              <div>
                <div className="flex center gap-2 mb-2">
                  <span className={`badge ${statusBadge[active.status]}`}>{active.status}</span>
                  <span className="badge badge-slate">{active.type}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 18 }}>{active.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setActive(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <p className="muted" style={{ marginTop: 0 }}>{active.description}</p>
              <div className="grid grid-2 mb-3">
                <div className="card-soft">
                  <div className="muted text-xs">Area</div>
                  <div className="font-bold">{active.area}</div>
                </div>
                <div className="card-soft">
                  <div className="muted text-xs">Freshness</div>
                  <div className="font-bold">{active.freshness}</div>
                </div>
                <div className="card-soft">
                  <div className="muted text-xs">Supporting Reports</div>
                  <div className="font-bold flex center gap-2">
                    <ThumbsUp size={14} /> {active.supporting}
                  </div>
                </div>
                <div className="card-soft">
                  <div className="muted text-xs">Severity</div>
                  <div className="font-bold flex center gap-2">
                    <AlertTriangle size={14} color={active.severity >= 7 ? "#dc2626" : "#f59e0b"} /> {active.severity}/10
                  </div>
                </div>
              </div>

              <div className="card-soft mb-3">
                <div className="flex between center mb-2">
                  <strong>Trust Score</strong>
                  <span className="font-bold" style={{ fontSize: 20, color: "#0f172a" }}>{active.trust}%</span>
                </div>
                <div className="trust-bar-wrap" style={{ height: 8 }}>
                  <div className="trust-bar" style={{ width: `${active.trust}%` }} />
                </div>
              </div>

              <div className="font-semi mb-2 text-sm">Why this trust score?</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#475569" }} className="text-sm">
                {trustWhy(active).map((r, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
