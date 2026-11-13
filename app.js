"use strict";
const $=s=>document.querySelector(s),today=()=>new Date().toISOString().slice(0,10);
const DEF={st:{lucky:0,misc:0},diary:[],tts:false,pts:0,xp:0,own:[],jobs:[],days:[],ans:{},qs:{},best:null,exam:0,day:{d:'',n:0,r:0,c:0,done:[]},cnt:{}};
let S=Object.assign({},DEF);
try{S=Object.assign({},DEF,JSON.parse(localStorage.getItem('fs2')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('fs2',JSON.stringify(S))}catch(e){}};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const vib=n=>{try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}};
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function floatTxt(t){const d=document.createElement('div');d.className='float';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1200)}
const Q=()=>window.FRAGEN.concat(S.custom||[]).map((q,i)=>(q.id=q.id||('q'+i),q));
const ico=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const NAV=[['home','Start','<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>'],['learn','Lernen','<path d="M4 5h6a3 3 0 013 3v12a2 2 0 00-2-2H4zM20 5h-6a3 3 0 00-3 3v12a2 2 0 012-2h7z"/>'],['garage','Garage','<path d="M3 16v-3l2-5h10l4 4h2v4M3 16h18M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z"/>'],['werk','Werkstatt','<path d="M14 6a4 4 0 105 5l-3 1-2-2 1-3zM4 20l9-9"/>'],['profile','Profil','<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>']];
let view='home';
function go(v){view=v;render()}
function render(){
  $('#nav').innerHTML=NAV.map(n=>`<button class="${(view===n[0]||(view==='quiz'&&n[0]==='learn')||((view==='lab'||view==='diary')&&n[0]==='learn'))?'on':''}" onclick="Z=null;W=null;go('${n[0]}')">${ico(n[2])}${n[1]}</button>`).join('');
  ({home,learn,garage,werk,profile,quiz:quizV,lab,diary})[view]();window.scrollTo(0,0);
}
/* Rang & Tag */
const RANKS=[[0,'Fahrschüler'],[150,'Kurvenjäger'],[400,'Straßenprofi'],[800,'Verkehrsfuchs'],[1500,'Prüfungsreif'],[3000,'Legende']];
const rank=()=>{let i=0;RANKS.forEach((r,k)=>{if(S.xp>=r[0])i=k});const n=RANKS[i+1];return{i,name:RANKS[i][1],cur:RANKS[i][0],next:n?n[0]:null,nn:n?n[1]:''}};
const D=()=>{if(S.day.d!==today())S.day={d:today(),n:0,r:0,c:0,done:[]};return S.day};
function streak(){let s=0,d=new Date();const f=x=>x.toISOString().slice(0,10);if(!S.days.includes(f(d)))d.setDate(d.getDate()-1);while(S.days.includes(f(d))){s++;d.setDate(d.getDate()-1)}return s}
const MISS=[['Beantworte 10 Fragen',d=>d.n,10,30],['5 Fragen in Folge richtig',d=>d.c,5,40],['8 richtige Antworten heute',d=>d.r,8,50]];
function missions(){const d=D();MISS.forEach((m,i)=>{if(m[1](d)>=m[2]&&!d.done.includes(i)){d.done.push(i);S.pts+=m[3];toast('Mission geschafft: +'+m[3]+' ⚙')}})}
const ring=(p,sz,txt)=>`<svg class="ring" width="${sz}" height="${sz}" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" stroke="#7cff4a" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(p*113.1).toFixed(1)} 113.1" transform="rotate(-90 22 22)"/><text x="22" y="26" text-anchor="middle" font-size="11" font-weight="800" fill="#eef3ee">${txt}</text></svg>`;
/* Teile */
const BASE={ps:75,nm:107,kg:900};
const PARTS=[
{id:'luft',n:'Sportluftfilter',cat:'Motor',cost:40,ps:2,nm:2,d:'Mehr Luft, weniger Widerstand.'},
{id:'ausp',n:'Sport-Endschalldämpfer',cat:'Motor',cost:110,ps:3,nm:3,d:'Weniger Gegendruck, mehr Sound. Sichtbar im Unterboden.'},
{id:'kruemm',n:'Fächerkrümmer 4-2-1',cat:'Motor',cost:180,ps:4,nm:4,req:['ausp'],d:'Besserer Gaswechsel.'},
{id:'chip',n:'Kennfeldoptimierung',cat:'Motor',cost:240,ps:6,nm:6,req:['luft','ausp'],d:'Zündung & Gemisch neu abgestimmt.'},
{id:'rev',n:'Motorrevision',cat:'Motor',job:'motor',ps:3,nm:2,kg:-5,d:'Nach Motorausbau überholt.'},
{id:'turbo',n:'Turbo-Umbau',cat:'Motor',cost:600,ps:28,nm:40,kg:12,hidden:true,req:['kruemm','chip','rev'],d:'Ladedruck statt Hubraum.'},
{id:'kupp',n:'Sportkupplung',cat:'Antrieb',job:'kupplung',nm:3,d:'Hält mehr Drehmoment.'},
{id:'fahr',n:'Gewindefahrwerk',cat:'Fahrwerk',cost:150,low:5,d:'Tiefer & straffer.'},
{id:'fahr2',n:'Tieferlegung Stufe 2',cat:'Fahrwerk',cost:130,low:5,req:['fahr'],d:'Noch tiefer.'},
{id:'bremse',n:'Sportbremse',cat:'Fahrwerk',cost:90,d:'Weniger Fading.'},
{id:'felg',n:'Alufelgen 5-Speiche',cat:'Räder',cost:100,kg:-6,rim:1,d:'Silber, leichter als Stahl.'},
{id:'felg2',n:'Mehrspeichen anthrazit',cat:'Räder',cost:140,kg:-6,rim:2,d:'Sportlicher Look.'},
{id:'felg3',n:'Tiefbett schwarz/rot',cat:'Räder',cost:190,kg:-7,rim:3,d:'Maximaler Auftritt.'},
{id:'reif',n:'Sportreifen',cat:'Räder',job:'reifen',d:'Mehr Grip.'},
{id:'tint1',n:'Scheibentönung leicht',cat:'Optik',cost:40,tint:1,d:'Dezent getönt.'},
{id:'tint2',n:'Scheibentönung stark',cat:'Optik',cost:70,tint:2,d:'Deutlich dunkler.'},
{id:'tint3',n:'Blackout',cat:'Optik',cost:110,tint:3,req:['tint2'],d:'Fast schwarz (nur Show, im Straßenverkehr nicht erlaubt).'},
{id:'radio',n:'Bluetooth-Radio',cat:'Sound',cost:60,aud:1,d:'Musik aus dem Handy.'},
{id:'lsp',n:'Lautsprecher-Set',cat:'Sound',cost:90,aud:1,req:['radio'],d:'Sattere Mitten.'},
{id:'amp',n:'Endstufe',cat:'Sound',cost:140,aud:1,req:['lsp'],d:'Mehr Leistung für den Bass.'},
{id:'sub',n:'Subwoofer',cat:'Sound',cost:170,aud:1,req:['amp'],d:'Der Kofferraum bebt.'}];
const has=id=>S.own.includes(id),okp=p=>(p.req||[]).every(has);
const stats=()=>{const r={...BASE,low:0};S.own.forEach(i=>{const p=PARTS.find(x=>x.id===i);if(!p)return;r.ps+=p.ps||0;r.nm+=p.nm||0;r.kg+=p.kg||0;r.low+=p.low||0});r.t=Math.round(1200*75/r.ps)/100;return r};
const ownedRim=()=>PARTS.filter(p=>p.rim&&has(p.id)).map(p=>p.rim);
const cfg=()=>{S.cfg=S.cfg||{rim:0,tint:0};if(S.cfg.rim&&!ownedRim().includes(S.cfg.rim))S.cfg.rim=0;return S.cfg};
const tintMax=()=>Math.max(0,...PARTS.filter(p=>p.tint&&has(p.id)).map(p=>p.tint));
const audN=()=>PARTS.filter(p=>p.aud&&has(p.id)).length;
const car=()=>'<div class="car3d"></div>';
function visStage(){const s=stats(),c=cfg();const n=(c.rim?1:0)+(Math.min(c.tint||0,tintMax())>0?1:0)+(s.low>=5?1:0)+(s.ps>=95?1:0);return n>=4?3:Math.min(2,n)}
function mount3d(v){const m=document.querySelector('.car3d');if(!m)return;
  if(v!=='under'){const n=visStage(),im=new Image();im.onload=()=>{if(m.isConnected){m.innerHTML='<img src="img/stage'+n+'.png" alt="Twingo" style="width:100%;display:block;border-radius:20px">'}};im.onerror=()=>mount3dReal(v);im.src='img/stage'+n+'.png';return}
  mount3dReal(v)}
