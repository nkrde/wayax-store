/* WayaX web: welcome, sign up, log in and guest flows (same rules as the mobile app) */
(function(){
const $=s=>document.querySelector(s);
const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const css=`
#ob{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;color:#171829;
 background:radial-gradient(40% 50% at 20% 15%,rgba(124,196,190,.45),transparent 70%),radial-gradient(35% 45% at 85% 20%,rgba(178,150,214,.45),transparent 70%),radial-gradient(50% 40% at 50% 100%,rgba(222,190,160,.35),transparent 70%),#cfd3dc;transition:opacity .35s}
#ob.out{opacity:0;pointer-events:none}
#ob .card{width:400px;max-width:calc(100vw - 32px);background:#fff;border-radius:22px;box-shadow:0 24px 70px rgba(23,24,41,.18);padding:32px;position:relative}
#ob .obbr{display:flex!important;flex-direction:row!important;align-items:center;gap:10px;font:700 20px Sora,Inter,sans-serif}#ob .obbr img{width:28px;height:28px}
#ob .bars{display:flex;gap:6px;margin:20px 0 22px}#ob .bars i{flex:1;height:3px;border-radius:2px;background:#e6e8ef}#ob .bars i.on{background:#171829}
#ob h2{font:700 21px/1.25 Sora,Inter,sans-serif;margin:0 0 8px}#ob p.d{font-size:13.5px;line-height:1.6;color:#5f6680;margin:0 0 20px}
#ob label{display:block;font:600 12.5px Inter;margin:0 0 6px}#ob .hint{font-size:11.5px;color:#8a90a6;margin:6px 0 0}
#ob .row{display:flex;gap:8px}#ob .cc{width:62px;height:46px;border-radius:12px;background:#f3f4f8;border:1px solid #e3e6ef;display:flex;align-items:center;justify-content:center;font:600 14px Inter}
#ob input{width:100%;height:46px;border-radius:12px;border:1px solid #d9ddec;padding:0 14px;font:500 15px Inter;outline:none;box-sizing:border-box}#ob input:focus{border-color:#171829;box-shadow:0 0 0 3px rgba(23,24,41,.08)}
#ob input.bad{border-color:#e5484d}#ob .err{color:#e5484d;font-size:12px;margin-top:6px;display:none}#ob .err.on{display:block}
#ob .f{margin-bottom:16px}
#ob .btn{width:100%;height:50px;border-radius:13px;border:0;background:#171829;color:#fff;font:600 15px Inter;cursor:pointer;margin-top:12px}#ob .btn:disabled{background:#8a8c94;cursor:default}
#ob .btn.sec{background:#fff;color:#171829;border:1px solid #d9ddec}
#ob .lnk{display:block;width:100%;background:none;border:0;margin-top:12px;font:600 13px Inter;color:#b7791f;cursor:pointer}#ob .lnk.mut{color:#8a90a6;font-weight:500;font-size:12px}
#ob .g{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:48px;border-radius:13px;border:1px solid #d9ddec;background:#fff;font:600 14px Inter;cursor:pointer}
#ob .or{display:flex;align-items:center;gap:10px;font-size:12px;color:#9aa0ad;margin:18px 0 12px}#ob .or:before,#ob .or:after{content:'';flex:1;height:1px;background:#e3e6ef}
#ob .two{display:flex;gap:10px}#ob .two .g{height:42px;font-size:13px}
#ob .acct{display:flex;align-items:center;gap:12px;width:100%;padding:14px;border-radius:16px;border:1.5px solid #e3e6ef;background:#fff;cursor:pointer;text-align:left;margin-bottom:10px}
#ob .acct:hover{border-color:#171829}#ob .av{width:40px;height:40px;border-radius:20px;background:#dceefd;color:#175ea1;display:flex;align-items:center;justify-content:center;font:700 16px Sora}
#ob .acct span.t{flex:1;display:flex;flex-direction:column;font-size:12.5px;color:#5f6680}#ob .acct b{font:600 15px Inter;color:#171829}
#ob .linked{display:flex;align-items:center;gap:12px;padding:14px;border-radius:16px;background:#e7f7ef;border:1px solid #b7e4cc;font-size:12.5px;color:#4b5563}#ob .linked b{display:block;font-size:14px;color:#171829}
#ob .welcome{text-align:center}#ob .welcome .tile{width:92px;height:92px;margin:6px auto 18px;border-radius:24px;background:#0b0b10;display:flex;align-items:center;justify-content:center}#ob .welcome .tile img{width:46px}
#ob .welcome h2{font-size:24px}#ob .demo{position:absolute;top:14px;right:16px;font-size:11px;color:#9aa0ad;background:none;border:0;cursor:pointer}
#ob .dlg{position:absolute;inset:0;border-radius:22px;background:rgba(23,24,41,.4);display:flex;align-items:center;justify-content:center;padding:28px}
#ob .dlg .in{width:100%;background:#fafafc;border-radius:18px;overflow:hidden;text-align:center;padding-top:18px}
#ob .dlg .in b{display:block;font:600 15px Inter;padding:0 16px}#ob .dlg .in p{font-size:12.5px;color:#5f6680;padding:6px 16px 14px;margin:0;line-height:1.5}
#ob .dlg .in button{display:block;width:100%;height:44px;border:0;border-top:1px solid #e3e5ec;background:none;color:#0a6cff;font:500 15px Inter;cursor:pointer}
.wg-bar{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:800;display:flex;align-items:center;gap:10px;background:#171829;color:#fff;border-radius:99px;padding:6px 6px 6px 16px;font:500 13px Inter;box-shadow:0 10px 30px rgba(23,24,41,.2)}
.wg-bar button{border:0;border-radius:99px;height:30px;padding:0 14px;font:600 12.5px Inter;cursor:pointer;background:#fff;color:#171829}.wg-bar button.l{background:transparent;color:#fff}
#wgSheet{position:fixed;inset:0;z-index:8500;background:rgba(23,24,41,.35);display:none;align-items:center;justify-content:center;font-family:Inter,sans-serif}#wgSheet.on{display:flex}
#wgSheet .c{width:380px;background:#fff;border-radius:20px;padding:26px;box-shadow:0 24px 60px rgba(23,24,41,.2)}#wgSheet h3{font:700 19px Sora,Inter;margin:0 0 8px}#wgSheet p{font-size:13px;color:#5f6680;line-height:1.55;margin:0 0 14px}
#wgSheet .ck{font-size:13px;margin:6px 0}#wgSheet .ck:before{content:'✓';color:#1f9d6b;font-weight:700;margin-right:8px}
#wgSheet button{display:block;width:100%;height:46px;border-radius:12px;border:0;font:600 14px Inter;cursor:pointer;margin-top:10px}#wgSheet .s{background:#171829;color:#fff;margin-top:18px}#wgSheet .l{background:#fff;border:1px solid #d9ddec;color:#171829}#wgSheet .n{background:none;color:#8a90a6;height:32px}
`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');
const G='<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.5 5.8c4.4-4 6.8-10 6.8-17.2z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
const LOGO='../assets/ai/logo.svg';
const S={flow:'signup',phone:'',gmail:'',gname:'',name:'',age:''};
const ob=document.createElement('div');ob.id='ob';document.body.appendChild(ob);
const bars=n=>'<div class="bars">'+[1,2,3,4].map(i=>'<i class="'+(i<=n?'on':'')+'"></i>').join('')+'</div>';
const head=n=>'<div class="obbr"><img src="'+LOGO+'" alt="">WayaX</div>'+(n?bars(n):'<div style="height:22px"></div>');
function card(html){ob.innerHTML='<div class="card">'+html+'</div>';const f=ob.querySelector('input');if(f)setTimeout(()=>f.focus(),60);}
const last=()=>LS.get('wxwLast');

function welcome(){
 card('<button class="demo" id="oDemo">Demo · start fresh</button><div class="welcome"><div class="tile"><img src="'+LOGO+'" alt=""></div><h2>Your AI for the market</h2><p class="d">Ask anything about stocks, get research from Waya’s analysts, and track what you own.</p></div>'+
 '<button class="btn" id="oNew">Get started, it’s free</button><button class="btn sec" id="oHave">I already have an account</button><button class="lnk" id="oGuest">Explore as guest</button>');
 $('#oNew').onclick=()=>{S.flow='signup';S.gmail='';S.gname='';mobile()};
 $('#oHave').onclick=login;$('#oGuest').onclick=guest;
 $('#oDemo').onclick=()=>{try{localStorage.removeItem('wxwLast')}catch(e){}welcome()};
}
function mobile(){
 const su=S.flow==='signup';
 card(head(su?1:0)+'<h2>'+(su?'Verify your mobile number':'Log in with your mobile number')+'</h2><p class="d">Enter your mobile number. We’ll send you a 6-digit code to verify it.</p>'+
 '<div class="f"><label for="oPh">Mobile number</label><div class="row"><span class="cc">+91</span><input id="oPh" inputmode="numeric" placeholder="98765 43210" maxlength="11"></div><p class="hint">Required. Standard charges may apply.</p></div>'+
 '<button class="btn" id="oSend" disabled>Send code</button><button class="lnk mut" id="oBack">Back</button>');
 const i=$('#oPh'),b=$('#oSend');i.oninput=()=>{i.value=i.value.replace(/\D/g,'').slice(0,10);b.disabled=i.value.length!==10};
 const go=()=>{if(b.disabled)return;S.phone=i.value;otp()};b.onclick=go;i.onkeydown=e=>{if(e.key==='Enter')go()};
 $('#oBack').onclick=su?welcome:login;
}
function otp(){
 const su=S.flow==='signup';
 card(head(su?2:0)+'<h2>Enter the 6-digit code</h2><p class="d">Sent to +91 '+S.phone.replace(/(\d{5})(\d{5})/,'$1 $2')+'. <a href="#" id="oEd" style="color:#b7791f;font-weight:600;text-decoration:none">Change</a></p>'+
 '<div class="f"><label for="oC">Verification code</label><input id="oC" inputmode="numeric" maxlength="6" placeholder="••••••" style="letter-spacing:8px;font-size:18px"><p class="err" id="oCe">That code didn’t work. Try again.</p><p class="hint">Any 6 digits work in this demo, except 000000.</p></div>'+
 '<button class="btn" id="oV" disabled>Verify &amp; continue</button>');
 const i=$('#oC'),b=$('#oV');i.oninput=()=>{i.value=i.value.replace(/\D/g,'').slice(0,6);b.disabled=i.value.length!==6;i.classList.remove('bad');$('#oCe').classList.remove('on')};
 const go=()=>{if(b.disabled)return;if(i.value==='000000'){i.classList.add('bad');$('#oCe').classList.add('on');return}if(su)gmail();else done(true)};
 b.onclick=go;i.onkeydown=e=>{if(e.key==='Enter')go()};$('#oEd').onclick=e=>{e.preventDefault();mobile()};
}
function gmail(){
 const on=!!S.gmail;
 card(head(3)+'<h2>Link your Gmail?</h2><p class="d">Optional. Link Google once and next time you can log in with one tap, no OTP needed.</p>'+
 (on?'<div class="linked"><span class="av">'+S.gname[0]+'</span><span style="flex:1"><b>'+S.gmail+'</b>Linked · one-tap log in is on</span><a href="#" id="oUn" style="font-weight:600;color:#b7791f;text-decoration:none;font-size:12.5px">Change</a></div><button class="btn" id="oG2">Continue</button>'
     :'<button class="g" id="oG">'+G+'Continue with Google</button><button class="lnk" id="oSkip">Skip for now</button>'));
 if(on){$('#oUn').onclick=e=>{e.preventDefault();S.gmail='';S.gname='';gmail()};$('#oG2').onclick=about;}
 else{$('#oG').onclick=()=>pick('link');$('#oSkip').onclick=()=>{S.gmail='';S.gname='';about()};}
}
function pick(mode){
 const A=[['Rahul','rahul@gmail.com'],['Rahul Work','rahul.work@gmail.com']];
 card('<div class="obbr" style="font-size:16px">'+G+'<span>Choose an account</span></div><p class="d" style="margin:6px 0 18px">to continue to WayaX</p>'+
 A.map((a,k)=>'<button class="acct" data-k="'+k+'"><span class="av">R</span><span class="t"><b>'+a[0]+'</b>'+a[1]+'</span></button>').join('')+'<button class="lnk mut" id="oPc">Cancel</button>');
 ob.querySelectorAll('.acct').forEach(b=>b.onclick=()=>{const a=A[+b.dataset.k];
  if(mode==='link'){S.gmail=a[1];S.gname=a[0].replace(/ Work$/,'');gmail();return}
  const l=last(),known=(l&&l.gmail)||'rahul@gmail.com';
  if(a[1]===known){S.name=(l&&l.name)||'Rahul';done(true);return}
  card(head(0)+'<h2>No WayaX account for this Gmail</h2><p class="d">'+a[1]+' isn’t linked to an account. Log in with your mobile number, then link Gmail from Profile.</p><button class="btn" id="oNp">Log in with phone OTP</button><button class="btn sec" id="oNs">Sign up instead</button><button class="lnk mut" id="oNc">Cancel</button>');
  $('#oNp').onclick=()=>{S.flow='login';mobile()};$('#oNs').onclick=()=>{S.flow='signup';S.gmail='';mobile()};$('#oNc').onclick=login;});
 $('#oPc').onclick=mode==='link'?gmail:login;
}
function about(){
 card(head(4)+'<h2>Your name and age</h2><p class="d">We use these to personalise WayaX and check that you’re eligible to join.</p>'+
 '<div class="f"><label for="oN">Name</label><input id="oN" placeholder="Your name" value="'+(S.gname||'')+'"><p class="hint">'+(S.gname?'From your Google account. You can change it.':'What should we call you?')+'</p></div>'+
 '<div class="f"><label for="oA">Age</label><input id="oA" inputmode="numeric" maxlength="3" placeholder="Your age in years"><p class="err" id="oAe">You need to be 18 or older to join WayaX.</p></div>'+
 '<button class="btn" id="oAb" disabled>Continue</button><p class="hint" style="text-align:center;margin-top:10px">Next, we’ll ask to use your location.</p>');
 const n=$('#oN'),a=$('#oA'),b=$('#oAb');const chk=()=>{a.value=a.value.replace(/\D/g,'').slice(0,3);a.classList.remove('bad');$('#oAe').classList.remove('on');b.disabled=!(n.value.trim().length>=2&&+a.value>=1)};
 n.oninput=chk;a.oninput=chk;if(S.gname)setTimeout(()=>a.focus(),80);
 const go=()=>{if(b.disabled)return;if(+a.value<18){a.classList.add('bad');$('#oAe').classList.add('on');return}S.name=n.value.trim().replace(/^./,c=>c.toUpperCase());S.age=a.value;loc()};
 b.onclick=go;a.onkeydown=e=>{if(e.key==='Enter')go()};
}
function loc(){
 ob.querySelector('.card').insertAdjacentHTML('beforeend','<div class="dlg"><div class="in"><b>Allow “WayaX” to use your location?</b><p>We use your city to show local market timings and relevant ideas. You can change this in your browser settings.</p><button data-l="1">Allow while visiting the site</button><button data-l="1">Allow this time</button><button data-l="0">Don’t allow</button></div></div>');
 ob.querySelectorAll('.dlg button').forEach(b=>b.onclick=()=>{S.city=b.dataset.l==='1'?'Mumbai':'';done(false)});
}
function login(){
 const l=last();S.flow='login';
 card(head(0)+'<h2>Log in to WayaX</h2><p class="d">Pick up where you left off.</p>'+
 (l?'<button class="acct" id="oSaved"><span class="av">'+(l.name||'R')[0]+'</span><span class="t"><b>Continue as '+(l.name||'Rahul')+'</b>+91 '+(l.phone||'98765 43210').replace(/^(\d{2})\d{3}\s?\d{2}(\d{3})$/,'$1••• ••$2')+' · last used here</span><span style="color:#9aa0ad;font-size:18px">›</span></button>':'')+
 '<div class="or">or log in with</div><div class="two"><button class="g" id="oLg">'+G+'Google</button><button class="g" id="oLp">📱 Phone OTP</button></div>'+
 '<button class="lnk" id="oLn">New to WayaX? Sign up</button><button class="lnk mut" id="oLb">Back</button>');
 if(l)$('#oSaved').onclick=()=>{S.name=l.name||'Rahul';done(true)};
 $('#oLg').onclick=()=>pick('login');$('#oLp').onclick=mobile;$('#oLn').onclick=()=>{S.flow='signup';S.gmail='';mobile()};$('#oLb').onclick=welcome;
}
function setName(nm){const hi=$('#hi');if(hi)hi.textContent=nm?'X, '+nm:'X';const a=$('#acmName');if(a)a.textContent=nm||'Guest';const v=$('#acmAva');if(v)v.textContent=(nm||'G')[0];}
function done(back){
 const l=last()||{};const nm=S.name||l.name||'Rahul';
 LS.set('wxwLast',{name:nm,phone:S.phone||l.phone||'9876543210',gmail:S.gmail||l.gmail||''});LS.set('wxwIn',1);
 document.body.classList.remove('wguest');document.querySelector('.wg-bar')&&document.querySelector('.wg-bar').remove();
 setName(nm);ob.classList.add('out');setTimeout(()=>ob.remove(),400);
 setTimeout(()=>window.toast&&toast(back?'Welcome back, '+nm:'Welcome, '+nm+' · 3 free AI questions a day'),500);
}
/* ---------- guest: whole AI section for 2 questions, then sign up ---------- */
let gq=0;
function guest(){
 document.body.classList.add('wguest');gq=0;setName('');ob.classList.add('out');setTimeout(()=>{ob.remove()},400);
 document.body.insertAdjacentHTML('beforeend','<div class="wg-bar">You’re exploring as a guest · 2 free AI questions<button class="l" id="wgL">Log in</button><button id="wgS">Sign up free</button></div>');
 $('#wgS').onclick=()=>restart('signup');$('#wgL').onclick=()=>restart('login');
}
document.body.insertAdjacentHTML('beforeend','<div id="wgSheet"><div class="c"><h3 id="wgT"></h3><p id="wgP"></p><div id="wgK"></div><button class="s" id="wgSs">Sign up free</button><button class="l" id="wgSl">Already have an account? Log in</button><button class="n" id="wgSn">Not now</button></div></div>');
const SH={ask:['Sign up to keep asking','You’ve used your 2 guest questions. Create a free account in under a minute.',['3 free AI questions every day','Chats saved to History','Watch To Buy and Portfolio']],
 hist:['Sign up to save your chats','Guest chats are not saved. Sign up and every chat stays in History.',['Search past chats','Pin, rename and delete','Pick up on any device']],
 watch:['Sign up to build your watch list','Track ideas until they reach the buy zone.',['Watch To Buy list','Waya Score for each stock','Add to Portfolio in one tap']],
 port:['Sign up to track your portfolio','Add your holdings and ask WayaX what to do with them.',['Invested, current value and returns','Upload from your broker','Analyze my Portfolio']]};
function sheet(k){const s=SH[k];$('#wgT').textContent=s[0];$('#wgP').textContent=s[1];$('#wgK').innerHTML=s[2].map(t=>'<div class="ck">'+t+'</div>').join('');$('#wgSheet').classList.add('on');}
$('#wgSn').onclick=()=>$('#wgSheet').classList.remove('on');$('#wgSs').onclick=()=>restart('signup');$('#wgSl').onclick=()=>restart('login');
function restart(f){$('#wgSheet').classList.remove('on');document.body.classList.remove('wguest');const b=document.querySelector('.wg-bar');b&&b.remove();
 document.body.appendChild(ob);ob.classList.remove('out');if(f==='login')login();else{S.flow='signup';S.gmail='';S.gname='';mobile()}}
const isG=()=>document.body.classList.contains('wguest');
document.addEventListener('click',e=>{if(!isG()||gq<2)return;const k=e.target.closest('#navHist')?'hist':e.target.closest('#navWatch')?'watch':e.target.closest('#navPort')?'port':'';if(k){e.preventDefault();e.stopImmediatePropagation();sheet(k)}},true);
const orig=window.send;
if(typeof orig==='function')window.send=function(){if(!isG())return orig.apply(this,arguments);const q=document.getElementById('q');if(!q||!q.value.trim())return orig.apply(this,arguments);
 if(gq>=2){sheet('ask');return}gq++;const r=orig.apply(this,arguments);setTimeout(()=>window.toast&&toast(gq<2?'1 more free question · chats, Watch To Buy and Portfolio are open to try':'That was your last guest question · sign up for 3 free a day'),2600);return r};
{const sb=document.getElementById('send');if(sb&&typeof orig==='function')sb.onclick=()=>window.send();}
/* logout returns to the welcome screen */
const lo=document.getElementById('loYes');if(lo)lo.onclick=()=>{try{const k=localStorage.getItem('wxwLast');localStorage.clear();if(k)localStorage.setItem('wxwLast',k)}catch(e){}location.reload()};
/* start */
if(LS.get('wxwIn')){ob.remove();const l=last();if(l)setName(l.name)}else welcome();
window.WXWEB={welcome:()=>{try{localStorage.removeItem('wxwIn')}catch(e){}document.body.appendChild(ob);ob.classList.remove('out');welcome()}};
})();
