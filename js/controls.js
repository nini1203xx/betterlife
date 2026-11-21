// controls.js — Nút chuyển tháng, Hôm nay

/* ===== NÚT ĐIỀU KHIỂN ===== */
$('#prev').onclick=()=>{view.setMonth(view.getMonth()-1);drawCal()};
$('#next').onclick=()=>{view.setMonth(view.getMonth()+1);drawCal()};
$('#today').onclick=()=>{const n=new Date();view=new Date(n.getFullYear(),n.getMonth(),1);sel=ks(n);drawAll()};
$('#dow').innerHTML=['Hai','Ba','Tư','Năm','Sáu','Bảy','Chủ Nhật'].map((d,i)=>`<div><span class="f">${i<6?'Thứ ':''}${d}</span><span class="s">${i<6?'T'+(i+2):'CN'}</span></div>`).join('');