function mount3dReal(v){const m=document.querySelector('.car3d');if(!m||!window.Twingo3D)return;const s=stats(),c=cfg();
  try{Twingo3D.mount(m,v||'out',{rim:c.rim||0,tint:Math.min(c.tint||0,tintMax()),low:Math.min(.05,s.low*.005),ps:s.ps,e2:has('ausp'),e1:has('kruemm'),tb:has('turbo'),ch:has('chip'),bk:has('bremse'),spin:false})}catch(e){m.innerHTML='<div class="m" style="padding:30px;text-align:center">3D-Ansicht nicht verfügbar (WebGL fehlt). Die App funktioniert sonst normal.</div>'}}
function revSound(){try{const A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime,ps=stats().ps,o=A.createOscillator(),o2=A.createOscillator(),g=A.createGain(),f=A.createBiquadFilter();o.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=700+ps*6;
  [o,o2].forEach((x,i)=>{x.frequency.setValueAtTime(55*(i?.5:1),t);x.frequency.exponentialRampToValueAtTime((140+ps)*(i?.5:1),t+.7);x.frequency.exponentialRampToValueAtTime(60*(i?.5:1),t+1.4);x.connect(f);x.start();x.stop(t+1.5)});
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25+(has('ausp')?.2:0)+(has('kruemm')?.15:0),t+.1);g.gain.exponentialRampToValueAtTime(.001,t+1.45);f.connect(g).connect(A.destination);vib(60)}catch(e){}}
/* HOME */
function home(){
  const r=rank(),p=r.next?(S.xp-r.cur)/(r.next-r.cur):1,d=D(),s=stats();
  $('#app').innerHTML=`<div class="top"><div class="logo">FAHRSCHULE <b>2.0</b></div><div class="chips"><div class="chip">🔥 ${streak()}</div><div class="chip">⚙ ${S.pts}</div></div></div>
  <div class="stage"><div class="tag">Twingo I · Milano 1</div><div class="hud"><b>${s.ps} PS</b><span>${s.nm} Nm · ${s.t} s</span></div>${car()}</div>
  <div class="card"><div class="row sp"><b>${r.name}</b><span class="m">${S.xp} XP${r.next?' · nächster Rang: '+r.nn:''}</span></div><div class="bar" style="margin-top:10px"><i style="width:${p*100}%"></i></div></div>
  ${(()=>{const f=forecast();return `<div class="card"><div class="row sp"><b>Prüfungs-Prognose</b><span class="big" style="font-size:26px;color:var(--g2)">${f.p} %</span></div><div class="bar" style="margin:8px 0"><i style="width:${f.p}%"></i></div><div class="m">${f.n} von ${f.tot} Fragen angefangen. Grobe Schätzung aus deinen bisherigen Antworten.</div></div>`})()}
  <button class="btn" onclick="startQuiz('mix')">Weiterfahren</button>
  <div class="grid"><button class="tile" onclick="startQuiz('wrong')"><span>Fehler-Garage</span><small>${Q().filter(q=>(S.qs[q.id]||{}).w>0).length} offen</small></button><button class="tile" onclick="startQuiz('exam')"><span>Prüfung</span><small>30 Fragen · max. 10 Fehlerpunkte</small></button></div>
  <h2>Tagesmissionen</h2><div class="card" style="padding:6px 16px">${MISS.map((m,i)=>{const v=Math.min(m[1](d),m[2]);return `<div class="mission"><div class="ck ${d.done.includes(i)?'on':''}">${d.done.includes(i)?'✓':''}</div><div style="flex:1"><div style="font-size:14px;font-weight:600">${m[0]}</div><div class="bar"><i style="width:${v/m[2]*100}%"></i></div></div><span class="chip">+${m[3]} ⚙</span></div>`}).join('')}</div>`;mount3d('out');
}
/* LERNEN */
function learn(){
  const qs=Q(),cats=[...new Set(qs.map(q=>q.c))];
  $('#app').innerHTML=`<h1>Lernen</h1><div class="m">${qs.length} Fragen in ${cats.length} Strecken</div>
  <div class="grid" style="margin-top:12px"><button class="tile hot" onclick="startQuiz('mix')"><span>Mix</span><small>10 Fragen gemischt</small></button><button class="tile" onclick="go('lab')"><span>Bremsweg-Labor</span><small>Physik zum Anfassen</small></button><button class="tile" onclick="go('diary')"><span>Fahrstunden-Tagebuch</span><small>Fragen zur letzten Stunde</small></button><button class="tile" onclick="S.tts=true;save();startQuiz('mix')"><span>Hörmodus</span><small>Fragen werden vorgelesen</small></button><button class="tile" onclick="startQuiz('cat','Gefahren-Szenarien')"><span>Gefahren-Szenarien</span><small>Was passiert gleich?</small></button><button class="tile" onclick="startQuiz('cat','Vorfahrt-Szenarien')"><span>Kreuzungs-Training</span><small>Animierte Vorfahrt</small></button></div>
  <h2>Strecken</h2>${cats.map(c=>{const t=qs.filter(q=>q.c===c),k=t.filter(q=>S.ans[q.id]===1).length;return `<div class="topic" onclick="startQuiz('cat','${c}')">${ring(k/t.length,48,Math.round(k/t.length*100)+'%')}<div><b>${c}</b><div class="m">${k} von ${t.length} sicher</div></div></div>`}).join('')}`;
}
/* QUIZ */
let Z=null;
function pick(n,list){const now=Date.now(),IV=[0,1,3,7,16],w=list.map(q=>{const s=S.qs[q.id]||{};const due=s.t?(now-s.t)/864e5>=IV[Math.min(s.b||0,4)]:true;return{q,k:(s.w?3:1)*(!s.t?1.2:(due?1:.15))*(0.4+Math.random())}});return w.sort((a,b)=>b.k-a.k).slice(0,n).map(x=>x.q)}
function startQuiz(mode,cat){
  let qs=Q();if(mode==='wrong')qs=qs.filter(q=>(S.qs[q.id]||{}).w>0);if(mode==='cat')qs=qs.filter(q=>q.c===cat);if(mode==='cats')qs=qs.filter(q=>cat.includes(q.c));
  const L=mode==='exam'?qs.slice().sort(()=>Math.random()-.5).slice(0,30):pick(10,qs);
  if(!L.length){toast('Keine Fragen vorhanden');return}
  Z={mode,L,i:0,sel:[],done:false,right:0,fp:0,combo:0,hist:[],conf:null};view='quiz';render();
}
function quizV(){
  if(Z.i>=Z.L.length)return result();
  const q=Z.L[Z.i],multi=q.ok.length>1,ex=Z.mode==='exam';
  const opts=q.a.map((a,j)=>{let c='opt';if(Z.sel.includes(j))c+=' sel';if(Z.done){if(q.ok.includes(j))c+=' good';else if(Z.sel.includes(j))c+=' bad'}
    const body=a.startsWith('<svg')?a:esc(a);return `<button class="${c}" ${Z.done?'disabled':''} onclick="tog(${j})"><i>${'ABCD'[j]}</i><span>${body}</span></button>`}).join('');
  $('#app').innerHTML=`<div class="top"><button class="chip" style="color:var(--t)" onclick="Z=null;go('learn')">✕</button><span class="m">${ex?'Prüfung · ':''}${q.c}</span><span class="row" style="gap:6px"><button class="chip" style="color:${S.tts?'var(--g)':'var(--t)'}" onclick="S.tts=!S.tts;save();S.tts?readQ():speechSynthesis.cancel();quizV()">🔊</button><span class="chip">🔥 ${Z.combo}</span></span></div>
  <div class="qhead">${Z.L.map((_,i)=>`<i class="${Z.hist[i]===1?'c':Z.hist[i]===0?'x':''} ${i===Z.i?'d':''}"></i>`).join('')}</div>
  ${q.img?`<div class="qimg" style="${(q.c==='Vorfahrt-Szenarien'||q.c==='Gefahren-Szenarien')?'max-width:300px':'max-width:150px'}">${q.img}</div>`:''}
  <h1 style="font-size:19px;line-height:1.3;font-weight:700">${esc(q.q)}</h1><div class="m">${multi?'Mehrere Antworten richtig':'Eine Antwort richtig'} · ${q.pt||3} Fehlerpunkte</div>
  <div class="${q.grid?'ogrid':''}" style="margin-top:8px">${opts}</div>
  ${Z.done&&!ex?`${q.anim?`<div class="qimg" style="max-width:300px">${q.anim}</div>`:''}<div class="exp">${esc(q.e)}</div>${q.p?`<div class="tip">🚗 Praxis: ${esc(q.p)}</div>`:''}`:''}
  ${!Z.done&&!ex?`<div class="m" style="margin-top:10px">Wie sicher bist du?</div><div class="seg" style="margin:6px 0">${[[2,'Sicher'],[1,'Unsicher'],[0,'Geraten']].map(c=>`<button class="${Z.conf===c[0]?'on':''}" onclick="Z.conf=${c[0]};quizV()">${c[1]}</button>`).join('')}</div>`:''}
  ${Z.done&&Z.note?`<div class="tip" style="border-color:var(--b);color:#bcd7ff;background:rgba(59,140,255,.08)">${Z.note}</div>`:''}
  <button class="btn" onclick="${Z.done?'nextQ()':'check()'}" ${!Z.done&&(!Z.sel.length||(!ex&&Z.conf===null))?'disabled':''}>${Z.done?'Weiter':'Prüfen'}</button>`;
  if(!Z.done&&S.tts&&!Z.spoken){Z.spoken=true;readQ()}
}
function speak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='de-DE';u.rate=.98;speechSynthesis.speak(u)}catch(e){}}
function readQ(){const q=Z&&Z.L[Z.i];if(!q)return;speak(q.q+'. '+q.a.map((a,j)=>'Antwort '+'ABCD'[j]+': '+(a.startsWith('<svg')?'ein Bild':a)).join('. '))}
function tog(j){const q=Z.L[Z.i];if(q.ok.length>1)Z.sel=Z.sel.includes(j)?Z.sel.filter(x=>x!==j):Z.sel.concat(j);else Z.sel=[j];quizV()}
function check(){
  const q=Z.L[Z.i],ok=Z.sel.length===q.ok.length&&q.ok.every(x=>Z.sel.includes(x)),s=S.qs[q.id]=S.qs[q.id]||{w:0},d=D(),ex=Z.mode==='exam';
  Z.hist[Z.i]=ok?1:0;Z.note='';const lucky=ok&&!ex&&Z.conf===0,misc=!ok&&!ex&&Z.conf===2;
  if(ok){Z.right++;Z.combo++;d.r++;d.c=Math.max(d.c,Z.combo);const g=Math.round((10+Math.min(Z.combo,6)*2)*(lucky?.4:1));if(!ex){S.xp+=g;S.pts+=g;floatTxt('+'+g+' XP')}vib(20);
    if(lucky){S.st.lucky++;Z.note='Glückstreffer: richtig, aber geraten. Die Frage kommt bald wieder.';s.b=0}else{if(S.ans[q.id]!==1)S.ans[q.id]=1;s.b=Math.min(4,(s.b||0)+1)}if(s.w>0&&Z.mode==='wrong'&&!lucky)s.w--}
  else{Z.combo=0;Z.fp+=q.pt||3;s.w=(s.w||0)+(misc?2:1);s.b=0;S.ans[q.id]=0;if(misc){S.st.misc++;Z.note='Fehlvorstellung erkannt: du warst sicher, lagst aber falsch. Genau diese Fragen sind wichtig.'}vib([40,40,40])}
  s.t=Date.now();d.n++;if(!S.days.includes(today()))S.days.push(today());missions();save();Z.done=true;
  if(ex){nextQ();return}quizV();if(S.tts)speak((ok?'Richtig. ':'Leider falsch. ')+q.e);
}
function nextQ(){Z.i++;Z.sel=[];Z.done=false;Z.conf=null;Z.spoken=false;try{speechSynthesis.cancel()}catch(e){}quizV()}
function result(){
  const ex=Z.mode==='exam',pass=Z.fp<=10;let bonus=0;
  if(ex){S.exam++;if(pass){bonus=100;S.pts+=bonus;S.xp+=60}S.best=S.best==null?Z.fp:Math.min(S.best,Z.fp)}save();
  $('#app').innerHTML=`<h1>${ex?(pass?'Bestanden 🏁':'Nicht bestanden'):'Strecke geschafft'}</h1>
  <div class="card"><div class="big">${Z.right}<span class="m">/${Z.L.length}</span></div><div class="m">richtig${ex?` · ${Z.fp} Fehlerpunkte (max. 10)`:''}</div>${bonus?`<div class="tip" style="border-color:var(--g);color:var(--g2);background:rgba(124,255,74,.08)">+${bonus} ⚙ und +60 XP fürs Bestehen</div>`:''}${ex&&S.best!=null?`<div class="m">Bestwert: ${S.best} Fehlerpunkte</div>`:''}</div>
  <button class="btn" onclick="Z=null;go('garage')">Teile kaufen</button><button class="btn alt" onclick="Z=null;go('home')">Zur Startseite</button>`;
}
/* PROGNOSE */
function forecast(){const qs=Q();if(!qs.length)return{p:0,n:0};let seen=0;const pr=qs.map(q=>{const a=S.ans[q.id],s=S.qs[q.id]||{};if(a===1){seen++;return .9}if(a===0){seen++;return .3}return .4});
  let pass=0,N=500;for(let r=0;r<N;r++){let fp=0;for(let i=0;i<30;i++){const k=Math.floor(Math.random()*qs.length);if(Math.random()>pr[k])fp+=qs[k].pt||3}if(fp<=10)pass++}return{p:Math.round(pass/N*100),n:seen,tot:qs.length}}
