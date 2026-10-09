import {
  PLACES,
  SAFETY_EVENTS,
  HERITAGE,
  REPORTS,
  REVIEWS,
  CITY_HEALTH,
  WEATHER,
  ROUTES,
  type Place,
  type CitizenReport,
} from "../data/puneData";

export const placeDNA = (p: Place) => {
  const dims = [
    { key: "Safety", value: p.safety },
    { key: "Cleanliness", value: p.cleanliness },
    { key: "Affordability", value: p.affordability },
    { key: "Accessibility", value: p.accessibility },
    { key: "Experience", value: p.experience },
    { key: "Popularity", value: p.popularity },
  ];
  const overall = dims.reduce((a, b) => a + b.value, 0) / dims.length;
  return { dims, overall: Math.round(overall * 10) / 10 };
};

export const whyThisScore = (p: Place): string[] => {
  const reasons: string[] = [];
  if (p.safety >= 8.5) reasons.push(`Strong safety indicators with ${Math.round(p.safety * 10)}/100 risk resilience.`);
  else if (p.safety < 7.5) reasons.push(`Lower safety score — reports of crowding or lighting issues in the area.`);
  if (p.cleanliness >= 8.5) reasons.push(`High cleanliness from citizen reports and on-site surveys.`);
  else if (p.cleanliness < 7.5) reasons.push(`Cleanliness could improve — multiple reports on waste and dust.`);
  if (p.affordability >= 9) reasons.push(`Excellent affordability — most visitors spend under ₹300.`);
  else if (p.affordability < 7) reasons.push(`Premium pricing — budget travelers may prefer alternatives.`);
  if (p.accessibility >= 8.5) reasons.push(`Good accessibility — ramps, transit and signage available.`);
  else if (p.accessibility < 7.5) reasons.push(`Limited accessibility — uneven paths and fewer ramps.`);
  if (p.popularity >= 9) reasons.push(`High popularity — frequently visited and reviewed.`);
  if (p.experience >= 9) reasons.push(`Strong visitor experience ratings across recent reviews.`);
  if (reasons.length < 3) reasons.push(`Steady visitor sentiment with consistent feedback over time.`);
  return reasons.slice(0, 4);
};

export const trustWhy = (r: CitizenReport): string[] => {
  const reasons: string[] = [];
  if (r.supporting >= 10) reasons.push(`${r.supporting} similar reports in the last 48 hours.`);
  else if (r.supporting >= 3) reasons.push(`${r.supporting} citizens have flagged this issue.`);
  else reasons.push("Few supporting reports so far — still under community review.");
  if (r.freshness.includes("min") || r.freshness.includes("hour")) reasons.push("Recently reported — highly relevant signal.");
  else reasons.push("Reported over a day ago — moderate freshness.");
  if (r.severity >= 7) reasons.push("Marked as high severity by reporter.");
  else if (r.severity >= 5) reasons.push("Medium severity — affects daily commute or comfort.");
  else reasons.push("Lower severity — minor inconvenience reported.");
  if (r.status === "Verified") reasons.push("Cross-checked with municipal data and other signals.");
  else if (r.status === "Likely") reasons.push("Pattern matches similar past incidents.");
  else reasons.push("Awaiting further community validation.");
  return reasons;
};

export const citypulseService = {
  getPlaces: async (): Promise<Place[]> => PLACES,
  getPlace: async (id: string): Promise<Place | undefined> => PLACES.find((p) => p.id === id),
  getPlaceDNA: placeDNA,
  searchPlaces: async (q: string) => {
    const l = q.toLowerCase();
    return PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(l) ||
        p.area.toLowerCase().includes(l) ||
        p.category.toLowerCase().includes(l) ||
        p.tags.some((t) => t.toLowerCase().includes(l)),
    );
  },
  filterPlaces: async (cat: string) =>
    cat === "All" ? PLACES : PLACES.filter((p) => p.category === cat),
  comparePlaces: (ids: string[]) => PLACES.filter((p) => ids.includes(p.id)),
  getSafetyEvents: async () => SAFETY_EVENTS,
  getCitizenReports: async () => REPORTS,
  getHeritage: async () => HERITAGE,
  getReviews: async (placeId: string) => REVIEWS.filter((r) => r.placeId === placeId),
  getCityHealth: async () => CITY_HEALTH,
  getWeather: async () => WEATHER,
  getRoutes: async () => ROUTES,
  submitCitizenReport: async (data: Omit<CitizenReport, "id" | "trust" | "status" | "supporting" | "createdAt" | "freshness">) => {
    const newReport: CitizenReport = {
      ...data,
      id: "r" + Date.now(),
      trust: 60,
      status: "Unverified",
      supporting: 0,
      freshness: "Just now",
      createdAt: new Date().toISOString(),
    };
    REPORTS.unshift(newReport);
    return newReport;
  },
  getRecommendations: async (mode: string) => {
    const scoring: Record<string, (p: Place) => number> = {
      Student: (p) => p.affordability * 1.4 + p.popularity * 0.8 + p.accessibility * 0.6,
      Tourist: (p) => p.experience * 1.3 + p.popularity * 1.0 + p.safety * 0.7,
      Family: (p) => p.safety * 1.2 + p.cleanliness * 1.1 + p.accessibility * 1.0,
      Budget: (p) => p.affordability * 1.6 + p.popularity * 0.6,
      Accessibility: (p) => p.accessibility * 1.6 + p.safety * 0.8,
    };
    const fn = scoring[mode] || scoring.Student;
    return [...PLACES].map((p) => ({ place: p, score: fn(p) })).sort((a, b) => b.score - a.score);
  },
  calculateBudget: (data: { people: number; food: number; travel: number; entry: number; hotel: number; activities: number }) => {
    const total = data.food + data.travel + data.entry + data.hotel + data.activities;
    const perPerson = total / Math.max(1, data.people);
    let status: "Within Budget" | "Slightly Over" | "Over Budget" = "Within Budget";
    if (perPerson > 2500) status = "Over Budget";
    else if (perPerson > 1500) status = "Slightly Over";
    return { total, perPerson, status };
  },
  whyThisScore,
  trustWhy,
};
