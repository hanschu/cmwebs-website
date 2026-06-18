
const LINE_URL='https://line.me/R/ti/p/@cmwebs';
function $(id){return document.getElementById(id)}
function n(id){return Number($(id)?.value||0)}
function money(v){return Math.round(Number(v||0)).toLocaleString('zh-TW')}
function toast(msg='已完成'){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function copyOutput(id){const el=$(id);const text=el?.innerText||el?.value||'';navigator.clipboard.writeText(text).then(()=>toast('已複製到剪貼簿')).catch(()=>toast('請手動複製'))}
function toggleMenu(){document.querySelector('.nav-inner')?.classList.toggle('open')}
function calcROI(){const price=n('price'),rent=n('rent'),management=n('management'),repair=n('repair'),tax=n('tax'),vacancy=n('vacancy'),mortgage=n('mortgage'),other=n('other');const annualGross=rent*12;const annualRent=annualGross*(1-vacancy/100);const annualCost=management*12+repair+tax+mortgage*12+other;const net=annualRent-annualCost;const gross=price?annualGross/price*100:0;const effective=price?annualRent/price*100:0;const netYield=price?net/price*100:0;const cash=net/12;[['annualGross',annualGross],['annualRent',annualRent],['annualCost',annualCost],['netIncome',net],['cashflow',cash]].forEach(([id,v])=>{if($(id))$(id).textContent='NT$ '+money(v)});if($('grossYield'))$('grossYield').textContent=gross.toFixed(2)+'%';if($('effectiveYield'))$('effectiveYield').textContent=effective.toFixed(2)+'%';if($('netYield'))$('netYield').textContent=netYield.toFixed(2)+'%'}
function makeReceipt(){const landlord=$('landlord')?.value.trim()||'房東';const tenant=$('tenant')?.value.trim()||'房客';const addr=$('addr')?.value.trim()||'租賃地址';const month=$('month')?.value||'本期';const amount=money(n('rentAmount'));const method=$('method')?.value||'匯款';const date=$('date')?.value||new Date().toISOString().slice(0,10);const note=$('note')?.value.trim();$('receiptText').textContent=`租金收據\n\n茲收到 ${tenant} 支付位於「${addr}」之 ${month} 租金，金額為新臺幣 ${amount} 元整。\n\n付款方式：${method}\n收款人：${landlord}\n付款人：${tenant}\n收款日期：${date}${note?`\n備註：${note}`:''}\n\n本收據由 CM 房東工具箱產生，請收付款雙方確認內容。`}
function lateNotice(){const tenant=$('tenant')?.value.trim()||'房客';const month=$('month')?.value||'本期';const amount=money(n('amount'));const deadline=$('deadline')?.value||'指定期限前';const level=$('level')?.value||'friendly';let opening='溫馨提醒您';let ending='若您已完成繳款，請忽略此訊息，並可回覆匯款帳號後五碼供核對，謝謝。';if(level==='formal'){opening='依租賃契約約定通知您';ending='請於期限內完成繳納或主動聯繫說明，以維護雙方租賃權益。';}if(level==='final'){opening='再次正式通知您';ending='若逾期仍未完成，房東將依租賃契約及相關法令處理。';}$('noticeText').textContent=`${tenant} 您好：\n\n${opening}，${month} 租金新臺幣 ${amount} 元目前尚未完成繳納。請於 ${deadline} 前完成付款。\n\n${ending}\n\nCM 房東工具箱 敬上`}
function handoverText(){const addr=$('addr')?.value.trim()||'租賃地址';const landlord=$('landlord')?.value.trim()||'房東';const tenant=$('tenant')?.value.trim()||'房客';const date=$('date')?.value||new Date().toISOString().slice(0,10);const elec=$('electric')?.value||'未填';const water=$('water')?.value||'未填';const keys=$('keys')?.value||'未填';const notes=$('notes')?.value.trim()||'無';const checked=[...document.querySelectorAll('[data-handover]:checked')].map(x=>'□ '+x.value).join('\n');$('handoverText').textContent=`租屋退租點交紀錄\n\n租賃地址：${addr}\n房東：${landlord}\n房客：${tenant}\n點交日期：${date}\n\n電表度數：${elec}\n水表度數：${water}\n鑰匙數量：${keys}\n\n已確認項目：\n${checked||'尚未勾選'}\n\n其他紀錄：${notes}\n\n雙方應就屋況、設備、費用及押金結算另行確認並簽名。`}
function updateChecklist(){const all=[...document.querySelectorAll('[data-check]')];const done=all.filter(x=>x.checked).length;const pct=all.length?Math.round(done/all.length*100):0;if($('checkProgress'))$('checkProgress').style.width=pct+'%';if($('checkCount'))$('checkCount').textContent=`已完成 ${done} / ${all.length} 項（${pct}%）`}
function updateAddressRisk(){const all=[...document.querySelectorAll('[data-risk]')];let score=100;let notes=[];all.forEach(x=>{if(x.checked){score-=Number(x.dataset.weight||5);notes.push(x.value)}});score=Math.max(0,score);if($('riskScore'))$('riskScore').textContent=score;if($('riskRing'))$('riskRing').style.background=`conic-gradient(${score>=80?'#06c755':score>=60?'#ff9a00':'#e44747'} ${score*3.6}deg,#dce8ef 0deg)`;if($('riskLevel'))$('riskLevel').textContent=score>=80?'初步低風險':score>=60?'建議進一步確認':'初步高風險';if($('riskNotes'))$('riskNotes').textContent=notes.length?'已勾選：'+notes.join('、'):'尚未勾選任何風險項目。'}
function updateRentalRisk(){const all=[...document.querySelectorAll('[data-rental-risk]')];let score=100;all.forEach(x=>{if(x.checked)score-=Number(x.dataset.weight||8)});score=Math.max(0,score);if($('rentalScore'))$('rentalScore').textContent=score;if($('rentalBar'))$('rentalBar').style.width=score+'%';if($('rentalLevel'))$('rentalLevel').textContent=score>=80?'資料完整度良好':score>=60?'仍有項目需要確認':'簽約前應提高警覺'}
function updateCredit(){const all=[...document.querySelectorAll('[data-credit]')];let score=0;let max=0;all.forEach(x=>{const w=Number(x.dataset.weight||10);max+=w;if(x.checked)score+=w});const pct=max?Math.round(score/max*100):0;const final=500+Math.round(pct*3.5);if($('creditScore'))$('creditScore').textContent=final;if($('creditRing'))$('creditRing').style.background=`conic-gradient(${final>=780?'#06c755':final>=650?'#ff9a00':'#e44747'} ${(final-500)/350*360}deg,#dce8ef 0deg)`;if($('creditLevel'))$('creditLevel').textContent=final>=780?'履約資料完整':final>=650?'仍可補強紀錄':'資料不足';}
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-current-year]').forEach(x=>x.textContent=new Date().getFullYear());if($('date')&&!$('date').value)$('date').value=new Date().toISOString().slice(0,10);if($('price'))calcROI();if($('receiptText'))makeReceipt();if($('noticeText'))lateNotice();if($('handoverText'))handoverText();updateChecklist();updateAddressRisk();updateRentalRisk();updateCredit()});


