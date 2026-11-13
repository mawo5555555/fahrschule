// Gefahren-Szenarien: animierte Draufsicht "Was passiert gleich?" (eigene Übungsfragen)
(function(){
const T=6; // Schleifendauer in s
const mo=(el,path,kt,kp,rot,spl)=>`<g>${el}<animateMotion path="${path}" dur="${T}s" repeatCount="indefinite" keyTimes="${kt}" keyPoints="${kp}" calcMode="${spl?'spline':'linear'}"${spl?` keySplines="${spl}"`:''} rotate="${rot?'auto':'0'}"/></g>`;
const fade=(el,kt,vals)=>`<g opacity="0">${el}<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" keyTimes="${kt}" values="${vals}"/></g>`;
const mark=(x,y,t)=>fade(`<g transform="translate(${x},${y})"><path d="M0 -12 L11 7 H-11Z" fill="#ffb020" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"><animateTransform attributeName="transform" type="scale" values="1;1.25;1" dur=".9s" repeatCount="indefinite"/></path><text y="5" font-size="11" font-weight="900" text-anchor="middle" fill="#1a1a1a">!</text></g>`,`0;${t};${t+.04};${t+.3};${t+.34};1`,'0;0;1;1;0;0');
const defs=`<defs><linearGradient id="hz-as" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#262c28"/><stop offset=".5" stop-color="#333a35"/><stop offset="1" stop-color="#262c28"/></linearGradient><radialGradient id="hz-dusk" cx=".5" cy=".6" r=".8"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient></defs>`;
const tree=(x,y,r)=>`<circle cx="${x+2}" cy="${y+3}" r="${r}" fill="#000" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="#1d3a22"/><circle cx="${x-r*.3}" cy="${y-r*.3}" r="${r*.55}" fill="#2a5230"/>`;
const road=(extra,dusk)=>`${defs}<rect width="300" height="220" fill="#0e1510"/>${[[20,30,10],[40,110,8],[18,180,9],[270,40,9],[255,120,10],[275,190,8]].map(t=>tree(...t)).join('')}
<rect x="84" width="132" height="220" fill="#3a413b"/><rect x="95" width="110" height="220" fill="url(#hz-as)"/><path d="M95 0V220M205 0V220" stroke="#e8ecd8" stroke-width="1.5" opacity=".6"/><path d="M150 0V220" stroke="#e8ecd8" stroke-width="2" stroke-dasharray="14 10" opacity=".55"/>${extra||''}${dusk?'<rect width="300" height="220" fill="url(#hz-dusk)"/>':''}`;
const car=(c,o={})=>`<g transform="scale(${o.s||1})"><ellipse cx="2" cy="3" rx="13" ry="22" fill="#000" opacity=".4"/><rect x="-11" y="-20" width="22" height="40" rx="7" fill="${c}"/><rect x="-10" y="-20" width="20" height="9" rx="4" fill="#fff" opacity=".18"/><rect x="-8" y="-9" width="16" height="9" rx="2.5" fill="#0a1214" opacity=".9"/><rect x="-8" y="3" width="16" height="9" rx="2.5" fill="#0a1214" opacity=".65"/><rect x="-13" y="-8" width="3" height="5" rx="1.5" fill="${c}"/><rect x="10" y="-8" width="3" height="5" rx="1.5" fill="${c}"/><circle cx="-7" cy="-19" r="2" fill="#fff6c0"/><circle cx="7" cy="-19" r="2" fill="#fff6c0"/>${o.beam?'<path d="M-9 -20 L-22 -58 L22 -58 L9 -20Z" fill="#fff6c0" opacity=".13"/>':''}<rect x="-9" y="18" width="5" height="2.5" fill="#ff3b30"/><rect x="4" y="18" width="5" height="2.5" fill="#ff3b30"/>${o.blink?`<circle cx="${o.blink}9" cy="-17" r="2" fill="#ffb020"><animate attributeName="opacity" values="1;0;1" dur=".6s" repeatCount="indefinite"/></circle>`:''}</g>`;
const person=(c,k)=>`<g transform="scale(${k||1})"><ellipse cx="1" cy="2" rx="7" ry="5" fill="#000" opacity=".35"/><ellipse cy="0" rx="6.5" ry="3.8" fill="${c}"/><circle r="3.2" fill="#e6bf99"/><circle cy="-.6" r="3.3" fill="#3a2a1e" opacity=".9"/></g>`;
const ball=()=>`<g><circle r="4.5" fill="#ff7a3a"/><path d="M-4 0 H4 M0 -4 V4" stroke="#fff" stroke-width="1" opacity=".7"/><animateTransform attributeName="transform" type="rotate" values="0;360" dur=".6s" repeatCount="indefinite"/></g>`;
const park=(x,y,c)=>`<g transform="translate(${x},${y})">${car(c)}</g>`;
const vm=(c,o)=>`<g transform="rotate(90)">${car(c,o)}</g>`;
const lane='M170,260 L170,-60';
const S=[
{id:'ball',
 build:(rev)=>road(park(190,64,'#7a8')+park(190,112,'#97a')+mark(190,86,.1)+mo(ball(),'M190,88 L132,88','0;.22;.5;1','0;0;1;1')+mo(person('#3b8cff',1.15),'M190,88 L140,88','0;.4;.72;1','0;0;1;1')),
 car:{q:['0;.45;1','0;.4;.4'],r:['0;.3;.38;.85;1','0;.34;.36;.36;1','.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1']},
 q:'Ein Ball rollt zwischen parkenden Autos auf die Fahrbahn. Womit musst du rechnen?',a:['Ein Kind läuft dem Ball hinterher.','Der Ball ist ein Einzelfall, ich fahre weiter.','Gegenverkehr überholt gleich.'],e:'Kinder achten nur auf den Ball. Bremsbereit werden, Tempo senken, notfalls anhalten.',
 q2:'Du siehst einen Ball auf die Straße rollen. Wie reagierst du?',a2:['Gas weg, bremsbereit, Blickkontakt suchen.','Hupen und beschleunigen.','Ausweichen nach links.'],e2:'Frühzeitig Tempo senken und auf ein nachlaufendes Kind gefasst sein.'},
{id:'door',
 build:(rev)=>road(park(190,150,'#889')+fade(`<g transform="translate(180,142)"><rect x="-1" y="0" width="3" height="20" fill="#ccd"><animateTransform attributeName="transform" type="rotate" values="0 0 0;-62 0 0" dur=".4s" begin="0s" fill="freeze"/></rect></g>`,'0;.3;.34;.8;.84;1','0;0;1;1;0;0')+mark(190,126,.25)),
 car:{q:['0;.5;1','0;.5;.5'],r:['0;.25;.55;1','0;.25;.5;1','.3 0 .7 1;.3 0 .7 1;.3 0 .7 1'],off:-22},
 q:'Du fährst an einem geparkten Auto vorbei, im Auto sitzt noch jemand. Womit rechnest du?',a:['Die Fahrertür geht plötzlich auf.','Das Auto fährt sofort an.','Nichts, die Seite ist sicher.'],e:'Türen öffnen oft ohne Blick nach hinten. Seitenabstand von mindestens etwa 1 m halten.',
 q2:'Wie viel Abstand hältst du zu parkenden Autos mit Insassen?',a2:['Möglichst etwa 1 m.','So nah wie möglich.','Egal, solange ich langsam bin.'],e2:'Ein Meter reicht meist, um einer sich öffnenden Tür auszuweichen.'},
{id:'bus',
 build:(rev)=>road(`<g transform="translate(192,100)"><ellipse cx="2" cy="3" rx="14" ry="42" fill="#000" opacity=".4"/><rect x="-12" y="-40" width="24" height="80" rx="6" fill="#e8a317"/><rect x="-10" y="-36" width="20" height="70" rx="4" fill="#f4bd45"/><rect x="-9" y="-38" width="18" height="6" rx="2" fill="#0a1214"/><circle cx="-10" cy="-42" r="2.5" fill="#ff7a00"><animate attributeName="opacity" values="1;0;1" dur=".7s" repeatCount="indefinite"/></circle><circle cx="10" cy="-42" r="2.5" fill="#ff7a00"><animate attributeName="opacity" values="1;0;1" dur=".7s" repeatCount="indefinite"/></circle></g>`+mark(192,40,.1)+mo(person('#ff5a4d',1.15),'M200,66 L140,66','0;.38;.7;1','0;0;1;1')),
 car:{q:['0;.45;1','0;.4;.4'],r:['0;.3;.38;.85;1','0;.34;.36;.36;1','.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1']},
 q:'Ein Bus steht an der Haltestelle. Plötzlich können Fußgänger hervortreten. Wie fährst du?',a:['Langsam, bremsbereit, bei Bedarf mit Seitenabstand vorbei.','Unverändert, Fußgänger müssen aufpassen.','Mit Hupen vorbeifahren.'],e:'Fußgänger treten häufig hinter Bussen hervor. Tempo anpassen und auf verdeckte Personen achten.',
 q2:'Warum ist der Bereich hinter einem Bus gefährlich?',a2:['Wegen verdeckter Fußgänger.','Wegen Gegenverkehr.','Wegen schlechter Sicht nach hinten.'],e2:'Der Bus verdeckt die Sicht auf Fußgänger, die queren wollen.'},
{id:'bike',
 build:(rev)=>road(`<rect x="205" y="70" width="95" height="44" fill="url(#hz-as)"/><path d="M205 70H300M205 114H300" stroke="#e8ecd8" stroke-width="1.5" opacity=".6"/>`+mo(`<g><ellipse cx="2" cy="3" rx="5" ry="14" fill="#000" opacity=".35"/><rect x="-1.5" y="-12" width="3" height="24" rx="1.5" fill="#ffb020"/><rect x="-6" y="-8" width="12" height="2" rx="1" fill="#555"/><circle cy="0" r="4.2" fill="#3b8cff"/><circle cy="-1" r="2.6" fill="#e6bf99"/></g>`,'M193,270 L193,-40','0;1','0;1',1)+mark(186,70,.2)),
 car:{q:['0;.5;1','0;.5;.5'],r:['0;.3;.5;1','0;.3;.3;1','.3 0 .7 1;.3 0 .7 1;.3 0 .7 1'],turn:1},
 q:'Du willst rechts abbiegen, rechts neben dir fährt ein Radfahrer geradeaus. Was gilt?',a:['Ich muss ihn durchlassen und achte auf den toten Winkel.','Ich habe Vorrang, weil ich größer bin.','Ich blinke, dann muss er bremsen.'],e:'Beim Abbiegen haben Geradeausfahrer Vorrang, auch Radfahrer. Der tote Winkel ist besonders gefährlich.',
 q2:'Was machst du vor dem Rechtsabbiegen mit Radweg neben der Fahrbahn?',a2:['Schulterblick und Spiegel, Radfahrer vorlassen.','Nur den Blinker setzen.','Schneller abbiegen.'],e2:'Spiegel, Schulterblick, Blinker, dann abbiegen und Radfahrer vorlassen.'},
{id:'over',
 build:(rev)=>road(mo(vm('#8b97a0'),'M128,-40 L128,260','0;1','0;1',1)+mo(vm('#3b8cff',{blink:'-'}),'M128,-80 L128,50 Q128,80 168,100 L168,270','0;.25;.55;1','0;.32;.62;1',1)+mark(150,60,.1)),
 car:{q:['0;.45;1','0;.45;.45'],r:['0;.3;.55;1','0;.3;.34;1','.3 0 .7 1;.3 0 .7 1;.3 0 .7 1'],off:16},
 q:'Gegenüber überholt ein Fahrzeug und kommt dir auf deiner Spur entgegen. Was tust du?',a:['Bremsbereit werden und nach rechts Platz machen.','Auf Vorfahrt bestehen.','Auf die Gegenfahrbahn ausweichen.'],e:'Tempo senken, äußerst rechts fahren und dem Überholer Raum geben.',
 q2:'Wann ist es riskant zu überholen?',a2:['Wenn Gegenverkehr nicht sicher einsehbar ist.','Auf gerader Strecke mit freier Sicht.','Bei geringer Geschwindigkeit des Vorausfahrenden.'],e2:'Überholen ist nur erlaubt, wenn Gegenverkehr nicht gefährdet wird und der Überholweg sicher einsehbar ist.'},
{id:'wild',dusk:1,
 build:(rev)=>road(tree(70,60,12)+tree(232,150,12)+mark(205,100,.15)+mo(`<g transform="rotate(-90)"><ellipse cx="2" cy="3" rx="6" ry="12" fill="#000" opacity=".4"/><ellipse rx="5.5" ry="11" fill="#9a6a3e"/><ellipse cy="-13" rx="3.2" ry="4" fill="#9a6a3e"/><path d="M-3 -16 L-6 -22 M3 -16 L6 -22 M-6 -22 L-9 -20 M6 -22 L9 -20" stroke="#6b4425" stroke-width="1.4" fill="none"/><circle cx="-1.2" cy="-15" r=".7" fill="#fff6a0"/><circle cx="1.2" cy="-15" r=".7" fill="#fff6a0"/></g>`,'M232,104 L66,104','0;.35;.7;1','0;0;1;1',0),1),
 car:{q:['0;.4;1','0;.36;.36'],r:['0;.3;.4;.9;1','0;.34;.36;.36;1','.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1']},
 q:'Du fährst in der Dämmerung an einem Waldstück vorbei. Womit musst du rechnen?',a:['Wild, das die Straße quert.','Nur mit Gegenverkehr.','Nichts, die Straße ist frei.'],e:'Dämmerung und Waldränder sind Hauptzeiten für Wildwechsel. Tempo reduzieren, bremsbereit sein.',
 q2:'Ein Reh steht auf der Fahrbahn. Wie reagierst du?',a2:['Bremsen, Spur halten, nicht ausweichen.','Ausweichen und hupen.','Beschleunigen.'],e2:'Spur halten und bremsen. Ausweichen führt häufig zu schwereren Unfällen.'},
{id:'bend',
 build:(rev)=>`${defs}<rect width="300" height="220" fill="#0e1510"/>${tree(40,50,12)+tree(260,60,11)+tree(250,170,12)+tree(40,170,10)}<path d="M150 260 L150 150 Q150 100 190 70 T260 -20" fill="none" stroke="#3a413b" stroke-width="134" stroke-linecap="butt"/><path d="M150 260 L150 150 Q150 100 190 70 T260 -20" fill="none" stroke="#2c332e" stroke-width="112"/><path d="M150 260 L150 150 Q150 100 190 70 T260 -20" fill="none" stroke="#e8ecd8" stroke-width="2" stroke-dasharray="14 10" opacity=".5"/>${[[126,130],[140,100],[170,86],[190,66],[132,160],[165,118]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="6" ry="3" fill="#b8742a" opacity=".85" transform="rotate(${p[0]%40} ${p[0]} ${p[1]})"/>`).join('')}<ellipse cx="148" cy="115" rx="20" ry="9" fill="#5a7080" opacity=".35"/>${mark(120,92,.1)}`,
 car:{q:['0;.5;1','0;.5;.5'],r:['0;.3;1','0;.3;.78','.3 0 .7 1;.3 0 .7 1'],path:'M150,260 L150,150 Q150,100 190,70 T260,-20'},
 q:'Nach Regen liegt nasses Laub in einer Kurve. Wie fährst du?',a:['Vor der Kurve abbremsen und gleichmäßig durchfahren.','In der Kurve bremsen.','Schneller werden, um Grip aufzubauen.'],e:'Auf nassem Laub ist die Haftung deutlich geringer. Vor der Kurve bremsen, in der Kurve nicht ruckartig lenken oder bremsen.',
 q2:'Was senkt die Haftung in einer Kurve am meisten?',a2:['Nasses Laub, Schmutz, Schnee.','Trockener Asphalt.','Neuwertige Reifen.'],e2:'Nässe, Laub, Schmutz und Eis verringern den Grip deutlich.'}];
function svg(h,rev){
  const c=h.car,path=c.path||(c.turn?'M170,260 L170,140 Q170,92 215,92 L320,92':(c.off&&rev?`M170,260 L170,150 Q170,120 ${170+c.off},80 L${170+c.off},-60`:lane));
  const kt=rev?c.r[0]:c.q[0],kp=rev?c.r[1]:c.q[1],sp=rev?c.r[2]:null;
  const m=mo(vm('#6bd13a',{beam:1,blink:c.turn&&rev?'+':null}),path,kt,kp,1,sp);
  const body=h.build(rev);
  // Nutzerfahrzeug zwischen Straße und Beschriftung einfügen: nach Straßenelementen, vor Warnmarkierung ist egal
  return `<svg viewBox="0 0 300 220" width="100%" style="display:block;border-radius:14px;overflow:hidden">${body}${m}</svg>`}
const out=[];
S.forEach(h=>{const img=svg(h,false),anim=svg(h,true);
  out.push({id:'hz1'+h.id,c:'Gefahren-Szenarien',pt:4,img,anim,q:h.q,a:h.a,ok:[0],e:h.e,p:'Gefahren erkennen, bevor sie passieren: „Was könnte jetzt passieren?“ ist die beste Frage im Straßenverkehr.'});
  out.push({id:'hz2'+h.id,c:'Gefahren-Szenarien',pt:4,img,anim,q:h.q2,a:h.a2,ok:[0],e:h.e2,p:''})});
window.FRAGEN=(window.FRAGEN||[]).concat(out);
})();
