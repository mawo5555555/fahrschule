// Generatoren für Varianten-Fragen (Zeichen, Vorfahrt-Szenarien, Zahlen). Alles eigene Übungsfragen.
(function(){
const rnd=seed=>{let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return(h>>>0)/4294967296}};
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const out=[];
/* ===== Verkehrszeichen (SVG) ===== */
const R='#d9261c',B='#1b5fb0';
const tri=g=>`<svg viewBox="0 0 100 100"><path d="M50 9 L94 88 H6Z" fill="#fff" stroke="${R}" stroke-width="9" stroke-linejoin="round"/>${g}</svg>`;
const circ=g=>`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43" fill="#fff" stroke="${R}" stroke-width="10"/>${g}</svg>`;
const blue=g=>`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${B}" stroke="#fff" stroke-width="3"/>${g}</svg>`;
const txt=(t,s,y,f)=>`<text x="50" y="${y}" font-size="${s}" font-weight="800" text-anchor="middle" font-family="Arial,sans-serif" fill="${f||'#111'}">${t}</text>`;
const SIGNS=[
 {id:'vg',t:'Vorrang',n:'Vorfahrt gewähren',m:'Fahrzeuge der kreuzenden Straße durchlassen',s:`<svg viewBox="0 0 100 100"><path d="M6 12 H94 L50 90Z" fill="#fff" stroke="${R}" stroke-width="9" stroke-linejoin="round"/></svg>`},
 {id:'stop',t:'Vorrang',n:'Halt! Vorfahrt gewähren',m:'Anhalten und Vorfahrt gewähren',s:`<svg viewBox="0 0 100 100"><path d="M30 5 H70 L95 30 V70 L70 95 H30 L5 70 V30Z" fill="${R}" stroke="#fff" stroke-width="4"/>${txt('STOP',24,60,'#fff')}</svg>`},
 {id:'vst',t:'Vorrang',n:'Vorfahrtstraße',m:'Du hast an Kreuzungen und Einmündungen Vorfahrt',s:`<svg viewBox="0 0 100 100"><path d="M50 3 L97 50 L50 97 L3 50Z" fill="#fff" stroke="#111" stroke-width="3"/><path d="M50 12 L88 50 L50 88 L12 50Z" fill="#ffd000"/></svg>`},
 {id:'ein',t:'Verbot',n:'Verbot der Einfahrt',m:'Du darfst hier nicht einfahren',s:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="${R}" stroke="#fff" stroke-width="3"/><rect x="20" y="42" width="60" height="16" rx="2" fill="#fff"/></svg>`},
 {id:'alle',t:'Verbot',n:'Verbot für Fahrzeuge aller Art',m:'Kein Fahrzeug darf hier fahren',s:circ('')},
 {id:'ueb',t:'Verbot',n:'Überholverbot für Kraftfahrzeuge aller Art',m:'Überholen von mehrspurigen Kfz ist verboten',s:circ(`<rect x="22" y="36" width="26" height="26" rx="6" fill="${R}"/><rect x="52" y="36" width="26" height="26" rx="6" fill="#111"/>`)},
 {id:'hab',t:'Verbot',n:'Absolutes Haltverbot',m:'Halten ist verboten (auch kurz)',s:blue(`<circle cx="50" cy="50" r="33" fill="none" stroke="${R}" stroke-width="8"/><path d="M28 28 L72 72 M72 28 L28 72" stroke="${R}" stroke-width="9"/>`)},
 {id:'hbe',t:'Verbot',n:'Eingeschränktes Haltverbot',m:'Halten bis zu 3 Minuten ist erlaubt, Parken nicht',s:blue(`<circle cx="50" cy="50" r="33" fill="none" stroke="${R}" stroke-width="8"/><path d="M28 72 L72 28" stroke="${R}" stroke-width="9"/>`)},
 {id:'kreis',t:'Gebot',n:'Kreisverkehr',m:'Hier beginnt ein Kreisverkehr',s:blue(`<g fill="none" stroke="#fff" stroke-width="7"><path d="M50 22 A28 28 0 0 1 77 40"/><path d="M78 62 A28 28 0 0 1 48 78"/><path d="M30 66 A28 28 0 0 1 28 36"/></g><g fill="#fff"><path d="M82 34 L66 36 L80 50Z"/><path d="M44 86 L52 70 L36 72Z"/><path d="M20 40 L36 36 L28 52Z"/></g>`)},
 {id:'einb',t:'Richtzeichen',n:'Einbahnstraße',m:'Nur in Pfeilrichtung fahren',s:`<svg viewBox="0 0 100 100"><rect x="4" y="22" width="92" height="56" rx="8" fill="${B}" stroke="#fff" stroke-width="3"/><path d="M18 50 H70 M58 34 L78 50 L58 66" stroke="#fff" stroke-width="9" fill="none" stroke-linejoin="round"/></svg>`},
 {id:'park',t:'Richtzeichen',n:'Parkplatz',m:'Hier darf geparkt werden',s:`<svg viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="10" fill="${B}" stroke="#fff" stroke-width="3"/>${txt('P',70,74,'#fff')}</svg>`},
 {id:'kre',t:'Gefahr',n:'Kreuzung oder Einmündung mit Vorfahrt von rechts',m:'Rechts vor links gilt; Vorsicht an der Kreuzung',s:tri(`<path d="M50 38 V76 M32 60 H68" stroke="#111" stroke-width="9"/>`)},
 {id:'kur',t:'Gefahr',n:'Gefährliche Kurve (links)',m:'Vorsicht, Linkskurve voraus',s:tri(`<path d="M58 78 V58 Q58 46 44 40" stroke="#111" stroke-width="9" fill="none"/><path d="M36 30 L52 36 L40 50Z" fill="#111"/>`)},
 {id:'ste',t:'Gefahr',n:'Steigung',m:'Starke Steigung voraus',s:tri(`<path d="M24 74 L76 46 V74Z" fill="#111"/>${txt('12%',16,84,'#111')}`)},
 {id:'fus',t:'Gefahr',n:'Fußgänger',m:'Auf Fußgänger achten, die die Fahrbahn queren könnten',s:tri(`<circle cx="50" cy="40" r="6" fill="#111"/><path d="M50 48 L50 66 M50 54 L40 62 M50 54 L60 62 M50 66 L42 78 M50 66 L58 78" stroke="#111" stroke-width="6" stroke-linecap="round" fill="none"/>`)},
 {id:'glatt',t:'Gefahr',n:'Schleudergefahr bei Nässe oder Schmutz',m:'Rutschige Fahrbahn, Tempo anpassen',s:tri(`<rect x="34" y="42" width="32" height="14" rx="5" fill="#111"/><path d="M32 68 Q42 58 52 68 T72 68" stroke="#111" stroke-width="5" fill="none"/>`)},
];
const TEMPO=[30,50,60,70,80,100,120];
SIGNS.forEach(s=>s.t=s.t||'');
TEMPO.forEach(v=>SIGNS.push({id:'t'+v,t:'Verbot',n:'Höchstgeschwindigkeit '+v+' km/h',m:'Höchstens '+v+' km/h fahren',s:circ(txt(v,38,62))}));
window.SIGNS=SIGNS;
const TYPES=['Vorrang','Verbot','Gebot','Gefahr','Richtzeichen'];
const TYPEX={Vorrang:'Vorrang-Zeichen regeln, wer zuerst fahren darf.',Verbot:'Verbotszeichen sind meist rund mit rotem Rand.',Gebot:'Gebotszeichen sind rund und blau.',Gefahr:'Gefahrzeichen sind dreieckig mit rotem Rand.',Richtzeichen:'Richtzeichen geben Hinweise und Anweisungen (meist blau, eckig).'};
SIGNS.forEach((s,i)=>{
  const r=rnd('sg'+s.id),others=shuffle(SIGNS.filter(x=>x.id!==s.id&&x.m!==s.m),r);
  // Form 1: Zeichen zeigen -> Bedeutung
  const opts=shuffle([s.m,others[0].m,others[1].m],r);
  out.push({id:'sz1'+s.id,c:'Verkehrszeichen',pt:3,img:s.s,q:'Was bedeutet dieses Zeichen?',a:opts,ok:[opts.indexOf(s.m)],e:'Das Zeichen heißt „'+s.n+'“: '+s.m+'.',p:''});
  // Form 2: Bedeutung -> Zeichen
  const so=shuffle([s,others[2],others[3],others[4]],r);
  out.push({id:'sz2'+s.id,c:'Verkehrszeichen',pt:3,q:'Welches Zeichen bedeutet: '+s.m+'?',a:so.map(x=>x.s),ok:[so.findIndex(x=>x.id===s.id)],e:'Richtig ist „'+s.n+'“.',p:'',grid:true});
  // Form 3: Zeichenart
  if(s.t){const to=shuffle(TYPES.filter(t=>t!==s.t),r).slice(0,2).concat(s.t),to2=shuffle(to,r);
    out.push({id:'sz3'+s.id,c:'Verkehrszeichen',pt:2,img:s.s,q:'Zu welcher Zeichenart gehört dieses Zeichen?',a:to2,ok:[to2.indexOf(s.t)],e:(TYPEX[s.t]||'')+' Dieses Zeichen: '+s.n+'.',p:''})}
});
/* ===== Zahlen-Generatoren ===== */
const SP=[30,40,50,60,70,80,90,100,110,120,130];
const opt3=(v,r,u)=>{const set=new Set([v]);const f=[0.5,2,1.5,0.75,3];let k=0;while(set.size<3&&k<10){const x=Math.round(v*f[Math.floor(r()*f.length)]);if(x!==v&&x>0)set.add(x);k++}
  const a=shuffle([...set],r);return {a:a.map(x=>x+u),ok:[a.indexOf(v)]}};
SP.forEach(v=>{
  const reac=Math.round(v/10*3),brem=Math.round(v/10*v/10),stop=reac+brem,gef=Math.round(brem/2);
  let r=rnd('rw'+v),o=opt3(reac,r,' m');out.push({id:'rw'+v,c:'Geschwindigkeit & Abstand',pt:3,q:'Wie lang ist der Reaktionsweg bei '+v+' km/h ungefähr (Faustformel)?',...o,e:'Reaktionsweg = 3 × (Tempo / 10) = 3 × '+v/10+' = '+reac+' m.',p:'Eine Sekunde Ablenkung bei '+v+' km/h sind rund '+Math.round(v/3.6)+' m im Blindflug.'});
  r=rnd('bw'+v);o=opt3(brem,r,' m');out.push({id:'bw'+v,c:'Geschwindigkeit & Abstand',pt:3,q:'Wie lang ist der normale Bremsweg bei '+v+' km/h ungefähr (Faustformel)?',...o,e:'Bremsweg = (Tempo / 10)² = '+v/10+'² = '+brem+' m.',p:'Der Bremsweg wächst quadratisch mit dem Tempo.'});
  r=rnd('aw'+v);o=opt3(stop,r,' m');out.push({id:'aw'+v,c:'Geschwindigkeit & Abstand',pt:4,q:'Wie lang ist der Anhalteweg bei '+v+' km/h ungefähr (normale Bremsung, Faustformel)?',...o,e:'Anhalteweg = Reaktionsweg + Bremsweg = '+reac+' m + '+brem+' m = '+stop+' m.',p:'Das sind etwa '+Math.round(stop/4)+' Autolängen.'});
  r=rnd('gb'+v);o=opt3(gef,r,' m');out.push({id:'gb'+v,c:'Geschwindigkeit & Abstand',pt:4,q:'Wie lang ist der Bremsweg bei einer Gefahrbremsung aus '+v+' km/h ungefähr (Faustformel: halber Bremsweg)?',...o,e:'Gefahrbremsung: (Tempo/10)² : 2 = '+brem+' : 2 ≈ '+gef+' m.',p:''});
  r=rnd('ab'+v);o=opt3(Math.round(v/2),r,' m');out.push({id:'ab'+v,c:'Geschwindigkeit & Abstand',pt:3,q:'Welchen Mindestabstand solltest du bei '+v+' km/h zum Vordermann halten (Faustformel „halber Tacho“)?',...o,e:'Abstand in Metern ≈ halber Tachowert, bei '+v+' km/h also '+v/2+' m.',p:'Zwei Sekunden Abstand wären '+Math.round(v/3.6*2)+' m.'});
  r=rnd('sk'+v);o=opt3(Math.round(v/3.6),r,' m');out.push({id:'sk'+v,c:'Geschwindigkeit & Abstand',pt:2,q:'Welche Strecke legst du bei '+v+' km/h in einer Sekunde zurück?',...o,e:v+' km/h : 3,6 ≈ '+Math.round(v/3.6)+' m pro Sekunde.',p:''});
});
[[30,'eine Sturzhöhe von etwa 4 m'],[50,'einem Sturz aus etwa 10 m Höhe'],[70,'einem Sturz aus etwa 19 m Höhe'],[100,'einem Sturz aus etwa 39 m Höhe']].forEach(([v,t],i)=>{
  const h=Math.round(v*v/254);const a=shuffle([h,Math.round(h/2),h*2],rnd('fall'+v));
  out.push({id:'fall'+v,c:'Geschwindigkeit & Abstand',pt:3,q:'Ein Aufprall mit '+v+' km/h entspricht etwa einem Sturz aus welcher Höhe?',a:a.map(x=>x+' m'),ok:[a.indexOf(h)],e:'Die Aufprallenergie entspricht grob v²/254 Metern Fallhöhe: bei '+v+' km/h etwa '+h+' m.',p:'Anschnallen rettet bei diesen Kräften Leben.'})});
/* ===== Warnleuchten ===== */
const ic=(g,c)=>`<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill="#101412"/><g stroke="${c}" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${g}</g></svg>`;
const LAMP=[
 {id:'oel',n:'Öldruck',c:'#ff3b30',m:'Sofort anhalten, Motor aus – Schmierung fehlt',g:'<path d="M20 52 H62 L74 40 H86 M30 52 L36 68 H70 L74 52"/><path d="M40 40 H54"/><path d="M16 66 Q20 58 24 66 Q20 72 16 66Z"/>'},
 {id:'bat',n:'Batterie/Ladekontrolle',c:'#ff3b30',m:'Die Batterie wird nicht geladen',g:'<rect x="18" y="36" width="64" height="38"/><path d="M30 36 V28 H42 V36 M60 36 V28 H72 V36 M32 55 H44 M64 49 V61 M58 55 H70"/>'},
 {id:'kue',n:'Kühlmitteltemperatur',c:'#ff3b30',m:'Motor überhitzt – anhalten und abkühlen lassen',g:'<path d="M42 16 V56 A14 14 0 1 0 60 56 V16Z"/><path d="M26 74 Q34 66 42 74 T58 74 T74 74"/>'},
 {id:'brm',n:'Bremsanlage',c:'#ff3b30',m:'Bremsflüssigkeit/Bremse prüfen oder Feststellbremse angezogen',g:'<circle cx="50" cy="50" r="28"/><path d="M50 34 V54 M50 64 V66"/><path d="M16 30 Q8 50 16 70 M84 30 Q92 50 84 70"/>'},
 {id:'abs',n:'ABS',c:'#ffb020',m:'ABS ist ausgefallen – normale Bremse funktioniert, kein Blockierschutz',g:'<circle cx="50" cy="50" r="30"/><path d="M30 60 L38 40 L46 60 M34 54 H42"/><path d="M52 60 V40 H58 Q64 40 64 46 Q64 50 58 50 H52 H58 Q66 50 66 56 Q66 60 58 60Z" transform="translate(-4 0)"/>'},
 {id:'mot',n:'Motorkontrollleuchte',c:'#ffb020',m:'Fehler im Motormanagement – bald Werkstatt aufsuchen',g:'<path d="M26 40 H40 L46 32 H66 V40 H76 V62 H66 V70 H40 L34 62 H26Z"/><path d="M18 48 V58 M84 46 V60"/>'},
 {id:'air',n:'Airbag',c:'#ff3b30',m:'Rückhaltesystem gestört – Airbag löst eventuell nicht aus',g:'<circle cx="38" cy="30" r="8"/><path d="M38 40 V62 L58 72 M38 46 L58 52"/><circle cx="66" cy="54" r="16"/>'},
];
LAMP.forEach(l=>{
  const r=rnd('lp'+l.id),o=shuffle([l.m,...shuffle(LAMP.filter(x=>x.id!==l.id),r).slice(0,2).map(x=>x.m)],r);
  out.push({id:'lp1'+l.id,c:'Technik',pt:4,img:ic(l.g,l.c),q:'Diese Kontrollleuchte leuchtet während der Fahrt auf. Was bedeutet sie?',a:o,ok:[o.indexOf(l.m)],e:l.n+': '+l.m+'.',p:'Rot heißt Gefahr oder Sofortmaßnahme, Gelb heißt: bald prüfen, Grün/Blau ist nur Information.'});
  const col=l.c==='#ff3b30'?'Rot':'Gelb/Orange';
  out.push({id:'lp2'+l.id,c:'Technik',pt:3,img:ic(l.g,l.c),q:'Welche Farbe hat die Warnleuchte „'+l.n+'“ im Normalfall und was folgt daraus?',a:['Rot: sofort handeln','Gelb: bald prüfen lassen','Grün: nur Information'],ok:[l.c==='#ff3b30'?0:1],e:l.n+' leuchtet '+col.toLowerCase()+'. '+(l.c==='#ff3b30'?'Rot verlangt sofortiges Handeln.':'Gelb verlangt baldige Prüfung.'),p:''})});
/* ===== Vorfahrt-Szenarien (SVG, Regelmaschine) ===== */
const M=['straight','right','left'],MN={straight:'geradeaus',right:'rechts',left:'links'};
const DIRN=['Süden','Westen','Norden','Osten'];
function pts(m){const P=[],line=(a,b,c,d)=>{const n=Math.max(1,Math.round(Math.hypot(c-a,d-b)/5));for(let i=0;i<=n;i++)P.push([a+(c-a)*i/n,b+(d-b)*i/n])},
  q=(x0,y0,cx,cy,x1,y1)=>{for(let i=1;i<=10;i++){const t=i/10;P.push([(1-t)**2*x0+2*(1-t)*t*cx+t*t*x1,(1-t)**2*y0+2*(1-t)*t*cy+t*t*y1])}};
  if(m==='straight')line(170,300,170,0);
  if(m==='right'){line(170,300,170,205);q(170,205,170,170,205,170);line(205,170,300,170)}
  if(m==='left'){line(170,300,170,185);q(170,185,170,130,115,130);line(115,130,0,130)}
  return P}
const rot=(p,k)=>{let [x,y]=[p[0]-150,p[1]-150];for(let i=0;i<k;i++)[x,y]=[-y,x];return[x+150,y+150]};
const cells=(m,k)=>{const s=new Set();pts(m).forEach(p=>{const q=rot(p,k);if(q[0]>=100&&q[0]<=200&&q[1]>=100&&q[1]<=200)s.add(Math.floor(q[0]/20)+','+Math.floor(q[1]/20))});return s};
const conflict=(mA,kA,mB,kB)=>{const a=cells(mA,kA),b=cells(mB,kB);for(const x of a)if(b.has(x))return true;return false};
const d=ps=>'M'+ps.map(p=>p[0].toFixed(0)+','+p[1].toFixed(0)).join(' L');
function signAt(k,state){ // Schild an der rechten Seite der Zufahrt k (lokal Süden), aufrecht gehalten
  if(state==='rvl')return'';const s={main:SIGNS[2].s,yield:SIGNS[0].s,stop:SIGNS[1].s}[state];
  return `<g transform="rotate(${-90*k} 214 262)"><g transform="translate(200,248) scale(.28)">${s.replace('<svg viewBox="0 0 100 100">','').replace('</svg>','')}</g></g>`}
function scene(cfg,anim){
  const {st,mine,mo,ko}=cfg;
  let road=`<defs><linearGradient id="as" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e3530"/><stop offset="1" stop-color="#252b27"/></linearGradient></defs><rect width="300" height="300" fill="#0d1410"/>
  <g fill="#18211b" stroke="#222d25"><rect x="8" y="8" width="88" height="88" rx="8"/><rect x="204" y="8" width="88" height="88" rx="8"/><rect x="8" y="204" width="88" height="88" rx="8"/><rect x="204" y="204" width="88" height="88" rx="8"/></g>
  <rect x="106" width="88" height="300" fill="#394039"/><rect y="106" width="300" height="88" fill="#394039"/>
  <rect x="110" width="80" height="300" fill="url(#as)"/><rect y="110" width="300" height="80" fill="url(#as)"/><rect x="110" y="110" width="80" height="80" fill="#2b322d"/>
  <path d="M150 0 V108 M150 192 V300 M0 150 H108 M192 150 H300" stroke="#e8ecd8" stroke-width="2" stroke-dasharray="10 8" opacity=".5"/>`;
  [0,1,2,3].forEach(k=>{let z='';for(let i=0;i<7;i++)z+=`<rect x="${113+i*11}" y="196" width="6" height="12" fill="#e9ecdf" opacity=".5"/>`;
    const sg=(k%2?st[1]:st[0]);road+=`<g transform="rotate(${90*k} 150 150)">${z}${signAt(k,sg)}${sg==='stop'?'<path d="M152 214 H188" stroke="#fff" stroke-width="3"/>':''}</g>`});
  const body=(c,m)=>`<ellipse cx="1" cy="3" rx="17" ry="10" fill="#000" opacity=".38"/><rect x="-15" y="-8" width="30" height="16" rx="6" fill="${c}"/><rect x="-14" y="-8" width="28" height="6" rx="3" fill="#fff" opacity=".2"/><rect x="0" y="-6" width="9" height="12" rx="2.5" fill="#0a1214" opacity=".9"/><rect x="-10" y="-6" width="7" height="12" rx="2" fill="#0a1214" opacity=".6"/><circle cx="14" cy="-5" r="1.9" fill="#fff6c0"/><circle cx="14" cy="5" r="1.9" fill="#fff6c0"/><path d="M15 -6 L36 -13 L36 13 L15 6Z" fill="#fff6c0" opacity=".11"/>${m==='left'?'<circle cx="13" cy="-8" r="1.8" fill="#ffb020"><animate attributeName="opacity" values="1;0;1" dur=".7s" repeatCount="indefinite"/></circle><circle cx="-13" cy="-8" r="1.8" fill="#ffb020"><animate attributeName="opacity" values="1;0;1" dur=".7s" repeatCount="indefinite"/></circle>':m==='right'?'<circle cx="13" cy="8" r="1.8" fill="#ffb020"><animate attributeName="opacity" values="1;0;1" dur=".7s" repeatCount="indefinite"/></circle><circle cx="-13" cy="8" r="1.8" fill="#ffb020"><animate attributeName="opacity" values="1;0;1" dur=".7s" repeatCount="indefinite"/></circle>':''}`;
  const car=(c,k,m,idx)=>{const P=pts(m);let i0=P.findIndex(p=>p[1]<=250);const a=P[i0],b=P[i0+1];const ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
    const arrow=`<path d="${d(P.slice(i0+1))}" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="3 6" stroke-linecap="round" opacity=".75"/>`;
    const t0=.4+idx*2.7,brake=idx>0?`<rect x="-16" y="-6" width="3" height="4" fill="#ff3b30"><animate attributeName="opacity" values="1;1;0" keyTimes="0;.9;1" dur="${t0}s" repeatCount="1" fill="freeze"/></rect><rect x="-16" y="2" width="3" height="4" fill="#ff3b30"><animate attributeName="opacity" values="1;1;0" keyTimes="0;.9;1" dur="${t0}s" repeatCount="1" fill="freeze"/></rect>`:'';
    const mover=anim?`<g>${body(c,m)}${brake}<animateMotion path="${d(P.slice(i0))}" dur="2.4s" begin="${t0}s;${t0+7.5}s" fill="freeze" rotate="auto" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .25 1"/></g>`:`<g transform="translate(${a[0]},${a[1]}) rotate(${ang})">${body(c,m)}</g>`;
    return `<g transform="rotate(${90*k} 150 150)">${arrow}${mover}</g>`};
  const iB=cfg.both?0:(cfg.second?0:1),iA=cfg.both?0:(cfg.second?1:0);
  return `<svg viewBox="0 0 300 300" width="100%" style="display:block;border-radius:14px">${road}${car('#3b8cff',ko,mo,iB)}${car('#6bd13a',0,mine,iA)}</svg>`}
const STS=[['rvl','rvl'],['main','yield'],['yield','main'],['main','stop'],['stop','main']];
const prio=(st,mA,mB,k)=>{ // liefert 'A','B','both'
  if(k===2){if(!conflict(mA,0,mB,2))return 'both';if(mA==='left'&&mB==='left')return 'both';if(mA==='left')return 'B';if(mB==='left')return 'A';return 'both'}
  if(!conflict(mA,0,mB,k))return 'both';
  const sa=st[0],sb=st[1];
  if(sa!==sb){const rank={main:0,rvl:1,yield:2,stop:2};return rank[sa]<rank[sb]?'A':'B'}
  return k===3?'B':'A'};
STS.forEach(st=>[1,2,3].forEach(k=>M.forEach(mA=>M.forEach(mB=>{
  const w=prio(st,mA,mB,k);
  if(k===2&&w==='both'&&mA!=='left'&&mB!=='left'&&mA!==mB)return; // zu trivial
  const id='vf'+st.join('')+k+mA[0]+mB[0];
  const sA=st[0],sB=st[1],cfg={st,mine:mA,other:mB,mo:mB,ko:k};
  const why=k===2?(w==='both'?'Die Fahrwege kreuzen sich nicht, beide dürfen gleichzeitig fahren.':'Linksabbieger müssen den entgegenkommenden Verkehr durchlassen, der geradeaus fährt oder rechts abbiegt.'):
    w==='both'?'Die Fahrwege kreuzen sich nicht, beide dürfen gleichzeitig fahren.':
    sA!==sB?(w==='A'?'Du fährst auf der Vorfahrtstraße (gelbe Raute). Das blaue Auto muss '+(sB==='stop'?'an der Haltlinie anhalten und ':'')+'warten.':'Das blaue Auto fährt auf der Vorfahrtstraße. Du musst '+(sA==='stop'?'am Stoppschild anhalten und ':'')+'warten.'):
    w==='A'?'Es gilt „Rechts vor links“. Das blaue Auto kommt von links, du kommst von rechts und darfst zuerst.':'Es gilt „Rechts vor links“. Das blaue Auto kommt von rechts und darf zuerst fahren.';
  const O=['Mein Auto (grün)','Das blaue Auto','Beide dürfen gleichzeitig'];
  const base={c:'Vorfahrt-Szenarien',pt:5,img:scene(cfg,false),anim:scene({...cfg,second:w==='B',both:w==='both'},true),e:why,p:'Im Zweifel: Schilder zuerst, dann „rechts vor links“, und nicht auf Vorfahrt bestehen.'};
  const intro='Du bist das grüne Auto und fährst '+MN[mA]+'. Das blaue Auto kommt von '+['','links','gegenüber','rechts'][k]+' und fährt '+MN[mB]+'. ';
  const tiny=st.join('')==='rvlrvl'?'Keine Schilder.':st[0]==='main'?'Du bist auf der Vorfahrtstraße.':st[1]==='main'?'Das blaue Auto ist auf der Vorfahrtstraße.':'';
  const ia={A:0,B:1,both:2}[w];
  out.push({...base,id:id+'a',q:intro+tiny+' Wer darf zuerst fahren?',a:O,ok:[ia]});
  const wait=w==='both'?2:(w==='A'?1:0);
  out.push({...base,id:id+'b',q:intro+tiny+' Wer muss warten?',a:['Mein Auto (grün)','Das blaue Auto','Niemand muss warten'],ok:[w==='both'?2:(w==='A'?1:0)]})
}))));
window.FRAGEN=window.FRAGEN.concat(out);
})();
