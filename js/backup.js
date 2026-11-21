// backup.js — Sao lưu / khôi phục dữ liệu

// Sao lưu
$('#bkb').onclick=()=>$('#dlg').showModal();
$('#cls').onclick=()=>$('#dlg').close();
$('#exp').onclick=()=>{$('#bk').value=JSON.stringify(db)};
$('#imp').onclick=()=>{try{const o=JSON.parse($('#bk').value);if(!o.ev)throw 0;db=Object.assign({ev:{},td:{},note:{},diary:{},mood:{},quick:''},o);save();$('#qn').value=db.quick||'';drawAll();alert('Đã nhập dữ liệu.')}catch(e){alert('Dữ liệu không hợp lệ.')}};