const DIARY=[['Kreuzung/Vorfahrt',['Vorfahrt','Vorfahrt-Szenarien']],['Kreisverkehr',['Vorfahrt-Szenarien','Vorfahrt']],['Autobahn',['Verhalten','Geschwindigkeit & Abstand']],['Überholen',['Verhalten']],['Parken/Einparken',['Parken & Halten']],['Bremsen/Tempo',['Geschwindigkeit & Abstand','Gefahren-Szenarien']],['Schalten/Technik',['Technik']],['Schilder',['Verkehrszeichen']],['Nachtfahrt/Nebel',['Verhalten','Gefahren-Szenarien']],['Radfahrer/Fußgänger',['Gefahren-Szenarien','Verhalten']]];
let DT=[];
function diary(){
  $('#app').innerHTML=`<div class="top"><button class="chip" style="color:var(--t)" onclick="go('learn')">←</button><span class="m">Fahrstunden-Tagebuch</span><span></span></div>
  <h1>Was kam heute dran?</h1><div class="m">Wähle die Themen der Fahrstunde. Danach bekommst du passende Fragen.</div>
  <div class="row" style="flex-wrap:wrap;margin:12px 0">${DIARY.map((d,i)=>`<button class="chip" style="color:var(--t);${DT.includes(i)?'border-color:var(--g);background:rgba(124,255,74,.15)':''}" onclick="DT=DT.includes(${i})?DT.filter(x=>x!==${i}):DT.concat(${i});diary()">${d[0]}</button>`).join('')}</div>
  <input id="dn" placeholder="Notiz (optional)" style="width:100%"><button class="btn" ${DT.length?'':'disabled'} onclick="saveDiary()">Speichern und üben</button>
  <h2>Letzte Einträge</h2>${S.diary.slice(-6).reverse().map(e=>`<div class="card"><div class="row sp"><b>${e.d}</b><button class="chip" style="color:var(--t)" onclick="startQuiz('cats',${JSON.stringify(e.c).replace(/"/g,'&quot;')})">Üben</button></div><div class="m">${e.t.join(', ')}${e.n?' · '+esc(e.n):''}</div></div>`).join('')||'<div class="m">Noch keine Einträge.</div>'}`}
