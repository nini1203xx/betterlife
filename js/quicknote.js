// quicknote.js — Quick note ở thanh bên

// Quick note chung (cột trái dưới cùng)
$('#qn').value=db.quick||'';
$('#qn').oninput=e=>{db.quick=e.target.value;save()};
