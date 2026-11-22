// panel.js — Thanh chi tiết ngày (nằm ngang dưới lịch): việc, lịch hẹn, ghi chú, nhật ký

function drawPanel(){
  const p=$('#panel'),d=new Date(sel+'T00:00');
  const thu=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'][d.getDay()];
  const head=`<h2>${thu}, ${d.getDate()}/${d.getMonth()+1}</h2><div class="mut">${NAV.find(n=>n[0]===tab)[2]} · Âm lịch ${lunarOf(d).d}/${lunarOf(d).m}${holidayOf(d)?' · '+esc(holidayOf(d).t):''}</div>

  if(tab==='td'||tab==='ev'){
    const store=db[tab],arr=store[sel]=store[sel]||[],isEv=tab==='ev';
    if(isEv)arr.sort(byTime);

    // Phần phải (danh sách): lịch hẹn = hàng thẻ ngang; việc = 3 cột theo trạng thái
    let body='';
    const cls='list';
    const dn=x=>isEv?x.done:st(x)===2;   // đã xong?
    if(!arr.length)body='<p class="mut">Chưa có gì cho ngày này.</p>';
    else body=arr.map(x=>`<div class="card2${dn(x)?' dn':''}"><button class="st ${dn(x)?'s2':'s0'}" data-s="${x.id}" title="Đánh dấu xong"></button>${x.time?`<b class="tm">${x.time}</b>`:''}<span title="${esc(x.t)}">${esc(x.t)}</span><button class="x" data-d="${x.id}">✕</button></div>`).join('');
   

    // Phần trái: tiêu đề + ô thêm mới
    p.innerHTML=`<div class="phead">${head}<div class="row"><input type="text" id="in" placeholder="${isEv?'Tên sự kiện / lời nhắc…':'Thêm việc cần làm…'}">
      ${isEv?`<input type="time" id="tm"><select id="rm"><option value="0">Đúng giờ</option><option value="10">Trước 10p</option><option value="30">Trước 30p</option><option value="60">Trước 1h</option></select>`:''}
      <button class="pri" id="add">Thêm</button></div></div><div class="strip ${cls}">${body}</div>`;

    const add=()=>{const t=$('#in').value.trim();if(!t)return;
      const o={id:uid(),t};
      if(isEv){o.time=$('#tm').value;o.rm=+$('#rm').value;o.done=false}else o.s=0;
      arr.push(o);save();drawAll()};
    $('#add').onclick=add;$('#in').onkeydown=e=>{if(e.key==='Enter')add()};
    // bấm chấm tròn: đổi trạng thái (việc: chờ → đang làm → xong → chờ)
    p.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{
      const x=arr.find(i=>i.id===b.dataset.s);
      if(isEv)x.done=!x.done;else x.s=st(x)===2?0:2;
      save();drawAll()});
    p.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{store[sel]=arr.filter(i=>i.id!==b.dataset.d);save();drawAll()});
  }else{
    const isD=tab==='diary';
    p.innerHTML=`<div class="phead">${head}`+(isD?`<div class="mood"><span class="mut">Hôm nay bạn thấy sao?</span>${MOODS.map((m,i)=>`<button data-m="${i}" class="${db.mood[sel]===i?'on':''}">${m}</button>`).join('')}</div>`:'')+
      `<div class="mut" id="sv">Tự động lưu</div></div><div class="strip" style="display:block"><textarea id="ta" placeholder="${isD?'Viết nhật ký ngày hôm nay…':'Ghi chú cho ngày này…'}">${esc(db[tab][sel]||'')}</textarea></div>`;
    let tm;
    $('#ta').oninput=e=>{db[tab][sel]=e.target.value;clearTimeout(tm);tm=setTimeout(()=>{save();drawCal();$('#sv').textContent='Đã lưu ✓'},400)};
    p.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{db.mood[sel]=+b.dataset.m;save();drawPanel();drawCal()});
  }
}
