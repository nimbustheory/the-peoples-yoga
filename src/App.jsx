import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Trash2, Save
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ===================================================================
//  STUDIO CONFIG
// ===================================================================
const STUDIO_CONFIG = {
  name: "THE PEOPLE'S",
  subtitle: "YOGA",
  tagline: "Yoga for all bodies.",
  logoMark: "P",
  description: "An inclusive, non-dogmatic space where everyone can experience the healing benefits of yoga. Two studios, 90+ classes a week, one community.",
  heroLine1: "YOGA",
  heroLine2: "FOR ALL",
  address: { street: "3014 NE Killingsworth St", city: "Portland", state: "OR", zip: "97211" },
  phone: "(503) 877-9644",
  email: "contactus@thepeoplesyoga.org",
  neighborhood: "NE & SE Portland",
  website: "https://thepeoplesyoga.org",
  social: { instagram: "@thepeoplesyogapdx" },
  locations: [
    { id: "ne", name: "Northeast", short: "NE", address: "3014 NE Killingsworth St", city: "Portland, OR 97211", studios: 3 },
    { id: "se", name: "Southeast", short: "SE", address: "4029 SE Hawthorne Blvd", city: "Portland, OR 97214", studios: 1 },
  ],
  theme: {
    accent:     { h: 15,  s: 55, l: 48 },
    accentAlt:  { h: 150, s: 28, l: 42 },
    warning:    { h: 5,   s: 65, l: 50 },
    primary:    { h: 20,  s: 25, l: 10 },
    surface:    { h: 35,  s: 22, l: 96 },
    surfaceDim: { h: 30,  s: 16, l: 92 },
  },
  features: {
    workshops: true, retreats: true, soundBaths: true, teacherTrainings: true,
    practiceTracking: true, communityFeed: true, guestPasses: true, milestones: true,
    multiLocation: true,
  },
  classCapacity: 35,
  specialtyCapacity: 20,
};

