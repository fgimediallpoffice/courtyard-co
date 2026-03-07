import { useState, useEffect, useRef } from "react";

// ── Persistent storage helpers ──
const S = {
  async get(key) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  },
  async set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch(e) { return false; }
  },
};

// ── Default site content ──
const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "Hyderabad · Est. 2025 · HITEC Corridor",
    title: "Where the Courtyard comes alive.",
    titleItalic: "Courtyard",
    description: "A curated flea market experience nestled within Hyderabad's most vibrant IT campuses. Artisans, makers, bakers & creators — brought to your doorstep.",
  },
  about: {
    title: "Not just a market. A moment.",
    body: "The Courtyard Co. was born from a simple belief — that the best discoveries happen by accident. We plant curated flea markets inside Hyderabad's IT campuses so that on your lunch break, between meetings, or on a quiet Saturday morning, you might stumble upon something that makes you stop.\n\nEvery vendor is handpicked. Every edition is themed. Every courtyard becomes a destination.",
    statNumber: "40+",
    statLabel: "Curated Stalls",
  },
  edition: {
    date: "April 18, 2026",
    theme: "The Summer Edit",
    day: "Saturday, April 18",
    timing: "10 AM – 6 PM",
    location: "Mindspace, Madhapur",
    stalls: "38 Curated Spots",
    entry: "Free · All Welcome",
    fullLocation: "Raheja Mindspace · Madhapur, Hyderabad",
  },
  marquee: ["Handmade Jewelry", "Artisanal Food", "Ethnic Wear", "Home Décor", "Natural Skincare", "Vintage Finds", "Live Art", "Plant Stalls", "Custom Portraits", "Chai & Conversations"],
  images: {
    hero1: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80&fit=crop",
    hero2: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80&fit=crop",
    hero3: "https://images.unsplash.com/photo-1604014238073-1f7b8d8b0dc7?w=600&q=80&fit=crop",
    hero4: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=80&fit=crop",
    about: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fit=crop",
    gallery1: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80&fit=crop",
    gallery2: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&fit=crop",
    gallery3: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80&fit=crop",
    gallery4: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80&fit=crop",
  },
};

// ── Seed demo submissions ──
const DEMO_SUBMISSIONS = [
  { id: "sub_001", name: "Priya Mehta", business: "Wildbloom Studio", category: "Jewelry & Accessories", instagram: "@wildbloom.studio", phone: "+91 98400 11234", message: "We make handcrafted silver and semi-precious stone jewelry. Each piece is one of a kind.", status: "pending", createdAt: "2025-03-01T09:22:00Z" },
  { id: "sub_002", name: "Aditya Rao", business: "Ferment & Co.", category: "Artisanal Food", instagram: "@fermentandco", phone: "+91 87654 32100", message: "Artisanal kombuchas, fermented hot sauces and kimchi. We've been selling at HITEC area offices for 6 months.", status: "approved", createdAt: "2025-03-03T14:05:00Z" },
  { id: "sub_003", name: "Sneha Krishnan", business: "Earthen Home", category: "Home & Décor", instagram: "@earthenhome.hyd", phone: "+91 99887 76655", message: "Handmade terracotta pots, hand-painted ceramics and macramé wall hangings.", status: "approved", createdAt: "2025-03-05T11:33:00Z" },
  { id: "sub_004", name: "Rahul Verma", business: "The Print Room", category: "Art & Prints", instagram: "@theprintroom_hyd", phone: "+91 77665 54433", message: "Limited edition giclée prints of Hyderabad cityscapes and abstract works. All archival quality.", status: "pending", createdAt: "2025-03-06T08:14:00Z" },
  { id: "sub_005", name: "Lakshmi Iyer", business: "Petal & Pot", category: "Plants & Botanicals", instagram: "@petalandpot", phone: "+91 90001 23456", message: "Rare succulents, air plants, custom terrariums and handmade planters.", status: "rejected", createdAt: "2025-02-28T16:45:00Z" },
  { id: "sub_006", name: "Karthik Nair", business: "Thali & Spice", category: "Artisanal Food", instagram: "@thaliandspice", phone: "+91 81234 56789", message: "Traditional Hyderabadi spice blends, pickles and homemade mithai.", status: "pending", createdAt: "2025-03-07T10:00:00Z" },
];

