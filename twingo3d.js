// Eigener, stilisierter Renault Twingo I in 3D (three.js r128). Keine fremden Modelle.
window.Twingo3D=(function(){
const T=THREE;let R,scene,cam,car,bodyG,wheelsG=[],glass,rimGrp=[],exG,under,ground,glow,plateF,plateR,posts,mats={};
let fixed=false,view='out',vt=0,th=2.3,ph=0.12,rad=6.0,thT=th,phT=ph,radT=rad,drag=false,last=0,idle=0,running=false,host=null,spin=0,st={rim:0,tint:0,low:0,ps:75,e2:0,e1:0,tb:0,ch:0,bk:0};
const tx=x=>x>.9?1-.1*Math.min(1,(x-.9)/.85):(x<-1.2?1-.06*Math.min(1,(-1.2-x)/.5):1),ty=y=>y>.95?1-.17*Math.min(1,(y-.95)/.47):1,hw=(x,y)=>.8*tx(x)*ty(y);
function weld(g){const P=g.attributes.position,map={},idx=[],pos=[];for(let i=0;i<P.count;i++){const k=P.getX(i).toFixed(4)+','+P.getY(i).toFixed(4)+','+P.getZ(i).toFixed(4);if(map[k]===undefined){map[k]=pos.length/3;pos.push(P.getX(i),P.getY(i),P.getZ(i))}idx.push(map[k])}
  const n=new T.BufferGeometry();n.setAttribute('position',new T.Float32BufferAttribute(pos,3));n.setIndex(idx);n.computeVertexNormals();return n}
function bodyGeo(){
  const s=new T.Shape(),a0=Math.PI+.187,a1=-.187;
  s.moveTo(-1.62,.22);s.lineTo(-1.23-.344,.22);s.absarc(-1.23,.285,.35,a0,a1,true);s.lineTo(1.12-.344,.22);s.absarc(1.12,.285,.35,a0,a1,true);s.lineTo(1.62,.22);
  s.quadraticCurveTo(1.74,.24,1.73,.45);s.quadraticCurveTo(1.745,.72,1.58,.83);s.lineTo(.93,.97);s.lineTo(.44,1.40);s.quadraticCurveTo(-.4,1.5,-1.28,1.4);s.quadraticCurveTo(-1.64,1.36,-1.69,1.05);s.lineTo(-1.72,.7);s.quadraticCurveTo(-1.74,.38,-1.62,.22);
  const g=new T.ExtrudeGeometry(s,{depth:1.4,bevelEnabled:true,bevelThickness:.1,bevelSize:.07,bevelSegments:5,curveSegments:28,steps:1});
  g.translate(0,0,-.7);const P=g.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i);const z0=P.getZ(i);P.setZ(i,z0*tx(x)*ty(y));if(x>.9&&y>.8&&y<1.05)P.setY(i,y+.04*(1-Math.min(1,(z0/.8)**2)));if(y>1.36)P.setY(i,y+.05*(1-Math.min(1,(z0/.62)**2)))}
  return weld(g)}