// ===================================================================
//  THEME
// ===================================================================
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, ls) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + ls))}%)`;
const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -14),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 28),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.2),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#2a1f14", textMuted: "#7a6b58", textFaint: "#a89880",
  border: "#e0d6c8", borderLight: "#ede6da",
};
const DF = "'Fraunces', serif";

// ===================================================================
//  DATE HELPERS
// ===================================================================
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const fmtDateS = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const fmtDateL = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ===================================================================
//  MOCK DATA
// ===================================================================
const TEACHERS = [
  { id: "t1", firstName: "Michelle", lastName: "Sarchiapone", role: "Founding Owner", certs: ["E-RYT-500", "MA Therapy"], specialties: ["Vinyasa", "Mindful Hatha", "Yoga Philosophy"], yearsTeaching: 15, bio: "Michelle founded The People's Yoga after a $5 yoga class at a martial arts studio changed her life. As someone who lived with debilitating depression, yoga's therapeutic benefits were transformative. Her sacred mission: make yoga accessible to every person, regardless of background or finances." },
  { id: "t2", firstName: "Beth", lastName: "Harp", role: "Operating Owner", certs: ["E-RYT-200", "Trauma-Informed"], specialties: ["Vinyasa", "Gentle Hatha", "Restorative"], yearsTeaching: 12, bio: "Beth discovered yoga through actor training. The practice became integral to their recovery from an eating disorder, offering a place to be present with pain and find healing through movement and mindfulness." },
  { id: "t3", firstName: "Sally", lastName: "Garrido-Spencer", role: "Studio Manager & Teacher", certs: ["RYT-500", "Yin Certified"], specialties: ["Yin", "Hatha", "Restorative"], yearsTeaching: 10, bio: "Sally came to yoga many times half-heartedly before connecting with a practice that hooked her devotion. Her teaching is rooted in discovering grief and suffering stored in the body, and the prayers for liberation that arise from that awareness." },
  { id: "t4", firstName: "Linnea", lastName: "Solveig", role: "Lead Teacher & Retreat Leader", certs: ["E-RYT-500", "Art Therapy"], specialties: ["Hatha", "Vinyasa", "Yoga & Art"], yearsTeaching: 14, bio: "Linnea leads the BLOOM retreat series, weaving together yoga, guided meditation, and multimedia art practice. Her classes invite curiosity and creative expression alongside traditional asana." },
  { id: "t5", firstName: "Stephanie", lastName: "Starnes", role: "Teacher & Sound Healer", certs: ["RYT-200", "Sound Healing Practitioner"], specialties: ["Restorative", "Sound Healing", "Yin"], yearsTeaching: 8, bio: "Stephanie's monthly sound healing ceremonies are a beloved studio tradition. She creates immersive soundscapes with crystal bowls and tuning forks, guiding students into deep states of relaxation and renewal." },
  { id: "t6", firstName: "Alix", lastName: "Northup", role: "Teacher", certs: ["E-RYT-200", "Yoga for Bones"], specialties: ["Hatha", "Yoga for Healthy Bones", "Gentle"], yearsTeaching: 11, bio: "Alix specializes in yoga for bone health and aging gracefully. Her workshops give students practical tools to maintain strength and mobility through targeted, evidence-based practice." },
  { id: "t7", firstName: "Sadie", lastName: "Leigh", role: "Teacher", certs: ["RYT-200", "Inversions Specialist"], specialties: ["Vinyasa", "Inversions", "Handstands"], yearsTeaching: 6, bio: "Sadie's inversion workshops break down complex poses into achievable progressions. She brings playfulness and confidence to the mat, helping students safely explore the world upside-down." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Mindful Hatha Flow", type: "HATHA",
  style: "NE Studio 1", temp: "Room Temp", duration: 75, location: "ne",
  description: "An exploration of yoga postures without the flow. Harmonize the fiery benefits of postural play with the ease of longer holds and the support of props. Expect standing and seated postures with targeted prop use, breathwork, and workshop-style moments.",
  intention: "Arrive as you are. There is nothing to fix, nothing to prove.",
  teacherTip: "Let the teacher know about injuries before class. Props are your allies, not crutches.",
  playlist: "Earth Room Ambient -- Sally's Selection",
};

const PAST_PRACTICES = [
  { id: "p1", date: offsetDate(-1), name: "Vinyasa Flow", type: "VINYASA", style: "NE Studio 2", temp: "Room Temp", duration: 60, location: "ne", description: "A breath-linked flow building heat and strength. Creative sequencing with modifications for all levels.", intention: "Let your breath lead the way.", teacherTip: "Chaturangas are always optional. Knees-down is just as powerful." },
  { id: "p2", date: offsetDate(-2), name: "Yin + Reiki", type: "YIN", style: "SE Studio", temp: "Room Temp", duration: 75, location: "se", description: "Gently paced poses held for 3-5 minutes to make space in connective tissues. Reiki offered throughout class with consent cards.", intention: "Surrender is not weakness -- it is wisdom.", teacherTip: "Support every shape with props. If you feel sharp sensation, back off." },
  { id: "p3", date: offsetDate(-3), name: "Strength & Mobility", type: "STRENGTH", style: "NE Studio 1", temp: "Room Temp", duration: 60, location: "ne", description: "Functional movement patterns meeting yoga postures. Build stability and develop body awareness.", intention: "Strong is not rigid. Flexible is not weak." },
];

const UPCOMING_PRACTICE = { id: "p-next", date: offsetDate(1), name: "Restorative + Sound Healing", type: "SPECIAL", style: "NE Studio 2", temp: "Room Temp", duration: 90, location: "ne", description: "A deeply nourishing practice combining supported restorative poses with the healing vibrations of crystal bowls, chimes, and tuning forks.", intention: "The deepest healing happens in stillness.", teacherTip: "Bring an extra layer. Grab two blankets and a bolster before settling in." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:00", type: "Vinyasa Flow", coach: "Beth Harp", capacity: 35, registered: 28, waitlist: 0, location: "ne" },
  { id: "cl2", time: "07:30", type: "Gentle Hatha", coach: "Sally Garrido-Spencer", capacity: 35, registered: 32, waitlist: 0, location: "ne" },
  { id: "cl3", time: "09:00", type: "Vinyasa Flow", coach: "Linnea Solveig", capacity: 30, registered: 30, waitlist: 4, location: "se" },
  { id: "cl4", time: "09:30", type: "Mindful Hatha", coach: "Alix Northup", capacity: 35, registered: 24, waitlist: 0, location: "ne" },
  { id: "cl5", time: "12:00", type: "Yin Yoga", coach: "Stephanie Starnes", capacity: 30, registered: 18, waitlist: 0, location: "se" },
  { id: "cl6", time: "16:30", type: "Vinyasa Flow", coach: "Sadie Leigh", capacity: 35, registered: 33, waitlist: 0, location: "ne" },
  { id: "cl7", time: "17:45", type: "Hatha", coach: "Linnea Solveig", capacity: 35, registered: 35, waitlist: 6, location: "ne" },
  { id: "cl8", time: "19:00", type: "Restorative", coach: "Stephanie Starnes", capacity: 30, registered: 22, waitlist: 0, location: "se" },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:00", type: "Vinyasa Flow", coach: "Beth", loc: "NE" }, { time: "07:30", type: "Gentle Hatha", coach: "Sally", loc: "NE" }, { time: "09:00", type: "Vinyasa", coach: "Linnea", loc: "SE" }, { time: "09:30", type: "Mindful Hatha", coach: "Alix", loc: "NE" }, { time: "12:00", type: "Yin", coach: "Stephanie", loc: "SE" }, { time: "16:30", type: "Vinyasa Flow", coach: "Sadie", loc: "NE" }, { time: "17:45", type: "Hatha", coach: "Linnea", loc: "NE" }, { time: "19:00", type: "Restorative", coach: "Stephanie", loc: "SE" }] },
  { day: "Tuesday", classes: [{ time: "06:00", type: "Hatha", coach: "Alix", loc: "NE" }, { time: "07:30", type: "Vinyasa Flow", coach: "Sadie", loc: "NE" }, { time: "09:00", type: "Gentle Hatha", coach: "Sally", loc: "SE" }, { time: "09:30", type: "Strength & Mobility", coach: "Beth", loc: "NE" }, { time: "12:00", type: "Mindful Hatha", coach: "Linnea", loc: "NE" }, { time: "16:30", type: "Vinyasa Flow", coach: "Sadie", loc: "NE" }, { time: "17:45", type: "Yin + Reiki", coach: "Stephanie", loc: "SE" }, { time: "19:15", type: "Restorative", coach: "Sally", loc: "NE" }] },
  { day: "Wednesday", classes: [{ time: "06:00", type: "Vinyasa Flow", coach: "Linnea", loc: "NE" }, { time: "07:30", type: "Gentle Hatha", coach: "Alix", loc: "NE" }, { time: "09:00", type: "Hatha", coach: "Sally", loc: "SE" }, { time: "09:30", type: "Vinyasa Flow", coach: "Beth", loc: "NE" }, { time: "12:00", type: "Yin", coach: "Stephanie", loc: "NE" }, { time: "16:30", type: "Mindful Hatha", coach: "Alix", loc: "NE" }, { time: "17:45", type: "Vinyasa", coach: "Sadie", loc: "SE" }, { time: "19:00", type: "Gentle Hatha", coach: "Sally", loc: "NE" }] },
  { day: "Thursday", classes: [{ time: "06:00", type: "Hatha", coach: "Beth", loc: "NE" }, { time: "07:30", type: "Vinyasa Flow", coach: "Linnea", loc: "NE" }, { time: "09:00", type: "Gentle Hatha", coach: "Alix", loc: "SE" }, { time: "09:30", type: "Strength & Mobility", coach: "Sadie", loc: "NE" }, { time: "12:00", type: "Mindful Hatha", coach: "Sally", loc: "NE" }, { time: "16:30", type: "Vinyasa Flow", coach: "Beth", loc: "NE" }, { time: "17:45", type: "Yin", coach: "Stephanie", loc: "SE" }, { time: "19:00", type: "Restorative", coach: "Sally", loc: "NE" }] },
  { day: "Friday", classes: [{ time: "06:00", type: "Vinyasa Flow", coach: "Sadie", loc: "NE" }, { time: "07:30", type: "Hatha", coach: "Alix", loc: "NE" }, { time: "09:00", type: "Vinyasa", coach: "Linnea", loc: "SE" }, { time: "09:30", type: "Gentle Hatha", coach: "Sally", loc: "NE" }, { time: "12:00", type: "Yin", coach: "Stephanie", loc: "NE" }, { time: "16:30", type: "Vinyasa Flow", coach: "Beth", loc: "NE" }, { time: "17:45", type: "Mindful Hatha", coach: "Alix", loc: "SE" }] },
  { day: "Saturday", classes: [{ time: "08:00", type: "Vinyasa Flow", coach: "Beth", loc: "NE" }, { time: "08:30", type: "Hatha", coach: "Sally", loc: "SE" }, { time: "09:30", type: "Strength & Mobility", coach: "Sadie", loc: "NE" }, { time: "10:00", type: "Gentle Hatha", coach: "Alix", loc: "SE" }, { time: "11:00", type: "Vinyasa", coach: "Linnea", loc: "NE" }, { time: "12:30", type: "Yin", coach: "Stephanie", loc: "NE" }] },
  { day: "Sunday", classes: [{ time: "08:30", type: "Gentle Hatha", coach: "Sally", loc: "NE" }, { time: "09:00", type: "Vinyasa Flow", coach: "Linnea", loc: "SE" }, { time: "10:00", type: "Mindful Hatha", coach: "Alix", loc: "NE" }, { time: "11:00", type: "Restorative", coach: "Stephanie", loc: "SE" }, { time: "16:00", type: "Vinyasa Flow", coach: "Sadie", loc: "NE" }, { time: "17:30", type: "Yin + Sound Healing", coach: "Stephanie", loc: "NE" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Tara M.", milestone: "300 Classes", message: "Three hundred classes. TPY is the only studio where I've felt truly welcome from day one. This community changed my relationship with my body.", date: today, celebrations: 48 },
  { id: "cf2", user: "Devon K.", milestone: "30-Day Streak", message: "30 days straight between NE and SE. Mornings with Sally, evenings with Stephanie. Feeling more grounded than ever.", date: today, celebrations: 26 },
  { id: "cf3", user: "Jasmine W.", milestone: "First Headstand!", message: "Sadie's workshop did it -- I kicked up and HELD it! The whole room clapped. I actually cried. Thank you TPY.", date: offsetDate(-1), celebrations: 55 },
  { id: "cf4", user: "Marcus R.", milestone: "1 Year Member", message: "One year as a member. As a scholarship recipient, this studio gave me access when I couldn't afford it. Now I'm paying it forward.", date: offsetDate(-2), celebrations: 67 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "300 Classes": { icon: Star, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "Both Studios": { icon: MapPin, color: "#6b8f71" },
  "First Headstand": { icon: ArrowUpRight, color: "#8b5cf6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Restorative Yoga + Sound Ceremony", date: "2026-04-18", startTime: "19:00", type: "Sound Healing", location: "ne", description: "Monthly sound ceremony with Stephanie Starnes. Restorative poses held with bolsters and blankets while crystal bowls, chimes, and tuning forks guide you into deep relaxation.", fee: 30, maxParticipants: 28, registered: 24, status: "Almost Full" },
  { id: "ev2", name: "Yoga For Healthy Bones", date: "2026-04-19", startTime: "13:00", type: "Workshop", location: "ne", description: "With Alix Northup. Evidence-based postures and practices that support bone density, balance, and healthy aging. All levels welcome.", fee: 40, maxParticipants: 20, registered: 14, status: "Registration Open" },
  { id: "ev3", name: "BLOOM: Yoga & Artistic Practice Retreat", date: "2026-06-25", startTime: "17:00", type: "Retreat", location: "offsite", description: "With Linnea Solveig at Trout Lake Abbey. Three days of guided meditation, active hatha, quiet yin, and multimedia art. Nourishing meals under the trees, lavender maze walks, bat-watching at twilight.", fee: 695, maxParticipants: 16, registered: 9, status: "Registration Open" },
  { id: "ev4", name: "How to Headstand with Sadie", date: offsetDate(6), startTime: "14:30", type: "Workshop", location: "ne", description: "Headstand can seem intimidating, but it can be one of the most attainable inversions. Purposeful warm-up, wall work, partner drills, and step-by-step progressions.", fee: 35, maxParticipants: 22, registered: 18, status: "Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m0", name: "New Student Special", type: "intro", price: 45, period: "30 days", features: ["Unlimited classes for 30 days", "Both studio locations", "Livestream access", "New students only"], popular: false },
  { id: "m1", name: "Single Drop-In", type: "drop-in", price: 18, period: "per class", features: ["1 studio class", "No commitment", "$12 for livestream"], popular: false },
  { id: "m2", name: "5 Class Pack", type: "pack", price: 85, period: "5 classes", features: ["5 class credits", "Valid 3 months", "$75 seniors/students/military"], popular: false },
  { id: "m3", name: "10 Class Pack", type: "pack", price: 160, period: "10 classes", features: ["10 class credits", "Valid 6 months", "$140 seniors/students/military"], popular: false },
  { id: "m4", name: "Unlimited Membership", type: "unlimited", price: 85, period: "/month", features: ["Unlimited studio classes", "Livestream + on-demand", "$5/month funds scholarships", "3-month minimum", "Both locations"], popular: true },
  { id: "m5", name: "Digital Membership", type: "digital", price: 65, period: "/month", features: ["Unlimited livestream", "Full on-demand library", "Practice anywhere", "3-month minimum"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "BLOOM Retreat -- June 2026", message: "Join Linnea at Trout Lake Abbey for yoga, art, and nature. Enroll before April 15 to save $100.", type: "celebration", pinned: true },
  { id: "a2", title: "Scholarship Fund Update", message: "$5 of every membership funds 30+ scholarships monthly, plus $6,000 in annual teacher training scholarships.", type: "info", pinned: false },
  { id: "a3", title: "Yoga for Bigger Bodies Series", message: "6-week series with Bethany Batsell starting April 13. Build body trust in a dedicated, supportive container.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Tara Morales", email: "tara@email.com", membership: "Unlimited", status: "active", joined: "2022-05-15", checkIns: 412, lastVisit: today, location: "NE" },
  { id: "mem2", name: "Devon Kim", email: "devon@email.com", membership: "Unlimited", status: "active", joined: "2023-02-01", checkIns: 298, lastVisit: offsetDate(-1), location: "Both" },
  { id: "mem3", name: "Jasmine Wells", email: "jasmine@email.com", membership: "Unlimited", status: "active", joined: "2024-08-01", checkIns: 134, lastVisit: today, location: "NE" },
  { id: "mem4", name: "Marcus Reid", email: "marcus@email.com", membership: "Scholarship", status: "active", joined: "2025-04-01", checkIns: 87, lastVisit: today, location: "SE" },
  { id: "mem5", name: "Lena Park", email: "lena@email.com", membership: "10 Class Pack", status: "active", joined: "2025-12-01", checkIns: 6, lastVisit: offsetDate(-3), location: "SE" },
  { id: "mem6", name: "Theo Santos", email: "theo@email.com", membership: "Unlimited", status: "frozen", joined: "2024-01-01", checkIns: 178, lastVisit: offsetDate(-35), location: "NE" },
  { id: "mem7", name: "River Chen", email: "river@email.com", membership: "Digital", status: "active", joined: "2025-06-01", checkIns: 92, lastVisit: offsetDate(-1), location: "Online" },
  { id: "mem8", name: "Ava Moreno", email: "ava@email.com", membership: "Unlimited", status: "active", joined: "2023-09-01", checkIns: 356, lastVisit: today, location: "Both" },
];

const ADMIN_METRICS = { activeMembers: 520, memberChange: 24, todayCheckIns: 142, weekCheckIns: 876, monthlyRevenue: 48600, revenueChange: 8.7, workshopRevenue: 6200, scholarships: 32 };

const ADMIN_CHARTS = {
  attendance: [{ day: "Mon", NE: 78, SE: 42 }, { day: "Tue", NE: 72, SE: 38 }, { day: "Wed", NE: 68, SE: 40 }, { day: "Thu", NE: 82, SE: 44 }, { day: "Fri", NE: 58, SE: 36 }, { day: "Sat", NE: 72, SE: 38 }, { day: "Sun", NE: 56, SE: 34 }],
  revenue: [{ month: "Oct", revenue: 41200 }, { month: "Nov", revenue: 43800 }, { month: "Dec", revenue: 40100 }, { month: "Jan", revenue: 45600 }, { month: "Feb", revenue: 47200 }, { month: "Mar", revenue: 48600 }],
  membershipBreakdown: [{ name: "Unlimited", value: 310, color: T.accent }, { name: "Digital", value: 68, color: T.success }, { name: "10 Pack", value: 52, color: T.warning }, { name: "5 Pack", value: 38, color: "#c2a04e" }, { name: "Scholarship", value: 32, color: "#8b5cf6" }, { name: "Drop-In", value: 20, color: T.textMuted }],
  classPopularity: [{ name: "Vinyasa Flow", pct: 92 }, { name: "Hatha", pct: 86 }, { name: "Gentle Hatha", pct: 82 }, { name: "Yin", pct: 78 }, { name: "Strength & Mobility", pct: 74 }, { name: "Restorative", pct: 70 }],
};

const HERO_IMAGES = {
  home: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&fit=crop&q=80",
  classes: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&fit=crop&q=80",
  schedule: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&fit=crop&q=80",
  practice: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&fit=crop&q=80",
  community: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&fit=crop&q=80",
  teachers: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&fit=crop&q=80",
  events: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&fit=crop&q=80",
  membership: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&fit=crop&q=80",
  rewards: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&fit=crop&q=80",
};

// ===================================================================
//  CONTEXT + SHARED COMPONENTS
// ===================================================================
const AppContext = createContext();

function PageHero({ title, subtitle, image, gradient, subtitleWide }) {
  const g = gradient || `linear-gradient(135deg, ${T.bg} 0%, hsl(20,30%,18%) 50%, hsl(15,40%,22%) 100%)`;
  const [imgOk, setImgOk] = useState(true);
  return (
    <div style={{ position: "relative", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "24px 20px 20px", overflow: "hidden" }}>
      {image && imgOk ? (
        <img src={image} alt="" onError={() => setImgOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} loading="lazy" />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: g }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "relative", zIndex: 1, color: "#fff" }}>
        <h1 style={{ fontFamily: DF, fontSize: "3.5rem", margin: "0 0 6px", lineHeight: 1.05, fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.4, maxWidth: subtitleWide ? "95%" : "85%" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: DF, fontSize: 22, color: T.text, margin: 0, fontWeight: 600 }}>{title}</h2>
      {linkText && <button onClick={() => setPage(linkPage)} style={{ fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>{linkText} <ChevronRight size={14} /></button>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (<div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}><div style={{ fontFamily: DF, fontSize: 22, color: T.text, fontWeight: 700 }}>{value}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{label}</div></div>);
}

function LocBadge({ loc }) {
  const isNE = (loc || "").toLowerCase().includes("ne") || loc === "ne";
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: isNE ? T.accentGhost : T.successGhost, color: isNE ? T.accent : T.success }}>{(loc || "").toUpperCase()}</span>;
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const s = { width: "100%", padding: "10px 14px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", boxSizing: "border-box", resize: "none" };
  return (<div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>{multiline ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}</div>);
}

function PracticeCardFull({ practice: p, expanded, onToggle }) {
  const isToday = p.date === today, isFuture = p.date > today;
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${isToday ? T.accentBorder : T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }} onClick={onToggle}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
              {isToday && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>Today</span>}
              {isFuture && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.successGhost, color: T.success }}>Upcoming</span>}
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: T.bgDim, color: T.textMuted }}>{p.type}</span>
              {p.location && <LocBadge loc={p.location} />}
            </div>
            <h3 style={{ fontFamily: DF, fontSize: 20, margin: 0, color: T.text, fontWeight: 600 }}>{p.name}</h3>
          </div>
          <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: T.textMuted, flexWrap: "wrap" }}>
          <span>{fmtDateS(p.date)}</span><span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {p.duration} min</span><span>{p.style}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
          <p style={{ fontSize: 13, color: "#5a4e3a", lineHeight: 1.6, margin: "0 0 12px" }}>{p.description}</p>
          {p.intention && <div style={{ padding: "10px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${T.accentGhost}, transparent)`, border: `1px solid ${T.accentBorder}`, marginBottom: 10 }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.accent, margin: "0 0 4px", letterSpacing: "0.05em" }}>Intention</p><p style={{ fontSize: 13, color: T.text, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{p.intention}</p></div>}
          {p.teacherTip && <div style={{ padding: "10px 14px", borderRadius: 10, background: T.bgDim, marginBottom: 10 }}><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: T.textMuted, margin: "0 0 4px", letterSpacing: "0.05em" }}>Teacher Tip</p><p style={{ fontSize: 13, color: "#5a4e3a", margin: 0, lineHeight: 1.5 }}>{p.teacherTip}</p></div>}
          {p.playlist && <p style={{ fontSize: 12, color: T.textMuted, display: "flex", alignItems: "center", gap: 6, margin: 0 }}><Music size={14} color={T.accent} /> {p.playlist}</p>}
        </div>
      )}
    </div>
  );
}