// ─────────────────────────────────────────────────
//  ICONS (inline SVG)
// ─────────────────────────────────────────────────
const Icon = {
  Dashboard: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Inbox: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M3 8l9 6 9-6"/><rect x="3" y="6" width="18" height="13" rx="2"/></svg>,
  Edit: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Image: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Calendar: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
  X: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Eye: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Trash: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Save: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  ChevronRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
  Users: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Tag: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Logout: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

// ─────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0F0E0C;
    --surface: #171510;
    --surface2: #1E1B17;
    --surface3: #262219;
    --border: rgba(201,168,108,0.1);
    --border2: rgba(201,168,108,0.18);
    --terracotta: #C17A5A;
    --terracotta-dim: rgba(193,122,90,0.15);
    --gold: #C9A86C;
    --gold-dim: rgba(201,168,108,0.12);
    --cream: #F5F0E8;
    --text: #E8E0D4;
    --text-muted: rgba(232,224,212,0.45);
    --text-dim: rgba(232,224,212,0.25);
    --green: #7AAB7A;
    --green-dim: rgba(122,171,122,0.15);
    --red: #C17A7A;
    --red-dim: rgba(193,122,122,0.15);
    --amber: #C9A86C;
    --amber-dim: rgba(201,168,108,0.15);
    --radius: 4px;
  }
  body { font-family: 'Jost', sans-serif; background: var(--bg); color: var(--text); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .admin-root { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--cream);
  }
  .sidebar-logo-text span { color: var(--terracotta); }
  .sidebar-logo-sub {
    font-size: .6rem; letter-spacing: .22em; text-transform: uppercase;
    color: var(--text-muted); margin-top: 3px; font-weight: 300;
  }
  .sidebar-nav { flex: 1; padding: 16px 0; overflow-y: auto; }
  .nav-section-label {
    font-size: .55rem; letter-spacing: .3em; text-transform: uppercase;
    color: var(--text-dim); padding: 12px 20px 6px; font-weight: 400;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px; cursor: pointer;
    font-size: .78rem; font-weight: 300; letter-spacing: .04em;
    color: var(--text-muted); transition: all .2s;
    border-left: 2px solid transparent;
    user-select: none;
  }
  .nav-item:hover { color: var(--text); background: var(--gold-dim); }
  .nav-item.active { color: var(--gold); border-left-color: var(--gold); background: var(--gold-dim); }
  .nav-badge {
    margin-left: auto; font-size: .6rem;
    background: var(--terracotta); color: white;
    padding: 1px 6px; border-radius: 10px; font-weight: 400;
  }
  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
  }
  .sidebar-user {
    display: flex; align-items: center; gap: 10px;
    font-size: .75rem; font-weight: 300; color: var(--text-muted);
  }
  .sidebar-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--terracotta-dim); border: 1px solid var(--terracotta);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: .85rem; color: var(--terracotta);
  }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    padding: 16px 28px; background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .topbar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 400; color: var(--cream);
  }
  .topbar-title span { color: var(--terracotta); font-style: italic; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .topbar-date {
    font-size: .65rem; letter-spacing: .18em; text-transform: uppercase;
    color: var(--text-muted); font-weight: 300;
  }

  .content { flex: 1; overflow-y: auto; padding: 28px; }

  /* ── STAT CARDS ── */
  .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 20px 22px;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card.gold::before { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .stat-card.terra::before { background: linear-gradient(90deg, transparent, var(--terracotta), transparent); }
  .stat-card.green::before { background: linear-gradient(90deg, transparent, var(--green), transparent); }
  .stat-card.amber::before { background: linear-gradient(90deg, transparent, var(--amber), transparent); }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem; font-weight: 300; line-height: 1;
    margin-bottom: 6px;
  }
  .stat-card.gold .stat-num { color: var(--gold); }
  .stat-card.terra .stat-num { color: var(--terracotta); }
  .stat-card.green .stat-num { color: var(--green); }
  .stat-card.amber .stat-num { color: var(--amber); }
  .stat-label { font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; color: var(--text-muted); font-weight: 300; }
  .stat-sub { font-size: .7rem; font-weight: 300; color: var(--text-dim); margin-top: 8px; }

  /* ── PANEL ── */
  .panel {
    background: var(--surface2); border: 1px solid var(--border);
    margin-bottom: 20px;
  }
  .panel-header {
    padding: 16px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 400; color: var(--cream);
  }
  .panel-body { padding: 22px; }

  /* ── BADGE ── */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 2px;
    font-size: .6rem; letter-spacing: .14em; text-transform: uppercase; font-weight: 400;
  }
  .badge.pending { background: var(--amber-dim); color: var(--amber); }
  .badge.approved { background: var(--green-dim); color: var(--green); }
  .badge.rejected { background: var(--red-dim); color: var(--red); }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    font-size: .58rem; letter-spacing: .25em; text-transform: uppercase;
    color: var(--text-dim); font-weight: 400; padding: 10px 14px;
    border-bottom: 1px solid var(--border); text-align: left; white-space: nowrap;
  }
  td { padding: 12px 14px; border-bottom: 1px solid rgba(201,168,108,0.06); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--gold-dim); }
  .td-name { font-size: .82rem; font-weight: 400; color: var(--cream); }
  .td-biz { font-family: 'Cormorant Garamond', serif; font-size: .95rem; color: var(--text); }
  .td-meta { font-size: .72rem; font-weight: 300; color: var(--text-muted); }
  .td-time { font-size: .65rem; font-weight: 300; color: var(--text-dim); white-space: nowrap; }

  /* ── ACTIONS ── */
  .actions { display: flex; align-items: center; gap: 6px; }
  .action-btn {
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border); background: transparent; cursor: pointer;
    color: var(--text-muted); transition: all .2s; border-radius: var(--radius);
  }
  .action-btn:hover { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }
  .action-btn.approve:hover { background: var(--green-dim); border-color: var(--green); color: var(--green); }
  .action-btn.reject:hover { background: var(--red-dim); border-color: var(--red); color: var(--red); }
  .action-btn.delete:hover { background: var(--red-dim); border-color: var(--red); color: var(--red); }

  /* ── FILTER BAR ── */
  .filter-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
  .filter-btn {
    padding: 6px 14px; border: 1px solid var(--border); background: transparent;
    font-family: 'Jost', sans-serif; font-size: .65rem; letter-spacing: .18em;
    text-transform: uppercase; color: var(--text-muted); cursor: pointer;
    transition: all .2s; border-radius: var(--radius);
  }
  .filter-btn:hover, .filter-btn.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
  .search-input {
    background: var(--surface3); border: 1px solid var(--border);
    padding: 7px 14px; font-family: 'Jost', sans-serif;
    font-size: .75rem; font-weight: 300; color: var(--text);
    outline: none; min-width: 200px; border-radius: var(--radius);
    transition: border-color .2s;
  }
  .search-input::placeholder { color: var(--text-dim); }
  .search-input:focus { border-color: var(--gold); }

  /* ── FORM FIELDS ── */
  .field-group { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
  .field-label {
    font-size: .58rem; letter-spacing: .28em; text-transform: uppercase;
    color: var(--terracotta); font-weight: 400;
  }
  .field-input, .field-textarea, .field-select {
    background: var(--surface3); border: 1px solid var(--border);
    padding: 10px 14px; font-family: 'Jost', sans-serif;
    font-size: .82rem; font-weight: 300; color: var(--text);
    outline: none; transition: border-color .2s; border-radius: var(--radius);
    width: 100%;
  }
  .field-input::placeholder, .field-textarea::placeholder { color: var(--text-dim); }
  .field-input:focus, .field-textarea:focus, .field-select:focus { border-color: var(--gold); }
  .field-textarea { resize: vertical; min-height: 80px; }
  .field-select { appearance: none; cursor: pointer; }
  .field-select option { background: #222; }

  /* ── GRID LAYOUTS ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* ── SAVE BTN ── */
  .save-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--terracotta); color: white;
    font-family: 'Jost', sans-serif; font-size: .68rem;
    letter-spacing: .2em; text-transform: uppercase;
    padding: 12px 28px; border: none; cursor: pointer;
    transition: background .3s; border-radius: var(--radius);
    font-weight: 400;
  }
  .save-btn:hover { background: #9A5B3C; }
  .save-btn.success { background: #5A8A5A; }
  .secondary-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: var(--text-muted);
    font-family: 'Jost', sans-serif; font-size: .68rem;
    letter-spacing: .2em; text-transform: uppercase;
    padding: 12px 24px; border: 1px solid var(--border); cursor: pointer;
    transition: all .2s; border-radius: var(--radius);
  }
  .secondary-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* ── IMAGE CARDS ── */
  .img-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .img-card { background: var(--surface3); border: 1px solid var(--border); overflow: hidden; }
  .img-preview { height: 140px; overflow: hidden; position: relative; }
  .img-preview img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.85); }
  .img-card-body { padding: 12px 14px; }
  .img-card-label {
    font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 8px; font-weight: 300;
  }
  .img-input {
    background: var(--surface); border: 1px solid var(--border);
    padding: 8px 10px; font-family: 'Jost', sans-serif;
    font-size: .72rem; font-weight: 300; color: var(--text);
    outline: none; width: 100%; transition: border-color .2s;
    border-radius: var(--radius);
  }
  .img-input:focus { border-color: var(--gold); }
  .img-input::placeholder { color: var(--text-dim); }

  /* ── MARQUEE EDITOR ── */
  .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .tag-item {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--gold-dim); border: 1px solid rgba(201,168,108,.25);
    padding: 5px 12px; font-size: .72rem; font-weight: 300;
    color: var(--gold); border-radius: var(--radius);
  }
  .tag-remove {
    background: none; border: none; cursor: pointer;
    color: var(--gold); opacity: .6; padding: 0; line-height: 1;
    transition: opacity .2s; display: flex; align-items: center;
  }
  .tag-remove:hover { opacity: 1; }
  .tag-add { display: flex; gap: 8px; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 20px;
  }
  .modal {
    background: var(--surface2); border: 1px solid var(--border2);
    width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto;
  }
  .modal-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    position: sticky; top: 0; background: var(--surface2); z-index: 1;
  }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--cream); }
  .modal-close {
    background: none; border: none; color: var(--text-muted); cursor: pointer;
    font-size: 1.3rem; line-height: 1; transition: color .2s;
  }
  .modal-close:hover { color: var(--terracotta); }
  .modal-body { padding: 22px; }
  .modal-field { margin-bottom: 14px; }
  .modal-field-label { font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 5px; }
  .modal-field-val { font-size: .85rem; font-weight: 300; color: var(--text); line-height: 1.7; }
  .modal-divider { height: 1px; background: var(--border); margin: 16px 0; }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--surface2); border: 1px solid var(--border2);
    padding: 12px 20px; z-index: 2000;
    font-size: .78rem; font-weight: 300; color: var(--text);
    display: flex; align-items: center; gap: 10px;
    animation: toastIn .3s ease;
    border-radius: var(--radius);
  }
  .toast.success { border-left: 3px solid var(--green); }
  .toast.error { border-left: 3px solid var(--red); }
  @keyframes toastIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }

  /* ── SECTION TABS ── */
  .section-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 22px; }
  .section-tab {
    padding: 10px 20px; font-size: .68rem; letter-spacing: .18em;
    text-transform: uppercase; color: var(--text-muted); cursor: pointer;
    border-bottom: 2px solid transparent; transition: all .2s; font-weight: 300;
  }
  .section-tab:hover { color: var(--text); }
  .section-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* ── EMPTY STATE ── */
  .empty { text-align: center; padding: 48px 24px; }
  .empty-icon { font-size: 3rem; margin-bottom: 12px; opacity: .3; }
  .empty-text { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--text-muted); }
  .empty-sub { font-size: .75rem; color: var(--text-dim); margin-top: 6px; font-weight: 300; }

  /* ── DETAIL ROW ── */
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(201,168,108,.06); }
  .detail-row:last-child { border-bottom: none; }
  .detail-key { font-size: .65rem; letter-spacing: .18em; text-transform: uppercase; color: var(--text-dim); font-weight: 300; }
  .detail-val { font-size: .82rem; font-weight: 300; color: var(--text); }

  /* ── QUICK ACTIONS ── */
  .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .quick-card {
    background: var(--surface3); border: 1px solid var(--border);
    padding: 16px 18px; cursor: pointer;
    display: flex; align-items: center; gap: 12px;
    transition: all .2s; border-radius: var(--radius);
  }
  .quick-card:hover { border-color: var(--gold); background: var(--gold-dim); }
  .quick-icon { color: var(--gold); flex-shrink: 0; }
  .quick-label { font-size: .78rem; font-weight: 300; color: var(--text); }
  .quick-sub { font-size: .65rem; color: var(--text-muted); margin-top: 2px; font-weight: 300; }

  /* ── ACTIVITY FEED ── */
  .activity-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(201,168,108,.06); }
  .activity-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .activity-dot.green { background: var(--green); }
  .activity-dot.terra { background: var(--terracotta); }
  .activity-dot.gold { background: var(--gold); }
  .activity-text { font-size: .78rem; font-weight: 300; color: var(--text); line-height: 1.5; }
  .activity-time { font-size: .65rem; color: var(--text-dim); margin-top: 2px; }
