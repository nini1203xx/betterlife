// calendar.js — Vẽ lịch tháng và các chip màu

/* ===== CÁC "CHIP" MÀU TRONG Ô LỊCH ===== */
function chips(k){
  const a=[],all=flt==='all';
  dayItems(k).forEach(it=>{
    if(!(all||flt===it.type))return;
    a.push(`<div class="chip ${it.type==='ev'?'ev':'s0'}${it.done?' dn':''}">${it.time?it.time+' ':''}${esc(it.t)}</div>`);
  });
   if((all||flt==='note')&&(db.note[k]||'').trim())a.push('<div class="chip nt">📝 Ghi chú</div>');
  if((all||flt==='diary')&&(db.diary[k]||'').trim())a.push(`<div class="chip nt">📖 Nhật ký ${db.mood[k]!=null?MOODS[db.mood[k]]:''}</div>`);
  return a;
}

/* ===== VẼ LỊCH ===== */
function drawCal(){
  const y=view.getFullYear(),m=view.getMonth();
  const mx=(innerWidth>1000&&innerHeight<820)?1:2;   // màn hình thấp: mỗi ô chỉ hiện 1 chip
  $('#title').textContent='Tháng '+(m+1)+', '+y;
  const off=(new Date(y,m,1).getDay()+6)%7,start=new Date(y,m,1-off),t=ks(new Date());
  let h='';
  for(let i=0;i<42;i++){
    const d=new Date(start);d.setDate(start.getDate()+i);
    if(i%7===0)h+=`<div class="wk">${isoWeek(d)}</div>`;
    const k=ks(d),c=chips(k),L=lunarOf(d),H=holidayOf(d);
    if(H)c.unshift(`<div class="chip hol">${esc(H.t)}</div>`);
    h+=`<div class="cell${d.getMonth()!==m?' out':''}${k===t?' today':''}${k===sel?' sel':''}" data-k="${k}">
      <span class="dn0${d.getDay()===0||(H&&H.off)?' red':''}">${d.getDate()}</span><div class="lun">${L.d}/${L.m}${L.leap?'n':''}</div>${c.slice(0,mx).join('')}${c.length>mx?`<span class="more">+${c.length-mx}</span>`:''}</div>`;
  }
  $('#grid').innerHTML=h;
  document.querySelectorAll('.cell').forEach(el=>el.onclick=()=>{
    sel=el.dataset.k;const d=new Date(sel+'T00:00');
    if(d.getMonth()!==view.getMonth())view=new Date(d.getFullYear(),d.getMonth(),1);
    drawAll();
  });
}
