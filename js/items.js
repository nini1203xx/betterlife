// items.js — Gom lịch hẹn, việc và nhắc lặp của một ngày thành MỘT danh sách chung

// Số tuần trong năm (chuẩn ISO, tuần bắt đầu từ thứ Hai)
function isoWeek(d){
  const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),n=t.getUTCDay()||7;
  t.setUTCDate(t.getUTCDate()+4-n);
  return Math.ceil(((t-Date.UTC(t.getUTCFullYear(),0,1))/864e5+1)/7);
}

// Nhắc lặp mỗi ngày: áp dụng cho ngày k nếu k nằm trong [start, end]
function repOn(r,k){return k>=r.start&&(!r.end||k<=r.end)}

// Mọi mục của ngày k, xếp theo giờ.  src: 'ev' lịch hẹn | 'td' việc | 'rep' nhắc lặp mỗi ngày
function dayItems(k){
  const a=[];
  (db.ev[k]||[]).forEach(x=>a.push({src:'ev',type:'ev',id:x.id,t:x.t,time:x.time,rm:x.rm,done:!!x.done,fired:!!x.fired}));
  (db.td[k]||[]).forEach(x=>a.push({src:'td',type:'td',id:x.id,t:x.t,time:x.time,rm:x.rm,done:st(x)===2,fired:!!x.fired}));
  (db.rep||[]).filter(r=>repOn(r,k)).forEach(r=>a.push({src:'rep',type:r.type,id:r.id,t:r.t,time:r.time,rm:r.rm,done:!!(r.done||{})[k],fired:!!(r.fired||{})[k]}));
  return a.sort((x,y)=>(x.time||'99').localeCompare(y.time||'99'));
}

// Đánh dấu xong / chưa xong
function toggleDone(it,k){
  if(it.src==='rep'){const r=db.rep.find(x=>x.id===it.id);r.done=r.done||{};r.done[k]=!r.done[k]}
  else{const x=db[it.src][k].find(i=>i.id===it.id);if(it.src==='ev')x.done=!x.done;else x.s=st(x)===2?0:2}
  save();
}
// Xóa một mục (nhắc lặp thì xóa khỏi mọi ngày)
function removeItem(it,k){
  if(it.src==='rep'){
    if(!confirm('Xóa nhắc nhở lặp này khỏi mọi ngày?'))return false;
    db.rep=db.rep.filter(x=>x.id!==it.id);
  }else db[it.src][k]=db[it.src][k].filter(x=>x.id!==it.id);
  save();return true;
}
// Ghi nhớ đã nhắc rồi (để không nhắc lặp lại)
function markFired(it,k){
  if(it.src==='rep'){const r=db.rep.find(x=>x.id===it.id);(r.fired=r.fired||{})[k]=1}
  else db[it.src][k].find(i=>i.id===it.id).fired=true;
}
