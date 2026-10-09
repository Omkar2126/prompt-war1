// CityPulse - Pune Demo Data
// All scores are 0-10 scale

export type Category =
  | "Restaurant"
  | "Street Food"
  | "Cafe"
  | "Hotel"
  | "Attraction"
  | "Heritage"
  | "Budget"
  | "Family"
  | "Market";

export interface Place {
  id: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  priceLevel: 1 | 2 | 3 | 4;
  safety: number;
  cleanliness: number;
  affordability: number;
  accessibility: number;
  experience: number;
  popularity: number;
  trust: number;
  image: string;
  tags: string[];
  bestFor: string[];
  hours: string;
}

export interface SafetyEvent {
  id: string;
  title: string;
  area: string;
  type: "Accident" | "Theft" | "Crowd" | "Hazard" | "Power";
  severity: "Low" | "Medium" | "High";
  time: string;
  description: string;
  lat: number;
  lng: number;
}

export interface Heritage {
  id: string;
  name: string;
  period: string;
  then: string;
  today: string;
  nearby: string[];
  area: string;
  lat: number;
  lng: number;
  emoji: string;
}

export interface CitizenReport {
  id: string;
  type: "Safety" | "Accident" | "Road" | "Cleanliness" | "Accessibility" | "Other";
  title: string;
  description: string;
  area: string;
  lat: number;
  lng: number;
  severity: number;
  trust: number;
  status: "Unverified" | "Likely" | "Verified" | "Resolved";
  supporting: number;
  freshness: string;
  createdAt: string;
  emoji: string;
}

export interface Review {
  id: string;
  placeId: string;
  user: string;
  rating: number;
  text: string;
  food: number;
  service: number;
  cleanliness: number;
  price: number;
  accessibility: number;
  ambience: number;
  date: string;
}

const emoji = {
  heritage: "🏛️",
  palace: "👑",
  fort: "🏰",
  food: "🍛",
  cafe: "☕",
  hotel: "🏨",
  street: "🥘",
  budget: "💸",
  family: "👨‍👩‍👧",
  park: "🌳",
  lake: "💧",
  temple: "🛕",
  market: "🛍️",
};

