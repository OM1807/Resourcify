export type Priority = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "reported" | "assigned" | "in_progress" | "resolved";
export type NeedType = "Medical" | "Food" | "Shelter" | "Rescue" | "Water";

export interface Incident {
  id: string;
  title: string;
  summary: string;
  location: string;
  city: string;
  // normalised svg coords on india map (0-100)
  x: number;
  y: number;
  priority: Priority;
  needType: NeedType;
  peopleAffected: number;
  severity: number; // 0-100
  time: string;
  image: string;
  status: IncidentStatus;
  reporter: string;
}

export interface Volunteer {
  id: string;
  name: string;
  initials: string;
  distanceKm: number;
  skills: string[];
  reliability: number; // 0-5
  completed: number;
  status: "available" | "on_task" | "off";
  city: string;
}

export const incidents: Incident[] = [
  {
    id: "INC-2041",
    title: "Flood victims trapped on rooftop",
    summary: "Family of 6 stranded after sudden river surge. Need boat rescue + medical kit. Children present.",
    location: "Mylapore, Chennai",
    city: "Chennai",
    x: 64, y: 78,
    priority: "critical",
    needType: "Rescue",
    peopleAffected: 6,
    severity: 94,
    time: "2 min ago",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=70",
    status: "reported",
    reporter: "+91 98••• ••231",
  },
  {
    id: "INC-2040",
    title: "Medical supplies needed at relief camp",
    summary: "200+ displaced people, insulin and ORS running out. Pregnant women on site.",
    location: "Sector 14, Gurugram",
    city: "Delhi",
    x: 50, y: 30,
    priority: "high",
    needType: "Medical",
    peopleAffected: 212,
    severity: 78,
    time: "9 min ago",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=70",
    status: "assigned",
    reporter: "+91 91••• ••872",
  },
  {
    id: "INC-2039",
    title: "Food packets request — landslide zone",
    summary: "70 families cut off after landslide. Road clearance underway. Requesting cooked meals.",
    location: "Wayanad, Kerala",
    city: "Wayanad",
    x: 45, y: 80,
    priority: "high",
    needType: "Food",
    peopleAffected: 280,
    severity: 71,
    time: "18 min ago",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=70",
    status: "in_progress",
    reporter: "+91 96••• ••104",
  },
  {
    id: "INC-2038",
    title: "Tent shelter required for 40 people",
    summary: "Cyclone aftermath. Roof collapse, no dry shelter. Elderly residents.",
    location: "Puri, Odisha",
    city: "Puri",
    x: 70, y: 56,
    priority: "medium",
    needType: "Shelter",
    peopleAffected: 40,
    severity: 58,
    time: "34 min ago",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=70",
    status: "in_progress",
    reporter: "+91 99••• ••556",
  },
  {
    id: "INC-2037",
    title: "Drinking water shortage",
    summary: "Tankers delayed by 2 days. ~150 households affected.",
    location: "Latur, Maharashtra",
    city: "Latur",
    x: 48, y: 60,
    priority: "medium",
    needType: "Water",
    peopleAffected: 600,
    severity: 52,
    time: "1 hr ago",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=70",
    status: "assigned",
    reporter: "+91 90••• ••318",
  },
  {
    id: "INC-2036",
    title: "Fire incident — slum cluster",
    summary: "Resolved. 24 families relocated. Damage assessment complete.",
    location: "Dharavi, Mumbai",
    city: "Mumbai",
    x: 38, y: 60,
    priority: "low",
    needType: "Shelter",
    peopleAffected: 96,
    severity: 30,
    time: "3 hr ago",
    image: "https://images.unsplash.com/photo-1517147177326-b37599372b73?w=600&q=70",
    status: "resolved",
    reporter: "+91 98••• ••420",
  },
  {
    id: "INC-2035",
    title: "Aid distribution point setup",
    summary: "Resolved. NGO base camp operational. Serving 500+ daily.",
    location: "Imphal, Manipur",
    city: "Imphal",
    x: 86, y: 44,
    priority: "low",
    needType: "Food",
    peopleAffected: 500,
    severity: 22,
    time: "5 hr ago",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=70",
    status: "resolved",
    reporter: "+91 97••• ••663",
  },
];

