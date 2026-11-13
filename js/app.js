const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='wm-osada-v3',MAIL='michal.santoris@gmail.com';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TERS={world:[['les','Les','#3c8a55'],['hory','Hory','#8a8fa8'],['moc','Močiar','#5c7a52'],['rov','Rovina','#a3b04a'],['voda','Voda','#3b86c4'],['pus','Púšť','#d4a94f']],
 vil:[['tra','Trávnik','#7fb552'],['les','Les (treba vyčistiť)','#3c8a55'],['ska','Skala','#8a8fa8'],['voda','Voda','#3b86c4']]};
const ICONS={world:['🏚️','🕳️','🗼','🏕️','⚠️','🪵','🪨','👤','🐉','🏠'],vil:['🏠','🔨','🌾','🛡️','🍺','📦','⛏️','🔥']};
const HINT={post:'400×400 px',npc:'400×400 px',hex:'512×512 px'};
// ---- data ----
const TPL={Zbraň:{ab:'STR',dmg:'1d6',dt:'',pf:1,mg:0},Brnenie:{ac:11,k:'Ľahké',mg:0},Štít:{ac:2,mg:0},Iné:{}};
function def(){
 const mk=(W,H,ters,f)=>Array.from({length:W*H},(_,i)=>{const c=i%W,r=i/W|0,h=Math.abs(Math.sin(c*12.9+r*78.2)*43758)%1;return{t:f?f(c,r,h):ters[Math.floor(h*ters.length)][0],rev:false,name:'',desc:'',img:'',ic:[],rum:''}});
 const world=mk(12,9,TERS.world);world[4*12+6]={...world[4*12+6],t:'rov',rev:true,name:'Osada',desc:'Tu sa všetko začalo.',ic:['🏠']};
 nb(6,4,12,9).forEach(i=>world[i].rev=true);
 const vil=mk(7,6,TERS.vil,(c,r,h)=>c==0||c==6||r==0?'les':h>.9?'ska':'tra');
 vil[3*7+3]={...vil[3*7+3],t:'tra',name:'Ohnisko',desc:'Stred osady.',ic:['🔥']};
 const d=new Date();d.setDate(d.getDate()+((6-d.getDay()+7)%7||7));d.setHours(18,0,0,0);
 return{world:{W:12,H:9,cells:world},vil:{W:7,H:6,cells:vil},
  stock:{Drevo:12,Kameň:5,Jedlo:20,Zlato:30},rumors:[{t:'Obchodník Brom tvrdí, že na východe stojí zrúcaná veža.',src:'Cestovateľ',hex:'I5'},{t:'Na starej mape je pri močiari nakreslená lebka.',src:'Stará mapa',hex:''}],
  exp:[],osada:{def:0,hap:0,pop:0},time:{d:1,m:2,y:1},log:[],ev:[],dt:[],
  bld:[{n:'Ohnisko',st:'Dokončená',lvl:1,cost:'',bonus:'Stred osady, tu sa schádzame.',prog:100,d:''}],
  chron:[{when:'Rok 1, 1. Prebúdzač',t:'Založenie osady',d:'Skupina sa zišla na prázdnom mieste a založila osadu.'}],
  fac:[{n:'Cestujúci obchodníci',d:'Kočovní predajcovia, ktorí prechádzajú okolo osady.',rel:'Neutrálna',rep:0}],
  rules:[{t:'Prihlasovanie',d:'Na výpravu sa hlásiš u DM-a najneskôr deň vopred. Ak sa nemôžeš zúčastniť, odhlás sa.'},{t:'Návrat do bezpečia',d:'Výprava končí v osade. Postava v teréne nemôže ísť na inú výpravu.'},{t:'Smrť postavy',d:'Padlá postava ide do Siene hrdinov a hráč si vytvorí novú na 1. úrovni (alebo podľa dohody).'},{t:'Korisť',d:'Korisť sa delí podľa dohody na konci výpravy, suroviny idú do osadového skladu.'},{t:'Aktivity medzi výpravami',d:'Postava v osade môže vykonať jednu aktivitu (stavať, craftovať, zbierať, loviť…). DM ju vyhodnotí.'}],
  players:[{name:'Marek',chars:[{name:'Thorin Kamenná päsť',race:'Trpaslík',cls:'Bojovník',lvl:3,img:'',hp:28,max:28,acb:0,spd:25,ab:{STR:16,DEX:12,CON:15,INT:8,WIS:12,CHA:10},saves:['STR','CON'],sk:{ath:1,prc:1,itm:1},inv:[{n:'Veľká sekera',q:1,w:'U seba',t:'Zbraň',ab:'STR',dmg:'1d12',dt:'sečné',pf:1,mg:0,eq:1,wt:3},{n:'Kolčuga',q:1,w:'U seba',t:'Brnenie',ac:16,k:'Ťažké',mg:0,eq:1,wt:27},{n:'Štít',q:1,w:'U seba',t:'Štít',ac:2,mg:0,eq:1,wt:3},{n:'Lano (15 m)',q:1,w:'U seba',t:'Iné',wt:5}]}]},{name:'Jana',chars:[]}],
  npcs:[{n:'Brom',i:'',d:'Cestujúci obchodník s pochybnými mapami.'}]}}
const BASE=(window.DATA&&window.DATA.v)||0;
let S=null;
try{const L=JSON.parse(localStorage.getItem(KEY));if(L&&L.base===BASE)S=L.s}catch(e){}
if(!S){S=window.DATA?JSON.parse(JSON.stringify(window.DATA)):def();try{localStorage.removeItem(KEY);localStorage.removeItem(KEY+'-d')}catch(e){}}
{const D0=def();Object.keys(D0).forEach(k=>{if(S[k]===undefined)S[k]=D0[k]});
S.players.forEach(p=>p.chars.forEach(c=>{c.inv=c.inv||[];c.sp=c.sp||[];c.sl=c.sl||Array.from({length:9},()=>[0,0]);c.gp=c.gp??0;
 if(c.atk){if(!c.inv.some(i=>i.t=='Zbraň'))c.inv.push({n:c.atk.n,q:1,w:'U seba',t:'Zbraň',ab:c.atk.b,dmg:c.atk.d,eq:1});delete c.atk}
 if(c.acb===undefined)c.acb=c.ac!=null?c.ac-10-Math.floor((c.ab.DEX-10)/2):0;
 c.inv.forEach(s=>{s.t=s.t||'Iné';Object.assign(s,{...TPL[s.t],...s});s.wt=s.wt??0;s.eq=s.eq??0})}))}
let dirty=!!localStorage.getItem(KEY+'-d');
function save(){try{localStorage.setItem(KEY,JSON.stringify({base:BASE,s:S}));localStorage.setItem(KEY+'-d','1')}catch(e){}dirty=true;$('#dirty').style.display='inline-block'}
if(dirty)$('#dirty').style.display='inline-block';
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2800)}
// ---- hex ----
const colName=n=>{let s='';n++;while(n>0){s=String.fromCharCode(65+(n-1)%26)+s;n=(n-1)/26|0}return s};
const colNum=s=>[...s.toUpperCase()].reduce((a,c)=>a*26+c.charCodeAt(0)-64,0)-1;
function shiftHex(h,dc,dr){const m=(h||'').trim().match(/^([A-Za-z]+)(\d+)$/);return m?colName(colNum(m[1])+dc)+(+m[2]+dr):h}
const rumAt=i=>S.rumors.filter(r=>(r.hex||'').trim().toUpperCase()===colName(i%S.world.W)+((i/S.world.W|0)+1));
function nb(c,r,W,H){const o=r&1?[[-1,0],[1,0],[0,-1],[1,-1],[0,1],[1,1]]:[[-1,0],[1,0],[-1,-1],[0,-1],[-1,1],[0,1]];
 return o.map(([a,b])=>[c+a,r+b]).filter(([x,y])=>x>=0&&y>=0&&x<W&&y<H).map(([x,y])=>y*W+x)}
