// utils.js — Hàm nhỏ dùng chung ($, ngày tháng, esc...)

/* ===== HÀM TIỆN ÍCH ===== */
const $=s=>document.querySelector(s);
const pad=n=>String(n).padStart(2,'0');
const ks=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const byTime=(a,b)=>(a.time||'99').localeCompare(b.time||'99');
const st=x=>x.s||0;