function CTACard() {
  return (
    <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,30%,18%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${T.accent}15` }} />
      <Heart size={28} color={T.accent} style={{ marginBottom: 12 }} />
      <h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>New Student Special</h3>
      <p style={{ fontSize: 13, color: "#b8a898", margin: "0 0 16px", lineHeight: 1.5 }}>30 days of unlimited classes at both studios for just $45. All levels, all bodies welcome.</p>
      <button style={{ padding: "12px 24px", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>Start Your Journey</button>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (<div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>{title}</h3>{children}</div>);
}

// ===================================================================
//  MODALS (position: absolute for phone frame containment)
// ===================================================================
function SettingsModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 390, background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: DF, fontSize: 24, margin: 0, fontWeight: 600 }}>Settings</h2>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STUDIO_CONFIG.locations.map(loc => (
            <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgDim, borderRadius: 12 }}>
              <MapPin size={20} color={T.accent} />
              <div><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{loc.name} Studio</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{loc.address}</p></div>
            </div>
          ))}
          {[{ icon: Share2, label: STUDIO_CONFIG.social.instagram, sub: "Follow us on Instagram" }, { icon: Gift, label: "Karma Points", sub: "Earn points with every class" }, { icon: Heart, label: "Scholarship Fund", sub: "$5/month from your membership supports others" }].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgDim, borderRadius: 12 }}>
              <item.icon size={20} color={T.accent} /><div><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{item.label}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{item.sub}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const notifs = [
    { id: "n1", title: "Class Confirmed", message: "You're booked for Vinyasa Flow at 6:00 AM tomorrow at NE with Beth.", time: "2h ago", read: false },
    { id: "n2", title: "Karma Points Earned", message: "You earned 20 Karma Points. 50 points to your next guest pass.", time: "1d ago", read: false },
    { id: "n3", title: "Sound Ceremony Saturday", message: "Stephanie's monthly Restorative + Sound Ceremony is almost full.", time: "2d ago", read: true },
    { id: "n4", title: "BLOOM Retreat Early Bird", message: "Save $100 on the Trout Lake retreat -- enroll before April 15.", time: "3d ago", read: true },
  ];
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 390, background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ fontFamily: DF, fontSize: 24, margin: 0, fontWeight: 600 }}>Notifications</h2><button onClick={onClose} style={{ padding: 4, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color={T.textMuted} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map(n => (
            <div key={n.id} style={{ padding: "14px 16px", borderRadius: 12, background: n.read ? T.bgDim : T.accentGhost, border: `1px solid ${n.read ? T.border : T.accentBorder}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: T.text }}>{n.title}</h4>{!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, flexShrink: 0, marginTop: 4 }} />}</div>
              <p style={{ fontSize: 13, color: "#5a4e3a", margin: "0 0 4px", lineHeight: 1.4 }}>{n.message}</p>
              <p style={{ fontSize: 11, color: T.textFaint, margin: 0 }}>{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const isFull = classData.registered >= classData.capacity;
  const handleConfirm = () => { onConfirm(classData.id); setConfirmed(true); setTimeout(onClose, 1500); };
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: 340, background: T.bgCard, borderRadius: 18, padding: "24px 22px", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Check size={28} color={T.accent} /></div>
            <h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>{isFull ? "Added to Waitlist" : "You're In!"}</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>See you on the mat</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>Reserve Your Spot</h3>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 16px" }}>{classData.dayLabel || fmtDateS(today)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[["Class", classData.type], ["Time", fmtTime(classData.time)], ["Teacher", classData.coach], ["Spots", isFull ? `Full -- ${classData.waitlist || 0} waitlisted` : `${classData.capacity - classData.registered} open`]].map(([l, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.borderLight}` : "none" }}>
                  <span style={{ fontSize: 13, color: T.textMuted }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: l === "Spots" ? (isFull ? T.warning : T.accent) : T.text }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>{isFull ? "Join Waitlist" : "Confirm"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===================================================================
//  CONSUMER PAGES
// ===================================================================
function HomePage() {
  const { openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const upcoming = CLASSES_TODAY.filter(c => { const [h, m] = c.time.split(":").map(Number); return h * 60 + m > currentMin; });

  return (<div>
    <PageHero title={<>{STUDIO_CONFIG.heroLine1}<br /><span style={{ color: T.accent }}>{STUDIO_CONFIG.heroLine2}</span></>} subtitle={STUDIO_CONFIG.description} image={HERO_IMAGES.home} subtitleWide />

    <section style={{ padding: "20px 16px 0" }}>
      <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
      <PracticeCardFull practice={TODAYS_FOCUS} expanded={true} onToggle={() => {}} />
    </section>

    <section style={{ padding: "0 16px", marginTop: 24 }}>
      <SectionHeader title="Up Next" linkText="Full Schedule" linkPage="schedule" />
      {upcoming.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.slice(0, 4).map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 54 }}><span style={{ fontFamily: DF, fontSize: 16, color: T.text, fontWeight: 600 }}>{fmtTime(c.time)}</span></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><p style={{ fontWeight: 600, fontSize: 13, color: T.text, margin: 0 }}>{c.type}</p><LocBadge loc={c.location} /></div>
                <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{c.coach} -- {c.registered}/{c.capacity}</p>
              </div>
              <button onClick={() => openReservation(c)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: c.registered >= c.capacity ? T.warningGhost : T.accent, color: c.registered >= c.capacity ? T.warning : "#fff" }}>{c.registered >= c.capacity ? "Waitlist" : "Reserve"}</button>
            </div>
          ))}
        </div>
      ) : <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 20px", color: T.textFaint }}><Moon size={28} style={{ marginBottom: 8 }} /><p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No more classes today</p></div>}
    </section>

    <section style={{ padding: "0 16px", marginTop: 28 }}>
      <SectionHeader title="Community" linkText="View All" linkPage="community" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {COMMUNITY_FEED.slice(0, 3).map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={18} color="#fff" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{item.user} <span style={{ color: T.accent }}>{item.milestone}</span></p>
                <p style={{ fontSize: 12, color: "#6b5e48", margin: "2px 0 0", lineHeight: 1.4 }}>{item.message.length > 55 ? item.message.slice(0, 55) + "..." : item.message}</p>
              </div>
              <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <Heart size={18} color={T.accent} fill={myC > 0 ? T.accent : "none"} /><span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>

    <section style={{ padding: "0 16px", marginTop: 28 }}>
      <SectionHeader title="Announcements" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : T.bgDim }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div><h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3><p style={{ fontSize: 13, color: "#6b5e48", margin: "4px 0 0" }}>{a.message}</p></div>
              {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: "0 16px", marginTop: 28 }}><CTACard /></section>
  </div>);
}