export const volunteers: Volunteer[] = [
  { id: "V-01", name: "Aarav Mehta",   initials: "AM", distanceKm: 1.2, skills: ["First Aid", "Boat Rescue", "Hindi/Tamil"], reliability: 4.9, completed: 142, status: "available", city: "Chennai" },
  { id: "V-02", name: "Priya Nair",    initials: "PN", distanceKm: 2.4, skills: ["Nursing", "Logistics"],                     reliability: 4.8, completed: 98,  status: "available", city: "Chennai" },
  { id: "V-03", name: "Rohan Verma",   initials: "RV", distanceKm: 3.8, skills: ["Driver", "Heavy Lifting"],                  reliability: 4.5, completed: 71,  status: "on_task",   city: "Chennai" },
  { id: "V-04", name: "Sara Iqbal",    initials: "SI", distanceKm: 0.9, skills: ["Pediatric Care", "Counseling"],             reliability: 4.95, completed: 188,status: "available", city: "Chennai" },
  { id: "V-05", name: "Karthik Rao",   initials: "KR", distanceKm: 5.6, skills: ["Cooking", "Distribution"],                  reliability: 4.3, completed: 54,  status: "available", city: "Chennai" },
  { id: "V-06", name: "Meera Joshi",   initials: "MJ", distanceKm: 7.1, skills: ["Translation", "Coordination"],              reliability: 4.6, completed: 109, status: "off",       city: "Chennai" },
];

export const kpis = {
  totalIncidents: 1284,
  activeVolunteers: 342,
  avgResponseMin: 17,
  criticalCases: 8,
};

export const responseTimeSeries = [
  { day: "Mon", minutes: 42 }, { day: "Tue", minutes: 38 },
  { day: "Wed", minutes: 31 }, { day: "Thu", minutes: 27 },
  { day: "Fri", minutes: 24 }, { day: "Sat", minutes: 19 },
  { day: "Sun", minutes: 17 },
];

export const incidentsByType = [
  { type: "Medical", count: 412 },
  { type: "Food", count: 318 },
  { type: "Shelter", count: 256 },
  { type: "Rescue", count: 178 },
  { type: "Water", count: 120 },
];

export const reliabilityTrend = [
  { week: "W1", score: 4.1 }, { week: "W2", score: 4.3 },
  { week: "W3", score: 4.4 }, { week: "W4", score: 4.6 },
  { week: "W5", score: 4.7 }, { week: "W6", score: 4.8 },
];

export const leaderboard = [
  { name: "Sara Iqbal", tasks: 188, score: 4.95 },
  { name: "Aarav Mehta", tasks: 142, score: 4.9 },
  { name: "Meera Joshi", tasks: 109, score: 4.6 },
  { name: "Priya Nair", tasks: 98, score: 4.8 },
  { name: "Rohan Verma", tasks: 71, score: 4.5 },
];

export const priorityStyles: Record<Priority, { bg: string; text: string; ring: string; label: string; dot: string }> = {
  critical: { bg: "bg-critical/10",  text: "text-critical",  ring: "ring-critical/30",  label: "Critical", dot: "bg-critical" },
  high:     { bg: "bg-destructive/10", text: "text-destructive", ring: "ring-destructive/30", label: "High",     dot: "bg-destructive" },
  medium:   { bg: "bg-warning/15",   text: "text-warning",   ring: "ring-warning/30",   label: "Medium",   dot: "bg-warning" },
  low:      { bg: "bg-success/10",   text: "text-success",   ring: "ring-success/30",   label: "Low",      dot: "bg-success" },
};