function imgBox(p,k){return p?`<img class="im" src="${esc(p)}" alt="" onerror="this.outerHTML='<div class=ph>Súbor ${esc(p)} sa nenašiel.<br>Nahraj ho do priečinka img/</div>'">`:`<div class="ph">Tu bude obrázok.<br>Odporúčaná veľkosť ${HINT[k]}<br>(WebP alebo JPG)</div>`}
function GridMap(id,key,o){
 const el=$('#'+id),R=30,SQ=Math.sqrt(3),m={sel:null,edit:false,v:{x:20,y:20,k:1}};
 const M=()=>S[key],ters=TERS[o.ters];
 el.innerHTML=`<div class="mapwrap"><div><div class="row" style="margin-bottom:8px"><label style="margin:0"><input type="checkbox" id="${id}-e" style="width:auto"> Režim úprav</label><span id="${id}-x" class="row" hidden><button data-x="u">+ riadok hore</button><button data-x="d">+ riadok dole</button><button data-x="l">+ stĺpec vľavo</button><button data-x="r">+ stĺpec vpravo</button></span></div><div class="map"><svg id="${id}-s"><g id="${id}-g"></g></svg><div class="zb"><button data-z="1.25" aria-label="Priblížiť">+</button><button data-z=".8" aria-label="Oddialiť">−</button><button data-z="0" aria-label="Vycentrovať">◎</button></div></div></div><div class="card" id="${id}-p"></div></div>`;
 const svg=$('#'+id+'-s'),g=$('#'+id+'-g'),P=$('#'+id+'-p');
 const st=i=>{const c=M().cells[i];if(!o.fog||c.rev)return 2;const W=M().W,H=M().H;return nb(i%W,i/W|0,W,H).some(j=>M().cells[j].rev)?1:0};
 const tc=t=>(ters.find(x=>x[0]==t)||ters[0])[2];
 function draw(){const{W,H,cells}=M();let h='';
  cells.forEach((c,i)=>{const q=i%W,r=i/W|0,x=R*SQ*(q+(r&1)/2),y=R*1.5*r,s=st(i);
   const pts=[0,1,2,3,4,5].map(k=>{const a=Math.PI/180*(60*k-30);return(x+R*Math.cos(a)).toFixed(1)+','+(y+R*Math.sin(a)).toFixed(1)}).join(' ');
   const fill=s==0?'#1c1634':tc(c.t),op=s==1?.55:1;
   h+=`<g data-i="${i}"><polygon class="hx${m.sel==i?' sel':''}" points="${pts}" fill="${fill}" opacity="${op}"/>`;
   if(s==0)h+=`<text x="${x}" y="${y+5}" text-anchor="middle" fill="#3d3266" font-size="16">☁</text>`;
   if(s==2&&c.ic.length)h+=`<text x="${x}" y="${y+7}" text-anchor="middle" font-size="${c.ic.length>1?15:22}">${c.ic.slice(0,2).join('')}</text>`;
   if(s==1&&rumAt(i).length)h+=`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="18">❓</text>`;
   h+='</g>'});
  g.innerHTML=h;g.setAttribute('transform',`translate(${m.v.x},${m.v.y}) scale(${m.v.k})`)}
 function panel(){const i=m.sel;if(i==null){P.innerHTML='<p class="mut">Klikni na pole mapy.</p>';return}
  const c=M().cells[i],W=M().W,co=colName(i%W)+((i/W|0)+1),s=st(i);
  if(!m.edit){
   if(s==0)P.innerHTML=`<h3>${co}</h3><p class="mut">Neznáme územie.</p>`;
   else if(s==1)P.innerHTML=`<h3>${co}: na obzore</h3><p>Terén: ${ters.find(x=>x[0]==c.t)[1]}</p>${rumAt(i).map(r=>`<p>❓ ${esc(r.t)} <span class="mut">(${esc(r.src)})</span></p>`).join('')||'<p class="mut">Zatiaľ žiadne zvesti.</p>'}`;
   else P.innerHTML=`<h3>${esc(c.name||co)}</h3><p class="mut">${co} · ${ters.find(x=>x[0]==c.t)[1]}</p>${imgBox(c.img,'hex')}<p>${esc(c.desc)||'<span class=mut>Bez popisu.</span>'}</p>${c.ic.map(x=>`<span class="tag">${x}</span>`).join('')}`;
   return}
  P.innerHTML=`<h3>Úprava ${co}</h3>
  ${o.fog?`<label><input type="checkbox" id="f-rev" style="width:auto" ${c.rev?'checked':''}> Hmla vypnutá (odhalené)</label>`:''}
  <label>Terén</label><select id="f-t">${ters.map(t=>`<option value="${t[0]}" ${t[0]==c.t?'selected':''}>${t[1]}</option>`).join('')}</select>
  <label>Názov</label><input id="f-n" value="${esc(c.name)}">
  <label>Popis</label><textarea id="f-d">${esc(c.desc)}</textarea>
  <label>Ikonky</label><div class="row" id="f-i">${ICONS[o.ters].map(x=>`<button data-ic="${x}" style="${c.ic.includes(x)?'border-color:var(--acc)':''}">${x}</button>`).join('')}</div>
  <label>Obrázok (cesta), odporúčané ${HINT.hex}</label><input id="f-m" value="${esc(c.img)}" placeholder="img/mapa/veza.webp">${imgBox(c.img,'hex')}
  ${o.fog?'<p class="mut">Zvesti k poliu sa pridávajú v záložke Zvesti.</p>':''}`;
  const set=(k,v)=>{c[k]=v;save();draw()};
  P.querySelector('#f-rev')?.addEventListener('change',e=>set('rev',e.target.checked));
  $('#f-t',P)||0;
  P.querySelector('#f-t').onchange=e=>set('t',e.target.value);
  P.querySelector('#f-n').oninput=e=>{c.name=e.target.value;save()};
  P.querySelector('#f-d').oninput=e=>{c.desc=e.target.value;save()};
  P.querySelector('#f-m').onchange=e=>{set('img',e.target.value);panel()};
  P.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>{const x=b.dataset.ic;c.ic=c.ic.includes(x)?c.ic.filter(y=>y!=x):[...c.ic,x];save();draw();panel()})}
 function expand(d){const{W,H,cells}=M(),mc=()=>({t:ters[0][0],rev:!o.fog,name:'',desc:'',img:'',ic:[]});let out=[];
  if(d=='l'||d=='r'){for(let r=0;r<H;r++){const row=cells.slice(r*W,r*W+W);d=='r'?row.push(mc()):row.unshift(mc());out.push(...row)}M().W=W+1}
  else{const nr=Array.from({length:W},mc);out=d=='d'?[...cells,...nr]:[...nr,...cells];M().H=H+1}
  M().cells=out;m.sel=null;
  if(key=='world'&&(d=='l'||d=='u'))S.rumors.forEach(r=>r.hex=shiftHex(r.hex,d=='l'?1:0,d=='u'?1:0));
  save();draw();panel();if(typeof rums=='function')rums();toast('Mapa rozšírená')}
 m.center=f=>{if(m.c&&!f)return;const{W,H}=M(),r=svg.getBoundingClientRect();if(!r.width)return;const w=R*SQ*(W+.5),h=R*1.5*(H-1)+2*R,k=Math.min(1.4,Math.max(.4,Math.min(r.width/w,r.height/h)*.95));m.v={k,x:(r.width-w*k)/2+R*SQ/2*k,y:(r.height-h*k)/2+R*k};m.c=1;draw()};
 el.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>expand(b.dataset.x));
 $('#'+id+'-e').onchange=e=>{m.edit=e.target.checked;$('#'+id+'-x').hidden=!m.edit;panel()};
 el.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{const z=+b.dataset.z;if(!z)return m.center(1);m.v.k=Math.min(3,Math.max(.4,m.v.k*z));draw()});
 svg.addEventListener('wheel',e=>{e.preventDefault();const r=svg.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top,k0=m.v.k,k=Math.min(3,Math.max(.4,k0*(e.deltaY<0?1.12:.89)));
  m.v.x=px-(px-m.v.x)*k/k0;m.v.y=py-(py-m.v.y)*k/k0;m.v.k=k;draw()},{passive:false});
 let dr=null;
 svg.onpointerdown=e=>{dr={x:e.clientX,y:e.clientY,vx:m.v.x,vy:m.v.y,mv:false};svg.setPointerCapture(e.pointerId)};
 svg.onpointermove=e=>{if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;if(Math.abs(dx)+Math.abs(dy)>5)dr.mv=true;if(dr.mv){m.v.x=dr.vx+dx;m.v.y=dr.vy+dy;g.setAttribute('transform',`translate(${m.v.x},${m.v.y}) scale(${m.v.k})`)}};
 svg.onpointerup=e=>{if(dr&&!dr.mv){const t=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-i]');if(t){m.sel=+t.dataset.i;draw();panel()}}dr=null};
 m.draw=()=>{draw();panel()};m.draw();return m}
