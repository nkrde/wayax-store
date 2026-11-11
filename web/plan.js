/* ===== WayaX plans & AI usage on the web =====
   Same state, presets, rules and copy as the app (preview.html "Plans & AI usage flows"),
   laid out for the web: sidebar widget, third-screen pages, centred popups, banner over the search bar. */
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const KEY = 'wxWebPlan';
  const PRESETS = {
    trial:{plan:'trial',pct:40}, trial80:{plan:'trial',pct:80}, trial100:{plan:'trial',pct:100}, trialEnded:{plan:'ended',pct:100},
    quarterly:{plan:'quarterly',pct:31}, yearly:{plan:'yearly',pct:62}, yearlyLimit:{plan:'yearly',pct:100},
    yearlyTopup:{plan:'yearly',pct:100,pack:200,tuUsed:122}, combo:{plan:'combo',pct:31}, lapsed:{plan:'lapsed',pct:0}, none:{plan:'none',pct:0}
  };
  const DEMO = [['trial','Free trial · 40% used'],['trial80','Free trial · 80% (banner)'],['trial100','Free trial · all used'],['trialEnded','Trial ended'],
    ['quarterly','Migrated · Believer Quarterly'],['yearly','Pro · Yearly'],['yearlyLimit','Pro · weekly limit hit'],['yearlyTopup','Pro · top-up in use'],
    ['combo','Combo · Equity + FnO + MCX'],['lapsed','Lapsed Believer'],['none','No plan'],['push','Monday reset · notification']];
  let S = load();
  function load(){ try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.plan) return s; } catch (e) {} return { plan:'yearly', pct:31, answers:0 }; }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const PAID = { quarterly:1, yearly:1, combo:1 };
  const isPaid = () => !!PAID[S.plan], hasTopup = () => isPaid() && S.pack > 0;
  const total = () => !hasTopup() ? Math.min(100, Math.round(S.pct)) : Math.min(100, Math.round((100 + (S.tuUsed || 0)) / (100 + S.pack) * 100));
  const atLimit = () => (S.plan === 'trial' && S.pct >= 100) || (isPaid() && S.pct >= 100 && !(hasTopup() && (S.tuUsed || 0) < S.pack));
  const blocked = () => atLimit() || ['ended','lapsed','none'].includes(S.plan);
  const PLANS = { quarterly:['Quarterly','₹4,500','Believer till 30 Jan 2027','Paid ₹4,500 on 30 Oct 2026'], yearly:['Yearly','₹6,500','Believer till 30 Aug 2027','Paid ₹6,500 on 30 Aug 2026'],
    combo:['Combo Plan','₹15,000','Believer till 30 Aug 2027','Paid ₹15,000 on 30 Aug 2026'] };
  const tone = () => hasTopup() ? ['#19b7ac','#cbf5ef'] : atLimit() ? ['#edb168','#fae6d0'] : ['#a05ec8','#ecd3fd'];
  const C = 2 * Math.PI;
  function ring(size, sw, pct, fg, bg){ const r = (size - sw) / 2, L = C * r, off = L * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="transform:rotate(-90deg)"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${sw}"/>`
      + (pct > 0 ? `<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${fg}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${off}"/>` : '') + '</svg>'; }
  const chev = c => `<svg viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="${c||'#9aa0ad'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const tick = '<svg viewBox="0 0 18 18" fill="none"><path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="#1f9d6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const wck = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const msg = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5A1.5 1.5 0 0 1 11.5 11H7l-3 2.5V11A1 1 0 0 1 3 10z" stroke="#a05ec8" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  let pack = 200, auto = true, xSel = null, xApps = { eq:1 }, cycle = 'yearly';

  /* ---------- sidebar: plan button + usage widget ---------- */
  function paintSide(){
    const trial = S.plan === 'trial', noplan = !isPaid() && !trial, [fg, bg] = tone(), t = total();
    const val = noplan ? '—' : hasTopup() ? '+' + Math.round(S.pack - (S.tuUsed || 0)) + '%' : t + '%';
    const sub = noplan ? (S.plan === 'ended' ? 'Free trial ended' : S.plan === 'lapsed' ? 'Plan ended' : 'No active plan') : trial ? 'Free trial · resets 26 Nov' : hasTopup() ? 'Using extra usage' : atLimit() ? 'Limit reached · resets Mon' : 'Resets Mon 9:00 AM';
    const cls = hasTopup() ? 'tu' : atLimit() ? 'full' : t >= 80 ? 'warn' : '';
    const planL = trial ? ['Free trial','See plans'] : isPaid() ? [`Believer · ${PLANS[S.plan][0]}`,'Manage'] : ['Become a Waya Believer','Subscribe'];
    $('.qfull').innerHTML = `<div class="wu ${cls}"><span class="wu-r">${ring(40, 5, noplan ? 0 : t, fg, noplan ? '#3a3a44' : 'rgba(255,255,255,.1)')}<b>${val}</b></span>
      <span class="wu-t"><b>AI Usage${noplan ? '<em>See Plans</em>' : ''}</b><span>${sub}</span></span><img class="wu-c" src="fx/chev-right-nav.svg" alt=""></div>
      <div class="wu-p"><span>${planL[0]}</span><b>${planL[1]} ›</b></div>`;
    $('.qmini').innerHTML = `${ring(44, 4, noplan ? 0 : t, fg, 'rgba(255,255,255,.1)')}<b>${val}</b>`;
    $('.qmini').title = 'AI Usage · ' + sub;
    $$('.wcount');
  }

  /* ---------- third-screen pages ---------- */
  const tiles = on => `<div class="wx-tiles">
      <button data-pack="67"${on===67?' class="on"':''}><span class="k">+67%</span><span class="v">₹99</span><span class="d">4 days extra</span></button>
      <button data-pack="200"${on===200?' class="on"':''}><span class="mp">MOST POPULAR</span><span class="k">+200%</span><span class="v">₹249</span><span class="d">2 weeks extra</span><span class="sv">Save 16%</span></button>
      <button data-pack="400"${on===400?' class="on"':''}><span class="k">+400%</span><span class="v">₹499</span><span class="d">4 weeks extra</span><span class="sv">Save 16%</span></button></div>`;
  const bar = () => `<div class="wx-ub"><div class="h"><span>Used ${total()}%</span><em>Left ${100 - total()}%</em></div><div class="tr"><i style="width:${total()}%"></i></div></div>`;
  function buyBlock(){
    if (hasTopup()) return `<div class="wx-card" style="display:flex;flex-direction:column;gap:12px"><div class="wx-r"><h3>Top-up in use</h3><small>+${S.pack}% pack · valid till 14 Mar</small></div>
      <p style="margin:0;font:400 12.5px/18px Inter;color:#64748b">Your weekly limit is used up, so WayaX is using your top-up.</p>${bar()}
      <div class="wx-tg"><span>Use automatically at limit</span><i class="wx-sw${auto ? '' : ' off'}" data-auto></i></div></div>`;
    return `<div class="wx-card" style="display:flex;flex-direction:column;gap:12px"><div class="wx-r"><h3>Buy AI Top Ups</h3><small>Valid 3 months · Balance 0%</small></div>
      <p style="margin:0;font:400 12.5px/18px Inter;color:#64748b">Used only after your weekly limit runs out.</p>${tiles(pack)}</div>`;
  }
  const DAYS = [['Today','2% used',[['ICICI Bank deep dive','1 question · 0.7%'],['Stock ideas for November','1 question · 1.3%']]],
    ['Yesterday','8.7% used',[['My portfolio','2 questions · 8.7%']]], ['Monday','12% used',[['Nifty outlook','3 questions · 4%'],['Watchlist review','2 questions · 8%']]]];
  function renderUsage(){
    const el = $('#vAiu'), trial = S.plan === 'trial', tu = hasTopup(), [fg, bg] = tone(), t = total(), noplan = !isPaid() && !trial;
    const chip = tu ? '<span class="wx-chip te">TOP-UP IN USE</span>' : noplan ? '<span class="wx-chip gr">NO ACTIVE PLAN</span>' : atLimit() ? '<span class="wx-chip am">LIMIT REACHED</span>' : `<span class="wx-chip">${trial ? 'FREE TRIAL' : 'BELIEVER · ' + (S.plan === 'combo' ? 'COMBO' : PLANS[S.plan][0].toUpperCase())}</span>`;
    const left = noplan ? 'Pick a plan to keep using WayaX AI.' : tu ? `${100 - t}% left · weekly limit + top-ups` : trial ? `${100 - S.pct}% left this month` : `${100 - S.pct}% left this week`;
    // where the usage went (same split as the app's Usage page, scaled to what is used)
    const used = noplan ? 0 : (tu ? 100 : S.pct), parts = [['Portfolio Analysis','#2160f5',.82],['Chat','#4c7df4',.04],['Other','#e4872d',.14]];
    const list = DAYS.map(d => `<div class="wx-gd"><span>${d[0]}</span><b>${d[1]}</b></div>` + d[2].map(c => `<button class="wx-ch" data-chat="${c[0]}"><span class="ic">${msg}</span><span><b>${c[0]}</b><span>${c[1]}</span></span><span class="va">View ›</span></button>`).join('')).join('');
    el.innerHTML = `<div class="wb">
      <div class="wx-r">${chip}<small>${noplan ? '' : tu ? 'Limit back Mon 9:00 AM' : trial ? 'Resets 26 Nov' : 'Resets Mon 9:00 AM'}</small></div>
      <div class="wx-hero${tu ? ' tu' : atLimit() ? ' full' : ''}"><div class="wx-ring">${ring(150, 14, noplan ? 0 : t, fg, bg)}<div><b>${noplan ? '—' : t + '%'}</b><span>${tu ? 'TOTAL USED' : 'OF TOTAL USED'}</span></div></div>
        <div class="wx-hs"><span class="l">${left}</span><span class="s">${trial ? '10 AI uses a month on the free trial.' : tu ? 'Weekly limit used up. Your top-up covers you till Monday.' : noplan ? 'Calls, Watch To Buy and history still work.' : 'One weekly limit across chat, skills and portfolio reviews.'}</span>
          ${noplan ? '' : `<span class="k"><i style="background:${fg}"></i>${tu ? 'Weekly limit + top-ups' : 'WayaX AI'}</span>`}</div></div>
      ${used ? `<div class="wx-card"><div class="wx-r" style="margin-bottom:12px"><h3>Where it went</h3><small>${used}% used</small></div>
        <div class="wx-split">${parts.map(p => `<i style="width:${p[2] * used}%;background:${p[1]}"></i>`).join('')}</div>
        <div class="wx-leg">${parts.map(p => `<div><i style="background:${p[1]}"></i>${p[0]}<em>${Math.round(p[2] * used)}% of total</em></div>`).join('')}</div></div>` : ''}
      <div class="wx-card" style="padding:12px 10px"><div class="wx-r" style="padding:2px 6px 0"><h3>Usage history</h3><small>Click a chat for details</small></div>${list}</div>
      ${trial || noplan ? '' : buyBlock()}
      <div class="wx-ft"><button class="wx-cta" data-cta>${tu ? 'Buy top-ups' : noplan ? 'See plans' : 'Upgrade / Renew'}</button></div></div>`;
  }
  function renderPlan(){
    const el = $('#vPlan'), trial = S.plan === 'trial', tu = hasTopup(), [fg] = tu ? ['#c58cf0'] : tone(), t = total();
    if (!trial && !isPaid()) { renderExplore('#vPlan'); return; }
    const P = PLANS[S.plan] || ['Free trial','₹0','',''];
    const sub = S.plan === 'combo' ? ['Equity + FnO + MCX','Believer till 30 Aug 2027'] : trial ? ['Everything included for 3 months'] : [P[2]];
    const keys = trial ? ['WayaX AI','Resets 26 Nov'] : tu ? ['Weekly limit + top-ups','Top-ups valid till 14 Mar'] : S.plan === 'combo' ? ['WayaX AI · ' + (100 - S.pct) + '% left this week','One limit · AI only in WayaX'] : ['WayaX AI','Resets Mon 9:00 AM'];
    const foot = trial ? 'Top-ups: with a Believer plan' : tu ? 'Weekly limit back Mon 9:00 AM' : 'Top-Up Usage: none';
    el.innerHTML = `<div class="wb">
      <p style="margin:0;font:400 13px Inter;color:#64748b">${trial ? 'You’re on the free trial' : 'You’re a Waya Believer · enjoy your benefits'}</p>
      <div class="wx-plan${trial ? ' tr' : ''}${tu ? ' tu' : ''}">${trial ? '<span class="rib">FREE TRIAL</span>' : tu ? '<span class="rib">TOP-UP IN USE</span>' : ''}
        <div><div class="n">${P[0]}</div>${sub.map(d => `<div class="d">${d}</div>`).join('')}<div style="height:6px"></div>
          <span class="k"><i style="background:${fg}"></i>${keys[0]}</span><span class="k"><i style="background:#8f8a9f"></i>${keys[1]}</span></div>
        <div class="wx-ring">${ring(104, 10, t, fg, 'rgba(255,255,255,.12)')}<div><b>${t}%</b><span>${tu ? 'TOTAL USED' : 'USED'}</span></div></div>
        <div class="f"><span>${foot}</span><button data-go="aiu">View AI usage ${chev('#e7d4fb')}</button></div></div>
      ${tu ? `<div class="wx-card" style="display:flex;flex-direction:column;gap:10px"><div class="wx-r"><h3>Top-Up Usage</h3><small>Valid 3 months</small></div>${bar()}</div>` : ''}
      ${S.plan === 'combo' ? '<div class="wx-apps"><div>Waya - Futures and Options<span>INSTALL / OPEN</span></div><div>Waya - MCX Commodities<span>INSTALL / OPEN</span></div></div>' : ''}
      <div class="wx-paid">${trial ? 'Trial ends on 26 Jan 2027' : P[3]}</div>
      ${trial ? '' : buyBlock()}
      <button class="wx-xb" data-pro>Explore all plans ${chev('#323232')}</button>
      <div class="wx-ft"><button class="wx-cta" data-cta>Upgrade / Renew</button></div></div>`;
  }
  function renderExplore(sel){
    const el = $(sel || '#vXpl'), has = S.plan === 'trial' || isPaid(), P = PLANS[S.plan];
    if (xSel == null) xSel = S.plan === 'yearly' ? 'yearly' : (S.plan === 'quarterly' || S.plan === 'trial') ? 'quarterly' : '';
    const cur = has ? `<div class="xp-cur"><div><small>Current plan</small><b>${P ? P[0] : 'Free trial'}</b><small>${S.plan === 'yearly' || S.plan === 'combo' ? '12 months' : '3 months'} · ${P ? P[3] : 'Trial ends on 26 Jan 2027'}</small></div><div><div class="p">${P ? P[1] : '₹0'}</div><button class="wx-link" data-cur>View plan ${chev('#7e3fae')}</button></div></div>`
      : `<div class="xp-cur"><div><b>${S.plan === 'lapsed' ? 'Your Pro plan has ended' : S.plan === 'ended' ? 'Your free trial has ended' : 'Free trial'}</b><small>${S.plan === 'lapsed' ? 'Unused top-ups are saved till 26 Mar and come back when you renew.' : '3 months · 10 AI uses a month · every answer type, nothing hidden'}</small></div><div class="p">${S.plan === 'none' ? '₹0' : ''}</div></div>`;
    const pl = (k, n, m, pr, per) => `<button class="xp-pl${xSel === k ? ' on' : ''}" data-pl="${k}"><span class="ck">${wck}</span><span class="n">${n}</span><span class="m">Recommendations + AI · ${m}</span><span class="pr">${pr} <small>${per}</small></span></button>`;
    const ap = (k, img, n, p, o, bt) => `<button class="xp-ap${xApps[k] ? ' on' : ''}" data-ap="${k}"><span class="ck">${wck}</span><img src="${img}" alt=""><span class="n">${n}</span><span class="p">${p}</span><s>${o}</s><span class="bt">${bt}</span></button>`;
    el.innerHTML = `<div class="wb">${cur}
      <div style="display:flex;flex-direction:column;gap:10px"><h3>Pro plans</h3><div class="xp-pls">${pl('quarterly','Quarterly','3 months','₹2,500','/ quarter')}${pl('yearly','Yearly','12 months','₹4,500','/ year')}</div></div>
      <div class="wx-card"><h3 style="margin-bottom:12px">What Pro includes</h3><div class="xp-inc">${['Waya research calls: today, weekly, open and exited','WayaX AI: company questions, stock ideas, Waya Score','Portfolio review and rebalancing','Financial model from your Excel'].map(x => `<div>${tick}${x}</div>`).join('')}</div></div>
      <div class="xp-cb"><h4>Combo Yearly plans</h4><p>Pick 2 or 3 apps · the more you add, the less each costs</p>
        <div class="xp-aps">${ap('eq','../assets/apps/icon.svg','Waya Equity','₹3,000','₹4,500','CURRENT APP')}${ap('fno','../assets/apps/icon.svg','Waya FnO','₹5,000','₹20,000','INSTALL')}${ap('mcx','../assets/apps/icon-mcx.svg','Waya MCX','₹7,500','₹12,000','INSTALL')}</div>
        <p class="xp-nt">A minimum of 2 subscriptions is required for a Combo Yearly Plan. Waya Equity is pre-selected when it is already subscribed.</p></div>
      ${buyBlockPlain()}
      <div class="wx-ft"><button class="wx-cta" data-cta>Upgrade / Renew</button></div></div>`;
  }
  const buyBlockPlain = () => `<div class="wx-card" style="display:flex;flex-direction:column;gap:12px"><div class="wx-r"><h3>Buy AI Top Ups</h3><small>Valid 3 months</small></div><p style="margin:0;font:400 12.5px/18px Inter;color:#64748b">Used only after your weekly limit runs out.</p>${tiles(pack)}</div>`;

  /* ---------- modals (the app's bottom sheets as centred popups) ---------- */
  const M = $('#wxModal');
  const modal = html => { M.innerHTML = `<div class="bd">${html}</div>`; openM('#wxModal'); };
  function openProSheet(){
    const t = S.plan === 'lapsed' ? ['Your Pro plan has ended','Your unused top-ups are saved till 26 Mar and come back when you renew.'] : S.plan === 'ended' ? ['Your free trial has ended',''] : S.plan === 'trial' ? ['You’ve used this month’s free allowance','Resets 26 Nov. Go Pro for 60× the usage.'] : ['Become a Waya Believer',''];
    const price = cycle === 'yearly' ? ['₹6,500','per year · about ₹542 a month'] : ['₹4,500','per quarter · about ₹1,500 a month'];
    modal(`<h3>${t[0]}</h3>${t[1] ? `<p class="sm">${t[1]}</p>` : ''}
      <div class="seg"><button data-cy="quarterly"${cycle==='quarterly'?' class="on"':''}>Quarterly</button><button data-cy="yearly"${cycle==='yearly'?' class="on"':''}>Yearly</button></div>
      <div class="pr">${price[0]}</div><div class="pm">${price[1]}</div>
      <div class="ck">${tick}All live research Recommendations</div><div class="ck">${tick}AI Usage, 60× the free Usage, resets weekly.</div><div class="ck">${tick}Portfolio review, models, Watch To Buy</div>
      <button class="wx-cta" data-buy="${cycle}">Continue · ${price[0]}</button><button class="nn" data-close>Not now</button>`);
  }
  function openTopups(p){
    pack = p || pack;
    const row = (k, l, pr, sv, mp) => `<button class="op${pack===k?' on':''}" data-pk="${k}">${mp ? '<span class="mp">MOST POPULAR</span>' : ''}<span>${l}${sv ? '<span class="sv">Save 16%</span>' : ''}</span><b>${pr}</b></button>`;
    modal(`<h3>${atLimit() ? 'Weekly limit reached' : 'Top-ups'}</h3><p class="sm">${atLimit() ? 'Resets Mon 9:00 AM. ' : ''}Used only after your weekly limit. Lasts 3 months.</p>
      ${row(67,'+67%, 4 days extra','₹99')}${row(200,'+200%, 2 weeks extra','₹249',1,1)}${row(400,'+400%, 4 weeks extra','₹499',1)}
      <div class="wx-tg"><span>Use automatically at limit</span><i class="wx-sw${auto ? '' : ' off'}" data-auto></i></div>
      <button class="wx-cta" data-pay>Buy</button><button class="nn" data-close>Not now</button>`);
  }
  function openUpgraded(){
    modal(`<h3>Your plan now includes WayaX AI</h3><div class="ls"><div><span>Plan</span><b>Pro · Yearly</b></div><div><span>Believer till</span><b>30 Aug 2027</b></div>
      <div><span>WayaX AI</span><b>Weekly limit, included</b></div><div><span>Next renewal</span><b>₹6,500</b></div></div>
      <p class="sm">Nothing extra to pay today.</p><button class="wx-cta" data-close>Try WayaX AI</button>`);
  }
  const QS = { 'Nifty outlook':[['Is Nifty in a bull phase?','Mon 11:30','0.7%'],['Bear / Base / Bull for Nifty 50','Mon 11:42','1.3%'],['Compare HDFC and ICICI','Mon 12:05','2%']],
    'Watchlist review':[['Review my watchlist','Mon 17:10','2%'],['Rebalance suggestions for my watchlist','Mon 17:25','6%']],
    'My portfolio':[['Analyze my portfolio','Yesterday 18:02','5.2%'],['What to keep and what to replace','Yesterday 18:20','3.5%']] };
  function openChatUse(name){
    const q = QS[name] || [[name,'Today 10:12','0.7%']], sum = q.reduce((a, x) => a + parseFloat(x[2]), 0);
    modal(`<h3>${name}</h3><div class="cs"><div>This chat used<b>${+sum.toFixed(1)}%</b></div><div>Questions<b>${q.length}</b></div><div>Of this week<b>${+(sum * 1.6).toFixed(1)}%</b></div></div>
      <p style="margin:6px 0 0;font:600 13px Sora;color:#171829">Usage per question</p>
      ${q.map((x, i) => `<div class="cq"><i>${i + 1}</i><div>${x[0]}<span>${x[1]}</span></div><b>${x[2]}</b></div>`).join('')}
      <button class="wx-cta" data-open="${name}">Open this chat</button>`);
  }
  function openDemo(){
    modal(`<h3>Plan state</h3><p class="sm">For testing. Sets the plan, AI usage and screens.</p><div>${DEMO.map(d => `<button class="item" data-st="${d[0]}">${d[1]}</button>`).join('')}</div>`);
  }
  M.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-close]')) { closeM(); return; }
    const cy = t.closest('[data-cy]'); if (cy) { cycle = cy.dataset.cy; openProSheet(); return; }
    const pk = t.closest('[data-pk]'); if (pk) { openTopups(+pk.dataset.pk); return; }
    if (t.closest('[data-auto]')) { auto = !auto; openTopups(); return; }
    const by = t.closest('[data-buy]'); if (by) { const was = S.plan; Object.assign(S, { plan:by.dataset.buy, pct:0, pack:0, tuUsed:0 }); save(); closeM(); refresh(); openView('plan');
      wxToast(was === 'lapsed' ? 'Welcome back · your weekly AI usage is reset to 100%' : 'You’re a Waya Believer · ' + PLANS[S.plan][0] + ' plan is active'); return; }
    if (t.closest('[data-pay]')) { S.pack = (S.pack || 0) + pack; S.tuUsed = S.tuUsed || 0; save(); closeM(); refresh(); wxToast('+' + pack + '% top-up added · used after your weekly limit'); return; }
    const op = t.closest('[data-open]'); if (op) { closeM(); const i = CHATS.findIndex(c => c[0] === op.dataset.open); if (i >= 0) openChat(i); else { CHATS.unshift([op.dataset.open, 'Mon']); openChat(0); } return; }
    const st = t.closest('[data-st]'); if (st) { closeM(); if (st.dataset.st === 'push') { showPush(); return; }
      S = Object.assign({ answers:1 }, PRESETS[st.dataset.st]); save(); refresh();
      if (S.plan === 'ended' || S.plan === 'lapsed') setTimeout(() => wxToast(S.plan === 'ended' ? 'Your free trial has ended · see plans' : 'Your Pro plan has ended · top-ups saved till 26 Mar'), 300); }
  });

  /* clicks inside the three pages */
  $$('#vAiu,#vPlan,#vXpl').forEach(el => el.addEventListener('click', e => {
    const t = e.target;
    const ch = t.closest('[data-chat]'); if (ch) { openChatUse(ch.dataset.chat); return; }
    const pk = t.closest('[data-pack]'); if (pk) { el.querySelectorAll('[data-pack]').forEach(x => x.classList.toggle('on', x === pk)); pack = +pk.dataset.pack; return; }
    if (t.closest('[data-auto]')) { auto = !auto; t.closest('[data-auto]').classList.toggle('off', !auto); return; }
    if (t.closest('[data-go="aiu"]')) { openView('aiu'); return; }
    if (t.closest('[data-cur]')) { openView('plan'); return; }
    if (t.closest('[data-pro]')) { openView('xpl'); return; }
    const pl = t.closest('[data-pl]'); if (pl) { xSel = pl.dataset.pl; renderExplore('#' + el.id); return; }
    const ap = t.closest('[data-ap]'); if (ap) { const k = ap.dataset.ap; if (k !== 'eq') xApps[k] = !xApps[k]; xSel = Object.values(xApps).filter(Boolean).length >= 2 ? '' : xSel; renderExplore('#' + el.id); return; }
    if (t.closest('[data-cta]')) {
      if (el.id === 'vAiu' && hasTopup()) { openTopups(pack); return; }
      if (el.id === 'vXpl' || (el.id === 'vPlan' && !isPaid() && S.plan !== 'trial')) {
        const combo = Object.values(xApps).filter(Boolean).length >= 2;
        const k = xSel || (combo ? 'combo' : '');
        if (!k) { wxToast('Pick Quarterly, Yearly or a Combo first'); return; }
        const was = S.plan; Object.assign(S, { plan:k, pct:0, pack:0, tuUsed:0 }); save(); refresh(); openView('plan');
        wxToast(was === 'lapsed' ? 'Welcome back · your weekly AI usage is reset to 100%' : 'You’re a Waya Believer · ' + PLANS[k][0] + ' plan is active'); return; }
      openView('xpl');
    }
  }));

  /* ---------- banner over the search bar, toast, push ---------- */
  function paintBanner(){
    const b = $('#wxBn'); let h = '', cls = '';
    if (S.plan === 'trial' && S.pct >= 100) { cls = 'dk'; h = `<span class="t">You've used this month's free allowance.</span><span class="m">Resets 26 Nov. Calls, Watch To Buy and history still work.</span><span class="sp"></span><button class="b" data-b="pro">Get Pro</button>`; }
    else if (S.plan === 'trial' && S.pct >= 80 && !S.dis80) { cls = 'lt'; h = `<span class="t">80% of this month's free allowance used</span><span class="m">· Resets 26 Nov</span><span class="sp"></span><button class="lk" data-b="pro">See Pro Plans</button>`; }
    else if (isPaid() && atLimit()) { cls = 'dk'; h = `<span class="t">Weekly limit reached.</span><span class="m">Resets Mon 9:00 AM.</span><span class="sp"></span><button class="b" data-b="topup">Buy top-ups</button>`; }
    else if (S.plan === 'ended' || S.plan === 'lapsed') { cls = 'dk'; h = `<span class="t">${S.plan === 'ended' ? 'Your free trial has ended.' : 'Your Pro plan has ended.'}</span><span class="m">${S.plan === 'lapsed' ? 'Top-ups saved till 26 Mar.' : 'Calls, Watch To Buy and history still work.'}</span><span class="sp"></span><button class="b" data-b="pro">See plans</button>`; }
    if (cls === 'dk' && S.disDk === S.plan + S.pct) h = '';
    if (h) h += '<button class="x" data-b="x" aria-label="Dismiss">✕</button>';
    b.className = 'wxbn ' + cls + (h ? ' on' : ''); b.innerHTML = h;
    $('#ask').classList.toggle('locked', blocked());
  }
  $('#wxBn').addEventListener('click', e => { const k = e.target.closest('[data-b]'); if (!k) return;
    if (k.dataset.b === 'x') { if ($('#wxBn').classList.contains('dk')) S.disDk = S.plan + S.pct; else S.dis80 = 1; save(); paintBanner(); }
    else if (k.dataset.b === 'topup') openTopups(200); else openView('xpl'); });
  let tT;
  function wxToast(text){ const t = $('#wxToast'); t.innerHTML = '<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4 4 8-9" stroke="#5ee0b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span><button aria-label="Close">✕</button>';
    t.querySelector('span').textContent = text; t.querySelector('button').onclick = () => t.classList.remove('on'); t.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('on'), 3600); }
  function showPush(){ $('#wxPush').classList.add('on'); }
  $('#wxPush').addEventListener('click', () => { $('#wxPush').classList.remove('on'); if (!isPaid()) S.plan = 'yearly'; S.pct = 0; S.dis80 = 0; S.pack = 0; S.tuUsed = 0; save(); refresh(); closeView(); resetChat(); setTimeout(() => wxToast('Welcome back · your weekly allowance is fresh'), 300); });

  /* ---------- hooks into the chat ---------- */
  window.planGate = () => { if (!blocked()) return false; if (isPaid()) openTopups(200); else if (S.plan === 'trial') openProSheet(); else openView('xpl'); return true; };
  document.addEventListener('wx:answer', () => {
    S.answers = (S.answers || 0) + 1;
    if (S.plan === 'trial') S.pct = Math.min(100, S.pct + 10);
    else if (hasTopup() && S.pct >= 100) S.tuUsed = Math.min(S.pack, (S.tuUsed || 0) + 8);
    else if (isPaid()) S.pct = Math.min(100, S.pct + 6);
    save(); refresh();
  });
  window.onViewOpen = v => { if (v === 'aiu') renderUsage(); if (v === 'plan') renderPlan(); if (v === 'xpl') renderExplore(); };
  function refresh(){
    paintSide(); paintBanner();
    const r = $('#research'); if (r) r.classList.toggle('unsub', !isPaid());
    if (shell.classList.contains('panel') && window.onViewOpen) onViewOpen(pnlEl.dataset.v);
  }
  $('.quota').addEventListener('click', () => openView(isPaid() || S.plan === 'trial' ? 'aiu' : 'xpl'));
  $$('[data-sub]').forEach(b => b.addEventListener('click', () => openView(isPaid() || S.plan === 'trial' ? 'plan' : 'xpl')));
  $('#rlUnlock') && $('#rlUnlock').addEventListener('click', () => openView('xpl'));
  $('#demoBtn').addEventListener('click', openDemo);
  window.WXPLAN = { get state(){ return S; }, set(k){ S = Object.assign({ answers:1 }, PRESETS[k]); save(); refresh(); }, openTopups, openProSheet, openUpgraded };
  refresh();
})();
