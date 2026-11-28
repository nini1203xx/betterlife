// sync.js — Đồng bộ dữ liệu giữa điện thoại và máy tính bằng Firebase (đăng nhập bằng email + mật khẩu)

// ===== 1) DÁN CẤU HÌNH FIREBASE CỦA BẠN VÀO ĐÂY (xem hướng dẫn, bước 5) =====
const FIREBASE_CONFIG={
  apiKey:'AIzaSyDi3ZzDT76VOIIsoE6_Xed3ner42ic3aQM',
  authDomain:'hongnhung-s-calendar.firebaseapp.com',
  projectId:'hongnhung-s-calendar',
  appId:'1:163207668852:web:253cd508ddded5549a9d21'
};

let fbDoc=null,fbUnsub=null,pushTimer=null,syncUser=null;
const syncReady=()=>typeof firebase!=='undefined'&&!FIREBASE_CONFIG.apiKey.startsWith('DÁN');
const setSyncLabel=t=>{const b=$('#syncb');if(b)b.textContent=t};

// Đẩy dữ liệu lên mây (chờ 0,8 giây sau lần lưu cuối để khỏi gửi liên tục)
function syncPush(){
  if(!fbDoc)return;
  db._ts=db._ts||Date.now();
  clearTimeout(pushTimer);setSyncLabel('☁️ Đang lưu…');
  pushTimer=setTimeout(()=>{
    fbDoc.set({data:JSON.stringify(db),ts:db._ts})
      .then(()=>setSyncLabel('☁️ Đã đồng bộ'))
      .catch(()=>setSyncLabel('☁️ Lỗi đồng bộ'));
  },800);
}

// Có dữ liệu từ mây về: bản nào mới hơn (theo _ts) thì thắng
function applyRemote(snap){
  if(!snap.exists){syncPush();return}                 // trên mây chưa có gì -> đẩy dữ liệu máy này lên
  if(snap.metadata.hasPendingWrites)return;           // thay đổi do chính máy này vừa ghi -> bỏ qua
  const r=snap.data();if(!r||!r.data)return;
  const rt=r.ts||0,lt=db._ts||0;
  if(rt>lt){                                          // mây mới hơn -> lấy về
    db=Object.assign({ev:{},td:{},note:{},diary:{},mood:{},quick:'',rep:[]},JSON.parse(r.data));
    try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}
    $('#qn').value=db.quick||'';
    drawAll();
  }else if(rt<lt){syncPush();return}                  // máy này mới hơn -> đẩy lên
  setSyncLabel('☁️ Đã đồng bộ');
}

// Nút "Đồng bộ" ở thanh bên + hộp đăng nhập
function syncUI(){
  const b=document.createElement('button');
  b.className='nav';b.id='syncb';b.textContent='☁️ Đồng bộ';
  $('.side').insertBefore(b,$('#bkb'));
  const d=document.createElement('dialog');
  d.innerHTML=`<h3 style="margin-top:0">Đồng bộ giữa các thiết bị</h3>
    <p class="mut" id="smsg"></p>
    <div class="row"><input type="text" id="se" placeholder="Email"></div>
    <div class="row"><input type="password" id="sp" placeholder="Mật khẩu"></div>
    <div class="row"><button class="pri" id="sin">Đăng nhập</button><button class="rd" id="sout">Đăng xuất</button><button class="rd" id="scl">Đóng</button></div>`;
  document.body.appendChild(d);
  b.onclick=()=>{
    $('#smsg').textContent=!syncReady()?'Chưa dán cấu hình Firebase vào js/sync.js.':syncUser?'Đang đăng nhập: '+syncUser.email:'Đăng nhập bằng tài khoản bạn đã tạo trên Firebase.';
    d.showModal();
  };
  $('#scl').onclick=()=>d.close();
  $('#sin').onclick=()=>{
    if(!syncReady())return;
    firebase.auth().signInWithEmailAndPassword($('#se').value.trim(),$('#sp').value)
      .then(()=>d.close()).catch(e=>{$('#smsg').textContent='Lỗi đăng nhập: '+e.code});
  };
  $('#sout').onclick=()=>{if(syncReady())firebase.auth().signOut().then(()=>d.close())};
}

// Khởi động
(function(){
  syncUI();
  if(!syncReady())return;
  firebase.initializeApp(FIREBASE_CONFIG);
  setSyncLabel('☁️ Đăng nhập');
  firebase.auth().onAuthStateChanged(u=>{
    syncUser=u;
    if(fbUnsub){fbUnsub();fbUnsub=null}
    fbDoc=null;
    if(!u){setSyncLabel('☁️ Đăng nhập');return}
    fbDoc=firebase.firestore().collection('users').doc(u.uid);
    setSyncLabel('☁️ Đang kết nối…');
    fbUnsub=fbDoc.onSnapshot(applyRemote,()=>setSyncLabel('☁️ Lỗi đồng bộ'));
  });
})();