// ---- tabs ----
const TABS=[['home','Nástenka'],['exp','Výpravy'],['world','Mapa sveta'],['vil','Mapa osady'],['set','Osada'],['rum','Zvesti'],['chars','Hráči a postavy'],['npc','NPC'],['chron','Kronika'],['fac','Frakcie'],['rules','Pravidlá'],['stat','Štatistiky'],['dice','Kocky'],['send','Odoslať zmeny']];
$('#nav').innerHTML=TABS.map(t=>`<button data-t="${t[0]}">${t[1]}</button>`).join('');
function go(t){$$('section').forEach(s=>s.classList.toggle('on',s.id=='s-'+t));$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));if(location.hash!='#'+t)history.replaceState(null,'','#'+t);if(t=='world')MW.center();if(t=='vil')MV.center();if(t=='stat')stats()}
$('#nav').onclick=e=>e.target.dataset.t&&go(e.target.dataset.t);
// ---- home & expeditions ----
const members=()=>S.players.map(p=>p.name);
const allChars=()=>S.players.flatMap(p=>p.chars.map(c=>({n:c.name,pl:p.name})));
const fd=d=>new Date(d).toLocaleString('sk-SK',{weekday:'long',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'});
const next=()=>S.exp.filter(e=>new Date(e.date)>new Date()&&!['Odohraná','Zrušená'].includes(e.st)).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
function left(v){if(!v)return'';const ms=new Date(v)-new Date();if(isNaN(ms))return'';if(ms<=0)return'✔ Hotové';const s=ms/1000|0,d=s/86400|0,h=s%86400/3600|0,m=s%3600/60|0;return 'zostáva '+(d?d+' d ':'')+(d||h?h+' h ':'')+m+' min'+(!d&&!h?' '+s%60+' s':'')}
function cdTick(){$$('.cd').forEach(e=>{const t=left(e.dataset.due);e.textContent=t;e.classList.toggle('ok',t[0]=='✔')})}
function tick(){cdTick();const e=next();if(!e){$('#clock').innerHTML='<span>Zatiaľ nie je naplánovaná žiadna výprava.</span>';return}
 let s=Math.max(0,(new Date(e.date)-new Date())/1000|0);const v=[[s/86400|0,'dní'],[s%86400/3600|0,'hodín'],[s%3600/60|0,'minút'],[s%60,'sekúnd']];
 $('#clock').innerHTML=v.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}
function home(){home2();const e=next();
 $('#hInfo').innerHTML=e?`${fd(e.date)}<br>Cieľ: <b>${esc(e.tgt)}</b><br>Vedie: <b>${esc(e.dm)}</b><br>Prihlásení (${e.signed.length}/${e.max}): ${e.signed.map(esc).join(', ')||'zatiaľ nikto'}`:'';
 $('#stock').innerHTML=Object.entries(S.stock).map(([k,v])=>`<span class="tag">${esc(k)}: <b>${v}</b></span>`).join('');
 $('#rumors').innerHTML=S.rumors.map(r=>`<p>❓ ${esc(r.t)} <span class="mut">(${esc(r.src)}${r.hex?', '+esc(r.hex):''})</span></p>`).join('')||'<p class="mut">Zatiaľ žiadne zvesti.</p>'}
function exps(){$('#expList').innerHTML=S.exp.map((e,i)=>`<div class="card"><h3>${esc(e.tgt)}</h3><p>${fd(e.date)}</p>
 <div class="row"><label style="margin:0">DM:</label><select data-dm="${i}" style="width:auto">${[...new Set([e.dm,...members()])].map(m=>`<option ${m==e.dm?'selected':''}>${esc(m)}</option>`).join('')}</select></div>
 <p>Prihlásení (${e.signed.length}/${e.max}): ${e.signed.map(esc).join(', ')||'nikto'}</p><div class="row"><label style="margin:0">Stav:</label><select data-st="${i}" style="width:auto">${['Otvorená','Potvrdená','Odohraná','Zrušená'].map(s=>`<option ${s==(e.st||'Otvorená')?'selected':''}>${s}</option>`).join('')}</select></div><label>Záznam z výpravy (zhrnutie, korisť, objavené polia)</label><textarea data-lg="${i}">${esc(e.log||'')}</textarea>
 <div class="row"><select data-ch="${i}" style="width:auto">${allChars().map(c=>`<option>${esc(c.n)} (${esc(c.pl)})</option>`).join('')}</select><button class="pri" data-su="${i}">Prihlásiť</button><button data-cp="${i}">Kopírovať pre Discord</button><button data-xd="${i}">Zmazať</button></div></div>`).join('')||'<p class="mut">Žiadne výpravy.</p>'}
$('#expList').onchange=e=>{const d=e.target.dataset;if(d.dm){S.exp[d.dm].dm=e.target.value;save();home()}if(d.st!=null){S.exp[d.st].st=e.target.value;save();home();tick()}};
$('#expList').oninput=e=>{const d=e.target.dataset;if(d.lg!=null){S.exp[d.lg].log=e.target.value;save();home()}};
$('#expList').onclick=e=>{const d=e.target.dataset;if(d.xd!=null){if(confirm('Zmazať výpravu?')){S.exp.splice(d.xd,1);save();exps();home();tick()}return}const x=S.exp[d.su??d.cp];if(d.su!=null){const n=$(`[data-ch="${d.su}"]`).value;if(x.signed.includes(n)||x.signed.length>=x.max)return toast('Prihlásenie nie je možné (už si v zozname alebo je plno).');x.signed.push(n);save();exps();home()}
 if(d.cp!=null){navigator.clipboard?.writeText(`Výprava ${fd(x.date)}, DM: ${x.dm}, cieľ: ${x.tgt}, prihlásení: ${x.signed.join(', ')}`);toast('Skopírované')}};
$('#nxAdd').onclick=()=>{const d=$('#nxDate').value,t=$('#nxTgt').value.trim();if(!d||!t)return toast('Vyplň dátum a cieľ.');S.exp.push({id:Date.now(),date:new Date(d).toISOString(),dm:members()[0]||'',tgt:t,max:5,signed:[],st:'Otvorená',log:''});save();exps();home()};
// ---- dice ----
const rnd=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n+1};
const LOG=[];
function roll(f,mode){const m=f.replace(/\s/g,'').toLowerCase().match(/^(\d*)d(\d+)(k[hl]\d+)?([+-]\d+)?$/);if(!m)return null;
 let n=+(m[1]||1),s=+m[2],mod=+(m[4]||0);if(n>100||s<2)return null;if(mode&&n==1&&s==20){n=2;m[3]=mode>0?'kh1':'kl1'}
 const r=Array.from({length:n},()=>rnd(s));let keep=r.map((v,i)=>i);
 if(m[3]){const k=+m[3].slice(2),o=[...keep].sort((a,b)=>m[3][1]=='h'?r[b]-r[a]:r[a]-r[b]);keep=o.slice(0,k)}
 const sum=keep.reduce((a,i)=>a+r[i],0);
 return{t:sum+mod,txt:`${f}: [${r.map((v,i)=>keep.includes(i)?v:`<s>${v}</s>`).join(', ')}]${mod?(mod>0?'+':'')+mod:''} = <b>${sum+mod}</b>`,nat:n>=1&&s==20&&keep.length==1?r[keep[0]]:0}}
function show(label,res){LOG.unshift(`<div>${label?esc(label)+' · ':''}${res.txt}</div>`);$('#log').innerHTML=LOG.join('');toast(`${label?label+': ':''}${res.t}`)}
$('#dBtns').innerHTML=[4,6,8,10,12,20,100].map(d=>`<button data-d="${d}">d${d}</button>`).join('');
$('#dBtns').onclick=e=>e.target.dataset.d&&show('',roll('1d'+e.target.dataset.d));
const go2=m=>{const r=roll($('#dF').value,m);r?show('',r):toast('Neplatný vzorec.')};
$('#dGo').onclick=()=>go2(0);$('#dAdv').onclick=()=>go2(1);$('#dDis').onclick=()=>go2(-1);
// ---- hráči a postavy ----
const md=v=>Math.floor((v-10)/2),sg=n=>(n>=0?'+':'')+n,AB=['STR','DEX','CON','INT','WIS','CHA'];
const SKL=[['acr','Akrobacia','Acrobatics','DEX'],['ani','Zaobchádzanie so zvieratami','Animal Handling','WIS'],['arc','Arkána','Arcana','INT'],['ath','Atletika','Athletics','STR'],['dec','Klamanie','Deception','CHA'],['his','História','History','INT'],['ins','Vhľad','Insight','WIS'],['itm','Zastrašovanie','Intimidation','CHA'],['inv','Vyšetrovanie','Investigation','INT'],['med','Medicína','Medicine','WIS'],['nat','Príroda','Nature','INT'],['prc','Vnímanie','Perception','WIS'],['prf','Vystupovanie','Performance','CHA'],['prs','Presviedčanie','Persuasion','CHA'],['rel','Náboženstvo','Religion','INT'],['slt','Šikovnosť rúk','Sleight of Hand','DEX'],['ste','Nenápadnosť','Stealth','DEX'],['sur','Prežitie','Survival','WIS']];
const prof=c=>2+Math.floor(((c.lvl||1)-1)/4),skb=(c,s)=>md(c.ab[s[3]])+prof(c)*(c.sk[s[0]]||0);
const newChar=()=>({name:'Nová postava',race:'',cls:'',lvl:1,img:'',hp:10,max:10,acb:0,spd:30,ab:{STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10},saves:[],sk:{},gp:0,inv:[],sp:[],sl:Array.from({length:9},()=>[0,0])});
const nin=(d,k,v,l)=>`<label>${l}<input type="number" ${d} data-n="${k}" value="${v}"></label>`;
function chr(c,p,i){const d=`data-p="${p}" data-c="${i}"`,pb=prof(c);
 return `<details class="ch" open><summary>${esc(c.name)} <span class="mut">${esc(c.race)} ${esc(c.cls)} ${c.lvl}</span></summary>
 <div class="chead"><div>${imgBox(c.img,'post')}</div><div>
 <div class="row"><input ${d} data-f="name" value="${esc(c.name)}" placeholder="Meno" style="flex:2"><input ${d} data-f="race" value="${esc(c.race)}" placeholder="Rasa" style="flex:1"><input ${d} data-f="cls" value="${esc(c.cls)}" placeholder="Trieda" style="flex:1"></div>
 <div class="row stats">${nin(d,'lvl',c.lvl,'Úroveň')}${nin(d,'hp',c.hp,'HP')}${nin(d,'max',c.max,'Max HP')}<label>AC (vypočítané)<input readonly value="${acOf(c)}"></label>${nin(d,'acb',c.acb||0,'Iný AC bonus')}${nin(d,'spd',c.spd,'Rýchlosť')}</div>
 <label>Cesta k portrétu (odporúčané ${HINT.post})</label><input ${d} data-f="img" value="${esc(c.img)}" placeholder="img/postavy/thorin.webp">
 <p>Proficiency <b>${sg(pb)}</b> · Pasívna Perception <b>${10+skb(c,SKL[11])}</b> <button ${d} data-ini>Iniciatíva ${sg(md(c.ab.DEX))}</button> <button ${d} data-del>Zmazať postavu</button></p></div></div>
 <h3>Atribúty</h3><div class="ab">${AB.map(k=>`<div class="abc"><span>${k}</span><input type="number" ${d} data-a="${k}" value="${c.ab[k]}"><button ${d} data-chk="${k}">${sg(md(c.ab[k]))}</button></div>`).join('')}</div>
 <h3>Záchranné hody</h3><div class="ab">${AB.map(k=>{const on=c.saves.includes(k);return `<div class="svb"><input type="checkbox" ${d} data-sv="${k}" ${on?'checked':''} aria-label="Zdatnosť ${k}"><button ${d} data-save="${k}">${k} ${sg(md(c.ab[k])+(on?pb:0))}</button></div>`}).join('')}</div>
 <h3>Zručnosti</h3><p class="mut">Kruh prepína: bez zdatnosti ○, zdatnosť ●, expertíza ◆. Klik na zručnosť hodí k20.</p>
 <div class="skills">${SKL.map(s=>{const v=c.sk[s[0]]||0;return `<div class="sk"><button ${d} data-pt="${s[0]}" class="pt" aria-label="Zdatnosť">${['○','●','◆'][v]}</button><button ${d} data-sk="${s[0]}"><span>${s[1]}<small>${s[2]} (${s[3]})</small></span><b>${sg(skb(c,s))}</b></button></div>`}).join('')}</div>
 ${extra(c,d)}</details>`}
const NUM=['q','ac','mg','wt'],ival=(t,k)=>t.type=='checkbox'?(t.checked?1:0):NUM.includes(k)?+t.value:t.value;
const PRE=[
{n:'Dýka',t:'Zbraň',ab:'DEX',dmg:'1d4',dt:'bodné',pf:1,wt:.5},{n:'Kyj',t:'Zbraň',ab:'STR',dmg:'1d6',dt:'drvivé',pf:1,wt:1},{n:'Kopija',t:'Zbraň',ab:'STR',dmg:'1d6',dt:'bodné',pf:1,wt:1.5},
{n:'Krátky meč',t:'Zbraň',ab:'DEX',dmg:'1d6',dt:'bodné',pf:1,wt:1},{n:'Rapír',t:'Zbraň',ab:'DEX',dmg:'1d8',dt:'bodné',pf:1,wt:1},{n:'Dlhý meč',t:'Zbraň',ab:'STR',dmg:'1d8',dt:'sečné',pf:1,wt:1.5},
{n:'Bojové kladivo',t:'Zbraň',ab:'STR',dmg:'1d8',dt:'drvivé',pf:1,wt:1},{n:'Veľká sekera',t:'Zbraň',ab:'STR',dmg:'1d12',dt:'sečné',pf:1,wt:3.5},{n:'Veľký meč',t:'Zbraň',ab:'STR',dmg:'2d6',dt:'sečné',pf:1,wt:3},
{n:'Ľahká kuša',t:'Zbraň',ab:'DEX',dmg:'1d8',dt:'bodné',pf:1,wt:2.5},{n:'Krátky luk',t:'Zbraň',ab:'DEX',dmg:'1d6',dt:'bodné',pf:1,wt:1},{n:'Dlhý luk',t:'Zbraň',ab:'DEX',dmg:'1d8',dt:'bodné',pf:1,wt:1},
{n:'Kožené brnenie',t:'Brnenie',ac:11,k:'Ľahké',wt:5},{n:'Pošité kožené brnenie',t:'Brnenie',ac:12,k:'Ľahké',wt:6},{n:'Kolčugová košeľa',t:'Brnenie',ac:13,k:'Stredné',wt:10},{n:'Šupinové brnenie',t:'Brnenie',ac:14,k:'Stredné',wt:20},{n:'Poloplatnicové brnenie',t:'Brnenie',ac:15,k:'Stredné',wt:20},{n:'Kolčuga',t:'Brnenie',ac:16,k:'Ťažké',wt:27},{n:'Plátové brnenie',t:'Brnenie',ac:18,k:'Ťažké',wt:30},
{n:'Štít',t:'Štít',ac:2,wt:3}];
function acOf(c){const dx=md(c.ab.DEX),b=c.inv.find(i=>i.t=='Brnenie'&&i.eq);let ac=10+dx;
 if(b)ac=(+b.ac||10)+(+b.mg||0)+(b.k=='Ľahké'?dx:b.k=='Stredné'?Math.min(2,dx):0);
 c.inv.filter(i=>i.t=='Štít'&&i.eq).forEach(s=>ac+=(+s.ac||2)+(+s.mg||0));return ac+(+c.acb||0)}
function itm(c,s,i,d){const a=k=>`${d} data-ii="${i}" data-ik="${k}"`,ck=(k,l)=>`<label class="inl"><input type="checkbox" ${a(k)} ${s[k]?'checked':''}>${l}</label>`;let mid='';
 if(s.t=='Zbraň'){const m=md(c.ab[s.ab]||10)+(+s.mg||0),at=m+(s.pf?prof(c):0);
  mid=`<label class="inl">Vlastnosť<select ${a('ab')} style="width:auto">${AB.map(k=>`<option ${k==s.ab?'selected':''}>${k}</option>`).join('')}</select></label><label class="inl">Zranenie<input ${a('dmg')} value="${esc(s.dmg)}" style="max-width:90px"></label><label class="inl">Typ<input ${a('dt')} value="${esc(s.dt)}" placeholder="sečné" style="max-width:110px"></label>${ck('pf','Zdatnosť')}<label class="inl">Mag. bonus<input type="number" ${a('mg')} value="${s.mg||0}" style="max-width:64px"></label><button class="pri" ${d} data-iatk="${i}">Zásah ${sg(at)} · ${esc(s.dmg)}${sg(m)}</button>`}
 else if(s.t=='Brnenie')mid=`<label class="inl">AC<input type="number" ${a('ac')} value="${s.ac}" style="max-width:64px"></label><label class="inl">Druh<select ${a('k')} style="width:auto">${['Ľahké','Stredné','Ťažké'].map(k=>`<option ${k==s.k?'selected':''}>${k}</option>`).join('')}</select></label><label class="inl">Mag. bonus<input type="number" ${a('mg')} value="${s.mg||0}" style="max-width:64px"></label>`;
 else if(s.t=='Štít')mid=`<label class="inl">Bonus AC<input type="number" ${a('ac')} value="${s.ac}" style="max-width:64px"></label><label class="inl">Mag. bonus<input type="number" ${a('mg')} value="${s.mg||0}" style="max-width:64px"></label>`;
 return `<div class="item"><div class="ir"><input ${a('n')} value="${esc(s.n)}" placeholder="Názov" style="flex:2;min-width:140px"><select ${a('t')} style="width:auto">${['Zbraň','Brnenie','Štít','Iné'].map(x=>`<option ${x==s.t?'selected':''}>${x}</option>`).join('')}</select>${s.t!='Iné'?ck('eq','Vybavené'):''}<button ${d} data-idl="${i}" aria-label="Zmazať">✕</button></div>
 ${mid?`<div class="ir">${mid}</div>`:''}<div class="ir"><label class="inl">Počet<input type="number" min="0" ${a('q')} value="${s.q}" style="max-width:70px"></label><label class="inl">Váha (kg)<input type="number" step="0.5" min="0" ${a('wt')} value="${s.wt||0}" style="max-width:80px"></label><select ${a('w')} style="width:auto"><option ${s.w=='U seba'?'selected':''}>U seba</option><option ${s.w=='V sklade'?'selected':''}>V sklade</option></select></div></div>`}
function invUI(c,d){const kg=c.inv.filter(s=>s.w=='U seba').reduce((a,s)=>a+(+s.wt||0)*(+s.q||0),0);
 return `<h3>Inventár a vybavenie</h3><div class="row stats"><label>Zlato (gp)<input type="number" ${d} data-n="gp" value="${c.gp}"></label><label>Nesené (kg)<input readonly value="${Math.round(kg*10)/10} / ${(c.ab.STR||10)*7}"></label></div>
 <div class="row" style="margin:8px 0"><button ${d} data-ia="Zbraň">+ Zbraň</button><button ${d} data-ia="Brnenie">+ Brnenie</button><button ${d} data-ia="Štít">+ Štít</button><button ${d} data-ia="Iné">+ Predmet</button><select ${d} data-ipre style="width:auto"><option value="">Pridať zo zoznamu…</option>${PRE.map((p,i)=>`<option value="${i}">${p.t}: ${esc(p.n)}</option>`).join('')}</select></div>
 ${[['Zbraň','Zbrane'],['Brnenie','Brnenie'],['Štít','Štíty'],['Iné','Ostatné predmety']].map(([t,l])=>{const h=c.inv.map((s,i)=>s.t==t?itm(c,s,i,d):'').join('');return h?`<h4>${l}</h4>${h}`:''}).join('')||'<p class="mut">Inventár je prázdny.</p>'}`}
function extra(c,d){return `<h3>Kúzla a sloty</h3><div class="row"><button ${d} data-rest>Dlhý odpočinok</button><span class="mut">obnoví HP a sloty</span></div>
<div class="ab" style="margin:8px 0">${c.sl.map((s,i)=>`<div class="abc"><span>Úr. ${i+1}</span><input type="number" min="0" ${d} data-sm="${i}" value="${s[0]}"><button ${d} data-su="${i}" title="Minúť slot">${s[0]-s[1]}/${s[0]}</button></div>`).join('')}</div>
${c.sp.map((s,i)=>`<div class="ir"><input ${d} data-pi="${i}" data-pk="n" value="${esc(s.n)}" placeholder="Kúzlo" style="flex:2"><input type="number" min="0" max="9" ${d} data-pi="${i}" data-pk="l" value="${s.l}" style="max-width:64px" title="Úroveň (0 = cantrip)"><input ${d} data-pi="${i}" data-pk="d" value="${esc(s.d)}" placeholder="8d6" style="max-width:90px"><button class="pri" ${d} data-cast="${i}">Zoslať</button><button ${d} data-psd="${i}" aria-label="Zmazať">✕</button></div>`).join('')}
<button ${d} data-padd>Pridať kúzlo</button>
${invUI(c,d)}`}
function chars(){$('#chars').innerHTML=S.players.map((p,pi)=>`<div class="card pl"><div class="row"><h3 style="margin:0">Hráč</h3><input data-pf="name" data-p="${pi}" value="${esc(p.name)}" style="max-width:220px"><button class="pri" data-ac="${pi}">Pridať postavu</button><button data-dp="${pi}">Zmazať hráča</button></div>${p.chars.map((c,ci)=>chr(c,pi,ci)).join('')||'<p class="mut">Hráč zatiaľ nemá žiadnu postavu.</p>'}</div>`).join('')||'<p class="mut">Zatiaľ žiadni hráči. Pridaj prvého nižšie.</p>'}
$('#chars').addEventListener('input',e=>{const d=e.target.dataset;if(d.pf!=null){S.players[d.p].name=e.target.value;save()}else if(d.f!=null&&d.c!=null){S.players[d.p].chars[d.c][d.f]=e.target.value;save()}
 else if(d.ik!=null){S.players[d.p].chars[d.c].inv[d.ii][d.ik]=ival(e.target,d.ik);save()}
 else if(d.pk!=null){S.players[d.p].chars[d.c].sp[d.pi][d.pk]=d.pk=='l'?+e.target.value:e.target.value;save()}});
$('#chars').addEventListener('change',e=>{const t=e.target,d=t.dataset;if(d.pf!=null){exps();home();return}
 const c=d.c!=null&&S.players[d.p].chars[d.c];if(!c)return;
 if(d.ipre!=null){if(t.value!==''){c.inv.push({q:1,w:'U seba',wt:0,mg:0,eq:0,...PRE[+t.value]});save();chars();stockItems()}return}
 if(d.n)c[d.n]=+t.value;else if(d.a)c.ab[d.a]=+t.value;else if(d.sv)c.saves=t.checked?[...c.saves,d.sv]:c.saves.filter(x=>x!=d.sv);else if(d.ik!=null){const it=c.inv[d.ii];it[d.ik]=ival(t,d.ik);if(d.ik=='t')Object.assign(it,{...TPL[it.t],...it})}else if(d.sm!=null){const s=c.sl[d.sm];s[0]=Math.max(0,+t.value||0);s[1]=Math.min(s[1],s[0])}
 save();if(d.n||d.a||d.sv||d.sm!=null||d.f=='img'||(d.ik!=null&&!['n','dt'].includes(d.ik)))chars();exps();home();stockItems()});
$('#chars').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.ac!=null){S.players[d.ac].chars.push(newChar());save();chars();return}
 if(d.dp!=null){if(confirm('Zmazať hráča aj s jeho postavami?')){S.players.splice(d.dp,1);save();chars();exps();home()}return}
 const c=d.c!=null&&S.players[d.p].chars[d.c];if(!c)return;
 if(d.del!=null){if(confirm('Zmazať postavu?')){S.players[d.p].chars.splice(d.c,1);save();chars();exps();home()}return}
 if(d.pt){c.sk[d.pt]=((c.sk[d.pt]||0)+1)%3;save();chars();return}
 const nm=c.name,pb=prof(c);
 if(d.su!=null){const s=c.sl[d.su];if(s[0]-s[1]<=0)return toast('Žiadny voľný slot úrovne '+(+d.su+1));s[1]++;save();chars();return}
 if(d.rest!=null){c.hp=c.max;c.sl.forEach(s=>s[1]=0);save();chars();toast('Odpočinuté: HP a sloty obnovené');return}
 if(d.padd!=null){c.sp.push({n:'',l:1,d:''});save();chars();return}
 if(d.psd!=null){c.sp.splice(d.psd,1);save();chars();return}
 if(d.ia){c.inv.push({n:'',q:1,w:'U seba',wt:0,t:d.ia,eq:0,...TPL[d.ia]});save();chars();return}
 if(d.iatk!=null){const w=c.inv[d.iatk],m=md(c.ab[w.ab]||10)+(+w.mg||0),h=roll('1d20'+sg(m+(w.pf?pb:0)));show(`${nm}, ${w.n||'zbraň'}: zásah`,h);let x=w.dmg;if(h.nat==20)x=x.replace(/^(\d*)/,q=>(+q||1)*2);const r=roll(x+sg(m));r?show(`${nm}, ${w.n||'zbraň'}: ${h.nat==20?'kritické ':''}zranenie ${w.dt||''}`,r):toast('Neplatný vzorec zranenia.');return}
 if(d.idl!=null){c.inv.splice(d.idl,1);save();chars();stockItems();return}
 if(d.cast!=null){const s=c.sp[d.cast],L=+s.l;let up=0;if(L>0){let k=L-1;while(k<9&&c.sl[k][0]-c.sl[k][1]<=0)k++;if(k>=9)return toast('Nemáš voľný slot pre '+(s.n||'kúzlo'));c.sl[k][1]++;up=k+1;save();chars()}
  const r=s.d&&roll(s.d);show(`${nm}, ${s.n||'kúzlo'}${up?' (slot '+up+')':''}`,r||{t:'zoslané',txt:'zoslané'});return}
 if(d.chk)show(`${nm}, ${d.chk}`,roll('1d20'+sg(md(c.ab[d.chk]))));
 if(d.save)show(`${nm}, záchr. ${d.save}`,roll('1d20'+sg(md(c.ab[d.save])+(c.saves.includes(d.save)?pb:0))));
 if(d.sk){const s=SKL.find(x=>x[0]==d.sk);show(`${nm}, ${s[2]}`,roll('1d20'+sg(skb(c,s))))}
 if(d.ini!=null)show(`${nm}, iniciatíva`,roll('1d20'+sg(md(c.ab.DEX))));
 };
