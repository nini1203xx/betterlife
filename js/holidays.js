// holidays.js — Ngày lễ. off:true = ngày nghỉ chính thức (số ngày hiện màu đỏ)

// Dương lịch: khóa dạng "ngày/tháng". Muốn thêm ngày lễ thì thêm một dòng vào đây.
const SOLAR_HOL={
  '1/1':{t:'Tết Dương lịch',off:true}, '14/2':{t:'Valentine'}, '8/3':{t:'Quốc tế Phụ nữ'},
  '30/4':{t:'Giải phóng miền Nam',off:true}, '1/5':{t:'Quốc tế Lao động',off:true},
  '1/6':{t:'Quốc tế Thiếu nhi'}, '2/9':{t:'Quốc khánh',off:true}, '20/10':{t:'Phụ nữ Việt Nam'},
  '20/11':{t:'Nhà giáo Việt Nam'}, '24/12':{t:'Đêm Giáng sinh'}, '25/12':{t:'Giáng sinh'}
};
// Âm lịch: khóa dạng "ngày/tháng âm"
const LUNAR_HOL={
  '1/1':{t:'Mùng 1 Tết',off:true}, '2/1':{t:'Mùng 2 Tết',off:true}, '3/1':{t:'Mùng 3 Tết',off:true},
  '15/1':{t:'Rằm tháng Giêng'}, '10/3':{t:'Giỗ Tổ Hùng Vương',off:true}, '15/4':{t:'Phật Đản'},
  '5/5':{t:'Tết Đoan Ngọ'}, '15/7':{t:'Vu Lan'}, '15/8':{t:'Tết Trung thu'}, '23/12':{t:'Ông Táo chầu trời'}
};

// Trả về {t:tên, off:true/undefined} hoặc null nếu không phải ngày lễ
function holidayOf(d){
  const s=SOLAR_HOL[d.getDate()+'/'+(d.getMonth()+1)];
  if(s)return s;
  const L=lunarOf(d);
  if(!L.leap){const l=LUNAR_HOL[L.d+'/'+L.m];if(l)return l}
  const n=new Date(d);n.setDate(d.getDate()+1);       // hôm sau là mùng 1 Tết => hôm nay là Giao thừa
  const N=lunarOf(n);
  if(N.d===1&&N.m===1)return {t:'Giao thừa',off:true};
  return null;
}