function saveDiary(){const cats=[...new Set(DT.flatMap(i=>DIARY[i][1]))];S.diary.push({d:today(),t:DT.map(i=>DIARY[i][0]),c:cats,n:($('#dn')||{}).value||''});save();const c=cats;DT=[];startQuiz('cats',c)}
function report(){const qs=Q(),cats=[...new Set(qs.map(q=>q.c))],f=forecast();
  const rows=cats.map(c=>{const t=qs.filter(q=>q.c===c),k=t.filter(q=>S.ans[q.id]===1).length,w=t.filter(q=>(S.qs[q.id]||{}).w>0).length;return `${c}: ${Math.round(k/t.length*100)} % sicher, ${w} Fehlerfragen`});
  const txt=`Fahrschule 2.0 – Lernstand ${today()}\nPrognose Theorieprüfung: ca. ${f.p} % (grobe Schätzung)\nLernserie: ${streak()} Tage · beste Simulation: ${S.best==null?'–':S.best+' Fehlerpunkte'}\nGlückstreffer: ${S.st.lucky} · sichere Fehler: ${S.st.misc}\n\n${rows.join('\n')}`.replace(/\\n/g,'\n');
  if(navigator.share)navigator.share({title:'Lernstand Fahrschule',text:txt}).catch(()=>{});else{try{navigator.clipboard.writeText(txt);toast('Bericht kopiert')}catch(e){toast('Teilen nicht möglich')}}}