function ClassesPage() {
  const [exp, setExp] = useState(null);
  const all = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));
  return (<div><PageHero title="Classes" subtitle="Past, present, and upcoming practice" image={HERO_IMAGES.classes} /><div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>{all.map(p => <PracticeCardFull key={p.id} practice={p} expanded={exp === p.id} onToggle={() => setExp(exp === p.id ? null : p.id)} />)}</div></div>);
}

function SchedulePage() {
  const [selDay, setSelDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [locFilter, setLocFilter] = useState("all");
  const { openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const filtered = (WEEKLY_SCHEDULE[selDay]?.classes || []).filter(c => locFilter === "all" || c.loc.toLowerCase() === locFilter);

  return (<div><PageHero title="Schedule" subtitle="Reserve your spot across both studios" image={HERO_IMAGES.schedule} />
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>{days.map((d, i) => <button key={d} onClick={() => setSelDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selDay === i ? T.accent : T.bgDim, color: selDay === i ? "#fff" : T.textMuted }}>{d}</button>)}</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>{["all", "ne", "se"].map(f => <button key={f} onClick={() => setLocFilter(f)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", background: locFilter === f ? T.accent : T.bgCard, color: locFilter === f ? "#fff" : T.textMuted }}>{f === "all" ? "Both" : f}</button>)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Restorative") || cls.type.includes("Sound");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}><span style={{ fontFamily: DF, fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p><LocBadge loc={cls.loc} />
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Restorative</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `s-${selDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 15, waitlist: 0, dayLabel: dayNames[selDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>Reserve</button>
            </div>
          );
        })}
      </div>
    </div>
  </div>);
}

function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);
  const handleSave = () => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setReflection({ energy: 4, focus: 4, notes: "" }); };

  return (<div><PageHero title="My Practice" subtitle="Track your journey and celebrate growth" image={HERO_IMAGES.practice} />
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[{ icon: Flame, val: 16, label: "Day Streak", c: T.accent, bg: T.accentGhost, bd: T.accentBorder }, { icon: Star, val: 134, label: "Total Classes", c: T.success, bg: T.successGhost, bd: T.successBorder }, { icon: Mountain, val: 8, label: "Milestones", c: T.warning, bg: T.warningGhost, bd: T.warningBorder }].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
            <s.icon size={20} color={s.c} style={{ margin: "0 auto 4px" }} /><div style={{ fontFamily: DF, fontSize: 28, fontWeight: 700, color: T.text }}>{s.val}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none" }}>{tab.label}</button>)}
      </div>
      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Leaf size={18} color={T.accent} /><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ label: "Energy Level", key: "energy", icons: [Moon, Moon, Sun, Sun, Sparkles], c: T.accent }, { label: "Focus & Presence", key: "focus", icons: [Wind, Wind, Heart, Heart, Sparkles], c: T.success }].map(row => (
              <div key={row.key}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</label>
                <div style={{ display: "flex", gap: 6 }}>{[1,2,3,4,5].map(n => { const I = row.icons[n-1]; return <button key={n} onClick={() => setReflection({...reflection, [row.key]: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection[row.key] >= n ? row.c : T.border}`, background: reflection[row.key] >= n ? `${row.c}12` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I size={18} color={reflection[row.key] >= n ? row.c : T.textFaint} /></button>; })}</div>
              </div>
            ))}
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: DF, fontSize: 17 }}>{saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}</button>
          </div>
        </div>
      )}
      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "100 Classes", "7-Day Streak", "30-Day Streak", "Both Studios", "1 Year Member"].includes(name);
            const Icon = badge.icon;
            return (<div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : "transparent"}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.45 }}><div style={{ width: 44, height: 44, borderRadius: "50%", background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><Icon size={22} color={earned ? badge.color : T.textFaint} /></div><p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: 0 }}>{name}</p><p style={{ fontSize: 11, color: T.textFaint, margin: "2px 0 0" }}>{earned ? "Earned" : "Keep going"}</p></div>);
          })}
        </div>
      )}
    </div>
  </div>);
}

