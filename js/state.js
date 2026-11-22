// state.js — Trạng thái hiện tại (ngày chọn, tab...) và hằng số

/* ===== TRẠNG THÁI ===== */
let view=new Date();view.setDate(1);
let sel=ks(new Date()),tab='all',flt='all';
const NAV=[['all','✅','Việc cần làm'],['ev','🗓️','Lịch hẹn'],['note','📝','Ghi chú'],['diary','📖','Nhật ký']];
const FL=[['all','Tất cả'],['td','Việc'],['ev','Hẹn'],['nt','Nhật ký']];
const SN=['Chờ làm','Đang làm','Xong'];
const MOODS=['😞','😕','😐','🙂','😄'];