/* BREMSWEG-LABOR */
let LAB={v:50,s:1};
function lab(){
  const v=LAB.v,f=LAB.s,re=v/10*3,br=(v/10)**2*f,sum=re+br,mx=(re+br)*1.05;
  const pct=x=>x/mx*100;
  $('#app').innerHTML=`<div class="top"><button class="chip" style="color:var(--t)" onclick="go('learn')">←</button><span class="m">Bremsweg-Labor</span><span></span></div>
  <h1>${v} km/h</h1><input type="range" min="20" max="130" step="10" value="${v}" oninput="LAB.v=+this.value;lab()">
  <div class="seg" style="margin:14px 0"><button class="${f===1?'on':''}" onclick="LAB.s=1;lab()">Trocken</button><button class="${f===2?'on':''}" onclick="LAB.s=2;lab()">Nass</button><button class="${f===4?'on':''}" onclick="LAB.s=4;lab()">Schnee</button></div>
  <div class="card"><div style="position:relative;height:56px;border-radius:12px;background:#101612;overflow:hidden"><div style="position:absolute;left:0;top:0;bottom:0;width:${pct(re)}%;background:rgba(255,176,32,.5)"></div><div style="position:absolute;left:${pct(re)}%;top:0;bottom:0;width:${pct(br)}%;background:rgba(255,90,77,.6)"></div><div id="labcar" style="position:absolute;left:0;top:8px;width:60px;transition:left 1.6s cubic-bezier(.2,.7,.3,1)"><svg viewBox="0 0 120 50" width="100%"><path d="M6 36V26q0-4 5-5l12-10q3-2 8-2h30q5 0 8 3l14 9q6 1 7 6v9z" fill="#7cff4a"/><circle cx="30" cy="38" r="8" fill="#0e0f0f"/><circle cx="90" cy="38" r="8" fill="#0e0f0f"/></svg></div></div>
  <div class="row sp" style="margin-top:12px"><div><div class="m">Reaktionsweg</div><b style="color:var(--o)">${Math.round(re)} m</b></div><div><div class="m">Bremsweg</div><b style="color:var(--r)">${Math.round(br)} m</b></div><div><div class="m">Anhalteweg</div><b style="color:var(--g2)">${Math.round(sum)} m</b></div></div>
  <div class="m" style="margin-top:10px">≈ ${(sum/4).toFixed(0)} Autolängen · Auf Nässe verdoppelt sich der Bremsweg grob, bei Schnee vervierfacht er sich.</div></div>
  <button class="btn" onclick="const c=$('#labcar');c.style.transition='none';c.style.left='0';requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transition='left 1.6s cubic-bezier(.3,.1,.4,1)';c.style.left=Math.max(0,(${pct(sum)}/100*($('#labcar').parentNode.clientWidth)-60))+'px'}))">Bremsung starten</button>`;
}
/* GARAGE */
const gauge=(l,v,max,u)=>`<div style="text-align:center"><svg width="104" height="104" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="3" stroke-dasharray="85 113" transform="rotate(135 22 22)" stroke-linecap="round"/><circle cx="22" cy="22" r="18" fill="none" stroke="#7cff4a" stroke-width="3" stroke-dasharray="${Math.min(1,v/max)*85} 113" transform="rotate(135 22 22)" stroke-linecap="round"/><text x="22" y="24" text-anchor="middle" font-size="9" font-weight="900" fill="#eef3ee">${v}</text><text x="22" y="31" text-anchor="middle" font-size="4" fill="#8b9a8f">${u}</text></svg><div class="m" style="margin-top:-8px">${l}</div></div>`;
function loadImg(sel,urls,done,sty){let i=0;const next=()=>{if(i>=urls.length)return;const u=urls[i++],im=new Image();im.onload=()=>{const m=document.querySelector(sel);if(m){m.innerHTML='<img src="'+u+'" style="'+(sty||'width:100%')+';display:block;border-radius:14px">';done&&done()}};im.onerror=next;im.src=u};next()}
const underStage=()=>has('kruemm')||has('turbo')?2:(has('ausp')?1:0);
let GT='out';
function underSVG_unused(){
  const e1=has('kruemm'),e2=has('ausp'),ch=has('chip'),tb=has('turbo'),rv=has('rev');
  const pipe=e1?'#d7dcd8':(e2?'#aeb4b0':'#6a6f6c'),mw=e2?36:26,pw=e1?9:7;
  return `<svg viewBox="0 0 400 300" width="100%" style="display:block"><rect width="400" height="300" rx="18" fill="#0b100d"/>
  <g stroke="#1d2a21" stroke-width="1"><path d="M0 60H400M0 120H400M0 180H400M0 240H400M80 0V300M160 0V300M240 0V300M320 0V300" opacity=".5"/></g>
  <rect x="120" y="20" width="160" height="260" rx="30" fill="#131a15" stroke="#26352a" stroke-width="2"/>
  <rect x="140" y="170" width="100" height="95" rx="12" fill="#1b251d" stroke="#2f4034"/><text x="190" y="222" text-anchor="middle" font-size="10" fill="#8b9a8f">TANK</text>
  <rect x="150" y="40" width="100" height="70" rx="10" fill="${rv?'#2a3a2e':'#1f2a23'}" stroke="${ch?'#7cff4a':'#3a4a3e'}" stroke-width="${ch?3:1.5}"/><text x="200" y="80" text-anchor="middle" font-size="10" fill="#8b9a8f">MOTOR</text>
  ${tb?'<circle cx="262" cy="62" r="14" fill="#1b251d" stroke="#7cff4a" stroke-width="3"/><path d="M262 54 L270 62 L262 70 L254 62Z" fill="#7cff4a"/>':''}
  <rect x="150" y="112" width="100" height="22" rx="6" fill="#18221b" stroke="#2f4034"/><text x="200" y="127" text-anchor="middle" font-size="9" fill="#8b9a8f">GETRIEBE</text>
  <path d="M40 80H150M250 80H360" stroke="#33423a" stroke-width="8" stroke-linecap="round"/><path d="M40 230H360" stroke="#26352a" stroke-width="6"/>
  <g fill="#0a0c0b" stroke="#2a2d2f" stroke-width="2"><rect x="26" y="62" width="30" height="36" rx="6"/><rect x="344" y="62" width="30" height="36" rx="6"/><rect x="26" y="212" width="30" height="36" rx="6"/><rect x="344" y="212" width="30" height="36" rx="6"/></g>
  <path d="M170 110 ${e1?'Q150 130 160 140 M200 110 Q200 130 190 140 M230 110 Q250 130 220 140 M190 140':'M185 110 V140'} V160 H170 V232 H200" fill="none" stroke="${pipe}" stroke-width="${pw}" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="${200-mw/2+12}" y="232" width="${mw}" height="44" rx="14" fill="${pipe}" stroke="#2a2d2f" stroke-width="2"/>
  ${e2?'<ellipse cx="'+(212)+'" cy="284" rx="9" ry="5" fill="#eef3ee" stroke="#555" stroke-width="2"/>':'<ellipse cx="212" cy="282" rx="6" ry="4" fill="#555"/>'}
  <text x="12" y="20" font-size="10" fill="#8b9a8f" letter-spacing="2">UNTERBODEN</text></svg>`}