$('#pAdd').onclick=()=>{const n=$('#pN').value.trim();if(!n)return toast('Zadaj meno hráča.');S.players.push({name:n,chars:[]});$('#pN').value='';save();chars();exps()};
// ---- NPC ----
function npcs(){$('#npcs').innerHTML=S.npcs.map(n=>`<div class="card" style="margin:0">${imgBox(n.i,'npc')}<h3 style="margin-top:10px">${esc(n.n)}</h3><p class="mut">${esc(n.d)}</p></div>`).join('')}
$('#nAdd').onclick=()=>{const n=$('#nN').value.trim();if(!n)return toast('Zadaj meno NPC.');S.npcs.push({n,i:$('#nI').value.trim(),d:$('#nD').value.trim()});save();npcs();$('#nN').value=$('#nI').value=$('#nD').value=''};
// ---- send ----
const fname=()=>'data.js';
$('#bDl').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['window.DATA='+JSON.stringify({...S,v:BASE+1},null,1)+';\n'],{type:'text/javascript'}));a.download=fname();a.click();toast('Súbor stiahnutý. Pošli ho e-mailom.')};
const sub=()=>encodeURIComponent('Zmena: '+fname()),body=()=>encodeURIComponent('Pripájam data.js so zmenami. Nahraj ho do priečinka data/ (prepíše pôvodný).');
$('#bMail').onclick=()=>location.href=`mailto:${MAIL}?subject=${sub()}&body=${body()}`;
$('#bGm').onclick=()=>window.open(`https://mail.google.com/mail/?view=cm&to=${MAIL}&su=${sub()}&body=${body()}`);
$('#bCp').onclick=()=>{navigator.clipboard?.writeText(fname());toast('Názov skopírovaný')};
$('#bReset').onclick=()=>{if(confirm('Zahodiť všetky lokálne zmeny?')){localStorage.removeItem(KEY);localStorage.removeItem(KEY+'-d');location.reload()}};
// ---- zvesti ----
const SRC=['Cestovateľ','Stará mapa','Pozorovanie','Iné'];
function rums(){$('#rList').innerHTML=S.rumors.map((r,i)=>`<div class="card"><textarea data-rf="t" data-i="${i}">${esc(r.t)}</textarea><div class="row" style="margin-top:8px"><select data-rf="src" data-i="${i}" style="width:auto">${SRC.map(s=>`<option ${s==r.src?'selected':''}>${s}</option>`).join('')}</select><input data-rf="hex" data-i="${i}" value="${esc(r.hex)}" placeholder="Pole, napr. I5" style="max-width:130px"><button data-rd="${i}">Zmazať</button></div></div>`).join('')||'<p class="mut">Zatiaľ žiadne zvesti.</p>'}
$('#rList').oninput=e=>{const d=e.target.dataset;if(d.rf==null)return;S.rumors[d.i][d.rf]=e.target.value;save();home();MW.draw()};
$('#rList').onclick=e=>{const i=e.target.dataset.rd;if(i!=null&&confirm('Zmazať zvesť?')){S.rumors.splice(i,1);save();rums();home();MW.draw()}};
$('#rAdd').onclick=()=>{const t=$('#rT').value.trim();if(!t)return toast('Napíš text zvesti.');S.rumors.push({t,src:$('#rS').value,hex:$('#rH').value.trim()});$('#rT').value=$('#rH').value='';save();rums();home();MW.draw();toast('Zvesť pridaná')};
// ---- osada, kronika, frakcie, pravidlá, štatistiky ----
const MON=['Ľadomesiac','Snežník','Prebúdzač','Kvetnik','Zeleň','Slnovrat','Žatva','Zlatník','Hmlovec','Listopád','Mrazník','Dlhá noc'],SEA=['Zima','Zima','Jar','Jar','Jar','Leto','Leto','Leto','Jeseň','Jeseň','Jeseň','Zima'];
function LE(id,key,F,mk,lbl,cb){const el=$('#'+id);
 const fld=(f,it,i)=>{const v=it[f.k],a=`data-k="${f.k}" data-i="${i}"`,o=typeof f.o=='function'?f.o():(f.o||[]);let h;
  if(f.t=='area')h=`<textarea ${a}>${esc(v)}</textarea>`;
  else if(f.t=='sel')h=`<select ${a}>${[...new Set([v,...o])].map(x=>`<option ${x==v?'selected':''}>${esc(x)}</option>`).join('')}</select>`;
  else if(f.t=='dt')h=`<input type="datetime-local" ${a} value="${esc(v||'')}"><small class="cd" data-due="${esc(v||'')}"></small>`;
  else if(f.t=='range')h=`<input type="range" min="${f.min}" max="${f.max}" ${a} value="${v}">`;
  else h=`<input type="${f.t=='num'?'number':'text'}" ${a} value="${esc(v)}">`;
  return `<label class="${f.t=='area'?'wide':''}">${f.l}${f.t=='range'?': <b>'+v+'</b>':''}${h}</label>`};
 const draw=()=>{el.innerHTML=S[key].map((it,i)=>`<div class="card"><div class="lef">${F.map(f=>fld(f,it,i)).join('')}</div><button data-d="${i}">Zmazať</button></div>`).join('')+`<button class="pri" data-add>${lbl}</button>`;cdTick()};
 el.oninput=e=>{const t=e.target,k=t.dataset.k;if(!k)return;S[key][t.dataset.i][k]=t.type=='number'||t.type=='range'?+t.value:t.value;save();cb&&cb()};
 el.onchange=e=>{const t=e.target;if(t.dataset.k&&(t.tagName=='SELECT'||t.type=='range'||t.type=='datetime-local')){draw();cb&&cb()}};
 el.onclick=e=>{const d=e.target.dataset;if(d.add!=null){S[key].push(mk());save();draw();cb&&cb()}if(d.d!=null&&confirm('Zmazať záznam?')){S[key].splice(d.d,1);save();draw();cb&&cb()}};
 draw()}