// Lightweight entrance animations for internal pages. Content remains visible if JS is unavailable.
document.addEventListener('DOMContentLoaded',()=>{
  if(document.body.classList.contains('premium-home')) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('page-motion');
  const selectors=[
    '.section-title', '.content > h2', '.content > h3', '.content > p', '.content > .notice',
    '.feature-card', '.service-card', '.tool-card', '.article-card', '.price-card', '.panel',
    '.step', '.split > *', '.gallery > *', '.faq-item', '.cta-banner', '.result-row', '.checkitem'
  ];
  const items=[...document.querySelectorAll(selectors.join(','))];
  const seen=new Set();
  const unique=items.filter(el=>{if(seen.has(el))return false;seen.add(el);return true});
  unique.forEach((el,index)=>{
    el.classList.add('motion-item');
    const parent=el.parentElement;
    const siblings=parent?[...parent.children].filter(x=>unique.includes(x)):[];
    const local=Math.max(0,siblings.indexOf(el));
    el.style.setProperty('--motion-delay',`${Math.min(local,5)*85}ms`);
    if(el.matches('.split > :first-child')) el.classList.add('motion-left');
    if(el.matches('.split > :last-child')) el.classList.add('motion-right');
  });
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('motion-in');
      io.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  unique.forEach(el=>io.observe(el));
});
