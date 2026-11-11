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
  // the app's three user flows (preview.html START): new user, migrated subscriber, Pro user
  const START = { new:{ plan:'trial', pct:0, welcome:1 }, migration:{ plan:'quarterly', pct:2, upgraded:1 }, pro:{ plan:'yearly', pct:31 } };
  const FLOWS = [['new','New user','Starts the 3-month free trial'],['migration','Migrated subscriber','Existing Believer, plan now includes WayaX AI'],['pro','Full Pro user','Yearly plan, 31% of this week used']];
  let firstRun = false;
  let S = load();
  function load(){ try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.plan) return s; } catch (e) {} firstRun = true; return Object.assign({ answers:0 }, START.new); }
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
  let pack = 200, auto = true, xSel = null, xApps = { eq:1 }, cycle = 'yearly';
  function ring(size, sw, pct, fg, bg, r){ r = r || (size - sw) / 2; const L = C * r, off = L * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="${bg}" stroke-width="${sw}"/>`
      + (pct > 0 ? `<circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="${fg}" stroke-width="${sw}" stroke-dasharray="${L}" stroke-dashoffset="${off}"/>` : '') + '</svg>'; }
  function ringW(size, sw, pct, fg, bg){ const r = (size - sw) / 2, L = C * r, off = L * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="transform:rotate(-90deg)"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${sw}"/>`
      + (pct > 0 ? `<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${fg}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${off}"/>` : '') + '</svg>'; }
  /* ---------- sidebar: plan button + usage widget ---------- */
  function paintSide(){
    const trial = S.plan === 'trial', noplan = !isPaid() && !trial, [fg, bg] = tone(), t = total();
    const val = noplan ? '—' : hasTopup() ? '+' + Math.round(S.pack - (S.tuUsed || 0)) + '%' : t + '%';
    const sub = noplan ? (S.plan === 'ended' ? 'Free trial ended' : S.plan === 'lapsed' ? 'Plan ended' : 'No active plan') : trial ? 'Free trial · resets 26 Nov' : hasTopup() ? 'Using extra usage' : atLimit() ? 'Limit reached · resets Mon' : 'Resets Mon 9:00 AM';
    const cls = hasTopup() ? 'tu' : atLimit() ? 'full' : t >= 80 ? 'warn' : '';
    const planL = trial ? ['Free trial','See plans'] : isPaid() ? [`Believer · ${PLANS[S.plan][0]}`,'Manage'] : ['Become a Waya Believer','Subscribe'];
    $('.qfull').innerHTML = `<div class="wu ${cls}"><span class="wu-r">${ringW(40, 5, noplan ? 0 : t, fg, noplan ? '#3a3a44' : 'rgba(255,255,255,.1)')}<b>${val}</b></span>
      <span class="wu-t"><b>AI Usage${noplan ? '<em>See Plans</em>' : ''}</b><span>${sub}</span></span><img class="wu-c" src="fx/chev-right-nav.svg" alt=""></div>
      <div class="wu-p"><span>${planL[0]}</span><b>${planL[1]} ›</b></div>`;
    const ringOn = (S.answers || 0) > 0 || S.shown;
    $('.qmini').innerHTML = ringOn ? `${ringW(44, 4, noplan ? 0 : t, fg, 'rgba(255,255,255,.1)')}<b>${val}</b>` : `${ringW(44, 4, 0, fg, 'rgba(255,255,255,.1)')}<b style="opacity:.6">AI</b>`;
    $('.qmini').title = 'AI Usage · ' + sub;
    $$('.wcount');
  }

  /* ---------- pages and sheets: the app's own templates (preview.html) ---------- */
  const sh = $('#wxSheet');
  function sheet(html){ sh.innerHTML = '<button class="shx" data-close aria-label="Close">✕</button>' + html; $('#wxSheetHost').classList.add('on'); }
  const closeSheet = () => $('#wxSheetHost').classList.remove('on');
  $('#wxSheetHost').addEventListener('click', e => { if (e.target.id === 'wxSheetHost') closeSheet(); });
  const openPro = () => openView('xpl'), goPlan = () => openView('plan'), goUsage = () => openView('aiu');
  const chev = c => `<svg viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="${c||'#9aa0ad'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const star = c => `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" stroke="${c||'#171829'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const tick = '<svg viewBox="0 0 18 18" fill="none"><path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="#1f9d6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const back = '<svg viewBox="0 0 14 14" fill="none"><path d="M7 2L2 7l5 5M12 2L7 7l5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const gauge = '<svg class="wu-ic" viewBox="0 0 24 24" fill="none"><path d="M4 16a8 8 0 1 1 16 0" stroke="#5f6680" stroke-width="1.8" stroke-linecap="round"/><path d="M12 16l3.5-4.5" stroke="#5f6680" stroke-width="1.8" stroke-linecap="round"/></svg>';

  const tiles = (on) => `<div class="wx-tiles">
      <button data-pack="67"${on===67?' class="on"':''}><span class="k">+67%</span><span class="v">₹99</span><span class="d">4 days extra</span></button>
      <button data-pack="200"${on===200?' class="on"':''}><span class="mp">MOST POPULAR</span><span class="k">+200%</span><span class="v">₹249</span><span class="d">2 weeks extra</span><span class="sv">Save 16%</span></button>
      <button data-pack="400"${on===400?' class="on"':''}><span class="k">+400%</span><span class="v">₹499</span><span class="d">4 weeks extra</span><span class="sv">Save 16%</span></button></div>`;
  function buyBlock(onPlan){
    if (hasTopup() && !onPlan) return `<div class="wx-row"><h3 style="font-size:16px">Top-ups</h3><small>Valid till 14 Mar</small></div>
      <div class="wx-buy tu"><div class="h">Top-up in use<small>+${S.pack}% pack</small></div><p>WayaX is using your top-up.</p><p>Your weekly limit is used up.</p>${bar()}
      <div class="mt"><span>+${S.pack}% top-up bought 14 Feb</span><span>Valid till 14 Mar</span></div></div>
      <div class="wx-row wx-tg"><span>Use automatically at limit</span><i class="${auto ? '' : 'off'}" data-auto2></i></div>`;
    return `<div class="wx-row"><h3 style="font-size:16px">Buy AI Top Ups</h3><small>${onPlan ? 'AI Usage' : 'Valid 3 months'}</small></div>
      <div class="wx-buy"><div class="h">No extra usage<small>Balance 0%</small></div>${onPlan ? '' : '<p>Used only after your weekly limit runs out.</p>'}${tiles(200)}</div>`;
  }
  const bar = () => `<div class="wx-ub"><div class="h"><span>Used ${total()}%</span><em>Left ${100 - total()}%</em></div><div class="tr"><i style="width:${total()}%"></i></div></div>`;
  function renderPlan(){
    const el = $('#plan'), trial = S.plan === 'trial', tu = hasTopup(), [fg, bg] = tu ? ['#a05ec8','#ecd3fd'] : tone();   // Figma 1199:3212 keeps the purple ring
    const P = PLANS[S.plan] || ['Free trial','₹0','',''];
    const rib = trial ? 'FREE TRIAL' : tu ? 'TOP-UP IN USE' : '';
    const sub = S.plan === 'combo' ? ['Equity + FnO + MCX', 'Believer till 30 Aug 2027'] : trial ? [] : [tu ? 'Believer till 30 Aug 2027' : 'Believer till 30 Jan 2027'];
    const keys = trial ? ['WayaX AI','Resets 26 Nov'] : tu ? ['Weekly limit + top-ups','Top-ups valid till 14 Mar']
      : S.plan === 'combo' ? ['WayaX AI · ' + (100 - S.pct) + '% left this week','One limit · AI only in WayaX'] : ['WayaX AI','Resets Mon 9:00 AM'];
    const foot = trial ? 'Top-ups: with a Believer plan' : tu ? 'Weekly limit back Mon 9:00 AM' : 'Top-Up Usage: none';
    el.innerHTML = `<header class="wx-hd ctr"><button class="wx-bk" aria-label="Back">${back}</button><h1>${trial ? 'You’re on the free trial' : 'You’re a Waya Believer'}</h1>${trial ? '' : '<p>Enjoy your benefits</p>'}</header>
      <div class="wx-sheet pl" style="gap:50px"><div class="pg" style="gap:${S.plan === 'combo' ? 10 : 12}px"><h3>Active plan</h3>
        <div class="pg" style="gap:${trial ? 8 : S.plan === 'combo' ? 10 : 12}px"><div class="wx-apr${trial ? ' tr' : ''}${tu ? ' tu' : ''}${S.plan === 'combo' ? ' cmb' : ''}">${rib ? `<span class="rib">${rib}</span>` : ''}<div class="in"><div class="t" style="gap:${trial ? 16 : S.plan === 'quarterly' ? 12 : 14}px"><span class="n">${P[0]}</span>${sub.map(d => `<span class="d">${d}</span>`).join('')}
          <span class="k"><i style="background:#a05ec8"></i>${keys[0]}</span><span class="k"><i style="background:#c9cdd6"></i>${keys[1]}</span></div>
          <div class="wx-big">${ring(108, 11, total(), fg, bg, 45)}<div><b>${total()}%</b><span>${tu ? 'TOTAL USED' : 'USED'}</span></div></div></div>
          <div class="f"><span>${foot}</span><b data-go="aiu">View AI usage ${chev('#7b479b')}</b></div></div>
        ${tu ? `<div class="wx-tu"><span class="lb">Top-Up Usage</span>${bar()}<div class="f"><span>Valid 3 months</span><b data-go="aiu">View AI usage ${chev('#08645d')}</b></div></div>` : ''}
        ${S.plan === 'combo' ? '<div class="apps" style="margin-top:-10px"><div class="wx-app">Waya - Futures and Options<span class="b">INSTALL / OPEN</span></div><div class="wx-app">Waya - MCX Commodities<span class="b">INSTALL / OPEN</span></div></div>' : ''}
        <div class="wx-paid">${trial ? 'Trial ends on 26 Jan 2027' : P[3]}</div></div></div>
        <div class="pg" style="gap:17px"><div class="wx-row bh"><h3>Buy AI Top Ups</h3><small>AI Usage</small></div>
          <div class="wx-buy"><div class="h">No extra usage<small>Balance 0%</small></div>${tiles(200)}</div></div>
        <button class="wx-xpl" data-pro>Explore All plans ${chev('#323232')}</button>
      </div><div class="wx-ft"><button data-cta>Upgrade / Renew</button></div>`;
  }

  /* ---------- 4 · AI Usage page (Figma 1220:4675, 1227:6045 top-up in use, 1220:4917 chat sheet) ---------- */
  const DAYS = [['Today','2% used',[['ICICI Bank deep dive','1 question · 0.7%'],['Stock ideas for November','1 question · 1.3%']]],
    ['Yesterday','8.7% used',[['My portfolio','2 questions · 8.7%']]], ['Monday','12% used',[['Nifty outlook','3 questions · 4%']]]];
  const msg = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v5A1.5 1.5 0 0 1 11.5 11H7l-3 2.5V11A1 1 0 0 1 3 10z" stroke="#a05ec8" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  function renderUsage(){
    const el = $('#aiu'), trial = S.plan === 'trial', tu = hasTopup(), [fg, bg] = tone();
    const chip = tu ? '<span class="wx-chip te">TOP-UP IN USE</span>' : `<span class="wx-chip">${trial ? 'FREE TRIAL' : 'BELIEVER · ' + (S.plan === 'combo' ? 'COMBO' : PLANS[S.plan][0].toUpperCase())}</span>`;
    const left = tu ? `${100 - total()}% left · weekly limit + top-ups` : trial ? `${100 - S.pct}% left this month` : `${100 - S.pct}% left this week`;
    const list = DAYS.map(d => `<div class="wx-gd"><span>${d[0]}</span><b>${d[1]}</b></div>` + d[2].map(c => `<button class="wx-ch" data-chat="${c[0]}"><span class="ic">${msg}</span><span class="tx"><b>${c[0]}</b><span>${c[1]}</span></span><span class="va">View all ›</span></button>`).join('')).join('');
    el.innerHTML = `<header class="wx-hd ctr"><button class="wx-bk" aria-label="Back">${back}</button><h1>AI Usage</h1></header>
      <div class="wx-sheet"><div class="wx-row">${chip}<small>${tu ? 'Limit back Mon 9:00 AM' : trial ? 'Resets 26 Nov' : 'Resets Mon 9:00 AM'}</small></div>
        <div class="wx-hero">${ring(200, 18, total(), fg, bg, 84)}<div><b>${total()}%</b><span>OF TOTAL USED</span></div></div>
        <p class="wx-left">${left}</p>
        <div class="wx-row"><h3 style="font-size:16px">Usage history</h3><small>Scroll for more</small></div>
        <div class="wx-box">${list}</div>
        ${trial ? '' : buyBlock(0)}
      </div><div class="wx-ft"><button data-cta>${tu ? 'Buy top-ups' : 'Upgrade / Renew'}</button></div>`;
  }

  const qIc = '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="6" r="4" fill="#3c87c7"/><circle cx="6" cy="13" r="4" fill="#6bb6f3"/><circle cx="20" cy="13" r="4" fill="#6bb6f3"/><circle cx="13" cy="20" r="4" fill="#3c87c7"/></svg>';
  const yIc = '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="6" r="4" fill="#a5651d"/><circle cx="6" cy="13" r="4" fill="#edb168"/><circle cx="20" cy="13" r="4" fill="#edb168"/><circle cx="13" cy="20" r="4" fill="#a5651d"/></svg>';
  const wck = '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function renderExplore(){
    const el = $('#xpl'); const has = S.plan === 'trial' || isPaid(), P = PLANS[S.plan]; el.classList.toggle('ns', !has);
    if (xSel == null) xSel = S.plan === 'yearly' ? 'yearly' : (S.plan === 'quarterly' || S.plan === 'trial') ? 'quarterly' : '';
    const cur = has ? `<div style="display:flex;flex-direction:column;gap:12px"><h3 class="xp-h">Current plan</h3>
      <div class="xp-card cur"><div class="r">${P ? P[0] : 'Free trial'}<b>${P ? P[1] : '₹0'}</b></div><div class="s">${S.plan === 'combo' ? '12 months' : S.plan === 'yearly' ? '12 months' : '3 months'}</div>
      <button class="vl" data-cur>View Current Plan ${chev('#7b479b')}</button></div>
      <div class="wx-paid">${P ? P[3] : 'Trial ends on 26 Jan 2027'}</div></div>`
      : `<div class="xp-card nf"><div class="r">Free trial<b>₹0</b></div><div class="s">3 months · 10 AI uses a month</div><span class="c">Every answer type, nothing hidden</span></div>`;
    const pl = (k, c, ic, n, m, pr) => `<button class="xp-pl ${c}${xSel === k ? ' on' : ''}" data-pl="${k}"><span class="ic">${ic}</span><span class="tx"><b>${n}</b>Recommendations + AI<span>${m}</span></span><span class="pr">${pr}</span></button>`;
    const ap = (k, img, n, p, o, bt, rt) => `<button class="xp-ap${xApps[k] ? ' on' : ''}" data-ap="${k}"><img src="${img}" alt=""><span class="n">${n}</span><span class="p">${p}</span><s>${o}</s><span class="ck" style="color:${xApps[k] ? '#fff' : '#8a4baf'}">${wck}</span><span class="bt">${bt}</span><span class="rt">${rt} Rated ★★★★★</span></button>`;
    el.innerHTML = `<header class="wx-hd ctr"><button class="wx-bk" aria-label="Back">${back}</button><h1>Explore plans</h1></header>
      <div class="wx-sheet" style="gap:20px">${cur}
        <div style="display:flex;flex-direction:column;gap:16px"><h3 class="xp-h">Pro plans</h3>${pl('quarterly','q',qIc,'Quarterly','3 months','₹2500')}${pl('yearly','y',yIc,'Yearly','12 months','₹4500')}</div>
        <div style="display:flex;flex-direction:column;gap:16px"><h3 class="xp-h" style="padding:0 11px">What Pro includes</h3><div class="xp-inc">${['Waya research calls: today, weekly, open and exited','WayaX AI: company questions, stock ideas, Waya Score','Portfolio review and rebalancing','Financial model from your Excel'].map(x => `<div>${tick}${x}</div>`).join('')}</div></div>
        <div class="xp-cb"><div class="xp-cbx"><h4>Combo Yearly plans</h4><div><div class="p1">Pick 2 or 3 apps</div><div class="p2">the more you add, the less each costs</div></div>
          <div class="xp-apps">${ap('eq','../assets/apps/icon.svg','Waya Equity','₹3,000','₹4,500','Current App','4.5')}${ap('fno','../assets/apps/icon-mcx.svg','Waya FnO','₹5,000','₹20,000','INSTALL','4.7')}${ap('mcx','../assets/apps/icon-mcx.svg','Waya MCX','₹7,500','₹12,000','INSTALL','3.7')}</div>
          <div class="nt">Note: A minimum of 2 subscriptions is required to create a Combo Yearly Plan. If Waya Equity Basic is already subscribed, Equity will be pre-selected automatically when creating the Combo Plan.</div></div></div>
        <div style="display:flex;flex-direction:column;gap:17px"><div class="wx-row"><h3 style="font-size:16px;padding:0 10px">Buy AI Top Ups</h3><small>Valid 3 months</small></div>
          <div class="wx-buy"><div class="h">No extra usage<small>Balance 0%</small></div><p>Used only after your weekly limit runs out.</p>${tiles(200)}</div></div>
      </div><div class="wx-ft"><button data-cta>Upgrade / Renew</button></div>`;
  }

  function openProSheet(kind){
    kind = kind || (S.plan === 'ended' ? 'ended' : S.plan === 'lapsed' ? 'lapsed' : 'pro');
    const t = { pro:['Your free trial has ended',''], ended:['Your free trial has ended',''],
      lapsed:['Your Pro plan has ended','Your unused top-ups are saved till 26 Mar and come back when you renew.'] }[kind];
    const price = cycle === 'yearly' ? ['₹6,500','per year · about ₹542 a month'] : ['₹4,500','per quarter · about ₹1,500 a month'];
    sheet(`<h3>${t[0]}</h3>${t[1] ? `<p class="sm">${t[1]}</p>` : ''}
      <div class="seg"><button data-cy="quarterly"${cycle==='quarterly'?' class="on"':''}>Quarterly</button><button data-cy="yearly"${cycle==='yearly'?' class="on"':''}>Yearly</button></div>
      <div class="pr">${price[0]}</div><div class="pm">${price[1]}</div>
      <div class="ck">${tick}All live research Recommendations</div><div class="ck">${tick}AI Usage, 60× the free Usage, resets weekly.</div><div class="ck">${tick}Portfolio review, models, Watch To Buy</div>
      <button class="cta" data-buy="${cycle}">Continue · ${price[0]}</button><button class="nn" data-close>Not now</button>`);
    sh.dataset.kind = kind;
  }
  function openTopups(p){
    pack = p || pack;
    const row = (k, l, pr, sv, mp) => `<button class="op${pack===k?' on':''}" data-pk="${k}">${mp ? '<span class="mp">Most popular</span>' : ''}<span>${l}${sv ? '<span class="sv">Save 16%</span>' : ''}</span><span>${pr}</span></button>`;
    sheet(`<h3>Top-ups</h3><p class="sm">Used only after your weekly limit. Lasts 3 months.</p>
      ${row(67,'+67%, 4 days extra','₹99')}${row(200,'+200%, 2 weeks extra','₹249',1,1)}${row(400,'+400%, 4 weeks extra','₹499',1)}
      <div class="tgl"><span>Use automatically at limit</span><i class="${auto ? '' : 'off'}" data-auto></i></div>
      <button class="cta" data-pay>Buy</button>`);
    sh.dataset.kind = 'topup';
  }
  function openUpgraded(){
    const P = PLANS[S.plan] || PLANS.quarterly;
    sheet(`<span class="shi">✦</span><h3>Your plan now includes WayaX AI</h3><p class="sm">Ask WayaX anything about stocks, funds and your portfolio.</p><div class="ls"><div><span>Plan</span><b>Pro · ${P[0]}</b></div><div><span>Believer till</span><b>${P[2].replace('Believer till ','')}</b></div>
      <div><span>WayaX AI</span><b>Weekly limit, included</b></div><div><span>Next renewal</span><b>${P[1]}</b></div></div>
      <p class="sm">Nothing extra to pay today.</p><button class="cta" data-close>Try WayaX AI</button>`);
    sh.dataset.kind = 'upgraded';
  }
  const QS = { 'Nifty outlook':[['Is Nifty in a bull phase?','Mon 11:30','0.7%'],['Bear / Base / Bull for Nifty 50','Mon 11:42','1.3%'],['Compare HDFC and ICICI','Mon 12:05','2%']],
    'Watchlist review':[['Review my watchlist','Mon 17:10','2%'],['Rebalance suggestions for my watchlist','Mon 17:25','6%']] };
  function openChatUse(name){
    const q = QS[name] || [[name,'Today 10:12','0.7%']], sum = q.reduce((a, x) => a + parseFloat(x[2]), 0);
    sheet(`<div class="wx-row" style="display:flex;justify-content:space-between;align-items:center"><h3 style="font-size:16px;margin:0">${name}</h3><span class="sm" style="margin:0">Monday</span></div>
      <div class="cs"><div>This chat used<b>${name === 'Nifty outlook' ? '4' : +sum.toFixed(1)}%</b></div><div>Questions<b>${q.length}</b></div><div>Of this week<b>${name === 'Nifty outlook' ? '6.5' : +(sum * 1.6).toFixed(1)}%</b></div></div>
      <h3 style="font-size:14px;margin:0">Usage per question</h3>
      ${q.map((x, i) => `<div class="cq"><i>${i + 1}</i><div>${x[0]}<span>${x[1]}</span></div><b>${x[2]}</b></div>`).join('')}
      <button class="ol" data-close>Open this chat</button>`);
    sh.dataset.kind = 'chat';
  }

  function openDemo(){ sheet(`<h3>Demo flows</h3><p class="sm">Start a user flow from the beginning, or jump to any plan state.</p>`
      + FLOWS.map(f => `<button class="item" data-flow="${f[0]}">${f[1]} <span>${f[2]}</span></button>`).join('')
      + `<p class="sm" style="margin-top:10px">Plan state</p>` + DEMO.map(d => `<button class="item" data-st="${d[0]}">${d[1]}</button>`).join('')); sh.dataset.kind = 'demo'; }
  function openPick(){ sheet(`<h3>Who is signing in?</h3><p class="sm">Pick a user to start that flow.</p>` + FLOWS.map(f => `<button class="item" data-flow="${f[0]}">${f[1]} <span>${f[2]}</span></button>`).join('')); sh.dataset.kind = 'pick'; }
  function startFlow(k){ S = Object.assign({ answers:0 }, START[k]); save(); closeSheet(); closeView(); resetChat(); refresh(); arrive(); }
  function arrive(){
    if (S.welcome) { S.welcome = 0; save(); setTimeout(() => wxToast('Free for 3 months · everything included'), 700); }
    if (S.upgraded) { S.upgraded = 0; save(); setTimeout(openUpgraded, 700); }
    if (S.plan === 'ended' && !S.endShown) { S.endShown = 1; save(); setTimeout(() => wxToast('Your free trial has ended · see plans in the menu'), 700); }
    if (S.plan === 'lapsed' && !S.endShown) { S.endShown = 1; save(); setTimeout(() => wxToast('Your Pro plan has ended · top-ups saved till 26 Mar'), 700); }
  }
  sh.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-close]')) { closeSheet(); if (sh.dataset.kind === 'chat') { const n = $('#wxSheet h3').textContent; let i = CHATS.findIndex(c => c[0] === n); if (i < 0) { CHATS.unshift([n, 'Mon']); i = 0; } if (t.closest('.ol')) window.openChat(i); } return; }
    const fl = t.closest('[data-flow]'); if (fl) { startFlow(fl.dataset.flow); return; }
    const st = t.closest('[data-st]'); if (st) { closeSheet(); if (st.dataset.st === 'push') { $('#wxPush').classList.add('on'); return; }
      S = Object.assign({ answers:1, shown:1 }, PRESETS[st.dataset.st]); save(); refresh();
      if (S.plan === 'ended' || S.plan === 'lapsed') setTimeout(() => wxToast(S.plan === 'ended' ? 'Your free trial has ended' : 'Your Pro plan has ended'), 300); return; }
    const cy = t.closest('[data-cy]'); if (cy) { cycle = cy.dataset.cy; openProSheet(sh.dataset.kind); return; }
    const pk = t.closest('[data-pk]'); if (pk) { openTopups(+pk.dataset.pk); return; }
    if (t.closest('[data-auto]')) { auto = !auto; openTopups(); return; }
    const by = t.closest('[data-buy]');
    if (by) { const was = S.plan; Object.assign(S, { plan:by.dataset.buy, pct:0, pack:0, tuUsed:0 }); save(); closeSheet(); refresh();
      wxToast(was === 'lapsed' ? 'Welcome back · your weekly AI usage is reset to 100%' : 'You’re a Waya Believer · ' + PLANS[S.plan][0] + ' plan is active'); return; }
    if (t.closest('[data-pay]')) { S.pack = (S.pack || 0) + pack; S.tuUsed = S.tuUsed || 0; save(); closeSheet(); refresh(); wxToast('+' + pack + '% top-up added · used after your weekly limit'); }
  });
  ['plan','aiu','xpl'].forEach(id => $('#' + id).addEventListener('click', e => {
    const t = e.target;
    if (t.closest('.wx-bk')) { closeView(); return; }
    if (id === 'xpl') {
      if (t.closest('[data-cur]')) { goPlan(); return; }
      const pl = t.closest('[data-pl]'); if (pl) { xSel = pl.dataset.pl; renderExplore(); return; }
      const ap = t.closest('[data-ap]'); if (ap) { const k = ap.dataset.ap; if (k !== 'eq') xApps[k] = !xApps[k]; renderExplore(); return; }
      const pk = t.closest('[data-pack]'); if (pk) { $$('#xpl [data-pack]').forEach(x => x.classList.toggle('on', x === pk)); pack = +pk.dataset.pack; return; }
      if (t.closest('[data-cta]')) { const combo = Object.values(xApps).filter(Boolean).length >= 2 && (xApps.fno || xApps.mcx); const k = xSel || (combo ? 'combo' : '');
        if (!k) { wxToast('Pick Quarterly, Yearly or a Combo first'); return; }
        const was = S.plan; Object.assign(S, { plan:k, pct:0, pack:0, tuUsed:0 }); save(); refresh(); goPlan();
        wxToast(was === 'lapsed' ? 'Welcome back · your weekly AI usage is reset to 100%' : 'You’re a Waya Believer · ' + PLANS[k][0] + ' plan is active'); }
      return; }
    const ch = t.closest('[data-chat]'); if (ch) { openChatUse(ch.dataset.chat); return; }
    const pk = t.closest('[data-pack]'); if (pk) { $$('#' + id + ' [data-pack]').forEach(x => x.classList.toggle('on', x === pk)); pack = +pk.dataset.pack; return; }
    if (t.closest('[data-auto2]')) { auto = !auto; renderUsage(); return; }
    if (t.closest('[data-go="aiu"]')) { goUsage(); return; }
    if (t.closest('[data-pro]')) { openPro(); return; }
    if (t.closest('[data-cta]')) { if (id === 'aiu' && hasTopup()) { S.pack = (S.pack || 0) + pack; save(); refresh(); wxToast('+' + pack + '% top-up added'); } else openPro(); }
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
  window.planGate = () => { if (!blocked()) return false; if (isPaid()) openTopups(200); else openView('xpl'); return true; };
  document.addEventListener('wx:answer', () => {
    S.answers = (S.answers || 0) + 1;
    if (S.plan === 'trial') S.pct = Math.min(100, S.pct + 10);
    else if (hasTopup() && S.pct >= 100) S.tuUsed = Math.min(S.pack, (S.tuUsed || 0) + 8);
    else if (isPaid()) S.pct = Math.min(100, S.pct + 6);
    save(); refresh();
  });
  window.onViewOpen = v => { if (v === 'aiu') renderUsage(); if (v === 'plan') { if (!isPaid() && S.plan !== 'trial') { openView('xpl'); return; } renderPlan(); } if (v === 'xpl') renderExplore(); };
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
  if (firstRun) setTimeout(openPick, 500); else arrive();
})();