function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (<div><PageHero title="Community" subtitle="Celebrate each other's practice" image={HERO_IMAGES.community} />
    <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
      {COMMUNITY_FEED.map(item => { const myC = feedCelebrations[item.id] || 0; return (
        <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{item.user[0]}</div>
            <div><p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{fmtDateS(item.date)}</p></div>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{item.milestone}</span>
          </div>
          <p style={{ fontSize: 14, color: "#4a3e2e", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
          <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.accentBorder : T.border}`, background: myC > 0 ? T.accentGhost : "transparent", cursor: "pointer" }}><Heart size={16} color={T.accent} fill={myC > 0 ? T.accent : "none"} /><span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{item.celebrations + myC}</span></button>
        </div>
      ); })}
    </div>
  </div>);
}

function TeachersPage() {
  const [exp, setExp] = useState(null);
  return (<div><PageHero title="Instructors" subtitle="Meet the teaching team" image={HERO_IMAGES.teachers} />
    <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
      {TEACHERS.map(t => { const expanded = exp === t.id; return (
        <div key={t.id} onClick={() => setExp(expanded ? null : t.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>{t.firstName[0]}{t.lastName[0]}</div>
            <div style={{ flex: 1 }}><h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{t.yearsTeaching} years teaching</p></div>
            <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </div>
          {expanded && <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}><p style={{ fontSize: 13, color: "#5a4e3a", lineHeight: 1.6, margin: "0 0 12px" }}>{t.bio}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{t.specialties.map(s => <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>)}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{t.certs.map(c => <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>)}</div></div>}
        </div>
      ); })}
    </div>
  </div>);
}

function MembershipPage() {
  return (<div><PageHero title="Rates" subtitle="Find your path to practice" image={HERO_IMAGES.membership} />
    <div style={{ padding: "20px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
      {MEMBERSHIP_TIERS.map(tier => (
        <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
          {tier.popular && <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Popular</div>}
          <h3 style={{ fontFamily: DF, fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>{tier.name}</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}><span style={{ fontFamily: DF, fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span><span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span></div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>{tier.features.map((f, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a4e3a" }}><CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}</li>)}</ul>
          <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: tier.popular ? T.accent : T.bg, color: "#fff" }}>Get Started</button>
        </div>
      ))}
    </div>
  </div>);
}

function EventsPage() {
  return (<div><PageHero title="Events" subtitle="Workshops, retreats, and special offerings" image={HERO_IMAGES.events} />
    <div style={{ padding: "20px 16px 0" }}>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,30%,18%))`, padding: "20px 18px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>{ev.location !== "offsite" && <LocBadge loc={ev.location} />}</div>
            <h3 style={{ fontFamily: DF, fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#b8a898" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {fmtDateS(ev.date)}</span>{ev.startTime !== "00:00" && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>}</div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#5a4e3a", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}><StatBox label="Price" value={`$${ev.fee}`} /><StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} /></div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: DF, background: T.accent, color: "#fff" }}>Register Now</button>
          </div>
        </div>
      ))}
    </div>
  </div>);
}

// ===================================================================
//  ADMIN PAGES
// ===================================================================
function AdminDashboard() {
  const metrics = [{ label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, icon: Users, color: T.accent }, { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns}/wk`, icon: Calendar, color: T.success }, { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, icon: DollarSign, color: T.warning }, { label: "Scholarships Active", value: ADMIN_METRICS.scholarships, change: "Funded by members", icon: Heart, color: "#8b5cf6" }];
  return (<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Dashboard</h1><p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>NE Killingsworth + SE Hawthorne</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
      {metrics.map((m, i) => (<div key={i} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><m.icon size={18} color={m.color} /></div><div style={{ fontFamily: DF, fontSize: 30, color: "#111827", fontWeight: 700 }}>{m.value}</div><span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: "#16a34a", marginTop: 4 }}><ArrowUpRight size={12} /> {m.change}</span><p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0" }}>{m.label}</p></div>))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
      <AdminCard title="Attendance by Location"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={ADMIN_CHARTS.attendance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" stroke="#6b7280" fontSize={12} /><YAxis stroke="#6b7280" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} /><Bar dataKey="NE" fill={T.accent} radius={[4, 4, 0, 0]} /><Bar dataKey="SE" fill={T.success} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>{[{ l: "NE Killingsworth", c: T.accent }, { l: "SE Hawthorne", c: T.success }].map((x, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} /><span style={{ fontSize: 11, color: "#6b7280" }}>{x.l}</span></div>)}</div></AdminCard>
      <AdminCard title="Revenue Trend"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={ADMIN_CHARTS.revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" stroke="#6b7280" fontSize={12} /><YAxis stroke="#6b7280" fontSize={12} tickFormatter={v => `$${v / 1000}k`} /><Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} /><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={T.accent} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#rg)" /></AreaChart></ResponsiveContainer></div></AdminCard>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
      <AdminCard title="Membership Breakdown"><div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827" }} /></PieChart></ResponsiveContainer></div><div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} /><span style={{ fontSize: 11, color: "#6b7280" }}>{e.name} ({e.value})</span></div>)}</div></AdminCard>
      <AdminCard title="Class Fill Rate"><div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{ADMIN_CHARTS.classPopularity.map((c, i) => <div key={i}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{c.name}</span><span style={{ fontSize: 11, color: "#6b7280" }}>{c.pct}%</span></div><div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${c.pct}%`, background: T.accent, borderRadius: 3 }} /></div></div>)}</div></AdminCard>
    </div>
  </div>);
}