export const PLACES: Place[] = [
  {
    id: "p1",
    name: "Shaniwar Wada",
    category: "Heritage",
    description:
      "An 18th-century historical fortification and palace in the heart of Pune, built by the Peshwas of the Maratha Empire.",
    address: "Kasba Peth, Pune",
    area: "Kasba Peth",
    lat: 18.5195,
    lng: 73.8553,
    rating: 4.5,
    priceLevel: 1,
    safety: 8.8,
    cleanliness: 7.9,
    affordability: 9.5,
    accessibility: 7.5,
    experience: 9.3,
    popularity: 9.4,
    trust: 9.7,
    image: emoji.heritage,
    tags: ["Historical", "Architecture", "Light Show"],
    bestFor: ["Tourist", "Family", "Heritage"],
    hours: "8:00 AM – 6:30 PM",
  },
  {
    id: "p2",
    name: "Aga Khan Palace",
    category: "Heritage",
    description:
      "A landmark of Indian freedom movement and a beautiful palace with sprawling gardens, built by Aga Khan III.",
    address: "Nagar Road, Pune",
    area: "Yerwada",
    lat: 18.5523,
    lng: 73.9015,
    rating: 4.6,
    priceLevel: 1,
    safety: 9.4,
    cleanliness: 9.0,
    affordability: 9.2,
    accessibility: 8.7,
    experience: 9.1,
    popularity: 9.0,
    trust: 9.8,
    image: emoji.palace,
    tags: ["Freedom Movement", "Gandhi Memorial", "Gardens"],
    bestFor: ["Family", "Tourist", "Heritage"],
    hours: "9:00 AM – 5:30 PM",
  },
  {
    id: "p3",
    name: "Sinhagad Fort",
    category: "Attraction",
    description:
      "A rugged hill fortress with sweeping valley views, famous for its historical battles and weekend treks.",
    address: "Sinhagad Ghat, Pune",
    area: "Sinhagad",
    lat: 18.3664,
    lng: 73.7548,
    rating: 4.7,
    priceLevel: 1,
    safety: 8.1,
    cleanliness: 7.6,
    affordability: 9.7,
    accessibility: 7.0,
    experience: 9.5,
    popularity: 9.3,
    trust: 9.4,
    image: emoji.fort,
    tags: ["Trek", "Adventure", "History"],
    bestFor: ["Tourist", "Adventure", "Family"],
    hours: "6:00 AM – 6:00 PM",
  },
  {
    id: "p4",
    name: "FC Road",
    category: "Street Food",
    description:
      "Fergusson College Road — the beating heart of Pune's student life, lined with cafés, street food and bookshops.",
    address: "Fergusson College Road, Shivajinagar",
    area: "Shivajinagar",
    lat: 18.5237,
    lng: 73.8412,
    rating: 4.4,
    priceLevel: 1,
    safety: 8.4,
    cleanliness: 7.4,
    affordability: 9.4,
    accessibility: 8.8,
    experience: 9.0,
    popularity: 9.2,
    trust: 8.9,
    image: emoji.street,
    tags: ["Student Hub", "Budget Eats", "Cafés"],
    bestFor: ["Student", "Budget", "Family"],
    hours: "8:00 AM – 11:00 PM",
  },
  {
    id: "p5",
    name: "Koregaon Park",
    category: "Cafe",
    description:
      "Upscale neighborhood with designer boutiques, premium cafés, and a vibrant nightlife scene.",
    address: "Koregaon Park, Pune",
    area: "Koregaon Park",
    lat: 18.5362,
    lng: 73.8939,
    rating: 4.5,
    priceLevel: 3,
    safety: 9.0,
    cleanliness: 8.6,
    affordability: 6.2,
    accessibility: 8.5,
    experience: 9.2,
    popularity: 9.0,
    trust: 9.1,
    image: emoji.cafe,
    tags: ["Nightlife", "Premium", "Dining"],
    bestFor: ["Tourist", "Couples", "Foodies"],
    hours: "10:00 AM – 1:00 AM",
  },
  {
    id: "p6",
    name: "Pune Peth",
    category: "Market",
    description:
      "Traditional old-city markets — spices, brassware, antiques and authentic Maharashtrian street food.",
    address: "Budhwar Peth, Pune",
    area: "Budhwar Peth",
    lat: 18.5145,
    lng: 73.8567,
    rating: 4.2,
    priceLevel: 1,
    safety: 7.6,
    cleanliness: 6.8,
    affordability: 9.6,
    accessibility: 7.4,
    experience: 8.9,
    popularity: 8.6,
    trust: 8.7,
    image: emoji.market,
    tags: ["Traditional", "Spices", "Old City"],
    bestFor: ["Budget", "Tourist", "Foodies"],
    hours: "9:00 AM – 9:00 PM",
  },
  {
    id: "p7",
    name: "Viman Nagar",
    category: "Restaurant",
    description:
      "Modern neighborhood with diverse dining, hotels and easy access to the airport — popular with travelers.",
    address: "Viman Nagar, Pune",
    area: "Viman Nagar",
    lat: 18.5679,
    lng: 73.9143,
    rating: 4.3,
    priceLevel: 2,
    safety: 8.7,
    cleanliness: 8.3,
    affordability: 7.5,
    accessibility: 8.9,
    experience: 8.4,
    popularity: 8.5,
    trust: 8.8,
    image: emoji.food,
    tags: ["Dining", "Hotels", "Airport"],
    bestFor: ["Family", "Tourist", "Business"],
    hours: "8:00 AM – 11:30 PM",
  },
  {
    id: "p8",
    name: "Baner",
    category: "Cafe",
    description:
      "Trendy suburb known for craft cafés, rooftop restaurants, and a young professional crowd.",
    address: "Baner, Pune",
    area: "Baner",
    lat: 18.5590,
    lng: 73.7868,
    rating: 4.4,
    priceLevel: 2,
    safety: 8.8,
    cleanliness: 8.4,
    affordability: 7.2,
    accessibility: 8.3,
    experience: 8.7,
    popularity: 8.8,
    trust: 8.9,
    image: emoji.cafe,
    tags: ["Trendy", "Rooftop", "Craft"],
    bestFor: ["Family", "Couples", "Foodies"],
    hours: "9:00 AM – 12:00 AM",
  },
  {
    id: "p9",
    name: "Kothrud",
    category: "Family",
    description:
      "A peaceful residential hub with family restaurants, parks and easy connectivity across Pune.",
    address: "Kothrud, Pune",
    area: "Kothrud",
    lat: 18.5074,
    lng: 73.8077,
    rating: 4.2,
    priceLevel: 2,
    safety: 8.9,
    cleanliness: 8.1,
    affordability: 8.2,
    accessibility: 8.4,
    experience: 8.0,
    popularity: 8.1,
    trust: 8.6,
    image: emoji.family,
    tags: ["Family", "Residential", "Parks"],
    bestFor: ["Family", "Student", "Budget"],
    hours: "7:00 AM – 11:00 PM",
  },
  {
    id: "p10",
    name: "Deccan",
    category: "Restaurant",
    description:
      "Lively central area with iconic restaurants, gyms, coaching hubs and classic Pune vibes.",
    address: "Deccan Gymkhana, Pune",
    area: "Deccan",
    lat: 18.5204,
    lng: 73.8367,
    rating: 4.3,
    priceLevel: 2,
    safety: 8.5,
    cleanliness: 7.8,
    affordability: 8.0,
    accessibility: 9.0,
    experience: 8.5,
    popularity: 8.9,
    trust: 8.8,
    image: emoji.food,
    tags: ["Iconic", "Central", "Vibrant"],
    bestFor: ["Student", "Family", "Foodies"],
    hours: "8:00 AM – 11:30 PM",
  },
  {
    id: "p11",
    name: "Empress Garden",
    category: "Family",
    description:
      "A lush botanical garden perfect for picnics, jogs and quiet evenings in nature.",
    address: "Camp, Pune",
    area: "Camp",
    lat: 18.5167,
    lng: 73.8811,
    rating: 4.4,
    priceLevel: 1,
    safety: 9.0,
    cleanliness: 8.6,
    affordability: 9.3,
    accessibility: 8.2,
    experience: 8.7,
    popularity: 8.4,
    trust: 9.2,
    image: emoji.park,
    tags: ["Garden", "Picnic", "Nature"],
    bestFor: ["Family", "Tourist", "Budget"],
    hours: "6:00 AM – 7:00 PM",
  },
  {
    id: "p12",
    name: "Bund Garden",
    category: "Family",
    description:
      "Peaceful garden surrounding a historic bund, popular for evening walks and street food.",
    address: "Sangam Bridge, Pune",
    area: "Camp",
    lat: 18.5322,
    lng: 73.8768,
    rating: 4.2,
    priceLevel: 1,
    safety: 8.2,
    cleanliness: 7.5,
    affordability: 9.2,
    accessibility: 8.5,
    experience: 8.1,
    popularity: 8.0,
    trust: 8.5,
    image: emoji.park,
    tags: ["Garden", "Walk", "Evening"],
    bestFor: ["Family", "Budget", "Tourist"],
    hours: "5:30 AM – 9:00 PM",
  },
];