let beat=0;
function boom(){try{const A=new (window.AudioContext||window.webkitAudioContext)(),t=A.currentTime,g=A.createGain(),o=A.createOscillator();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(42,t+.25);g.gain.setValueAtTime(Math.min(.9,.25+audN()*.2),t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g).connect(A.destination);o.start();o.stop(t+.5)}catch(e){}}
function playBeat(){if(!audN()){toast('Erst eine Anlage einbauen');return}let n=0;const id=setInterval(()=>{boom();vib(30);const e=$('#eq');if(e)e.classList.toggle('pump');if(++n>=8)clearInterval(id)},430)}
function innerSVG(){const n=audN(),b=(on,x,y,w,h,l)=>`<g opacity="${on?1:.25}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#161e18" stroke="${on?'#7cff4a':'#2f4034'}" stroke-width="2"/><text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" font-size="11" fill="#eef3ee">${l}</text></g>`;
  return `<svg viewBox="0 0 400 260" width="100%" style="display:block"><rect width="400" height="260" rx="18" fill="#0b100d"/><path d="M20 120 Q200 60 380 120 V250 H20Z" fill="#111813" stroke="#26352a" stroke-width="2"/>
  <circle cx="110" cy="150" r="46" fill="none" stroke="#2f4034" stroke-width="8"/><circle cx="110" cy="150" r="10" fill="#26352a"/>
  ${b(has('radio'),180,110,120,46,'RADIO')}${b(has('lsp'),40,200,100,36,'LAUTSPRECHER')}${b(has('amp'),160,200,90,36,'ENDSTUFE')}${b(has('sub'),270,200,100,36,'SUBWOOFER')}
  <g id="eq" class="${beat?'pump':''}">${[0,1,2,3,4,5,6].map(i=>`<rect x="${316+i*10}" y="${100-(i%3)*8}" width="6" height="${(n+1)*8+(i%3)*8}" rx="2" fill="#7cff4a" opacity="${n?.9:.2}" style="transform-origin:bottom;transform-box:fill-box;animation:eq ${.5+i*.07}s ease-in-out infinite alternate"/>`).join('')}</g></svg>`}