function AdminMembersPage() {
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => (m.name.toLowerCase().includes(search.toLowerCase())) && (filter === "all" || m.status === filter));
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Members</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><UserPlus size={16} /> Add Member</button></div>
    <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1, position: "relative" }}><Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, outline: "none", boxSizing: "border-box" }} /></div><div style={{ display: "flex", gap: 4 }}>{["all", "active", "frozen"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#f9fafb", color: filter === f ? "#fff" : "#6b7280" }}>{f}</button>)}</div></div>
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Member", "Plan", "Status", "Classes", "Studio"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{filtered.map(m => <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6" }}><td style={{ padding: "12px 16px" }}><p style={{ color: "#111827", fontWeight: 600, margin: 0 }}>{m.name}</p><p style={{ color: "#9ca3af", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p></td><td style={{ padding: "12px 16px", color: "#374151" }}>{m.membership}</td><td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}15` : `${T.warning}15`, color: m.status === "active" ? T.accent : T.warning }}>{m.status}</span></td><td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace" }}>{m.checkIns}</td><td style={{ padding: "12px 16px", color: "#6b7280" }}>{m.location}</td></tr>)}</tbody></table></div>
  </div>);
}

function AdminSchedulePage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Schedule</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Class</button></div>
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Time", "Class", "Teacher", "Studio", "Spots", ""].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead><tbody>{CLASSES_TODAY.map(c => <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}><td style={{ padding: "12px 16px", color: "#111827", fontFamily: "monospace" }}>{fmtTime(c.time)}</td><td style={{ padding: "12px 16px", color: "#374151", fontWeight: 600 }}>{c.type}</td><td style={{ padding: "12px 16px", color: "#374151" }}>{c.coach}</td><td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.location.toUpperCase()}</td><td style={{ padding: "12px 16px" }}><span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span></td><td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Edit3 size={12} /></button><button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={12} /></button></div></td></tr>)}</tbody></table></div>
  </div>);
}

function AdminTeachersPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Teachers</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><UserPlus size={16} /> Add Teacher</button></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
      {TEACHERS.map(t => (<div key={t.id} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 20, color: "#fff", fontWeight: 600 }}>{t.firstName[0]}{t.lastName[0]}</div><div><h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p></div></div><div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>{t.certs.map(c => <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280" }}>{c}</span>)}</div><div style={{ display: "flex", gap: 6 }}><button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button><button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button><button style={{ padding: "8px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={14} /></button></div></div>))}
    </div>
  </div>);
}

function AdminEventsPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Events</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Event</button></div>
    {EVENTS.map(ev => (<div key={ev.id} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><h3 style={{ color: "#111827", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{ev.name}</h3><p style={{ color: "#6b7280", fontSize: 12 }}>{fmtDateS(ev.date)} -- {ev.type}</p></div><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", cursor: "pointer" }}><Edit3 size={14} /></button><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={14} /></button></div></div><div style={{ display: "flex", gap: 16, marginTop: 8 }}><span style={{ fontSize: 12, color: "#6b7280" }}>${ev.fee}</span><span style={{ fontSize: 12, color: "#6b7280" }}>{ev.registered}/{ev.maxParticipants} registered</span><span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{ev.status}</span></div></div>))}
  </div>);
}

function AdminPricingPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Pricing</h1><button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Tier</button></div>
    {MEMBERSHIP_TIERS.map(tier => (<div key={tier.id} style={{ background: "#ffffff", border: `1px solid ${tier.popular ? T.accent : "#e5e7eb"}`, borderRadius: 12, padding: 18 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><h3 style={{ color: "#111827", fontWeight: 700, fontSize: 15, margin: 0 }}>{tier.name}</h3><p style={{ color: T.accent, fontSize: 22, fontFamily: DF, fontWeight: 700, margin: "4px 0 0" }}>${tier.price} <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans'" }}>{tier.period}</span></p></div><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", cursor: "pointer" }}><Edit3 size={14} /></button><button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer" }}><Trash2 size={14} /></button></div></div></div>))}
  </div>);
}

function AdminCommsPage() {
  const [message, setMessage] = useState(""); const [sent, setSent] = useState(false);
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Broadcast</h1>
    <AdminCard title="New Announcement"><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a broadcast for all members..." rows={4} style={{ width: "100%", padding: 12, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#111827", fontSize: 13, fontFamily: "'DM Sans'", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 12 }} /><button onClick={() => { setSent(true); setTimeout(() => { setSent(false); setMessage(""); }, 2000); }} disabled={!message.trim()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: message.trim() ? T.accent : "#e5e7eb", color: message.trim() ? "#fff" : "#9ca3af", fontWeight: 600, fontSize: 13, cursor: message.trim() ? "pointer" : "default" }}>{sent ? <><Check size={14} /> Sent!</> : <><Send size={14} /> Broadcast to All</>}</button></AdminCard>
    <AdminCard title="Recent Broadcasts">{ANNOUNCEMENTS.map(a => <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}><p style={{ color: "#111827", fontWeight: 600, fontSize: 14, margin: 0 }}>{a.title}</p><p style={{ color: "#6b7280", fontSize: 12, margin: "4px 0 0" }}>{a.message}</p></div>)}</AdminCard>
  </div>);
}

function AdminSettingsPage() {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h1 style={{ fontFamily: DF, fontSize: 28, color: "#111827", margin: 0, fontWeight: 600 }}>Settings</h1>
    <AdminCard title="Studio Information"><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{STUDIO_CONFIG.locations.map(loc => <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, background: "#f9fafb" }}><MapPin size={18} color={T.accent} /><div><p style={{ color: "#111827", fontWeight: 600, fontSize: 14, margin: 0 }}>{loc.name} -- {loc.studios} studio{loc.studios > 1 ? "s" : ""}</p><p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{loc.address}</p></div><button style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, cursor: "pointer" }}><Edit3 size={14} /></button></div>)}</div></AdminCard>
    <AdminCard title="Integrations">{["Booking System", "Payment Processor", "Email Marketing", "Analytics"].map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}><span style={{ color: "#374151", fontSize: 13 }}>{item}</span><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${T.accent}15`, color: T.accent }}>Connected</span></div>)}</AdminCard>
  </div>);
}