export const SAFETY_EVENTS: SafetyEvent[] = [
  {
    id: "s1",
    title: "Heavy traffic congestion",
    area: "FC Road",
    type: "Hazard",
    severity: "Medium",
    time: "Today, 6:30 PM",
    description: "Major slowdown near Fergusson College due to ongoing road repair work.",
    lat: 18.5237,
    lng: 73.8412,
  },
  {
    id: "s2",
    title: "Pothole reported",
    area: "Sinhagad Road",
    type: "Hazard",
    severity: "Low",
    time: "Today, 11:00 AM",
    description: "Large pothole near Vitthalwadi chowk, slow down advised for two-wheelers.",
    lat: 18.4575,
    lng: 73.8260,
  },
  {
    id: "s3",
    title: "Crowd surge alert",
    area: "Koregaon Park",
    type: "Crowd",
    severity: "Medium",
    time: "Tonight, 9:00 PM",
    description: "High footfall expected during the weekend music event at North Main Road.",
    lat: 18.5362,
    lng: 73.8939,
  },
  {
    id: "s4",
    title: "Minor accident cleared",
    area: "Baner–Aundh",
    type: "Accident",
    severity: "Low",
    time: "Today, 2:15 PM",
    description: "Two-wheeler accident resolved, traffic restored to normal flow.",
    lat: 18.5590,
    lng: 73.7900,
  },
  {
    id: "s5",
    title: "Streetlight outage",
    area: "Budhwar Peth",
    type: "Power",
    severity: "Medium",
    time: "Today, 8:00 PM",
    description: "Three streetlights out near the market square — exercise caution at night.",
    lat: 18.5145,
    lng: 73.8567,
  },
  {
    id: "s6",
    title: "Waterlogging on service road",
    area: "Nagar Road",
    type: "Hazard",
    severity: "High",
    time: "Today, 5:45 PM",
    description: "Heavy waterlogging near Aga Khan Palace junction due to recent rainfall.",
    lat: 18.5523,
    lng: 73.9015,
  },
];