function setCfg(kind,val){S.cfg=S.cfg||{rim:0,tint:0};S.cfg[kind]=val;save();garage()}
function garage(){
  const s=stats(),c=cfg(),rims=ownedRim(),tm=tintMax();
  let stage;
  if(GT==='out')stage=`<div class="stage"><div class="tag">Twingo I · Milano 1</div>${car()}</div><button class="btn alt" onclick="revSound()">Motor starten</button>`;
  else if(GT==='under')stage=`<div class="stage"><div class="tag">Hebebühne</div><div id="imgun">${car()}</div></div><div class="m" style="margin:6px 4px">Auf der Hebebühne siehst du Auspuffanlage, Motor und Getriebe. Teile kaufst du unten unter Motor.</div>`;
  else stage=`<div class="stage" style="padding:12px"><div id="imgin">${innerSVG()}</div></div><button class="btn" onclick="playBeat()">Sound testen</button>`;
  const seg=`<div class="seg" style="margin:8px 0">${[['out','Außen'],['under','Unterboden'],['in','Innenraum']].map(x=>`<button class="${GT===x[0]?'on':''}" onclick="GT='${x[0]}';garage()">${x[1]}</button>`).join('')}</div>`;
  const pickers=GT==='out'?`<div class="card"><b>Felgen</b><div class="row" style="margin:8px 0;flex-wrap:wrap"><button class="chip" style="color:var(--t);${!c.rim?'border-color:var(--g)':''}" onclick="setCfg('rim',0)">Stahl</button>${rims.map(r=>`<button class="chip" style="color:var(--t);${c.rim===r?'border-color:var(--g)':''}" onclick="setCfg('rim',${r})">${PARTS.find(p=>p.rim===r).n}</button>`).join('')}</div>
  <b>Scheiben</b><div class="row" style="margin:8px 0"><button class="chip" style="color:var(--t);${!c.tint?'border-color:var(--g)':''}" onclick="setCfg('tint',0)">Klar</button>${[1,2,3].filter(t=>t<=tm).map(t=>`<button class="chip" style="color:var(--t);${c.tint===t?'border-color:var(--g)':''}" onclick="setCfg('tint',${t})">Stufe ${t}</button>`).join('')}</div></div>`:'';
  $('#app').innerHTML=`<div class="top"><h1 style="margin:0">Garage</h1><div class="chip">⚙ ${S.pts}</div></div>${seg}${stage}${pickers}
  <div class="card gauges">${gauge('Leistung',s.ps,140,'PS')}${gauge('Drehmoment',s.nm,150,'Nm')}<div style="align-self:center"><div class="m">Gewicht</div><b>${s.kg} kg</b><div class="m" style="margin-top:6px">Tiefer</div><b>${s.low*5} mm</b><div class="m" style="margin-top:6px">0–100</div><b>${s.t} s</b></div></div>
  ${[...new Set(PARTS.map(p=>p.cat))].map(c=>`<h2>${c}</h2><div class="grid">${PARTS.filter(p=>p.cat===c).map(partCard).join('')}</div>`).join('')}`;mount3d(GT==='under'?'under':'out');if(GT==='under')loadImg('#imgun',[2,1,0].filter(k=>k<=underStage()).map(k=>'img/under'+k+'.png'),null,'max-height:68vh;width:auto;max-width:100%;margin:0 auto');if(GT==='in'){const n=Math.min(3,audN());loadImg('#imgin',[3,2,1,0].filter(k=>k<=n).map(k=>'img/dash'+k+'.png').concat(['img/dash_real.jpg']))}
}
function partCard(p){
  const own=has(p.id),can=okp(p);
  if(p.hidden&&!can&&!own)return `<div class="part lock"><b>???</b><small>Baue erst alle Motorstufen aus.</small></div>`;
  let btn;if(own)btn='<button disabled>Verbaut ✓</button>';
  else if(p.job)btn=S.jobs.includes(p.job)?`<button onclick="buy('${p.id}')">Einbauen</button>`:'<button disabled>Auftrag nötig</button>';
  else btn=`<button ${(!can||S.pts<p.cost)?'disabled':''} onclick="buy('${p.id}')">${can?p.cost+' ⚙':'Vorbau fehlt'}</button>`;
  const eff=[p.ps?'+'+p.ps+' PS':'',p.nm?'+'+p.nm+' Nm':'',p.low?'−'+p.low*5+' mm':''].filter(Boolean).join(' · ');
  return `<div class="part ${own?'own':''} ${can?'':'lock'}"><b>${p.n}</b><small>${p.d}</small>${eff?`<div class="eff">${eff}</div>`:''}${btn}</div>`;
}
function buy(id){const p=PARTS.find(x=>x.id===id);if(!okp(p))return;if(p.cost){if(S.pts<p.cost)return;S.pts-=p.cost}S.own.push(id);save();toast(p.n+' verbaut');garage()}
/* WERKSTATT */
const JOBS=[
{id:'reifen',n:'Reifenwechsel',cost:0,need:10,d:'Sommer auf Sportreifen. Reihenfolge ist wichtig.',steps:['Auto sichern: Handbremse, ersten Gang einlegen','Radmuttern am Boden eine halbe Umdrehung lösen','Wagenheber am vorgesehenen Ansatzpunkt anheben','Radmuttern ganz abschrauben, Rad abnehmen','Neues Rad aufsetzen, Muttern über Kreuz handfest','Wagen ablassen, Muttern über Kreuz mit Drehmoment anziehen','Reifendruck bei kaltem Reifen prüfen','Nach ca. 50 km Radmuttern nachziehen']},
{id:'kupplung',n:'Kupplung tauschen',cost:150,need:40,d:'Verschleißteil. Richtig gemacht rutscht nichts mehr.',steps:['Batterie abklemmen','Antriebswellen, Anlasser und Schaltgestänge lösen','Getriebe abstützen und vom Motor abziehen','Druckplatte und Kupplungsscheibe ausbauen','Schwungrad prüfen, ggf. planen','Neue Scheibe mit Zentrierdorn einsetzen','Druckplatte kreuzweise anziehen','Ausrücklager prüfen und fetten','Getriebe wieder anbauen','Probefahrt und Kupplungsweg prüfen']},
{id:'motor',n:'Motor ausbauen',cost:300,need:80,d:'Der Hauptjob: Motor raus, überholen, wieder rein.',steps:['Batterie abklemmen','Kühlmittel und Motoröl ablassen','Schläuche, Kabel und Kraftstoffleitung lösen','Auspuffkrümmer und Antriebswellen abbauen','Motorlager lösen, Kran einhängen','Motor mit Getriebe nach oben herausheben','Überholen (Dichtungen, Lager, Ventilspiel)','Motor einsetzen, Lager anziehen','Alles anschließen, Öl und Kühlmittel auffüllen','Probelauf, Dichtheit prüfen']}];
let W=null;
function werk(){
  if(W)return job();const n=Object.values(S.ans).filter(v=>v===1).length;
  $('#app').innerHTML=`<h1>Werkstatt</h1><div class="m">Aufträge in der richtigen Reihenfolge lösen, dafür gibt es neue Teile. Sicher gelöste Fragen: ${n}</div>`+JOBS.map(j=>{const done=S.jobs.includes(j.id),lock=n<j.need;return `<div class="card"><div class="row sp"><b>${j.n}</b>${done?'<span class="chip">erledigt ✓</span>':''}</div><div class="m" style="margin:4px 0 8px">${j.d}</div><div class="m">${lock?`🔒 Freigabe bei ${j.need} sicheren Fragen`:j.cost?`Kosten ${j.cost} ⚙`:'Gratis'}</div><button class="btn" ${(lock||done||(j.cost&&S.pts<j.cost))?'disabled':''} onclick="startJob('${j.id}')">${done?'Erledigt':'Auftrag starten'}</button></div>`}).join('');
}
function startJob(id){const j=JOBS.find(x=>x.id===id);if(j.cost)S.pts-=j.cost;W={j,order:j.steps.map((s,i)=>({s,i})).sort(()=>Math.random()-.5),next:0,err:0};save();job()}
function job(){
  $('#app').innerHTML=`<h1>${W.j.n}</h1><div class="m">Tippe die Schritte in der richtigen Reihenfolge an. Fehler: ${W.err}</div><div class="bar" style="margin:12px 0"><i style="width:${W.next/W.order.length*100}%"></i></div>`+
  W.order.map((o,k)=>`<button class="step ${o.i<W.next?'done':''}" id="st${k}" onclick="stepTap(${k})"><span>${o.i<W.next?o.i+1:'•'}</span>${esc(o.s)}</button>`).join('')+`<button class="btn alt" onclick="W=null;werk()">Abbrechen</button>`;
}
function stepTap(k){const o=W.order[k];if(o.i<W.next)return;if(o.i===W.next){W.next++;vib(15);if(W.next>=W.order.length)return jobDone();job()}else{W.err++;vib([40,40]);job();const e=document.getElementById('st'+k);e&&e.classList.add('err')}}
function jobDone(){S.jobs.includes(W.j.id)||S.jobs.push(W.j.id);const b=Math.max(0,60-W.err*10);S.pts+=b;S.xp+=40;save();
  $('#app').innerHTML=`<h1>Auftrag erledigt 🔧</h1><div class="card"><div class="big">${W.err}<span class="m"> Fehler</span></div><div class="tip" style="border-color:var(--g);color:var(--g2);background:rgba(124,255,74,.08)">+${b} ⚙ · +40 XP · Teil in der Garage freigeschaltet.</div></div><button class="btn" onclick="W=null;go('garage')">Zur Garage</button>`}