function rrect(x0,x1,z0,z1,r){const s=new T.Shape();s.moveTo(x0+r,z0);s.lineTo(x1-r,z0);s.quadraticCurveTo(x1,z0,x1,z0+r);s.lineTo(x1,z1-r);s.quadraticCurveTo(x1,z1,x1-r,z1);s.lineTo(x0+r,z1);s.quadraticCurveTo(x0,z1,x0,z1-r);s.lineTo(x0,z0+r);s.quadraticCurveTo(x0,z0,x0+r,z0);return s}
function bumper(x0,x1,y0,h,w){const g=new T.ExtrudeGeometry(rrect(x0,x1,-w,w,.09),{depth:h,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:3,curveSegments:10});g.rotateX(Math.PI/2);g.translate(0,y0+h,0);return weld(g)}
function quad(p,q,r,s){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([...p,...q,...r,...p,...r,...s],3));g.computeVertexNormals();return g}
function plateTex(){const c=document.createElement('canvas');c.width=520;c.height=110;const x=c.getContext('2d');x.fillStyle='#f4f4f2';x.fillRect(0,0,520,110);x.fillStyle='#1c4aa8';x.fillRect(0,0,60,110);x.fillStyle='#ffd400';for(let i=0;i<10;i++){const a=i/10*6.283;x.beginPath();x.arc(30+16*Math.cos(a),55+16*Math.sin(a),2.6,0,7);x.fill()}
  x.strokeStyle='#222';x.lineWidth=6;x.strokeRect(3,3,514,104);x.fillStyle='#111';x.font='bold 74px Arial,Helvetica,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('MILANO 1',292,60);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t}
function envMap(){const sc=new T.Scene(),c=document.createElement('canvas');c.width=4;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#cfe9ff');g.addColorStop(.48,'#8fa89a');g.addColorStop(.52,'#1b231d');g.addColorStop(1,'#0b0f0c');x.fillStyle=g;x.fillRect(0,0,4,256);
  const t=new T.CanvasTexture(c);sc.add(new T.Mesh(new T.SphereGeometry(50,32,16),new T.MeshBasicMaterial({map:t,side:T.BackSide})));
  [[10,12,8,14,6],[-12,10,6,12,5],[0,14,-14,18,5]].forEach(a=>{const m=new T.Mesh(new T.PlaneGeometry(a[3],a[4]),new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide}));m.position.set(a[0],a[1],a[2]);m.lookAt(0,0,0);m.material.color.setScalar(a[4]>5?3:2);sc.add(m)});
  const pm=new T.PMREMGenerator(R);const e=pm.fromScene(sc,.02).texture;pm.dispose();return e}
function rimMesh(t){
  const g=new T.Group(),m=(c,me,ro)=>new T.MeshStandardMaterial({color:c,metalness:me,roughness:ro});
  const cyl=(r,h,mat)=>{const c=new T.Mesh(new T.CylinderGeometry(r,r,h,40),mat);c.rotation.x=Math.PI/2;return c};
  if(t===0){const d=cyl(.2,.03,m(0x8d938f,.6,.45));d.position.z=.075;g.add(d);const hub=new T.Mesh(new T.SphereGeometry(.07,16,8,0,6.283,0,1.57),m(0xaab0ac,.7,.3));hub.rotation.x=Math.PI/2;hub.position.z=.09;g.add(hub);
    for(let i=0;i<6;i++){const a=new T.Mesh(new T.BoxGeometry(.05,.03,.015),m(0x2a2d2b,.2,.8));a.position.set(Math.cos(i*1.047)*.14,Math.sin(i*1.047)*.14,.092);g.add(a)}return g}
  const base=cyl(.205,.03,m(t===3?0x131518:0x161816,.4,.5));base.position.z=.07;g.add(base);
  const n=t===1?5:t===2?10:6,col=t===1?0xe8ece9:t===2?0x4a4f52:0x0f1113;
  for(let i=0;i<n;i++){const w=t===2?.035:.07,b=new T.Mesh(new T.BoxGeometry(w,.17,.03),m(col,.9,.25));b.position.set(0,.11,.088);const p=new T.Group();p.add(b);p.rotation.z=i*6.283/n;g.add(p)}
  const ring=new T.Mesh(new T.TorusGeometry(.2,t===3?.02:.012,8,40),m(t===3?0xe8322a:0xdfe3e0,.9,.2));ring.position.z=.09;g.add(ring);
  const c=cyl(.045,.04,m(col,.9,.3));c.position.z=.095;g.add(c);return g}
