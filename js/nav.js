// nav.js — Thanh bên và bộ lọc

/* ===== THANH BÊN + BỘ LỌC ===== */
function drawNav(){
  $('#nav').innerHTML=NAV.map(([k,i,l])=>`<button class="nav${k===tab?' on':''}" data-t="${k}">${i} ${l}</button>`).join('');
  document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;flt=tab;drawNav();drawCal();drawPanel()});
  $('#flt').innerHTML=FL.map(([k,l])=>`<button class="${k===flt?'on':''}" data-f="${k}">${l}</button>`).join('');
  document.querySelectorAll('#flt button').forEach(b=>b.onclick=()=>{flt=b.dataset.f;tab=(flt==='note'||flt==='diary')?flt:'all';drawNav();drawCal();drawPanel()});
}
