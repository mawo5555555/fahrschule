// Gefahren-Szenarien: kurze Animationen "Was passiert gleich?" (eigene Übungsfragen)
(function(){
const road=(x)=>`<rect width="300" height="220" fill="#101612"/><rect x="95" width="110" height="220" fill="#2a312c"/><path d="M150 0V220" stroke="#e8ecd8" stroke-width="2" stroke-dasharray="10 8" opacity=".5"/>${x||''}`;
const car=(x,y,c,rot,extra)=>`<g transform="translate(${x},${y}) rotate(${rot||0})"><rect x="-9" y="-16" width="18" height="32" rx="5" fill="${c}"/><rect x="-6" y="-8" width="12" height="9" rx="2" fill="#0a1214" opacity=".8"/>${extra||''}</g>`;
const mv=(el,path,dur,begin)=>`<g>${el}<animateMotion path="${path}" dur="${dur}s" begin="${begin||0}s;${(begin||0)+6}s" repeatCount="1" fill="freeze"/></g>`;
const me=mv(car(0,0,'#6bd13a',0),'M170,230 L170,-30',4.5,0);
const park=(y)=>car(215,y,'#556',0);
const S=[
{id:'ball',scene:road(park(60)+park(112)+mv(`<circle r="5" fill="#ff7a3a"/>`,'M212,86 L160,86',1.2,1.2)+mv(`<g><circle r="5" fill="#f2c9a0"/><rect x="-4" y="5" width="8" height="12" rx="3" fill="#3b8cff"/></g>`,'M212,86 L150,86',1.6,2.2)+me),
 q:'Ein Ball rollt zwischen parkenden Autos auf die Fahrbahn. Womit musst du rechnen?',a:['Ein Kind läuft dem Ball hinterher.','Der Ball ist ein Einzelfall, ich fahre weiter.','Gegenverkehr überholt gleich.'],ok:0,e:'Kinder achten nur auf den Ball. Bremsbereit werden, Tempo senken, notfalls anhalten.',
 q2:'Du siehst einen Ball auf die Straße rollen. Wie reagierst du?',a2:['Gas weg, bremsbereit, Blickkontakt suchen.','Hupen und beschleunigen.','Ausweichen nach links.'],e2:'Frühzeitig Tempo senken und auf ein nachlaufendes Kind gefasst sein.'},
{id:'door',scene:road(car(205,70,'#556',0,'<rect x="-22" y="-14" width="14" height="3" fill="#ddd"><animateTransform attributeName="transform" type="rotate" values="0 -9 -12;-70 -9 -12" dur="2s" begin="1.5s" fill="freeze"/></rect>')+car(205,130,'#667',0)+me),
 q:'Du fährst an einem geparkten Auto vorbei, im Auto sitzt noch jemand. Womit rechnest du?',a:['Die Fahrertür geht plötzlich auf.','Das Auto fährt sofort an.','Nichts, die Seite ist sicher.'],ok:0,e:'Türen öffnen oft ohne Blick nach hinten. Seitenabstand von mindestens etwa 1 m halten.',
 q2:'Wie viel Abstand hältst du zu parkenden Autos mit Insassen?',a2:['Möglichst etwa 1 m.','So nah wie möglich.','Egal, solange ich langsam bin.'],e2:'Ein Meter reicht meist, um einer sich öffnenden Tür auszuweichen.'},
{id:'bus',scene:road(`<rect x="196" y="40" width="28" height="70" rx="5" fill="#e8a317"/>`+mv(`<g><circle r="5" fill="#f2c9a0"/><rect x="-4" y="5" width="8" height="12" rx="3" fill="#ff5a4d"/></g>`,'M210,120 L170,120',1.4,1.8)+me),
 q:'Ein Bus steht an der Haltestelle. Plötzlich können Fußgänger hervortreten. Wie fährst du?',a:['Langsam, bremsbereit, bei Bedarf mit Seitenabstand vorbei.','Unverändert, Fußgänger müssen aufpassen.','Mit Hupen vorbeifahren.'],ok:0,e:'Fußgänger treten häufig hinter Bussen hervor. Tempo anpassen und auf verdeckte Personen achten.',
 q2:'Warum ist der Bereich hinter einem Bus gefährlich?',a2:['Wegen verdeckter Fußgänger.','Wegen Gegenverkehr.','Wegen schlechter Sicht nach hinten.'],e2:'Der Bus verdeckt die Sicht auf Fußgänger, die queren wollen.'},
{id:'bike',scene:road(mv(`<g transform="rotate(0)"><rect x="-3" y="-12" width="6" height="24" rx="3" fill="#ffb020"/></g>`,'M178,280 L178,-30',4.5,0)+mv(car(0,0,'#6bd13a',0),'M165,230 L165,150 Q165,125 190,125',3.2,0)),
 q:'Du willst rechts abbiegen, rechts neben dir fährt ein Radfahrer geradeaus. Was gilt?',a:['Ich muss ihn durchlassen und achte auf den toten Winkel.','Ich habe Vorrang, weil ich größer bin.','Ich blinke, dann muss er bremsen.'],ok:0,e:'Beim Abbiegen haben Geradeausfahrer Vorrang, auch Radfahrer. Der tote Winkel ist besonders gefährlich.',
 q2:'Was machst du vor dem Rechtsabbiegen mit Radweg neben der Fahrbahn?',a2:['Schulterblick und Spiegel, Radfahrer vorlassen.','Nur den Blinker setzen.','Schneller abbiegen.'],e2:'Spiegel, Schulterblick, Blinker, dann abbiegen und Radfahrer vorlassen.'},
{id:'over',scene:road(mv(car(0,0,'#3b8cff',180),'M125,-30 L125,230',3.6,0.2)+mv(car(0,0,'#d9d9d9',180),'M125,-60 Q125,-10 170,40 L170,230',3.6,0.2)+me),
 q:'Gegenüber überholt ein Fahrzeug und kommt dir auf deiner Spur entgegen. Was tust du?',a:['Bremsbereit werden und nach rechts Platz machen.','Auf Vorfahrt bestehen.','Auf die Gegenfahrbahn ausweichen.'],ok:0,e:'Tempo senken, äußerst rechts fahren und dem Überholer Raum geben.',
 q2:'Wann ist es riskant zu überholen?',a2:['Wenn Gegenverkehr nicht sicher einsehbar ist.','Auf gerader Strecke mit freier Sicht.','Bei geringer Geschwindigkeit des Vorausfahrenden.'],e2:'Überholen ist nur erlaubt, wenn Gegenverkehr nicht gefährdet wird und der Überholweg sicher einsehbar ist.'},
{id:'wild',scene:road(`<path d="M0 0H95M205 0H300V220H205" fill="#1a2a1a"/>`+mv(`<g><ellipse rx="9" ry="5" fill="#a0764a"/><circle cx="10" cy="-1" r="3" fill="#a0764a"/></g>`,'M260,110 L40,110',1.6,1.3)+me),
 q:'Du fährst in der Dämmerung an einem Waldstück vorbei. Womit musst du rechnen?',a:['Wild, das die Straße quert.','Nur mit Gegenverkehr.','Nichts, die Straße ist frei.'],ok:0,e:'Dämmerung und Waldränder sind Hauptzeiten für Wildwechsel. Tempo reduzieren, bremsbereit sein.',
 q2:'Ein Reh steht auf der Fahrbahn. Wie reagierst du?',a2:['Bremsen, Spur halten, nicht ausweichen.','Ausweichen und hupen.','Beschleunigen.'],e2:'Spur halten und bremsen. Ausweichen führt häufig zu schwereren Unfällen.'},
{id:'bend',scene:road(`<path d="M95 0 Q95 90 150 140 T205 220" fill="none" stroke="#2a312c" stroke-width="110"/>`+mv(car(0,0,'#6bd13a',0),'M165,230 L165,150 Q160,110 190,60',3.8,0)),
 q:'Nach Regen liegt nasses Laub in einer Kurve. Wie fährst du?',a:['Vor der Kurve abbremsen und gleichmäßig durchfahren.','In der Kurve bremsen.','Schneller werden, um Grip aufzubauen.'],ok:0,e:'Auf nassem Laub ist die Haftung deutlich geringer. Vor der Kurve bremsen, in der Kurve nicht ruckartig lenken oder bremsen.',
 q2:'Was senkt die Haftung in einer Kurve am meisten?',a2:['Nasses Laub, Schmutz, Schnee.','Trockener Asphalt.','Neuwertige Reifen.'],e2:'Nässe, Laub, Schmutz und Eis verringern den Grip deutlich.'}];
const out=[];
S.forEach(h=>{const svg=`<svg viewBox="0 0 300 220" width="100%" style="display:block;border-radius:14px">${h.scene}</svg>`;
  out.push({id:'hz1'+h.id,c:'Gefahren-Szenarien',pt:4,img:svg,q:h.q,a:h.a,ok:[h.ok],e:h.e,p:'Gefahren erkennen, bevor sie passieren: „Was könnte jetzt passieren?“ ist die beste Frage im Straßenverkehr.'});
  out.push({id:'hz2'+h.id,c:'Gefahren-Szenarien',pt:4,img:svg,q:h.q2,a:h.a2,ok:[0],e:h.e2,p:''})});
window.FRAGEN=(window.FRAGEN||[]).concat(out);
})();
