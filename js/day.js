// day.js — Tab "Trong ngày": xem và thêm mọi thứ của ngày đang chọn
let multi=[];   // các ngày đã chọn khi dùng chế độ "Nhiều ngày"

function drawDay(p,head){
  const k=sel,items=dayItems(k);multi=[];
  const card=it=>`<div class="card2${it.done?' dn':''}"><button class="st ${it.done?'s2':'s0'}" data-s="${it.src}|${it.id}" title="Đánh dấu xong"></button>${it.time?`<b class="tm">${it.time}</b>`:''}<span title="${esc(it.t)}">${it.src==='rep'?'↻ ':''}${esc(it.t)}</span><button class="x" data-d="${it.src}|${it.id}">✕</button></div>`;
  const notes=[['note','📝',db.note[k]],['diary','📖',db.diary[k]]].filter(n=>(n[2]||'').trim())
    .map(n=>`<div class="card2" data-go="${n[0]}" style="cursor:pointer"><span>${n[1]} ${esc(n[2].trim().slice(0,40))}</span></div>`).join('');
  const body=items.map(card).join('')+notes||'<p class="mut">Chưa có gì cho ngày này.</p>';

  p.innerHTML=`<div class="phead">${head}
    <div class="row"><select id="ty"><option value="td">Việc</option><option value="ev">Hẹn</option></select>
      <input type="text" id="in" placeholder="Nội dung…"><button class="pri" id="add">Thêm</button></div>
    <div class="row"><input type="time" id="tm">
      <select id="rm"><option value="0">Đúng giờ</option><option value="10">Trước 10p</option><option value="30">Trước 30p</option><option value="60">Trước 1h</option></select>
      <select id="rp"><option value="one">1 ngày</option><option value="multi">Nhiều ngày</option><option value="daily">Mỗi ngày</option></select></div>
    <div class="row" id="mrow" style="display:none"><input type="date" id="dp"><button class="rd" id="dpb">+ ngày</button><span id="dts"></span></div>
  </div><div class="strip list">${body}</div>`;

  // Chế độ "Nhiều ngày": chọn từng ngày rồi bấm "+ ngày"
  const dts=()=>{
    $('#dts').innerHTML=multi.map(d=>`<button class="x" data-r="${d}">${d.slice(8)}/${d.slice(5,7)} ✕</button>`).join('');
    $('#dts').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{multi=multi.filter(x=>x!==b.dataset.r);dts()});
  };
  $('#dp').value=k;
  $('#rp').onchange=e=>{$('#mrow').style.display=e.target.value==='multi'?'flex':'none'};
  $('#dpb').onclick=()=>{const v=$('#dp').value;if(v&&!multi.includes(v))multi.push(v);dts()};

  const add=()=>{
    const t=$('#in').value.trim();if(!t)return;
    const ty=$('#ty').value,time=$('#tm').value,rm=+$('#rm').value,mode=$('#rp').value;
    if(mode==='daily'){          // lặp mỗi ngày, bắt đầu từ ngày đang chọn
      (db.rep=db.rep||[]).push({id:uid(),t,time,rm,type:ty,start:k,done:{},fired:{}});
    }else{                       // 1 ngày, hoặc nhiều ngày đã chọn
      const days=mode==='multi'&&multi.length?multi:[k];
      days.forEach(d=>(db[ty][d]=db[ty][d]||[]).push(ty==='ev'?{id:uid(),t,time,rm,done:false}:{id:uid(),t,time,rm,s:0}));
    }
    save();drawAll();
  };
  $('#add').onclick=add;$('#in').onkeydown=e=>{if(e.key==='Enter')add()};
  p.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const[s,id]=b.dataset.s.split('|');toggleDone(items.find(i=>i.src===s&&i.id===id),k);drawAll()});
  p.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const[s,id]=b.dataset.d.split('|');if(removeItem(items.find(i=>i.src===s&&i.id===id),k))drawAll()});
  p.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{tab=b.dataset.go;drawNav();drawPanel()});
}
