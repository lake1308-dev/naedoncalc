const won=n=>Math.round(Number(n)||0).toLocaleString('ko-KR')+'원';
const el=id=>document.getElementById(id);
const num=id=>Math.max(0,Number(el(id)?.value)||0);
function setText(id,text){const node=el(id);if(node)node.textContent=text;}
function jump(id){el(id)?.scrollIntoView({behavior:'smooth',block:'start'});}
function getServiceDays(a,b){const s=new Date(a),e=new Date(b);if(Number.isNaN(s.getTime())||Number.isNaN(e.getTime()))return 0;const ms=e-s;return ms>=0?Math.floor(ms/86400000)+1:0;}
function severanceEstimate(start,end,wage,periodDays){const d=getServiceDays(start,end);const avg=wage/Math.max(1,periodDays);if(d<365)return {days:d,avg,sev:0};return {days:d,avg,sev:avg*30*(d/365)};}
function calcInsurance(){const gross=num('grossPay'),nonTax=num('nonTax'),base=Math.max(0,gross-nonTax);const pensionBase=base===0?0:Math.min(6590000,Math.max(410000,base));const pension=pensionBase*.0475;const health=base*.03595;const care=health*.1314;const healthCare=health+care;const employment=base*.009;const total=pension+healthCare+employment;setText('pensionOut',won(pension));setText('healthOut',won(healthCare));setText('employmentOut',won(employment));setText('insuranceTotal',won(total));setText('afterInsurance',won(Math.max(0,gross-total)));}
function calcMinWage(){const hourly=num('hourly'),hours=Math.min(40,num('weeklyHours')),rest=hours>=15?(hours/40)*8:0,weekly=hourly*(hours+rest),monthly=weekly*(365/7/12);setText('weeklyPaidRest',rest.toFixed(1)+'시간');setText('weeklyPay',won(weekly));setText('monthlyPay',won(monthly));setText('minWageStatus',hourly>=10320?'2026년 최저시급 이상입니다.':'2026년 최저시급 10,320원보다 낮습니다.');}
function calcWeeklyHoliday(){const rate=num('weeklyRate'),hours=Math.min(40,num('weeklyWorkHours')),rest=hours>=15?(hours/40)*8:0;setText('holidayHours',rest.toFixed(1)+'시간');setText('holidayPay',won(rate*rest));}
function calcAnnualLeave(){setText('annualLeaveOut',won(num('unusedLeave')*num('dailyOrdinary')));}
function calcOvertime(){setText('overtimeOut',won(num('ordinaryHourly')*num('overtimeHours')*Number(el('overtimeMultiplier')?.value||1.5)));}
function calcAnnual(){setText('salaryConvertOut',won(num('monthlySalary')*12));}
function calcMonthly(){setText('salaryConvertOut',won(num('annualSalary')/12));}
function calcSeverance(){const r=severanceEstimate(el('startDate')?.value,el('endDate')?.value,num('threeMonthWage'),num('threeMonthDays'));setText('serviceDays',r.days.toLocaleString('ko-KR')+'일');setText('avgDaily',won(r.avg));setText('severanceOut',r.days>=365?won(r.sev):'계속근로 1년 미만');}
function calcQuitPack(){const s=num('quitSeverance'),l=num('quitLeaveDays')*num('quitDailyWage');setText('quitSevOut',won(s));setText('quitLeaveOut',won(l));setText('quitTotalOut',won(s+l));}
function calcQuitQuick(){const r=severanceEstimate(el('qStart')?.value,el('qEnd')?.value,num('qThreeMonth'),num('qDays')),leave=num('qUnusedLeave')*num('qDailyWage'),total=r.sev+leave;setText('qTotal',r.days>=365?won(total):won(leave));setText('qBreakdown','퇴직금 '+(r.days>=365?won(r.sev):'1년 미만')+' + 연차수당 '+won(leave));}
window.addEventListener('DOMContentLoaded',()=>{calcInsurance();calcMinWage();calcWeeklyHoliday();calcAnnualLeave();calcOvertime();calcAnnual();calcSeverance();calcQuitPack();calcQuitQuick();});