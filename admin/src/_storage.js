import { useState, useEffect, useRef } from "react";

// ── Persistent storage helpers (localStorage) ──
const S = {
  async get(key) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch { return null; }
  },
  async set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
  },
};