const me=()=>localStorage.getItem('wm-me')||'?';
function logS(x){S.log.unshift({t:new Date().toLocaleString('sk-SK'),w:me(),x});S.log.length=Math.min(S.log.length,60)}
function stockItems(){$('#stockItems').innerHTML=S.players.flatMap(p=>p.chars.flatMap(c=>c.inv.filter(i=>i.w=='V sklade'&&i.n).map(i=>`${esc(i.n)} ×${i.q} <span class="mut">(${esc(c.name)})</span>`))).map(x=>`<div>${x}</div>`).join('')||'Nič.'}
function stockUI(){$('#stockEd').innerHTML=Object.entries(S.stock).map(([k,v])=>`<div class="svb" style="margin:4px 0"><b style="min-width:100px">${esc(k)}</b><button data-sd="${esc(k)}" data-v="-1" style="flex:0">−</button><input type="number" data-sv2="${esc(k)}" value="${v}" style="max-width:90px"><button data-sd="${esc(k)}" data-v="1" style="flex:0">+</button><button data-sx="${esc(k)}" aria-label="Zmazať" style="flex:0">✕</button></div>`).join('')||'<p class="mut">Sklad je prázdny.</p>';
 stockItems();$('#stockLog').innerHTML=S.log.slice(0,15).map(l=>`<div>${esc(l.t)} · ${esc(l.w)}: ${esc(l.x)}</div>`).join('')||'Zatiaľ bez záznamov.'}