`;

// ─────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}
function fmtShort(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
}
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return [toast, show];
}

// ─────────────────────────────────────────────────
//  DASHBOARD TAB
// ─────────────────────────────────────────────────
function DashboardTab({ submissions, onNav }) {
  const pending = submissions.filter(s => s.status === 'pending').length;
  const approved = submissions.filter(s => s.status === 'approved').length;
  const recent = [...submissions].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);

  return (
    <div>
      <div className="stats-row">
        <div className="stat-card gold">
          <div className="stat-num">{submissions.length}</div>
          <div className="stat-label">Total Applications</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card terra">
          <div className="stat-num">{pending}</div>
          <div className="stat-label">Pending Review</div>
          <div className="stat-sub">Awaiting decision</div>
        </div>
        <div className="stat-card green">
          <div className="stat-num">{approved}</div>
          <div className="stat-label">Approved Vendors</div>
          <div className="stat-sub">Confirmed for next edition</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-num">38</div>
          <div className="stat-label">Stalls Available</div>
          <div className="stat-sub">April 18, 2026</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'16px' }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Recent Applications</span>
            <button className="filter-btn" onClick={() => onNav('submissions')}>View All</button>
          </div>
          <div className="panel-body" style={{padding:0}}>
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Vendor</th><th>Category</th><th>Date</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {recent.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="td-biz">{s.business}</div>
                        <div className="td-meta">{s.name}</div>
                      </td>
                      <td><div className="td-meta">{s.category}</div></td>
                      <td><div className="td-time">{fmtShort(s.createdAt)}</div></td>
                      <td><span className={`badge ${s.status}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Quick Actions</span></div>
            <div className="panel-body">
              <div className="quick-actions">
                <div className="quick-card" onClick={() => onNav('submissions')}>
                  <span className="quick-icon"><Icon.Inbox /></span>
                  <div><div className="quick-label">Review Applications</div><div className="quick-sub">{pending} pending</div></div>
                </div>
                <div className="quick-card" onClick={() => onNav('content')}>
                  <span className="quick-icon"><Icon.Edit /></span>
                  <div><div className="quick-label">Edit Content</div><div className="quick-sub">Hero, About, Edition</div></div>
                </div>
                <div className="quick-card" onClick={() => onNav('images')}>
                  <span className="quick-icon"><Icon.Image /></span>
                  <div><div className="quick-label">Change Images</div><div className="quick-sub">9 images managed</div></div>
                </div>
                <div className="quick-card" onClick={() => onNav('edition')}>
                  <span className="quick-icon"><Icon.Calendar /></span>
                  <div><div className="quick-label">Edition Details</div><div className="quick-sub">Apr 18, 2026</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><span className="panel-title">Activity</span></div>
            <div className="panel-body" style={{paddingTop:8, paddingBottom:8}}>
              {recent.slice(0,4).map((s,i) => (
                <div className="activity-item" key={s.id}>
                  <div className={`activity-dot ${s.status==='approved'?'green':s.status==='rejected'?'terra':'gold'}`}/>
                  <div>
                    <div className="activity-text"><strong style={{color:'var(--cream)'}}>{s.business}</strong> applied as vendor</div>
                    <div className="activity-time">{fmtShort(s.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  SUBMISSIONS TAB
// ─────────────────────────────────────────────────
function SubmissionsTab({ submissions, onUpdate, showToast }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = submissions.filter(s => {
    const matchStatus = filter === 'all' || s.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.business.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }).sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));

  const changeStatus = (id, status) => {
    onUpdate(id, { status });
    showToast(`Application ${status}`, status === 'approved' ? 'success' : 'error');
    if (selected?.id === id) setSelected(prev => ({...prev, status}));
  };
  const deleteItem = (id) => {
    onUpdate(id, null);
    showToast('Application deleted');
    setSelected(null);
  };

  const counts = { all: submissions.length, pending: submissions.filter(s=>s.status==='pending').length, approved: submissions.filter(s=>s.status==='approved').length, rejected: submissions.filter(s=>s.status==='rejected').length };

  return (
    <div>
      <div className="filter-bar">
        {['all','pending','approved','rejected'].map(f => (
          <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
            {f} {counts[f] > 0 && <span style={{opacity:.7}}>({counts[f]})</span>}
          </button>
        ))}
        <input className="search-input" placeholder="Search vendor, business, category…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Vendor Applications</span>
          <span style={{fontSize:'.7rem',color:'var(--text-muted)',fontWeight:300}}>{filtered.length} result{filtered.length!==1?'s':''}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div className="empty-text">No applications found</div>
            <div className="empty-sub">Try changing filters or search terms</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Business</th><th>Contact</th><th>Category</th><th>Instagram</th><th>Date</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="td-biz">{s.business}</div>
                      <div className="td-meta">{s.name}</div>
                    </td>
                    <td><div className="td-meta">{s.phone}</div></td>
                    <td><div className="td-meta">{s.category}</div></td>
                    <td><div className="td-meta" style={{color:'var(--terracotta)'}}>{s.instagram}</div></td>
                    <td><div className="td-time">{fmtDate(s.createdAt)}</div></td>
                    <td><span className={`badge ${s.status}`}>{s.status}</span></td>
                    <td>
                      <div className="actions">
                        <button className="action-btn" title="View Details" onClick={()=>setSelected(s)}><Icon.Eye /></button>
                        {s.status !== 'approved' && <button className="action-btn approve" title="Approve" onClick={()=>changeStatus(s.id,'approved')}><Icon.Check /></button>}
                        {s.status !== 'rejected' && <button className="action-btn reject" title="Reject" onClick={()=>changeStatus(s.id,'rejected')}><Icon.X /></button>}
                        <button className="action-btn delete" title="Delete" onClick={()=>deleteItem(s.id)}><Icon.Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{selected.business}</div>
              <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <span className={`badge ${selected.status}`}>{selected.status}</span>
                <span style={{fontSize:'.65rem',color:'var(--text-dim)'}}>ID: {selected.id}</span>
              </div>
              {[['Applicant Name', selected.name],['Business Name',selected.business],['Category',selected.category],['Instagram',selected.instagram],['Phone',selected.phone],['Applied On',fmtDate(selected.createdAt)]].map(([k,v])=>(
                <div className="detail-row" key={k}>
                  <span className="detail-key">{k}</span>
                  <span className="detail-val" style={k==='Instagram'?{color:'var(--terracotta)'}:{}}>{v}</span>
                </div>
              ))}
              <div className="modal-divider"/>
              <div className="modal-field">
                <div className="modal-field-label">About their products</div>
                <div className="modal-field-val">{selected.message}</div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:18}}>
                {selected.status!=='approved'&&<button className="save-btn" onClick={()=>changeStatus(selected.id,'approved')}><Icon.Check />Approve</button>}
                {selected.status!=='rejected'&&<button className="secondary-btn" onClick={()=>changeStatus(selected.id,'rejected')}><Icon.X />Reject</button>}
                <button className="secondary-btn" style={{marginLeft:'auto',borderColor:'var(--red)',color:'var(--red)'}} onClick={()=>deleteItem(selected.id)}><Icon.Trash />Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
//  CONTENT EDITOR TAB
// ─────────────────────────────────────────────────
function ContentTab({ content, onChange, showToast }) {
  const [tab, setTab] = useState('hero');
  const [local, setLocal] = useState(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setLocal(content); }, [content]);

  const set = (section, key, val) => setLocal(p => ({ ...p, [section]: { ...p[section], [key]: val } }));
  const setMarquee = (val) => setLocal(p => ({ ...p, marquee: val }));
  const [newTag, setNewTag] = useState('');

  const save = async () => {
    setSaving(true);
    await onChange(local);
    setTimeout(() => { setSaving(false); showToast('Content saved successfully!'); }, 500);
  };

  const addTag = () => {
    if (newTag.trim()) { setMarquee([...local.marquee, newTag.trim()]); setNewTag(''); }
  };
  const removeTag = (i) => setMarquee(local.marquee.filter((_,idx)=>idx!==i));

  const tabs = ['hero','about','marquee'];

  return (
    <div>
      <div className="section-tabs">
        {tabs.map(t=><div key={t} className={`section-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</div>)}
      </div>

      {tab === 'hero' && (
        <div className="panel">
          <div className="panel-header"><span className="panel-title">Hero Section</span></div>
          <div className="panel-body">
            <div className="field-group">
              <label className="field-label">Eyebrow Text</label>
              <input className="field-input" value={local.hero.eyebrow} onChange={e=>set('hero','eyebrow',e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Main Title</label>
              <input className="field-input" value={local.hero.title} onChange={e=>set('hero','title',e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Italic Word (highlighted in terracotta)</label>
              <input className="field-input" value={local.hero.titleItalic} onChange={e=>set('hero','titleItalic',e.target.value)} placeholder="Word to italicize & highlight" />
            </div>
            <div className="field-group">
              <label className="field-label">Description</label>
              <textarea className="field-textarea" value={local.hero.description} onChange={e=>set('hero','description',e.target.value)} style={{minHeight:90}} />
            </div>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="panel">
          <div className="panel-header"><span className="panel-title">About Section</span></div>
          <div className="panel-body">
            <div className="field-group">
              <label className="field-label">Section Title</label>
              <input className="field-input" value={local.about.title} onChange={e=>set('about','title',e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Body Text</label>
              <textarea className="field-textarea" value={local.about.body} onChange={e=>set('about','body',e.target.value)} style={{minHeight:140}} />
            </div>
            <div className="grid-2">
              <div className="field-group">
                <label className="field-label">Stat Number</label>
                <input className="field-input" value={local.about.statNumber} onChange={e=>set('about','statNumber',e.target.value)} placeholder="e.g. 40+" />
              </div>
              <div className="field-group">
                <label className="field-label">Stat Label</label>
                <input className="field-input" value={local.about.statLabel} onChange={e=>set('about','statLabel',e.target.value)} placeholder="e.g. Curated Stalls" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'marquee' && (
        <div className="panel">
          <div className="panel-header"><span className="panel-title">Scrolling Marquee Tags</span></div>
          <div className="panel-body">
            <div style={{marginBottom:16, fontSize:'.75rem', color:'var(--text-muted)', fontWeight:300, lineHeight:1.7}}>
              These tags scroll across the terracotta band below the hero. Add, remove or reorder them.
            </div>
            <div className="tag-list">
              {local.marquee.map((tag, i) => (
                <span key={i} className="tag-item">
                  {tag}
                  <button className="tag-remove" onClick={()=>removeTag(i)}><Icon.X /></button>
                </span>
              ))}
            </div>
            <div className="tag-add">
              <input className="field-input" style={{flex:1}} placeholder="Add new tag…" value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTag()} />
              <button className="save-btn" onClick={addTag}>+ Add</button>
            </div>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:10,marginTop:8}}>
        <button className={`save-btn ${saving?'success':''}`} onClick={save}>
          <Icon.Save />{saving?'Saved!':'Save Changes'}
        </button>
        <button className="secondary-btn" onClick={()=>setLocal(content)}>Discard</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  IMAGES TAB
// ─────────────────────────────────────────────────
function ImagesTab({ content, onChange, showToast }) {
  const [imgs, setImgs] = useState(content.images);
  const [saving, setSaving] = useState(false);

  useEffect(()=>setImgs(content.images),[content.images]);

  const setImg = (key, val) => setImgs(p => ({...p, [key]: val}));

  const save = async () => {
    setSaving(true);
    await onChange({ ...content, images: imgs });
    setTimeout(()=>{ setSaving(false); showToast('Images updated!'); }, 500);
  };

  const imageSlots = [
    { key: 'hero1', label: 'Hero Mosaic — Top Left' },
    { key: 'hero2', label: 'Hero Mosaic — Top Right' },
    { key: 'hero3', label: 'Hero Mosaic — Mid Right' },
    { key: 'hero4', label: 'Hero Mosaic — Bottom Banner' },
    { key: 'about', label: 'About Section — Main Photo' },
    { key: 'gallery1', label: 'Gallery Strip — Photo 1' },
    { key: 'gallery2', label: 'Gallery Strip — Photo 2' },
    { key: 'gallery3', label: 'Gallery Strip — Photo 3' },
    { key: 'gallery4', label: 'Gallery Strip — Photo 4' },
  ];

  return (
    <div>
      <div style={{marginBottom:20, fontSize:'.8rem', color:'var(--text-muted)', fontWeight:300, lineHeight:1.7}}>
        Paste any image URL (Unsplash, CDN, hosted image) to update the website photos. Preview updates in real-time.
      </div>
      <div className="img-grid">
        {imageSlots.map(({ key, label }) => (
          <div className="img-card" key={key}>
            <div className="img-preview">
              {imgs[key] ? <img src={imgs[key]} alt={label} onError={e=>e.target.style.display='none'} /> : (
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-dim)',fontSize:'.75rem'}}>No image</div>
              )}
            </div>
            <div className="img-card-body">
              <div className="img-card-label">{label}</div>
              <input className="img-input" value={imgs[key]||''} onChange={e=>setImg(key,e.target.value)} placeholder="Paste image URL…" />
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:10,marginTop:20}}>
        <button className={`save-btn ${saving?'success':''}`} onClick={save}>
          <Icon.Save />{saving?'Saved!':'Save All Images'}
        </button>
        <button className="secondary-btn" onClick={()=>setImgs(content.images)}>Discard</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  EDITION TAB
// ─────────────────────────────────────────────────
function EditionTab({ content, onChange, showToast }) {
  const [local, setLocal] = useState(content.edition);
  const [saving, setSaving] = useState(false);

  useEffect(()=>setLocal(content.edition),[content.edition]);
  const set = (key, val) => setLocal(p=>({...p,[key]:val}));

  const save = async () => {
    setSaving(true);
    await onChange({ ...content, edition: local });
    setTimeout(()=>{ setSaving(false); showToast('Edition details saved!'); }, 500);
  };

  const fields = [
    ['date', 'Display Date', 'e.g. April 18, 2026'],
    ['fullLocation', 'Full Location Line', 'e.g. Raheja Mindspace · Madhapur, Hyderabad'],
    ['theme', 'Edition Theme Name', 'e.g. The Summer Edit'],
    ['day', 'Day & Date (short)', 'e.g. Saturday, April 18'],
    ['timing', 'Timings', 'e.g. 10 AM – 6 PM'],
    ['location', 'Location (short)', 'e.g. Mindspace, Madhapur'],
    ['stalls', 'Stalls Available', 'e.g. 38 Curated Spots'],
    ['entry', 'Entry Details', 'e.g. Free · All Welcome'],
  ];

  return (
    <div>
      <div className="panel">
        <div className="panel-header"><span className="panel-title">Next Edition Details</span></div>
        <div className="panel-body">
          <div className="grid-2">
            {fields.map(([key, label, placeholder]) => (
              <div className="field-group" key={key}>
                <label className="field-label">{label}</label>
                <input className="field-input" value={local[key]||''} onChange={e=>set(key,e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span className="panel-title">Preview</span></div>
        <div className="panel-body">
          {[['Theme', local.theme],['Date', local.date],['Timing', local.timing],['Location', local.location],['Stalls', local.stalls],['Entry', local.entry]].map(([k,v])=>(
            <div className="detail-row" key={k}>
              <span className="detail-key">{k}</span>
              <span className="detail-val" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.05rem'}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',gap:10}}>
        <button className={`save-btn ${saving?'success':''}`} onClick={save}><Icon.Save />{saving?'Saved!':'Save Edition'}</button>
        <button className="secondary-btn" onClick={()=>setLocal(content.edition)}>Discard</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState(DEMO_SUBMISSIONS);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [toast, showToast] = useToast();

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      const savedSubs = await S.get('tcc-submissions');
      const savedContent = await S.get('tcc-content');
      if (savedSubs) setSubmissions(savedSubs);
      else { setSubmissions(DEMO_SUBMISSIONS); await S.set('tcc-submissions', DEMO_SUBMISSIONS); }
      if (savedContent) setContent(savedContent);
      setLoading(false);
    })();
  }, []);

  const updateSubmission = async (id, patch) => {
    const updated = patch === null
      ? submissions.filter(s => s.id !== id)
      : submissions.map(s => s.id === id ? { ...s, ...patch } : s);
    setSubmissions(updated);
    await S.set('tcc-submissions', updated);
  };

  const updateContent = async (newContent) => {
    setContent(newContent);
    await S.set('tcc-content', newContent);
  };

  const pending = submissions.filter(s => s.status === 'pending').length;

  const navItems = [
    { id:'dashboard', label:'Overview', Icon: Icon.Dashboard },
    { id:'submissions', label:'Applications', Icon: Icon.Inbox, badge: pending > 0 ? pending : null },
    { id:'content', label:'Edit Content', Icon: Icon.Edit },
    { id:'images', label:'Manage Images', Icon: Icon.Image },
    { id:'edition', label:'Edition Details', Icon: Icon.Calendar },
  ];

  const titles = {
    dashboard: <span>Good morning, <span>Admin</span></span>,
    submissions: <span>Vendor <span>Applications</span></span>,
    content: <span>Content <span>Editor</span></span>,
    images: <span>Image <span>Manager</span></span>,
    edition: <span>Edition <span>Details</span></span>,
  };

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--bg)',fontFamily:"'Cormorant Garamond',serif",color:'var(--text-muted)',fontSize:'1.2rem',letterSpacing:'.1em'}}>
      Loading…
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="admin-root">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-text">The Courtyard <span>Co.</span></div>
            <div className="sidebar-logo-sub">Admin Dashboard</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            {navItems.map(({ id, label, Icon: I, badge }) => (
              <div key={id} className={`nav-item ${tab===id?'active':''}`} onClick={()=>setTab(id)}>
                <I />
                <span>{label}</span>
                {badge && <span className="nav-badge">{badge}</span>}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">A</div>
              <div>
                <div style={{color:'var(--text)',fontSize:'.78rem'}}>Admin</div>
                <div style={{fontSize:'.62rem'}}>Courtyard Co.</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{titles[tab]}</div>
            <div className="topbar-right">
              <span className="topbar-date">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
            </div>
          </div>

          <div className="content">
            {tab === 'dashboard' && <DashboardTab submissions={submissions} onNav={setTab} />}
            {tab === 'submissions' && <SubmissionsTab submissions={submissions} onUpdate={updateSubmission} showToast={showToast} />}
            {tab === 'content' && <ContentTab content={content} onChange={updateContent} showToast={showToast} />}
            {tab === 'images' && <ImagesTab content={content} onChange={updateContent} showToast={showToast} />}
            {tab === 'edition' && <EditionTab content={content} onChange={updateContent} showToast={showToast} />}
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type==='success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </>
  );
}