function build(){
  scene=new T.Scene();cam=new T.PerspectiveCamera(26,1.6,.1,60);
  R=new T.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=.9;R.domElement.style.cssText='width:100%;display:block;touch-action:pan-y;border-radius:20px';
  scene.environment=envMap();
  scene.add(new T.HemisphereLight(0xdfffe0,0x101510,.35));const d=new T.DirectionalLight(0xffffff,1.1);d.position.set(3,5,4);scene.add(d);const d2=new T.DirectionalLight(0x9bff5e,.5);d2.position.set(-4,2,-3);scene.add(d2);
  const gc=document.createElement('canvas');gc.width=gc.height=256;const gx=gc.getContext('2d'),gr=gx.createRadialGradient(128,128,0,128,128,128);gr.addColorStop(0,'rgba(124,255,74,.30)');gr.addColorStop(.5,'rgba(60,120,40,.12)');gr.addColorStop(1,'rgba(0,0,0,0)');gx.fillStyle=gr;gx.fillRect(0,0,256,256);
  ground=new T.Mesh(new T.CircleGeometry(5,48),new T.MeshBasicMaterial({map:new T.CanvasTexture(gc),transparent:true,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=.002;scene.add(ground);
  const sh=document.createElement('canvas');sh.width=sh.height=128;const sx=sh.getContext('2d'),sg=sx.createRadialGradient(64,64,0,64,64,64);sg.addColorStop(0,'rgba(0,0,0,.75)');sg.addColorStop(1,'rgba(0,0,0,0)');sx.fillStyle=sg;sx.fillRect(0,0,128,128);
  const shadow=new T.Mesh(new T.PlaneGeometry(4.4,2.3),new T.MeshBasicMaterial({map:new T.CanvasTexture(sh),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.006;ground.add(shadow);shadow.rotation.x=0;shadow.position.set(0,0,.006);
  car=new T.Group();scene.add(car);bodyG=new T.Group();car.add(bodyG);
  mats.paint=new T.MeshPhysicalMaterial({color:0x2fa40c,metalness:.45,roughness:.26,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:1.0});
  mats.black=new T.MeshStandardMaterial({color:0x0b0d0e,roughness:.7,metalness:.05});
  mats.glass=new T.MeshPhysicalMaterial({color:0x2a3f48,metalness:.7,roughness:.06,envMapIntensity:.7,transparent:true,opacity:.95});
  bodyG.add(new T.Mesh(bodyGeo(),mats.paint));
  const mk=(x0,x1,y0,h,w)=>new T.Mesh(bumper(x0,x1,y0,h,w),mats.black);
  bodyG.add(mk(1.6,1.79,.22,.33,.7));bodyG.add(mk(-1.83,-1.62,.22,.3,.65));
  const fog=new T.MeshStandardMaterial({color:0xfff2b0,emissive:0xffd860,emissiveIntensity:.25,metalness:.5,roughness:.2});
  for(const s of [-1,1]){const f=new T.Mesh(new T.CylinderGeometry(.05,.05,.04,20),fog);f.rotation.z=Math.PI/2;f.position.set(1.8,.31,s*.46);bodyG.add(f)}
  const grl=new T.Mesh(new T.BoxGeometry(.03,.05,.6),new T.MeshStandardMaterial({color:0x040506}));grl.position.set(1.805,.47,0);bodyG.add(grl);
  const lg=new T.Mesh(new T.PlaneGeometry(.13,.13),new T.MeshStandardMaterial({color:0xd8dcd9,metalness:.9,roughness:.25}));lg.rotation.set(0,Math.PI/2,Math.PI/4);lg.position.set(1.835,.64,0);bodyG.add(lg);;
  // Scheiben
  const win=(pts)=>{const sh=new T.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));const g=new T.ShapeGeometry(sh);const P=g.attributes.position;for(let s=-1;s<=1;s+=2){const gg=g.clone(),Q=gg.attributes.position;for(let i=0;i<Q.count;i++)Q.setZ(i,s*(hw(Q.getX(i),Q.getY(i))+.12*0+.006));if(s<0)gg.index?0:gg.scale(1,1,1);const m=new T.Mesh(gg,mats.glass);if(s<0){m.material=mats.glass.clone();m.material.side=T.BackSide;mats.glassB=m.material}bodyG.add(m)}};
  win([[.86,1.0],[.5,1.36],[-.1,1.37],[-.1,1.0]]);win([[-.22,1.0],[-.22,1.37],[-1.18,1.37],[-1.5,1.14],[-1.58,1.0]]);
  const wq=(a,b,c,dd,nx,ny)=>{const o=.095;const f=(p)=>[p[0]+nx*o,p[1]+ny*o,p[2]];[a,b,c,dd]=[a,b,c,dd].map(f);const m=new T.Mesh(quad(a,b,c,dd),mats.glass);m.material=mats.glass;bodyG.add(m);const m2=new T.Mesh(quad(a,dd,c,b),mats.glass);bodyG.add(m2)};
  wq([.96,1.0,-.66],[.96,1.0,.66],[.52,1.36,.6],[.52,1.36,-.6],.63,.78);wq([-1.66,.86,-.6],[-1.66,.86,.6],[-1.42,1.33,.58],[-1.42,1.33,-.58],-.9,.43);
  // Türleisten, Spiegel, Lichter, Lüftungsschlitze
  for(const s of [-1,1]){for(const xx of [.82,-.2]){const f=new T.Mesh(new T.BoxGeometry(.012,.62,.012),mats.black);f.position.set(xx,.68,s*(hw(xx,.68)+.012));bodyG.add(f)}const hd=new T.Mesh(new T.BoxGeometry(.1,.025,.03),mats.black);hd.position.set(-.05,.92,s*(hw(-.05,.92)+.02));bodyG.add(hd);const l=new T.Mesh(new T.BoxGeometry(1.0,.07,.03),mats.black);l.position.set(.1,.58,s*(hw(.1,.58)+.02));bodyG.add(l);
    const mi=new T.Mesh(new T.BoxGeometry(.1,.13,.16),mats.black);mi.position.set(.62,1.08,s*.9);bodyG.add(mi);
    const hh=new T.Mesh(new T.CylinderGeometry(.14,.14,.07,32),new T.MeshStandardMaterial({color:0x15181a,metalness:.5,roughness:.4}));hh.rotation.z=Math.PI/2;hh.position.set(1.715,.7,s*.5);bodyG.add(hh);const hl=new T.Mesh(new T.SphereGeometry(.115,24,12,0,6.283,0,1.45),new T.MeshStandardMaterial({color:0xf4f7ee,emissive:0xfff0b0,emissiveIntensity:.35,metalness:.5,roughness:.1,envMapIntensity:1.4}));hl.rotation.z=-Math.PI/2;hl.scale.set(.6,1,1);hl.position.set(1.742,.7,s*.5);bodyG.add(hl);
    const ind=new T.Mesh(new T.BoxGeometry(.05,.05,.12),new T.MeshStandardMaterial({color:0xffa500,emissive:0xff7a00,emissiveIntensity:.4}));ind.position.set(1.75,.56,s*.6);bodyG.add(ind);
    const tl=new T.Mesh(new T.BoxGeometry(.05,.26,.1),new T.MeshStandardMaterial({color:0xd01a10,emissive:0x7a0905,emissiveIntensity:.6}));tl.position.set(-1.77,.78,s*.62);bodyG.add(tl)}
  for(let i=0;i<4;i++){const v=new T.Mesh(new T.BoxGeometry(.15,.01,.025),mats.black);v.position.set(1.0+i*.0+.5,.9,-.46+i*.06);v.position.set(1.12,.91-i*.0,-.46+i*.06*1);v.rotation.y=.2;bodyG.add(v);const v2=v.clone();v2.position.z=-v.position.z;bodyG.add(v2)}
  const pt=plateTex(),pm=new T.MeshStandardMaterial({map:pt,roughness:.5});plateF=new T.Mesh(new T.PlaneGeometry(.52,.11),pm);plateF.rotation.y=Math.PI/2;plateF.position.set(1.812,.37,0);bodyG.add(plateF);
  plateR=new T.Mesh(new T.PlaneGeometry(.52,.11),pm);plateR.rotation.y=-Math.PI/2;plateR.position.set(-1.852,.37,0);bodyG.add(plateR);
  // Räder
  const tire=new T.MeshStandardMaterial({color:0x0e0f0f,roughness:.9});
  [[1.12,1],[1.12,-1],[-1.23,1],[-1.23,-1]].forEach(([x,s])=>{const w=new T.Group();w.position.set(x,.285,s*.665);const tr=new T.Mesh(new T.CylinderGeometry(.29,.29,.19,40),tire);tr.rotation.x=Math.PI/2;w.add(tr);
    const rim=new T.Group();rim.position.z=.012;w.add(rim);if(s<0)w.rotation.y=Math.PI;w.userData={rim,s};car.add(w);wheelsG.push(w)});
  // Unterboden
  under=new T.Group();car.add(under);exG=new T.Group();under.add(exG);
  const dk=new T.MeshStandardMaterial({color:0x2b2f2d,metalness:.5,roughness:.6});
  const eng=new T.Mesh(new T.BoxGeometry(.7,.2,.6),dk);eng.position.set(.95,.15,0);under.add(eng);const gb=new T.Mesh(new T.BoxGeometry(.38,.18,.3),dk);gb.position.set(.55,.14,-.1);under.add(gb);
  const sub=new T.Mesh(new T.BoxGeometry(.5,.03,1.1),dk);sub.position.set(1.05,.185,0);under.add(sub);const tank=new T.Mesh(new T.BoxGeometry(.7,.14,.8),dk);tank.position.set(-.55,.15,0);under.add(tank);
  for(const x of [1.12,-1.23]){const ax=new T.Mesh(new T.CylinderGeometry(.02,.02,1.2,10),dk);ax.rotation.x=Math.PI/2;ax.position.set(x,.27,0);under.add(ax)}
  // Beleuchtung unter dem Auto + Hebebühne
  glow=new T.PointLight(0x7cff4a,0,3);glow.position.set(0,.1,0);car.add(glow);
  posts=new T.Group();for(const x of [-.9,.9])for(const s of [-1,1]){const p=new T.Mesh(new T.BoxGeometry(.12,1.15,.12),new T.MeshStandardMaterial({color:0x555b57,metalness:.6,roughness:.5}));p.position.set(x,.575-1.2,s*.62);posts.add(p)}posts.visible=false;scene.add(posts);
  apply();
}
function exhaust(){
  while(exG.children.length)exG.remove(exG.children[0]);
  const sport=st.e2,fan=st.e1,col=sport?0xdfe3e0:0x6a6f6c,r=fan?.035:.03,mt=new T.MeshStandardMaterial({color:col,metalness:.9,roughness:.25});
  const pipe=(x0,x1,y,z,rr)=>{const l=Math.abs(x1-x0),c=new T.Mesh(new T.CylinderGeometry(rr,rr,l,16),mt);c.rotation.z=Math.PI/2;c.position.set((x0+x1)/2,y,z);exG.add(c)};
  if(fan){[-.18,-.06,.06,.18].forEach((z,i)=>{pipe(.75,.45,.2,z*1.0,.025);});pipe(.45,.1,.17,0,r+.01)}else pipe(.55,.1,.17,0,r);
  pipe(.1,-.9,.15,.06,r);
  const mf=new T.Mesh(new T.CylinderGeometry(sport?.09:.075,sport?.09:.075,.5,20),mt);mf.rotation.z=Math.PI/2;mf.position.set(-1.35,.15,.06);exG.add(mf);
  pipe(-.9,-1.1,.15,.06,r);
  const tip=new T.Mesh(new T.CylinderGeometry(sport?.065:.04,sport?.065:.04,.1,20),new T.MeshStandardMaterial({color:sport?0xf0f3f1:0x444,metalness:1,roughness:.15}));tip.rotation.z=Math.PI/2;tip.position.set(-1.86,.17,.06);exG.add(tip);
  if(st.tb){const t=new T.Mesh(new T.TorusGeometry(.08,.04,10,20),new T.MeshStandardMaterial({color:0x7cff4a,emissive:0x2f9a14,emissiveIntensity:.8}));t.position.set(.9,.3,.38);t.rotation.y=1.2;exG.add(t)}
  if(st.ch){const gl=new T.Mesh(new T.BoxGeometry(.7,.02,.62),new T.MeshStandardMaterial({color:0x7cff4a,emissive:0x2f9a14,emissiveIntensity:.5}));gl.position.set(.95,.255,0);exG.add(gl)}
}
function apply(){
  if(!car)return;
  bodyG.position.y=-st.low;
  const tt=[0x2a3f48,0x16242a,0x0a1317,0x020405][st.tint||0];mats.glass.color.setHex(tt);mats.glass.opacity=[.9,.95,.98,1][st.tint||0];if(mats.glassB){mats.glassB.color.setHex(tt);mats.glassB.opacity=mats.glass.opacity}
  wheelsG.forEach(w=>{const u=w.userData;if(u.cur!==st.rim){u.rim.children.slice().forEach(c=>u.rim.remove(c));u.rim.add(rimMesh(st.rim));u.cur=st.rim;
    if(st.bk){const c=new T.Mesh(new T.BoxGeometry(.06,.13,.05),new T.MeshStandardMaterial({color:0xe8322a,roughness:.4}));c.position.set(0,-.13,.04);u.rim.add(c)}}});
  glow.intensity=Math.max(0,(st.ps-80)/20);exhaust();
}
function resize(){if(!host||!R)return;const w=host.clientWidth||340;R.setSize(w,Math.round(w*(view==='under'?.8:.66)),false);R.domElement.style.height=Math.round(w*(view==='under'?.8:.66))+'px';cam.aspect=w/(w*(view==='under'?.8:.66));cam.updateProjectionMatrix()}
function loop(t){if(!running)return;requestAnimationFrame(loop);if(!host||!host.isConnected){running=false;return}
  const dt=Math.min(.05,(t-last)/1000||0.016);last=t;
  if(!drag){idle+=dt;if(!fixed&&idle>2.5&&view==='out')thT+=dt*.25}
  th+=(thT-th)*Math.min(1,dt*8);ph+=(phT-ph)*Math.min(1,dt*8);rad+=(radT-rad)*Math.min(1,dt*6);
  const lift=view==='under'?1.2:0;vt+=((view==='under'?1:0)-vt)*Math.min(1,dt*4);car.position.y=lift*vt;ground.visible=vt<.5;posts.visible=vt>.5;
  const ty=.55+lift*vt*.9,cx=Math.cos(ph)*Math.sin(th)*rad,cz=Math.cos(ph)*Math.cos(th)*rad,cy=ty+Math.sin(ph)*rad;
  cam.position.set(cx,cy<.15&&view!=='under'?.15:cy,cz);cam.lookAt(0,ty,0);
  spin+=dt*3;wheelsG.forEach(w=>{if(st.spin)w.userData.rim.rotation.z=-spin*(w.userData.s>0?1:-1)});
  R.render(scene,cam)}
function bind(el){let x0=0,y0=0;const c=R.domElement;
  c.onpointerdown=e=>{drag=true;idle=0;x0=e.clientX;y0=e.clientY;c.setPointerCapture(e.pointerId)};
  c.onpointermove=e=>{if(!drag)return;thT-=(e.clientX-x0)*.012;const lo=view==='under'?-.9:.02;phT=Math.max(lo,Math.min(.6,phT+(e.clientY-y0)*.008));x0=e.clientX;y0=e.clientY};
  c.onpointerup=c.onpointercancel=()=>{drag=false;idle=0}}
return{
  mount(el,v,opts){if(!window.THREE)return;if(!R){build();bind(el)}host=el;el.appendChild(R.domElement);this.set(opts||{});this.view(v||'out');resize();if(!running){running=true;requestAnimationFrame(loop)}},
  set(o){Object.assign(st,o);apply()},
  view(v){view=v;const cm=/cam=([-\d.]+),([-\d.]+),([-\d.]+)/.exec(location.search);if(cm){fixed=true;th=thT=+cm[1];ph=phT=+cm[2];rad=radT=+cm[3];resize();return}if(v==='under'){phT=-.38;radT=6.4;thT=.9}else{phT=.17;radT=6.0;thT=th>7||th<-7?2.3:th}resize()},
  rev(){}
}})();
