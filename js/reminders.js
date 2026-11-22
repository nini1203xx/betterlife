// reminders.js — Nhắc nhở theo giờ

/* ===== NHẮC NHỞ: 20 giây kiểm tra 1 lần (chỉ chạy khi tab đang mở) ===== */
try{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission()}catch(e){}
function toast(msg){const t=$('#toast');t.textContent='🔔 '+msg;t.style.display='block';setTimeout(()=>t.style.display='none',12000);t.onclick=()=>t.style.display='none'}
function check(){
  const n=new Date(),k=ks(n),mins=n.getHours()*60+n.getMinutes();let ch=false;
  dayItems(k).forEach(e=>{
    if(!e.time||e.done||e.fired)return;
    const [h,m]=e.time.split(':').map(Number),at=h*60+m;
    if(mins>=at-(e.rm||0)&&mins<=at+30){
      markFired(e,k);ch=true;toast(e.t+' ('+e.time+')');
      try{if(Notification.permission==='granted')new Notification('Nhắc nhở',{body:e.t+' – '+e.time})}catch(x){}
    }
  });
  if(ch)save();
}
setInterval(check,20000);check();