$('#stockEd').onclick=e=>{const d=e.target.dataset;if(d.sd!=null){const o=S.stock[d.sd],n=Math.max(0,o+ +d.v);S.stock[d.sd]=n;logS(`${d.sd}: ${o} → ${n}`);save();stockUI();home()}
 if(d.sx!=null&&confirm('Zmazať surovinu?')){logS(`${d.sx}: odstránená`);delete S.stock[d.sx];save();stockUI();home()}};
$('#stockEd').onchange=e=>{const d=e.target.dataset;if(d.sv2!=null){const o=S.stock[d.sv2],n=Math.max(0,+e.target.value||0);S.stock[d.sv2]=n;logS(`${d.sv2}: ${o} → ${n}`);save();stockUI();home()}};
$('#sAdd').onclick=()=>{const n=$('#sN').value.trim();if(!n||n in S.stock)return toast('Zadaj novú surovinu.');S.stock[n]=0;logS(n+': pridaná');$('#sN').value='';save();stockUI();home()};
$('#me').value=localStorage.getItem('wm-me')||'';$('#me').oninput=e=>localStorage.setItem('wm-me',e.target.value);
$('#ind').innerHTML=[['def','Obrana'],['hap','Spokojnosť'],['pop','Obyvatelia']].map(([k,l])=>`<label>${l}<input type="number" data-ik="${k}" value="${S.osada[k]}"></label>`).join('');
$('#ind').oninput=e=>{const k=e.target.dataset.ik;if(k){S.osada[k]=+e.target.value;save();home()}};
function timeUI(){const t=S.time;$('#timeEd').innerHTML=`<label>Deň<input type="number" min="1" max="30" data-t="d" value="${t.d}" style="max-width:80px"></label><label>Mesiac<select data-t="m">${MON.map((m,i)=>`<option value="${i}" ${i==t.m?'selected':''}>${m}</option>`).join('')}</select></label><label>Rok<input type="number" data-t="y" value="${t.y}" style="max-width:90px"></label><button data-add="1">+1 deň</button><button data-add="7">+7 dní</button><span class="tag">${SEA[t.m]}</span>`}
$('#timeEd').onchange=e=>{const d=e.target.dataset;if(d.t){S.time[d.t]=+e.target.value;save();timeUI();home()}};
$('#timeEd').onclick=e=>{const n=+e.target.dataset.add;if(n){const t=S.time;t.d+=n;while(t.d>30){t.d-=30;t.m++;if(t.m>11){t.m=0;t.y++}}save();timeUI();home()}};
function home2(){
 const work=[...S.bld.filter(b=>b.due&&b.st!='Dokončená').map(b=>({t:'🏗 '+b.n,due:b.due})),...S.dt.filter(x=>x.due&&x.st!='Vyhodnotená').map(x=>({t:`${x.act} (${x.who})`,due:x.due}))].sort((a,b)=>new Date(a.due)-new Date(b.due));
 $('#hWorkCard').hidden=!work.length;$('#hWork').innerHTML=work.map(w=>`<p>${esc(w.t)} <span class="cd" data-due="${esc(w.due)}"></span></p>`).join('');cdTick();const t=S.time;$('#hTime').innerHTML=`<b>${t.d}. ${MON[t.m]}, rok ${t.y}</b> · ${SEA[t.m]}`;
 const ev=S.ev.filter(e=>e.st=='Aktívna');$('#hEvCard').hidden=!ev.length;$('#hEv').innerHTML=ev.map(e=>`<p><b>${esc(e.t)}</b><br>${esc(e.d)}</p>`).join('');
 const last=S.exp.filter(e=>e.st=='Odohraná'&&e.log).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
 $('#hPrev').innerHTML=last?`<p class="mut">${esc(last.tgt)}, ${fd(last.date)}</p><p>${esc(last.log)}</p>`:'<p class="mut">Zatiaľ nič. Záznam sa objaví po odohranej výprave.</p>';
 $('#stock').insertAdjacentHTML('beforeend',`<span class="tag">Obrana: <b>${S.osada.def}</b></span><span class="tag">Spokojnosť: <b>${S.osada.hap}</b></span><span class="tag">Obyvatelia: <b>${S.osada.pop}</b></span>`)}
