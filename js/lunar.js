// lunar.js — Đổi ngày dương lịch sang âm lịch Việt Nam (múi giờ GMT+7)

function jdFromDate(dd,mm,yy){
  const a=Math.floor((14-mm)/12),y=yy+4800-a,m=mm+12*a-3;
  let jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
  if(jd<2299161)jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-32083;
  return jd;
}
function getNewMoonDay(k,tz){
  const T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180;
  let Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;
  Jd1+=0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
  const M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3;
  const Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3;
  const F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
  let C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M);
  C1+=-0.4068*Math.sin(Mpr*dr)+0.0161*Math.sin(dr*2*Mpr)-0.0004*Math.sin(dr*3*Mpr);
  C1+=0.0104*Math.sin(dr*2*F)-0.0051*Math.sin(dr*(M+Mpr))-0.0074*Math.sin(dr*(M-Mpr))+0.0004*Math.sin(dr*(2*F+M));
  C1+=-0.0004*Math.sin(dr*(2*F-M))-0.0006*Math.sin(dr*(2*F+Mpr))+0.0010*Math.sin(dr*(2*F-Mpr))+0.0005*Math.sin(dr*(2*Mpr+M));
  const dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;
  return Math.floor(Jd1+C1-dt+0.5+tz/24);
}
function getSunLongitude(jdn,tz){
  const T=(jdn-2451545.5-tz/24)/36525,T2=T*T,dr=Math.PI/180;
  const M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2;
  const L0=280.46645+36000.76983*T+0.0003032*T2;
  const DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M)+(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);
  let L=(L0+DL)*dr;
  L-=Math.PI*2*Math.floor(L/(Math.PI*2));
  return Math.floor(L/Math.PI*6);
}
function getLunarMonth11(yy,tz){
  const k=Math.floor((jdFromDate(31,12,yy)-2415021)/29.530588853);
  let nm=getNewMoonDay(k,tz);
  if(getSunLongitude(nm,tz)>=9)nm=getNewMoonDay(k-1,tz);
  return nm;
}
function getLeapMonthOffset(a11,tz){
  const k=Math.floor((a11-2415021.076998695)/29.530588853+0.5);
  let i=1,last=0,arc=getSunLongitude(getNewMoonDay(k+i,tz),tz);
  do{last=arc;i++;arc=getSunLongitude(getNewMoonDay(k+i,tz),tz)}while(arc!==last&&i<14);
  return i-1;
}
function convertSolar2Lunar(dd,mm,yy,tz){
  const day=jdFromDate(dd,mm,yy),k=Math.floor((day-2415021.076998695)/29.530588853);
  let ms=getNewMoonDay(k+1,tz);
  if(ms>day)ms=getNewMoonDay(k,tz);
  let a11=getLunarMonth11(yy,tz),b11=a11,ly;
  if(a11>=ms){ly=yy;a11=getLunarMonth11(yy-1,tz)}else{ly=yy+1;b11=getLunarMonth11(yy+1,tz)}
  const diff=Math.floor((ms-a11)/29);let leap=0,lm=diff+11;
  if(b11-a11>365){const lo=getLeapMonthOffset(a11,tz);if(diff>=lo){lm=diff+10;if(diff===lo)leap=1}}
  if(lm>12)lm-=12;
  if(lm>=11&&diff<4)ly-=1;
  return [day-ms+1,lm,ly,leap];
}

// Hàm dùng trong lịch: lunarOf(new Date(...)) -> {d:ngày, m:tháng, y:năm, leap:1 nếu tháng nhuận}
const _lunarCache={};
function lunarOf(d){
  const key=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
  if(!_lunarCache[key]){
    const r=convertSolar2Lunar(d.getDate(),d.getMonth()+1,d.getFullYear(),7);
    _lunarCache[key]={d:r[0],m:r[1],y:r[2],leap:r[3]};
  }
  return _lunarCache[key];
}