export const HERITAGE: Heritage[] = [
  {
    id: "h1",
    name: "Shaniwar Wada",
    period: "1732 CE · Peshwa Era",
    then:
      "Seat of the Peshwa rulers of the Maratha Empire, known for grand processions and political decisions that shaped India.",
    today:
      "An iconic ruin in central Pune, with a sound-and-light show narrating its 300-year history.",
    nearby: ["Kasba Peth", "Budhwar Peth", "Lal Mahal"],
    area: "Kasba Peth",
    lat: 18.5195,
    lng: 73.8553,
    emoji: "🏛️",
  },
  {
    id: "h2",
    name: "Aga Khan Palace",
    period: "1892 CE · Colonial Era",
    then:
      "Built by Sultan Aga Khan III; later became a prison for Mahatma Gandhi, Kasturba Gandhi and Sarojini Naidu during the Quit India movement.",
    today:
      "A memorial to Gandhi, with his ashes preserved on the grounds — a place of reflection and history.",
    nearby: ["Yerwada Jail", "Empress Garden", "Nagar Road"],
    area: "Yerwada",
    lat: 18.5523,
    lng: 73.9015,
    emoji: "👑",
  },
  {
    id: "h3",
    name: "Sinhagad Fort",
    period: "2000+ years old",
    then:
      "Site of the famous Battle of Sinhagad (1670) where Tanaji Malusare sacrificed his life recapturing the fort from the Mughals.",
    today:
      "A popular trekking and picnic destination with stunning valley views and rustic Maharashtrian food stalls.",
    nearby: ["Khadakwasla Dam", "Panshet", "Karla Caves"],
    area: "Sinhagad",
    lat: 18.3664,
    lng: 73.7548,
    emoji: "🏰",
  },
  {
    id: "h4",
    name: "Lal Mahal",
    period: "1630 CE · Shahaji Bhosale",
    then:
      "Childhood home of Chhatrapati Shivaji Maharaj — the founder of the Maratha Empire grew up within these walls.",
    today:
      "A reconstructed palace in the city, hosting exhibitions on Maratha history and culture.",
    nearby: ["Shaniwar Wada", "Kasba Peth", "Pune Peth"],
    area: "Kasba Peth",
    lat: 18.5215,
    lng: 73.8563,
    emoji: "🏯",
  },
  {
    id: "h5",
    name: "Pataleshwar Cave Temple",
    period: "8th Century CE",
    then:
      "An 8th-century rock-cut temple dedicated to Lord Shiva, carved from a single basalt rock during the Rashtrakuta period.",
    today:
      "A quiet heritage site in the heart of Pune, surrounded by a small garden and frequented by history lovers.",
    nearby: ["Jangli Maharaj Road", "Fergusson College", "Deccan"],
    area: "Shivajinagar",
    lat: 18.5273,
    lng: 73.8411,
    emoji: "🛕",
  },
];