// ===================================================================
//  MAIN APP
// ===================================================================
export default function App({ onEnterAdmin, startInAdmin, onExitAdmin }) {
  const [page, setPage] = useState(startInAdmin ? "admin-dashboard" : "home");
  const [isAdmin, setIsAdmin] = useState(!!startInAdmin);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const contentRef = useRef(null);

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo(0, 0); }, [page]);

  const registerForClass = useCallback((id) => setClassRegistrations(p => ({ ...p, [id]: true })), []);
  const openReservation = useCallback((d) => setReservationClass(d), []);
  const celebrateFeed = useCallback((id) => setFeedCelebrations(p => ({ ...p, [id]: (p[id] || 0) + 1 })), []);

  const mainTabs = [{ id: "home", label: "Home", icon: Home }, { id: "schedule", label: "Schedule", icon: CalendarDays }, { id: "community", label: "Community", icon: Heart }, { id: "practice", label: "Practice", icon: TrendingUp }, { id: "more", label: "More", icon: Menu }];
  const moreItems = [{ id: "classes", label: "Classes", icon: Calendar }, { id: "teachers", label: "Teachers", icon: Users }, { id: "membership", label: "Rates", icon: CreditCard }, { id: "events", label: "Events", icon: PartyPopper }, { id: "rewards", label: "Karma Points", icon: Gift }];
  const adminTabs = [{ id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard }, { id: "admin-members", label: "Members", icon: Users }, { id: "admin-schedule", label: "Schedule", icon: CalendarDays }, { id: "admin-teachers", label: "Teachers", icon: UserCheck }, { id: "admin-events", label: "Events", icon: PartyPopper }, { id: "admin-pricing", label: "Pricing", icon: CreditCard }, { id: "admin-comms", label: "Broadcast", icon: Megaphone }, { id: "admin-settings", label: "Settings", icon: Settings }];
  const isMoreActive = moreItems.some(item => item.id === page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "rewards": return (
        <div><PageHero title="Karma Points" subtitle="Earn points, unlock perks, support community" image={HERO_IMAGES.rewards} />
          <div style={{ padding: "20px 16px" }}>
            <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(20,30%,18%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, margin: "0 0 8px" }}>Your Karma</p>
              <div style={{ fontFamily: DF, fontSize: 48, fontWeight: 700 }}>1,480</div>
              <p style={{ fontSize: 13, color: "#b8a898", margin: "4px 0 0" }}>20 points to next reward</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ pts: 500, reward: "Free Guest Pass", icon: UserPlus }, { pts: 1000, reward: "Free Mat Rental (1 Month)", icon: Gift }, { pts: 1500, reward: "10% Off Workshop", icon: Award }, { pts: 2500, reward: "Scholarship Donation in Your Name", icon: Heart }].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center" }}><r.icon size={20} color={T.accent} /></div>
                  <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14, margin: 0, color: T.text }}>{r.reward}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{r.pts} points</p></div>
                  <button style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: r.pts <= 1480 ? "pointer" : "default", background: r.pts <= 1480 ? T.accent : T.bgDim, color: r.pts <= 1480 ? "#fff" : T.textFaint }}>{r.pts <= 1480 ? "Redeem" : "Locked"}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-comms": return <AdminCommsPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f9fafb", color: "#111827" }}>
          <aside style={{ width: 240, background: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, zIndex: 10 }}>
            <div style={{ padding: "16px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
              <div><span style={{ fontFamily: DF, fontSize: 14, color: "#111827", display: "block", lineHeight: 1 }}>{STUDIO_CONFIG.name}</span><span style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin</span></div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => { const active = page === tab.id; return <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#6b7280", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}><tab.icon size={18} /><span>{tab.label}</span>{active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}</button>; })}
            </nav>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}><button onClick={() => { if (onExitAdmin) { onExitAdmin(); } else { setIsAdmin(false); setPage("home"); } }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", textAlign: "left" }}><LogOut size={18} /><span>Exit Admin</span></button></div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto", minHeight: "100vh" }}>{renderPage()}</main>
        </div>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div ref={contentRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 60, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.app-scroll::-webkit-scrollbar { display: none; }`}</style>
          <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DF, fontSize: 16, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
              <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontFamily: DF, fontSize: 17, lineHeight: 1, letterSpacing: "0.01em" }}>{STUDIO_CONFIG.name}</span><span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span></div>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <button onClick={() => { if (onEnterAdmin) onEnterAdmin(); else { setIsAdmin(true); setPage("admin-dashboard"); } }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}><Shield size={20} /></button>
              <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}><Bell size={20} /><span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>2</span></button>
              <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}><Settings size={20} /></button>
            </div>
          </header>
          {renderPage()}
        </div>
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 60, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 8, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}><span style={{ fontFamily: DF, fontSize: 20, fontWeight: 600 }}>More</span><button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{moreItems.map(item => { const active = page === item.id; return <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}><item.icon size={22} /><span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span></button>; })}</div>
            </div>
          </div>
        )}
        <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "white", borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50 }}>
          {mainTabs.map(tab => { const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id; return <button key={tab.id} onClick={tab.id === "more" ? () => setShowMore(true) : () => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}><tab.icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span></button>; })}
        </nav>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