function stats(){const c=S.world.cells,rv=c.filter(x=>x.rev).length,done=S.exp.filter(e=>e.st=='Odohraná'),cnt={};members().forEach(m=>cnt[m]=0);done.forEach(e=>cnt[e.dm]=(cnt[e.dm]||0)+1);
 const nx=Object.entries(cnt).sort((a,b)=>a[1]-b[1])[0];
 $('#statBox').innerHTML=`<p>Odhalené polia: <b>${rv}/${c.length}</b> (${Math.round(rv/c.length*100)} %)</p><p>Odohrané výpravy: <b>${done.length}</b></p><p>Hráči: <b>${S.players.length}</b>, postavy: <b>${allChars().length}</b></p><h3>Kto koľko viedol</h3>${Object.entries(cnt).map(([k,v])=>`<p>${esc(k)}: <b>${v}</b></p>`).join('')||'<p class="mut">Žiadni hráči.</p>'}${nx?`<p class="mut">Na rade je pravdepodobne: <b>${esc(nx[0])}</b></p>`:''}`}
LE('bld','bld',[{k:'n',l:'Názov',t:'text'},{k:'st',l:'Stav',t:'sel',o:['Plánovaná','Rozostavaná','Dokončená','Poškodená']},{k:'lvl',l:'Úroveň',t:'num'},{k:'cost',l:'Cena (suroviny)',t:'text'},{k:'bonus',l:'Bonus',t:'text'},{k:'due',l:'Hotové do (odpočet)',t:'dt'},{k:'prog',l:'Postup stavby (%)',t:'range',min:0,max:100},{k:'d',l:'Popis',t:'area'}],()=>({n:'Nová budova',st:'Plánovaná',lvl:1,cost:'',bonus:'',prog:0,d:'',due:''}),'Pridať budovu',home);
LE('dt','dt',[{k:'who',l:'Hráč',t:'sel',o:members},{k:'act',l:'Aktivita',t:'sel',o:['Stavať','Craftovať','Zbierať suroviny','Ťažiť suroviny','Loviť','Skúmať','Obchodovať','Trénovať','Liečiť sa','Verbovať']},{k:'st',l:'Stav',t:'sel',o:['Čaká','Vyhodnotená']},{k:'due',l:'Hotové do (odpočet)',t:'dt'},{k:'d',l:'Popis',t:'area'},{k:'res',l:'Výsledok (DM)',t:'text'}],()=>({who:members()[0]||'',act:'Stavať',st:'Čaká',d:'',res:'',due:''}),'Zapísať aktivitu',home);
LE('ev','ev',[{k:'t',l:'Názov',t:'text'},{k:'st',l:'Stav',t:'sel',o:['Aktívna','Vyriešená']},{k:'d',l:'Popis',t:'area'}],()=>({t:'Nová udalosť',st:'Aktívna',d:''}),'Pridať udalosť',home);
LE('chron','chron',[{k:'when',l:'Dátum v hre',t:'text'},{k:'t',l:'Názov',t:'text'},{k:'d',l:'Text',t:'area'}],()=>({when:`Rok ${S.time.y}, ${S.time.d}. ${MON[S.time.m]}`,t:'Nový záznam',d:''}),'Pridať záznam');
LE('fac','fac',[{k:'n',l:'Názov',t:'text'},{k:'rel',l:'Vzťah',t:'sel',o:['Priateľská','Neutrálna','Nepriateľská']},{k:'rep',l:'Reputácia',t:'range',min:-5,max:5},{k:'d',l:'Popis',t:'area'}],()=>({n:'Nová frakcia',d:'',rel:'Neutrálna',rep:0}),'Pridať frakciu');
LE('rules','rules',[{k:'t',l:'Názov',t:'text'},{k:'d',l:'Text',t:'area'}],()=>({t:'Nové pravidlo',d:''}),'Pridať pravidlo');
stockUI();timeUI();
// ---- init ----
const MW=GridMap('m-world','world',{fog:true,ters:'world'});const MV=GridMap('m-vil','vil',{fog:false,ters:'vil'});
home();exps();rums();chars();npcs();tick();setInterval(tick,1000);
go(TABS.some(t=>'#'+t[0]==location.hash)?location.hash.slice(1):'home');
