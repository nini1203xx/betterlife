// store.js — Cấu trúc dữ liệu, đọc/ghi localStorage

/* ===== DỮ LIỆU: khóa luôn là ngày dạng "2026-11-21" =====
   ev = lịch hẹn [{id,t,time,rm,done}]   td = việc [{id,t,s}]  (s: 0 chờ, 1 đang làm, 2 xong)
   note / diary = văn bản   mood = 0..4   quick = quick note chung */
const KEY='forest-lich-v1';

let db={
  ev:{},
  td:{},
  note:{},
  diary:{},
  mood:{},
  quick:'',
  rep:[]
};

try{
  const r=localStorage.getItem(KEY);
  if(r) db=Object.assign(db,JSON.parse(r))
}catch(e){}

const save=()=>{
  try{
    localStorage.setItem(KEY,JSON.stringify(db))
  }catch(e){}
};
