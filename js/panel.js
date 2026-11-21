// panel.js — Panel trái: việc, lịch hẹn, ghi chú, nhật ký

/* ===== PANEL TRÁI ===== */
function drawPanel(){
  const p=$('#panel'),d=new Date(sel+'T00:00');
  const thu=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'][d.getDay()];
  const head=`<h2>${thu}, ${d.getDate()}/${d.getMonth()+1}</h2><div class="mut">${NAV.find(n=>n[0]===tab)[2]}</div>`;

  if(tab==='td'||tab==='ev'){
    const store=db[tab],arr=store[sel]=store[sel]||[],isEv=tab==='ev';
    if(isEv)arr.sort(byTime);
    let body='';
    if(!arr.length)body='<p class="mut" style="margin-top:16px">Chưa có gì cho ngày này.</p>';
    else if(isEv)body=arr.map(x=>`<div class="card2${x.done?' dn':''}"><button class="st ${x.done?'s2':'s0'}" data-s="${x.id}" title="Đánh dấu xong"></button>${x.time?`<b class="tm">${x.time}</b>`:''}<span>${esc(x.t)}</span><button class="x" data-d="${x.id}">✕</button></div>`).join('');
    else body=[0,1,2].map(s=>{
      const l=arr.filter(x=>st(x)===s);if(!l.length)return '';
      return `<h3><i class="dot s${s}"></i>${SN[s]} <span>· ${l.length}</span></h3>`+
        l.map(x=>`<div class="card2${s===2?' dn':''}"><button class="st s${s}" data-s="${x.id}" title="Bấm để đổi trạng thái"></button><span>${esc(x.t)}</span><button class="x" data-d="${x.id}">✕</button></div>`).join('');
    }).join('');
    p.innerHTML=head+`<div class="row"><input type="text" id="in" placeholder="${isEv?'Tên sự kiện / lời nhắc…':'Thêm việc cần làm…'}">
      ${isEv?`<input type="time" id="tm"><select id="rm"><option value="0">Đúng giờ</option><option value="10">Trước 10p</option><option value="30">Trước 30p</option><option value="60">Trước 1h</option></select>`:''}
      <button class="pri" id="add">Thêm</button></div>`+body;

    const add=()=>{const t=$('#in').value.trim();if(!t)return;
      const o={id:uid(),t};
      if(isEv){o.time=$('#tm').value;o.rm=+$('#rm').value;o.done=false}else o.s=0;
      arr.push(o);save();drawAll()};
    $('#add').onclick=add;$('#in').onkeydown=e=>{if(e.key==='Enter')add()};
    // bấm chấm tròn: đổi trạng thái (việc: chờ → đang làm → xong → chờ)
    p.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{
      const x=arr.find(i=>i.id===b.dataset.s);
      if(isEv)x.done=!x.done;else x.s=(st(x)+1)%3;
      save();drawAll()});
    p.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{store[sel]=arr.filter(i=>i.id!==b.dataset.d);save();drawAll()});
  }else{
    const isD=tab==='diary';
    p.innerHTML=head+(isD?`<div class="mood"><span class="mut">Hôm nay bạn thấy sao?</span>${MOODS.map((m,i)=>`<button data-m="${i}" class="${db.mood[sel]===i?'on':''}">${m}</button>`).join('')}</div>`:'<div style="height:12px"></div>')+
      `<textarea id="ta" placeholder="${isD?'Viết nhật ký ngày hôm nay…':'Ghi chú cho ngày này…'}">${esc(db[tab][sel]||'')}</textarea><div class="mut" id="sv">Tự động lưu</div>`;
    let tm;
    $('#ta').oninput=e=>{db[tab][sel]=e.target.value;clearTimeout(tm);tm=setTimeout(()=>{save();drawCal();$('#sv').textContent='Đã lưu ✓'},400)};
    p.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{db.mood[sel]=+b.dataset.m;save();drawPanel();drawCal()});
  }
}