export const REPORTS: CitizenReport[] = [
  {
    id: "r1",
    type: "Road",
    title: "Pothole near Karve Nagar",
    description: "Deep pothole causing trouble for two-wheeler riders, especially at night.",
    area: "Karve Nagar",
    lat: 18.4925,
    lng: 73.8189,
    severity: 6,
    trust: 82,
    status: "Verified",
    supporting: 14,
    freshness: "2 hours ago",
    createdAt: "2026-01-15T10:00:00Z",
    emoji: "🚧",
  },
  {
    id: "r2",
    type: "Cleanliness",
    title: "Overflowing dustbin at FC Road",
    description: "Public bin overflowing for the past 2 days, attracting stray dogs.",
    area: "FC Road",
    lat: 18.5237,
    lng: 73.8412,
    severity: 4,
    trust: 75,
    status: "Likely",
    supporting: 6,
    freshness: "5 hours ago",
    createdAt: "2026-01-15T07:00:00Z",
    emoji: "🗑️",
  },
  {
    id: "r3",
    type: "Safety",
    title: "Dim lighting near Peth area",
    description: "Multiple streetlights not working — feels unsafe after 9 PM.",
    area: "Budhwar Peth",
    lat: 18.5145,
    lng: 73.8567,
    severity: 7,
    trust: 88,
    status: "Verified",
    supporting: 21,
    freshness: "1 day ago",
    createdAt: "2026-01-14T20:00:00Z",
    emoji: "💡",
  },
  {
    id: "r4",
    type: "Accessibility",
    title: "Broken ramp at metro station",
    description: "Wheelchair ramp on the east exit is broken since last week.",
    area: "Deccan",
    lat: 18.5204,
    lng: 73.8367,
    severity: 5,
    trust: 69,
    status: "Likely",
    supporting: 3,
    freshness: "8 hours ago",
    createdAt: "2026-01-15T04:00:00Z",
    emoji: "♿",
  },
  {
    id: "r5",
    type: "Accident",
    title: "Two-wheeler skid on wet road",
    description: "Waterlogging caused a skid — thankfully no injuries reported.",
    area: "Nagar Road",
    lat: 18.5523,
    lng: 73.9015,
    severity: 6,
    trust: 91,
    status: "Verified",
    supporting: 28,
    freshness: "30 mins ago",
    createdAt: "2026-01-15T11:30:00Z",
    emoji: "🚑",
  },
  {
    id: "r6",
    type: "Road",
    title: "Broken footpath slab",
    description: "Uneven footpath near bus stop — risky for elders.",
    area: "Kothrud",
    lat: 18.5074,
    lng: 73.8077,
    severity: 4,
    trust: 71,
    status: "Unverified",
    supporting: 2,
    freshness: "12 hours ago",
    createdAt: "2026-01-15T00:00:00Z",
    emoji: "🚧",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "v1",
    placeId: "p4",
    user: "Aarav M.",
    rating: 4.5,
    text: "Vada pav and misal here are unbeatable. Slightly crowded on weekends.",
    food: 9.2,
    service: 7.6,
    cleanliness: 7.4,
    price: 9.4,
    accessibility: 8.6,
    ambience: 8.5,
    date: "2 days ago",
  },
  {
    id: "v2",
    placeId: "p5",
    user: "Sneha R.",
    rating: 4.6,
    text: "Lovely brunch spots, great vibe. A bit pricey for daily visits.",
    food: 9.0,
    service: 9.1,
    cleanliness: 8.8,
    price: 6.4,
    accessibility: 8.5,
    ambience: 9.3,
    date: "1 week ago",
  },
  {
    id: "v3",
    placeId: "p1",
    user: "Rohit K.",
    rating: 4.7,
    text: "Light and sound show is a must. Bring a guide to know the full history.",
    food: 0,
    service: 8.0,
    cleanliness: 8.0,
    price: 9.6,
    accessibility: 7.5,
    ambience: 9.4,
    date: "3 days ago",
  },
  {
    id: "v4",
    placeId: "p3",
    user: "Priya D.",
    rating: 4.8,
    text: "Trek is moderate, views are breathtaking. The pithla-bhakri at top is amazing.",
    food: 8.5,
    service: 8.0,
    cleanliness: 7.4,
    price: 9.7,
    accessibility: 6.8,
    ambience: 9.6,
    date: "5 days ago",
  },
  {
    id: "v5",
    placeId: "p8",
    user: "Karan J.",
    rating: 4.3,
    text: "Modern cafés, great for working remotely. Coffee quality varies.",
    food: 8.4,
    service: 8.5,
    cleanliness: 8.7,
    price: 7.0,
    accessibility: 8.2,
    ambience: 8.9,
    date: "2 weeks ago",
  },
];

export const CITY_HEALTH = {
  safety: 8.4,
  cleanliness: 7.8,
  affordability: 8.6,
  accessibility: 8.2,
  tourism: 9.0,
  citizenReports: 1247,
};

export const WEATHER = {
  temp: 27,
  condition: "Light rain expected",
  rainChance: 65,
  humidity: 78,
  recommendation:
    "Rain expected this evening. Indoor attractions and cafés are recommended over open forts.",
};

export const ROUTES = [
  {
    id: "A",
    name: "Route A · Safer",
    time: 18,
    distance: 6.2,
    safety: 8.9,
    incidents: 1,
    description:
      "Slightly longer but well-lit, less incident exposure and uses main arterial roads.",
  },
  {
    id: "B",
    name: "Route B · Faster",
    time: 15,
    distance: 5.7,
    safety: 7.4,
    incidents: 4,
    description:
      "Shortest in time, passes through 4 reported incident zones in the last 24 hours.",
  },
  {
    id: "C",
    name: "Route C · Balanced",
    time: 17,
    distance: 6.0,
    safety: 8.3,
    incidents: 2,
    description: "Compromise between speed and safety — good for evening travel.",
  },
];