/* PROFIL */
function profile(){
  const r=rank(),n=Object.values(S.ans).filter(v=>v===1).length,A=[['🎯','Erste Antwort',Object.keys(S.ans).length>0],['💯','100 sicher',n>=100],['🔥','7 Tage',streak()>=7],['🏁','Prüfung bestanden',S.best!=null&&S.best<=10],['🔧','1. Auftrag',S.jobs.length>0],['⚙','Alle Aufträge',S.jobs.length>=3],['🚀','Turbo',has('turbo')],['📚','300 sicher',n>=300]];
  $('#app').innerHTML=`<h1>Profil</h1><div class="card"><div class="row sp"><div><div class="big" style="font-size:24px">${r.name}</div><div class="m">${S.xp} XP · ${n} Fragen sicher · ${streak()} Tage Serie</div></div></div></div>
  <div class="card"><div class="row sp"><span>Glückstreffer (geraten, richtig)</span><b>${S.st.lucky}</b></div><div class="row sp" style="margin-top:6px"><span>Sichere Fehler (Fehlvorstellung)</span><b>${S.st.misc}</b></div><button class="btn alt" onclick="report()">Bericht für den Fahrlehrer teilen</button></div>
  <h2>Abzeichen</h2><div class="ach">${A.map(a=>`<div class="${a[2]?'':'off'}"><span>${a[0]}<small>${a[1]}</small></span></div>`).join('')}</div>
  <h2>Einstellungen</h2>
  <div class="card"><b>Prüfungstermin</b><br><input type="date" value="${S.examDate||''}" onchange="S.examDate=this.value;save()" style="margin-top:8px"></div>
  <div class="card"><b>Tägliche Erinnerung</b><div class="m" style="margin:4px 0 10px">Kalendereintrag mit Alarm (iPhone und Android).</div><div class="row"><input type="time" id="rt" value="18:00"><button class="btn" style="margin:0" onclick="ics()">Eintrag laden</button></div></div>
  <div class="card"><b>Eigene Fragen importieren</b><div class="m" style="margin:4px 0 10px">JSON-Datei, bleibt nur auf diesem Gerät. Aktuell: ${(S.custom||[]).length} eigene.</div><input type="file" accept=".json" onchange="imp(this)"></div>
  <div class="card"><b>Hinweis</b><div class="m">Alle Fragen sind eigene Übungsfragen, keine amtlichen. Sie ersetzen nicht die Vorbereitung in der Fahrschule.</div></div>
  <div class="card"><b>Technik</b><div class="m">3D-Darstellung mit three.js (MIT-Lizenz). Der Twingo ist ein eigenes, stilisiertes Modell, Renault ist eine Marke der Renault Group und nicht beteiligt. Armaturenbrett-Foto: „Renault twingo interior“ (Wikimedia Commons, gemeinfrei).</div></div>
  <button class="btn alt" onclick="if(confirm('Alles zurücksetzen?')){S=Object.assign({},DEF);save();go('home')}">Fortschritt zurücksetzen</button>`;
}
function ics(){const t=$('#rt').value.replace(':','')+'00',d=today().replace(/-/g,'');
  const f=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:fs2@local\r\nDTSTAMP:${d}T000000\r\nDTSTART:${d}T${t}\r\nDTEND:${d}T${t}\r\nRRULE:FREQ=DAILY\r\nSUMMARY:Twingo tunen – 10 Fragen lernen\r\nBEGIN:VALARM\r\nTRIGGER:PT0M\r\nACTION:DISPLAY\r\nDESCRIPTION:Fahrschule 2.0\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([f],{type:'text/calendar'}));a.download='fahrschule.ics';a.click()}
function imp(el){const f=el.files[0];if(!f)return;f.text().then(t=>{try{const a=JSON.parse(t);if(!Array.isArray(a))throw 0;S.custom=a.filter(q=>q.q&&q.a&&q.ok).map((q,i)=>({...q,c:q.c||'Eigene',id:'c'+i}));save();toast(S.custom.length+' Fragen importiert');profile()}catch(e){toast('Ungültige Datei')}})}
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
if(location.search.includes('demo')){S.own=['luft','ausp','kruemm','fahr','fahr2','felg2','tint2','radio','lsp','chip','bremse'];S.cfg={rim:2,tint:2};S.pts=500;S.xp=320}
if(location.hash.length>1)view=location.hash.slice(1);
render();
