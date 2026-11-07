// Logika stránky. Smerovanie ide cez #: #/ (úvod), #/hrac/ID, #/postava/ID_HRACA/ID_POSTAVY
const AB=[["str","Sila"],["dex","Obratnosť"],["con","Odolnosť"],["int","Inteligencia"],["wis","Múdrosť"],["cha","Charizma"]];
const SK=[["Akrobacia","dex"],["Zaobchádzanie so zvieratami","wis"],["Arkána","int"],["Atletika","str"],["Klamanie","cha"],["História","int"],["Odhaľovanie úmyslov","wis"],["Zastrašovanie","cha"],["Vyšetrovanie","int"],["Medicína","wis"],["Príroda","int"],["Vnímanie","wis"],["Vystupovanie","cha"],["Presviedčanie","cha"],["Náboženstvo","int"],["Šikovnosť rúk","dex"],["Nenápadnosť","dex"],["Prežitie","wis"]];
const KEY="dnd-kronika-v1";
const e=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Math.random().toString(36).slice(2,5);
const newChar=(name="Nová postava")=>({id:slug(name),name,cls:"",sub:"",race:"",bg:"",al:"",lvl:1,xp:0,ab:{str:10,dex:10,con:10,int:10,wis:10,cha:10},sv:{},sk:{},ac:10,spd:30,hp:10,hpc:10,hpt:0,hd:"1d8",ds:0,df:0,sa:"",img:"",pr:"",sl:{},cond:[],ex:0,camp:"",eqp:{},inv:[],mac:[],spl:[],conc:"",aca:false,acm:0,hdu:0,cnt:[],comp:[],co:{pp:0,gp:0,ep:0,sp:0,cp:0},atk:[],coin:"",eq:"",sp:"",ft:"",nt:""});
let D=null,local=false;
try{const s=localStorage.getItem(KEY);if(s){D=JSON.parse(s);local=true}}catch(x){}
D=D||JSON.parse(JSON.stringify(window.DATA));
const fix=()=>{D.cspells=D.cspells||[];if(!D.bestiary)D.bestiary=seedBest();D.bestiary=D.bestiary.map(m=>({...newMon(),...m,hd:m.hd||HDS[m.name]||"",ab:{...newMon().ab,...m.ab}}));D.players.forEach(p=>p.chars=p.chars.map(c=>({...newChar(),...c,ab:{...newChar().ab,...c.ab},co:{...newChar().co,...c.co}})));if(!D.camps){D.camps=[{id:"hlavna",name:"Hlavná kampaň",dm:D.dm||{enc:[],round:1,turn:0},journal:D.journal||[]}];D.players.forEach(p=>p.chars.forEach(c=>{if(!c.camp)c.camp="hlavna"}))}delete D.dm;delete D.journal;D.camps.forEach(k=>{k.dm=k.dm||{enc:[],round:1,turn:0};k.journal=k.journal||[];k.world=k.world||{npc:[],loc:[],quest:[]};k.world.fac=k.world.fac||[];k.stash=k.stash||{co:{}};k.stash.co={pp:0,gp:0,ep:0,sp:0,cp:0,...k.stash.co};k.stash.items=k.stash.items||[];k.map=k.map||{w:20,h:12,t:[]};k.date=k.date||""})};fix();
const GHK=KEY+"-gh";
const ghCfg=()=>{let c={};try{c=JSON.parse(localStorage.getItem(GHK)||"{}")}catch(x){}const m=location.hostname.match(/^([^.]+)\.github\.io$/),r=location.pathname.split("/")[1];return{owner:c.owner||(m?m[1]:""),repo:c.repo||(m&&r?r:""),branch:c.branch||"main",path:c.path||"data.js",token:c.token||""}};
async function ghSave(){const c=ghCfg();if(!c.token||!c.owner||!c.repo)return alert("Najprv nastav ukladanie na GitHub (dole: Ukladanie na GitHub).");
 const url=`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${c.path}`,H={Authorization:"Bearer "+c.token,Accept:"application/vnd.github+json"};
 try{let sha;const g=await fetch(url+"?ref="+encodeURIComponent(c.branch),{headers:H});if(g.ok)sha=(await g.json()).sha;else if(g.status!=404)throw new Error("Čítanie zlyhalo ("+g.status+"). Skontroluj token, názov repozitára a vetvu.");
  const body={message:"Aktualizácia dát z webu",content:btoa(unescape(encodeURIComponent(dataText(false)))),branch:c.branch};if(sha)body.sha=sha;
  const p=await fetch(url,{method:"PUT",headers:{...H,"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!p.ok)throw new Error((await p.json()).message||"Zápis zlyhal ("+p.status+")");
  localStorage.setItem(KEY+"-dirty","0");banner();toast("✔","","Uložené na GitHub – stránka sa obnoví do pár minút")}catch(x){alert("Uloženie na GitHub zlyhalo: "+x.message)}}
const BK=KEY+"-bak";let lastBk=0;
const banner=()=>{const b=document.getElementById("banner");if(!b)return;let z=false;try{z=localStorage.getItem(KEY+"-dirty")=="1"}catch(x){}b.innerHTML=z?'⚠ Máš zmeny, ktoré nie sú v data.js. <button class="sm" data-a="dl">Stiahnuť data.js</button> <button class="sm" data-a="dlf">Plná záloha</button>'+(ghCfg().token?' <button class="sm" data-a="ghsave">Uložiť na GitHub</button>':""):"";b.style.display=z?"block":"none"};
const save=()=>{try{const old=localStorage.getItem(KEY);if(old&&Date.now()-lastBk>120000){lastBk=Date.now();const b=JSON.parse(localStorage.getItem(BK)||"[]");b.unshift({t:lastBk,d:old});localStorage.setItem(BK,JSON.stringify(b.slice(0,5)))}}catch(x){try{localStorage.removeItem(BK)}catch(y){}}try{localStorage.setItem(KEY,JSON.stringify(D));localStorage.setItem(KEY+"-dirty","1");local=true}catch(x){}banner()};
const pubD=()=>{const o=JSON.parse(JSON.stringify(D));o.bestiary=o.bestiary.filter(m=>!m.s);o.camps.forEach(k=>{k.journal=k.journal.filter(j=>!j.s);for(const t in k.world)k.world[t]=k.world[t].filter(i=>!i.s)});return o};
const dataText=full=>"// Dáta stránky\nwindow.DATA="+JSON.stringify(full?D:pubD(),null,1)+";\n";
const ACOL={str:"#b3261e",dex:"#2e8b3d",con:"#d9731a",int:"#2a6fb5",wis:"#1f8a8a",cha:"#8e3fa8"},ORDER=["dragon","wizard","knight","goblin","dwarf","elf","rogue","slime"];
const artFor=c=>ART[/trpasl/i.test(c.race)?"dwarf":/elf/i.test(c.race)?"elf":/zlod|tulák/i.test(c.cls)?"rogue":/bojov|barbar|paladin|rytier/i.test(c.cls)?"knight":/čarod|kúzeln|mág|warlock|bard/i.test(c.cls)?"wizard":/druid|hájnik|lovec|mních/i.test(c.cls)?"goblin":"dragon"];
const CONDS=["Oslepený","Očarený","Ohluchnutý","Vystrašený","Zachytený","Neschopný","Neviditeľný","Ochromený","Skamenený","Otrávený","Ležiaci","Spútaný","Omráčený","V bezvedomí"],XP=[0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
let snd=true,AC_,lastRoll=null;
const beep=()=>{if(!snd)return;try{AC_=AC_||new AudioContext();const o=AC_.createOscillator(),g=AC_.createGain(),t=AC_.currentTime;o.type="triangle";o.frequency.value=170+Math.random()*130;g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);g.connect(AC_.destination);o.start();o.stop(t+.25)}catch(x){}};
function toast(t,cl,l){const el=document.getElementById("toast");if(!el)return;el.className="";void el.offsetWidth;el.className="show "+cl;el.innerHTML=`<small>${e(l)}</small><b>${t}</b>`;clearTimeout(toast.h);toast.h=setTimeout(()=>el.className="",2600)}
let cur={},mode=0,log=[];
const mod=v=>Math.floor((v-10)/2),sg=n=>(n>=0?"+":"")+n,pb=c=>2+Math.floor((c.lvl-1)/4);
const skm=(c,i)=>mod(c.ab[SK[i][1]])+pb(c)*(c.sk[i]||0),svm=(c,k)=>mod(c.ab[k])+(c.sv[k]?pb(c):0);
const rnd=s=>1+Math.floor(Math.random()*s);

function roll(label,n,s,m=0,md=0){lastRoll=[label,n,s,m,md];
 let t,k,txt;
 if(s==20&&n==1&&md){const a=rnd(20),b=rnd(20);k=md>0?Math.max(a,b):Math.min(a,b);t=k+m;txt=`d20 ${md>0?"výhoda":"nevýhoda"} [${a}, ${b}] → ${k}`}
 else{const r=Array.from({length:n},()=>rnd(s));const sum=r.reduce((a,b)=>a+b,0);t=sum+m;k=r[0];txt=`${n}d${s} [${r.join(", ")}]`}
 if(m)txt+=" "+sg(m);
 const cl=s==20&&n==1?(k==20?"crit":k==1?"fail":""):"";
 log.unshift(`<div class="le"><span class="mut">${e(label)}</span><br><b class="${cl}">${t}</b> <span class="mut">${txt}${cl=="crit"?" – kritický zásah!":cl=="fail"?" – kritický neúspech":""}</span></div>`);
 log=log.slice(0,60);drawLog();beep();toast(t,cl,label);return t;
}
function rollExpr(label,ex){
 const s=String(ex).replace(/\s/g,"").toLowerCase().replace(/k/g,"d");
 if(!/^[+-]?(\d*d\d+|\d+)([+-](\d*d\d+|\d+))*$/.test(s))return roll(label+" (zlý zápis)",1,20);
 const m1=s.match(/^(\d*)d(\d+)([+-]\d+)?$/);if(m1)return roll(label,+m1[1]||1,+m1[2],+(m1[3]||0));
 let t=0,parts=[];for(const q of s.match(/[+-]?(\d*d\d+|\d+)/g)){const g=q[0]=="-"?-1:1,b=q.replace(/^[+-]/,"");if(b.includes("d")){const[n,f]=b.split("d"),r=Array.from({length:+n||1},()=>rnd(+f)),sm=r.reduce((x,y)=>x+y,0);t+=g*sm;parts.push(`${q.replace(/^\+/,"")} [${r.join(",")}]`)}else{t+=g*+b;parts.push(q)}}
 log.unshift(`<div class="le"><span class="mut">${e(label)}</span><br><b>${t}</b> <span class="mut">${parts.join(" ")}</span></div>`);log=log.slice(0,60);drawLog();beep();toast(t,"",label)}
const drawLog=()=>{const l=document.getElementById("log");if(l)l.innerHTML=log.join("")||'<p class="mut">Zatiaľ žiadne hody.</p>'};
const fld=(l,p,v,t="text",x="")=>`<label class="f">${l}<input type="${t}" data-f="${p}" value="${e(v)}" ${x}></label>`;

const rollerHTML=()=>`<aside class="pa roller"><h3>Kocky</h3><div class="row"><label class="f" style="flex:1">Počet<input id="dn" type="number" value="1" min="1" max="50"></label><label class="f" style="flex:1">Bonus<input id="dm" type="number" value="0"></label></div>
 <div class="dice">${[4,6,8,10,12,20,100].map(s=>`<button data-a="d" data-s="${s}">d${s}</button>`).join("")}</div>
 <div class="row">${[["Normálne",0],["Výhoda",1],["Nevýhoda",-1]].map(([n,v])=>`<button class="sm ${mode==v?"pri":""}" data-a="md" data-v="${v}">${n}</button>`).join("")}</div>
 <div class="row" style="margin-top:8px"><input id="dx" placeholder="napr. 8d6+4" style="flex:1"><button class="pri" data-a="dx">Hoď</button></div><div class="log" id="log"></div><button class="sm" data-a="again">↻ Opakovať</button> <button class="sm" data-a="cl">Vymazať históriu</button> <button class="sm" data-a="snd">${snd?"🔊":"🔇"} Zvuk</button></aside>`;
const CD=["Nevidí; útoky proti nemu s výhodou, jeho útoky s nevýhodou.","Nemôže útočiť na očarovateľa; ten má výhodu pri sociálnych hodoch.","Nepočuje; zlyhá v hodoch, ktoré vyžadujú sluch.","Nevýhoda na hody, kým vidí zdroj strachu; nemôže sa k nemu priblížiť.","Rýchlosť 0.","Nemôže robiť akcie ani reakcie.","Útoky proti nemu s nevýhodou, jeho útoky s výhodou.","Neschopný, nehybný; zlyhá záchrany na SIL a OBR; útoky proti nemu s výhodou, zblízka kritický zásah.","Premenený na kameň; neschopný, odolný voči všetkému zraneniu.","Nevýhoda na hody na útok a na vlastnosti.","Pohybuje sa len plazením; útoky zblízka proti nemu s výhodou, jeho útoky s nevýhodou.","Rýchlosť 0; útoky proti nemu s výhodou; jeho útoky a záchrany OBR s nevýhodou.","Neschopný; zlyhá záchrany na SIL a OBR; útoky proti nemu s výhodou.","Neschopný, padá; zlyhá záchrany SIL a OBR; útoky proti nemu s výhodou, zblízka kritický zásah."];
const DL={chest:"dl-a",main:"dl-w",off:"dl-o"};
const cntHTML=c=>`<section class="pa"><h3>Schopnosti – počítadlá</h3>${c.cnt.map((q,i)=>`<div class="cnt"><input data-f="cnt.${i}.n" value="${e(q.n)}" placeholder="Druhý dych"><input type="number" data-f="cnt.${i}.m" value="${q.m}" min="0" max="9" aria-label="Max"><span class="row">${Array.from({length:q.m},(_,j)=>`<button class="pf" data-a="cpip" data-i="${i}" data-j="${j}">${j<q.u?"○":"●"}</button>`).join("")}</span><select data-f="cnt.${i}.r" aria-label="Obnova"><option value="">bez obnovy</option><option value="s" ${q.r=="s"?"selected":""}>krátky</option><option value="l" ${q.r=="l"?"selected":""}>dlhý</option></select><button class="sm" data-a="cdel" data-i="${i}">✕</button></div>`).join("")}<button class="sm" data-a="cadd">+ Počítadlo</button><p class="mut">Obnova: krátky odpočinok obnoví „krátky“, dlhý obnoví oba.</p></section>`;
const compHTML=c=>`<section class="pa"><h3>Spoločníci a privolané tvory</h3>${c.comp.map((q,i)=>`<div class="wi"><div class="row"><input data-f="comp.${i}.n" value="${e(q.n)}" style="flex:1"><span class="mut">AC</span><input type="number" data-f="comp.${i}.ac" value="${q.ac}" style="width:56px"><button class="sm" data-a="cphp" data-i="${i}" data-d="-1">−</button><b>${q.hp}/${q.max}</b><button class="sm" data-a="cphp" data-i="${i}" data-d="1">+</button><button class="sm" data-a="cpdel" data-i="${i}">✕</button></div><div class="row">${q.atk.map((a,j)=>`<button class="sm" data-a="cpatk" data-i="${i}" data-j="${j}">${e(a.n||"Útok")} ${e(a.b)}</button><button class="sm" data-a="cpdmg" data-i="${i}" data-j="${j}" title="Zranenie">⚔ ${e(a.d)}</button>`).join("")}</div></div>`).join("")}${D.bestiary.length?`<div class="row" style="margin-top:6px"><select id="cps">${D.bestiary.map(b=>`<option value="${b.id}">${e(b.name)}</option>`).join("")}</select><button class="sm" data-a="cpadd">+ Pridať z bestiára</button></div>`:""}</section>`;
const imgField=(img,t,input)=>`<div>${img&&img.startsWith("data:")?"":input}<div class="row" style="margin-top:4px"><button class="sm" data-a="pic" data-t="${t}">Nahrať obrázok</button>${img?`<button class="sm" data-a="picx" data-t="${t}">Odstrániť</button>`:""}</div></div>`;
const acCalc=c=>{const dx=mod(c.ab.dex),a=c.eqp.chest?.a,sh=c.eqp.off?.sh?2:0,base=a?a.b+(a.cap==0?0:Math.min(dx,a.cap==9?99:a.cap)):10+dx;return base+sh+(+c.acm||0)};
const acVal=c=>c.aca?acCalc(c):c.ac;
function eqpHook(c,f){const m=f.match(/^eqp\.(main|off|chest)\.n$/);if(!m)return false;const k=m[1],s=c.eqp[k],v=(s.n||"").trim();delete s.a;delete s.sh;
 const ar=ARMORS.find(x=>x[0]==v),w=WEAPONS.find(x=>x[0]==v);
 if(k=="chest"&&ar){s.a={b:ar[1],cap:ar[2]};s.d="AC "+ar[1]+(ar[2]==9?" + OBR":ar[2]?" + OBR (max "+ar[2]+")":"")}
 else if(k=="off"&&v==SHIELD){s.sh=true;s.d="+2 AC"}
 else if(w&&k!="chest"){s.d=w[1].replace("d","k")+" "+w[2];const mm=mod(w[4]=="r"?c.ab.dex:w[4]=="f"?Math.max(c.ab.str,c.ab.dex):c.ab.str),row={n:w[0],b:sg(mm+pb(c)),d:w[1]+(mm?sg(mm):"")},o=c.atk.find(x=>x.n==w[0]);o?Object.assign(o,row):c.atk.push(row)}
 return true}
const spellHTML=c=>{const L=c.spl.map((s,i)=>({...s,i})).sort((x,y)=>x.l-y.l);
 return `<section class="pa" style="grid-column:1/-1"><h3>Kúzla</h3>${c.conc?`<p class="conc">🧠 Sústredenie: <b>${e(c.spl.find(s=>s.id==c.conc)?.n||"")}</b> <button class="sm" data-a="cend">Ukončiť</button></p>`:""}<div class="row" style="margin-bottom:8px"><input list="spl" id="spi" placeholder="Hľadaj alebo napíš vlastné kúzlo…" style="flex:1"><datalist id="spl">${[...SPELLS,...D.cspells].map(s=>{const q=s.split("|");return `<option value="${e(q[1])}" label="${q[0]==0?"trik":q[0]+". úr."}">`}).join("")}</datalist><button class="sm" data-a="as">Pridať</button></div>
 ${L.map(s=>`<div class="sp ${s.p?"prep":""}"><button class="sm" data-a="sprep" data-i="${s.i}" title="Pripravené">${s.p?"☑":"☐"}</button><span class="spn"><b>${e(s.n)}</b> <small class="mut">${s.l?s.l+". úr.":"trik"}</small><br><small>${e(s.d)}</small></span><span class="row"><button class="sm ${s.k?"pri":""}" data-a="skon" data-i="${s.i}" title="Vyžaduje sústredenie">🧠</button><button class="sm" data-a="scast" data-i="${s.i}">Zoslať</button>${/\d+k\d+/.test(s.d)?`<button class="sm" data-a="sroll" data-i="${s.i}" title="Hodiť kocky z popisu">🎲</button>`:""}<button class="sm" data-a="sdel" data-i="${s.i}">✕</button></span></div>`).join("")}
 <textarea data-f="sp" placeholder="Poznámky ku kúzlam…">${e(c.sp)}</textarea></section>`};
const SLOTS=[["neck","📿","Náhrdelník"],["head","🪖","Hlava"],["cloak","🧣","Plášť na chrbte"],["gloves","🧤","Rukavice"],["chest","🛡️","Hruď / brnenie"],["wrist","🔗","Náramky"],["ring1","💍","Prsteň 1"],["belt","🎗️","Opasok"],["ring2","💍","Prsteň 2"],["main","⚔️","Hlavná ruka"],["legs","👖","Nohy"],["off","🛡️","Druhá ruka / štít"],["boots","👢","Topánky"]];
const invTot=c=>{const t=c.inv.reduce((s,i)=>s+(+i.q||0)*(+i.w||0),0),cap=c.ab.str*15;return `Zaťaženie: ${Math.round(t*10)/10} / ${cap} lb${t>cap?" – preťažený!":""}`};
const invHTML=c=>`<section class="pa"><h3>Výbava na tele</h3><div class="eqg">${SLOTS.map(([k,ic,n])=>{const s=c.eqp[k]||{};return `<div class="slot" style="grid-area:${k}"><b>${ic} ${n}</b><input data-f="eqp.${k}.n" value="${e(s.n)}" placeholder="Predmet" aria-label="${n}" ${DL[k]?`list="${DL[k]}"`:""}><input data-f="eqp.${k}.d" value="${e(s.d)}" placeholder="Bonus / poznámka" aria-label="${n} – poznámka"></div>`}).join("")}</div></section>
 <datalist id="dl-w">${WEAPONS.map(w=>`<option value="${w[0]}" label="${w[1]} ${w[2]}">`).join("")}</datalist><datalist id="dl-a">${ARMORS.map(w=>`<option value="${w[0]}" label="AC ${w[1]}">`).join("")}</datalist><datalist id="dl-o"><option value="${SHIELD}" label="+2 AC">${WEAPONS.map(w=>`<option value="${w[0]}">`).join("")}</datalist><datalist id="dl-c">${Object.keys(CLASSES).map(k=>`<option value="${k}">`).join("")}</datalist><datalist id="dl-r">${Object.keys(RACES).map(k=>`<option value="${k}">`).join("")}</datalist>
 <section class="pa"><h3>Batoh</h3>${c.inv.length?'<div class="inv mut"><span>Predmet</span><span>Počet</span><span>Váha (lb)</span><span></span></div>':""}${c.inv.map((it,i)=>`<div class="inv"><input data-f="inv.${i}.n" value="${e(it.n)}" placeholder="Predmet"><input type="number" data-f="inv.${i}.q" value="${it.q}" min="0" aria-label="Počet"><input type="number" step="0.1" data-f="inv.${i}.w" value="${it.w}" min="0" aria-label="Váha"><button class="sm" data-a="idel" data-i="${i}">✕</button></div>`).join("")}<div class="row" style="margin-top:6px"><button class="sm" data-a="iadd">+ Predmet</button><span class="mut" id="invtot">${invTot(c)}</span></div></section>`;
function viewHome(){
 return `<section class="hero"><div class="parade">${["goblin","dwarf","knight","dragon","wizard","elf","rogue","slime"].map(k=>ART[k]).join("")}</div><h1>Kronika družiny</h1><p>Hrdinovia, ich príbehy a hody kockou</p></section>
 <div class="wrap pg"><h2>Hráči</h2><div class="cards">${D.players.map((p,i)=>`<a class="pa card" href="#/hrac/${p.id}"><span class="art">${ART[ORDER[i%ORDER.length]]}</span><h3>${e(p.name)}</h3><p><i>${e(p.motto)}</i></p><p class="mut">${p.chars.map(c=>e(c.name)).join(", ")||"Zatiaľ bez postáv"}</p></a>`).join("")}<button class="pa card add" data-a="np">+ Nový hráč</button></div><h2 style="margin-top:28px">Kampane</h2><div class="cards">${D.camps.map((k,i)=>`<a class="pa card" href="#/hra/${k.id}/dm"><span class="art">${ART[ORDER[(i+3)%ORDER.length]]}</span><h3>${e(k.name)}</h3><p class="mut">Postáv: ${D.players.reduce((n,p)=>n+p.chars.filter(c=>c.camp==k.id).length,0)} · Záznamov: ${k.journal.length}</p></a>`).join("")}<button class="pa card add" data-a="nk">+ Nová kampaň</button></div><h2 style="margin-top:28px">Bestiár</h2><div class="cards"><a class="pa card" href="#/bestiar"><span class="art">${ART.slime}</span><h3>Bestiár</h3><p class="mut">Monštier: ${D.bestiary.length}</p></a></div>${local?'<p class="mut" style="color:#e8d6a6">Zobrazuješ lokálne zmeny uložené v tomto prehliadači.</p>':""}</div>`;
}
function viewPlayer(){
 const p=D.players.find(x=>x.id==cur.p);if(!p)return notFound();
 return `<div class="wrap pg"><h2>${e(p.name)}</h2><div class="pa" style="margin-bottom:18px"><div class="grid g2">${fld("Meno hráča","name",p.name)}${fld("Heslo / citát","motto",p.motto)}</div><div class="row" style="margin-top:8px"><button class="sm" data-a="dp">Zmazať hráča</button></div></div>
 <div class="cards">${p.chars.map(c=>`<a class="pa card" href="#/postava/${p.id}/${c.id}"><span class="art">${c.img?`<img src="${e(c.img)}" alt="" onerror="this.remove()">`:artFor(c)}</span><h3>${e(c.name)}</h3><p>${e(c.race)} ${e(c.cls)} ${e(c.sub)}, level ${c.lvl}</p><p class="mut">AC ${acVal(c)} · HP ${c.hpc}/${c.hp}</p></a>`).join("")}<button class="pa card add" data-a="nc">+ Nová postava</button></div></div>`;
}
function viewChar(){
 const p=D.players.find(x=>x.id==cur.p),c=p?.chars.find(x=>x.id==cur.c);if(!c)return notFound();
 const sp=c.sa?`<p class="mut">Čarovanie: útok ${sg(mod(c.ab[c.sa])+pb(c))}, záchrana DC ${8+mod(c.ab[c.sa])+pb(c)}</p>`:"";
 return `<div class="wrap"><div class="sheet"><main class="stack">
 <section class="pa"><div class="row" style="align-items:flex-start;flex-wrap:nowrap">${c.img?`<img class="portrait" src="${e(c.img)}" alt="" onerror="this.remove()">`:`<div class="portrait art">${artFor(c)}</div>`}<div class="grid g2" style="flex:1">${fld("Meno","name",c.name)}${fld("Trieda","cls",c.cls,"text",'list="dl-c"')}${fld("Podtrieda","sub",c.sub)}${fld("Rasa","race",c.race,"text",'list="dl-r"')}${fld("Pôvod","bg",c.bg)}${fld("Zameranie","al",c.al)}${fld("Level","lvl",c.lvl,"number",'min="1" max="20"')}${fld("Skúsenosti (XP)","xp",c.xp,"number")}${imgField(c.img,"c",fld("Obrázok (URL alebo cesta k súboru)","img",c.img))}<label class="f">Kampaň<select data-f="camp"><option value="">–</option>${D.camps.map(k=>`<option value="${k.id}" ${c.camp==k.id?"selected":""}>${e(k.name)}</option>`).join("")}</select></label></div></div><p class="mut">Ďalší level pri ${XP[c.lvl]??"–"} XP${XP[c.lvl]!=null&&c.xp>=XP[c.lvl]?" – môžeš postúpiť! ⭐":""}</p><button class="sm" data-a="preset" title="Kocky životov, záchrany, sloty kúziel, HP a rýchlosť">Použiť predvoľby triedy a rasy</button> <button class="sm" data-a="lvlup">Postúpiť na vyšší level ⭐</button> <button class="sm" data-a="prt">Vytlačiť / PDF</button></section>
 <section class="pa"><div class="abs">${AB.map(([k,n])=>`<div class="ab" style="--c:${ACOL[k]}"><div class="mut">${n}</div><button class="md" data-a="rl" data-l="${n}" data-m="${mod(c.ab[k])}" title="Hod na vlastnosť">${sg(mod(c.ab[k]))}</button><input type="number" data-f="ab.${k}" value="${c.ab[k]}" min="1" max="30"></div>`).join("")}</div>
 <div class="grid g2" style="margin-top:12px">${fld("Bonus zdatnosti","_a",sg(pb(c)),"text","readonly")}<label class="f">Obranné číslo (AC)${c.aca?" – auto":""}<input type="number" data-f="${c.aca?"_ac":"ac"}" value="${acVal(c)}" ${c.aca?"readonly":""}></label><label class="f">Počítať AC z výbavy<input type="checkbox" data-f="aca" ${c.aca?"checked":""}></label>${fld("Bonus k AC (magické)","acm",c.acm,"number")}${fld("Rýchlosť","spd",c.spd,"number")}<label class="f">Iniciatíva<button data-a="rl" data-l="Iniciatíva" data-m="${mod(c.ab.dex)}">Hodiť ${sg(mod(c.ab.dex))}</button></label>${fld("Pasívne vnímanie","_b",10+skm(c,11),"text","readonly")}</div></section>
 ${invHTML(c)}<div class="cols">
 <section class="pa"><h3>Životy</h3><div class="bar"><i style="width:${Math.round(100*c.hpc/Math.max(1,c.hp))}%"></i></div><div class="grid g2">${fld("Max HP","hp",c.hp,"number")}${fld("Aktuálne HP","hpc",c.hpc,"number")}${fld("Dočasné HP","hpt",c.hpt,"number")}${fld("Kocky životov","hd",c.hd)}</div><div class="row" style="margin-top:8px"><button class="sm" data-a="hp" data-d="-5">-5</button><button class="sm" data-a="hp" data-d="-1">-1</button><button class="sm" data-a="hp" data-d="1">+1</button><button class="sm" data-a="hp" data-d="5">+5</button><button class="sm" data-a="hf">Plné HP</button><button class="sm" data-a="hdr">Hodiť kocku životov (liečenie)</button><button class="sm" data-a="sr">Krátky odpočinok</button><button class="sm" data-a="lr">Dlhý odpočinok</button><span class="mut">Kocky životov zostáva: ${Math.max(0,c.lvl-(c.hdu||0))} / ${c.lvl}</span></div><div class="ds" style="margin-top:8px"><b>Záchrany proti smrti</b>${[["ds","Úspechy","●"],["df","Neúspechy","✖"]].map(([k,l,ic])=>`<div class="row"><span style="width:90px">${l}</span>${[0,1,2].map(j=>`<button class="pf" data-a="dsv" data-k="${k}" data-j="${j}">${c[k]>j?ic:"○"}</button>`).join("")}</div>`).join("")}${c.ds>=3?'<b class="crit">Stabilizovaný</b>':""}${c.df>=3?'<b class="fail">Mŕtvy</b>':""}</div></section>
 <section class="pa"><h3>Záchranné hody</h3>${AB.map(([k,n])=>`<div class="sk"><button class="pf" data-a="sv" data-k="${k}">${c.sv[k]?"●":"○"}</button><span>${n}</span><button class="v" data-a="rl" data-l="Záchrana: ${n}" data-m="${svm(c,k)}">${sg(svm(c,k))}</button></div>`).join("")}</section>
 <section class="pa"><h3>Zručnosti</h3><p class="mut">○ nič · ● zdatnosť · ◆ expertíza</p>${SK.map(([n,k],i)=>`<div class="sk"><button class="pf" data-a="sk" data-i="${i}">${["○","●","◆"][c.sk[i]||0]}</button><span>${n} <small class="mut">(${k.toUpperCase()})</small></span><button class="v" data-a="rl" data-l="${n}" data-m="${skm(c,i)}">${sg(skm(c,i))}</button></div>`).join("")}</section>
 ${cntHTML(c)}
 ${compHTML(c)}
 <section class="pa"><h3>Makrá hodov</h3>${c.mac.map((q,i)=>`<div class="mac"><input data-f="mac.${i}.n" value="${e(q.n)}" placeholder="Názov"><input data-f="mac.${i}.x" value="${e(q.x)}" placeholder="8d6+4"><button class="sm pri" data-a="mrun" data-i="${i}" title="Hodiť">🎲</button><button class="sm" data-a="mdel" data-i="${i}">✕</button></div>`).join("")}<button class="sm" data-a="madd">+ Makro</button><p class="mut">Zápis: 2d6+1d4+3 (aj „k“ namiesto „d“).</p></section>
 <section class="pa"><h3>Stavy</h3><div class="row">${CONDS.map((n,i)=>`<button class="chip ${c.cond.includes(i)?"on":""}" data-a="cd" data-n="${i}" title="${CD[i]}">${n}</button>`).join("")}</div>${c.cond.map(i=>`<p class="mut"><b>${CONDS[i]}:</b> ${CD[i]}</p>`).join("")}<div class="grid g2" style="margin-top:8px">${fld("Vyčerpanie (0–6)","ex",c.ex,"number",'min="0" max="6"')}</div></section>
 <section class="pa"><h3>Útoky</h3>${c.atk.map((a,i)=>`<div class="atk"><input data-f="atk.${i}.n" value="${e(a.n)}" placeholder="Zbraň"><input data-f="atk.${i}.b" value="${e(a.b)}" placeholder="+5"><input data-f="atk.${i}.d" value="${e(a.d)}" placeholder="1d8+3"><span class="row"><button class="sm" data-a="ra" data-i="${i}">Útok</button><button class="sm" data-a="rd" data-i="${i}">Zranenie</button><button class="sm" data-a="da" data-i="${i}">✕</button></span></div>`).join("")}<button class="sm" data-a="na">+ Útok</button>
 <h3 style="margin-top:14px">Čarovanie</h3><label class="f">Čarovacia vlastnosť<select data-f="sa"><option value="">–</option>${AB.map(([k,n])=>`<option value="${k}" ${c.sa==k?"selected":""}>${n}</option>`).join("")}</select></label>${sp}</section>
 <section class="pa"><h3>Peniaze a poznámky</h3><div class="grid" style="grid-template-columns:repeat(5,1fr)">${["pp","gp","ep","sp","cp"].map(k=>fld(k.toUpperCase(),"co."+k,c.co[k],"number",'min="0"')).join("")}</div>${fld("Poznámka (drahokamy, poklady)","coin",c.coin)}<textarea data-f="eq">${e(c.eq)}</textarea></section>
 <section class="pa"><h3>Sloty kúziel</h3>${[1,2,3,4,5,6,7,8,9].map(l=>{const s=c.sl[l]||{m:0,u:0};return `<div class="sk"><span>${l}. úroveň</span><input type="number" min="0" max="9" value="${s.m}" data-f="sl.${l}.m" style="width:46px" aria-label="Počet slotov ${l}. úrovne">${Array.from({length:s.m},(_,j)=>`<button class="pf" data-a="pip" data-l="${l}" data-j="${j}" title="Klikni pre minutie/obnovu">${j<s.u?"○":"●"}</button>`).join("")}</div>`}).join("")}<p class="mut">● dostupný slot · ○ minutý</p></section>
 ${spellHTML(c)}
 <section class="pa"><h3>Jazyky a zdatnosti</h3><textarea data-f="pr">${e(c.pr)}</textarea></section>
 <section class="pa"><h3>Schopnosti a vlastnosti</h3><textarea data-f="ft">${e(c.ft)}</textarea></section>
 <section class="pa"><h3>Poznámky a príbeh</h3><textarea data-f="nt">${e(c.nt)}</textarea><div class="row" style="margin-top:8px"><button class="sm" data-a="dc">Zmazať postavu</button></div></section></div></main>
 ${rollerHTML()}</div></div>`;
}
function viewSearch(){const q=cur.q.toLowerCase(),has=(...a)=>a.some(x=>String(x||"").toLowerCase().includes(q)),R=[];
 D.players.forEach(p=>{if(has(p.name,p.motto))R.push(["Hráč",p.name,`#/hrac/${p.id}`,p.motto]);p.chars.forEach(c=>{if(has(c.name,c.cls,c.sub,c.race,c.bg,c.nt,c.ft,c.eq,c.sp)||c.spl.some(s=>has(s.n))||c.inv.some(i=>has(i.n)))R.push(["Postava",c.name,`#/postava/${p.id}/${c.id}`,`${c.race} ${c.cls} ${c.lvl}`])})});
 D.bestiary.forEach(m=>{if(has(m.name,m.type,m.tr,m.sn,m.nt))R.push(["Monštrum",m.name,`#/bestiar/${m.id}`,m.type])});
 D.camps.forEach(k=>{if(has(k.name))R.push(["Kampaň",k.name,`#/hra/${k.id}/dm`,""]);k.journal.forEach(j=>{if(has(j.title,j.text))R.push(["Denník",j.title,`#/hra/${k.id}/dennik`,k.name])});WK.forEach(([t,h])=>k.world[t].forEach(it=>{if(has(it.n,it.t))R.push([h,it.n,`#/hra/${k.id}/svet`,k.name])}))});
 SPELLS.forEach(s=>{const x=s.split("|");if(has(x[1],x[2]))R.push(["Kúzlo",x[1],"",`${x[0]}. úr. – ${x[2]}`])});
 return `<div class="wrap pg"><h2>Hľadanie: „${e(cur.q)}“</h2><div class="stack">${R.length?R.slice(0,80).map(([t,n,h,s])=>`<div class="pa"><span class="mut">${t}</span> ${h?`<a href="${h}"><b>${e(n)}</b></a>`:`<b>${e(n)}</b>`} <span class="mut">${e(s)}</span></div>`).join(""):'<p style="color:#e8d6a6">Nič sa nenašlo.</p>'}</div></div>`}
const notFound=()=>`<div class="wrap"><div class="pa"><h3>Nenájdené</h3><p>Táto stránka neexistuje. <a href="#/">Späť na úvod</a></p></div></div>`;

function render(){
 const p=D.players.find(x=>x.id==cur.p),c=p?.chars.find(x=>x.id==cur.c);
 let html,cr='<a href="#/">Úvod</a>';
 if(cur.v=="p"){html=viewPlayer();cr+=` › ${e(p?.name)}`}
 else if(cur.v=="c"){html=viewChar();cr+=` › <a href="#/hrac/${cur.p}">${e(p?.name)}</a> › ${e(c?.name)}`}
 else if(cur.v=="k"){html=viewCamp();cr+=` › ${e(K()?.name)}`}else if(cur.v=="s"){html=viewSearch();cr+=" › Hľadanie"}else if(cur.v=="g"){html=viewGen();cr+=" › Generátory"}else if(cur.v=="b"){html=viewBestiary();cr+=" › Bestiár"}else if(cur.v=="m"){html=viewMonster();cr+=` › <a href="#/bestiar">Bestiár</a> › ${e(MO()?.name)}`}else html=viewHome();
 document.getElementById("app").innerHTML=html;document.getElementById("crumbs").innerHTML=cr;drawLog();banner();
}
function route(){const h=location.hash.slice(1).split("/");
 cur=h[1]=="hrac"?{v:"p",p:h[2]}:h[1]=="postava"?{v:"c",p:h[2],c:h[3]}:h[1]=="hra"?{v:"k",k:h[2],t:{dennik:"j",svet:"w",zasoba:"s",mapa:"m"}[h[3]]||"dm"}:h[1]=="dm"||h[1]=="dennik"?{v:"k",k:D.camps[0]?.id,t:h[1]=="dm"?"dm":"j"}:h[1]=="hladaj"?{v:"s",q:decodeURIComponent(h[2]||"")}:h[1]=="generator"?{v:"g"}:h[1]=="bestiar"?(h[2]?{v:"m",m:h[2]}:{v:"b"}):{v:"h"};render();scrollTo(0,0)}
addEventListener("hashchange",route);

function setPath(o,path,v){const k=path.split(".");let t=o;for(let i=0;i<k.length-1;i++)t=t[k[i]]=t[k[i]]||{};t[k[k.length-1]]=v}
document.addEventListener("change",ev=>{const t=ev.target,f=t.dataset.f;if(!f)return;
 const p=D.players.find(x=>x.id==cur.p),tgt=cur.v=="c"?p?.chars.find(x=>x.id==cur.c):p;if(!tgt)return;
 let v=t.type=="checkbox"?t.checked:t.type=="number"?(+t.value||0):t.value;if(f=="lvl")v=Math.min(20,Math.max(1,v));
 setPath(tgt,f,v);const hk=cur.v=="c"&&eqpHook(tgt,f);save();if(/^inv\./.test(f)){const el=document.getElementById("invtot");if(el)el.textContent=invTot(tgt)}if(hk||cur.v=="p"||/^(lvl|ab\.|sa$|sl\.|hp$|hpc$|aca$|acm$|cnt\.\d+\.m$)/.test(f))render()});
document.addEventListener("click",ev=>{const b=ev.target.closest("[data-a]");if(!b)return;
 const a=b.dataset.a,d=b.dataset,p=D.players.find(x=>x.id==cur.p),c=p?.chars.find(x=>x.id==cur.c),R=()=>{save();render()};
 if(a=="np"){const n=prompt("Meno hráča:");if(!n)return;D.players.push({id:slug(n),name:n,motto:"",chars:[]});R()}
 else if(a=="dp"){if(confirm("Zmazať hráča aj s postavami?")){D.players=D.players.filter(x=>x.id!=p.id);save();location.hash="#/"}}
 else if(a=="nc"){const n=prompt("Meno postavy:");if(!n)return;const ch=newChar(n);ch.camp=D.camps[0]?.id||"";p.chars.push(ch);save();location.hash=`#/postava/${p.id}/${ch.id}`}
 else if(a=="dc"){if(confirm("Zmazať postavu?")){p.chars=p.chars.filter(x=>x.id!=c.id);save();location.hash="#/hrac/"+p.id}}
 else if(a=="rl")roll(d.l,1,20,+d.m,mode);
 else if(a=="sv"){c.sv[d.k]=!c.sv[d.k];R()}
 else if(a=="sk"){c.sk[d.i]=((c.sk[d.i]||0)+1)%3;R()}
 else if(a=="hp"){let q=+d.d;if(q<0&&c.conc){const dc=Math.max(10,Math.floor(-q/2));roll("Sústredenie na „"+(c.spl.find(s=>s.id==c.conc)?.n||"kúzlo")+"“ – záchrana ODO (DC "+dc+")",1,20,svm(c,"con"),mode)}if(q<0&&c.hpt>0){const w=Math.min(c.hpt,-q);c.hpt-=w;q+=w}c.hpc=Math.max(0,Math.min(c.hp,c.hpc+q));if(c.hpc>0){c.ds=0;c.df=0}R()}
 else if(a=="hf"){c.hpc=c.hp;R()}
 else if(a=="na"){c.atk.push({n:"",b:"+0",d:"1d6"});R()}
 else if(a=="da"){c.atk.splice(+d.i,1);R()}
 else if(a=="ra"){const x=c.atk[d.i];roll((x.n||"Útok")+" – útok",1,20,parseInt(x.b)||0,mode)}
 else if(a=="rd"){const x=c.atk[d.i];rollExpr((x.n||"Útok")+" – zranenie",x.d)}
 else if(a=="d")roll("Voľný hod",Math.max(1,+document.getElementById("dn").value||1),+d.s,+document.getElementById("dm").value||0,mode);
 else if(a=="dx")rollExpr("Vlastný hod",document.getElementById("dx").value);
 else if(a=="md"){mode=+d.v;render()}
 else if(a=="cl"){log=[];drawLog()}
 else if(a=="cadd"){c.cnt.push({n:"",m:1,u:0,r:"l"});R()}
 else if(a=="cdel"){c.cnt.splice(+d.i,1);R()}
 else if(a=="cpip"){const q=c.cnt[+d.i];q.u=+d.j<q.u?q.u-1:Math.min(q.m,q.u+1);R()}
 else if(a=="sr"){c.cnt.forEach(q=>{if(q.r=="s")q.u=0});toast("☕","","Krátky odpočinok");R()}
 else if(a=="dsv"){const j=+d.j;c[d.k]=c[d.k]>j?j:j+1;R()}
 else if(a=="prt")window.print();
 else if(a=="lvlup"){if(c.lvl>=20)return alert("Maximálny level.");const cl=CLASSES[c.cls],die=cl?cl[0]:(+(String(c.hd).match(/d(\d+)/)||[])[1]||8),avg=Math.floor(die/2)+1+mod(c.ab.con),n=prompt(`Level ${c.lvl+1}: prírastok HP (priemer ${avg}). Zadaj vlastný hod alebo nechaj priemer:`,avg);if(n===null)return;const g=Math.max(1,+n||avg);c.lvl++;c.hp+=g;c.hpc+=g;c.hd=c.lvl+"d"+die;if(cl&&cl[3])c.sl=slotsFor(cl[3],c.lvl);if([4,8,12,16,19].includes(c.lvl))alert("Level "+c.lvl+": máš zvýšenie vlastností (+2) alebo feat.");R()}
 else if(a=="cpadd"){const s=D.bestiary.find(q=>q.id==document.getElementById("cps").value);if(!s)return;c.comp.push({n:s.name,ac:s.ac,hp:s.hp,max:s.hp,atk:s.atk.map(q=>({...q}))});R()}
 else if(a=="cphp"){const q=c.comp[+d.i];q.hp=Math.max(0,Math.min(q.max,q.hp+(+d.d)));R()}
 else if(a=="cpdel"){c.comp.splice(+d.i,1);R()}
 else if(a=="cpatk"){const q=c.comp[+d.i],t=q.atk[+d.j];roll(q.n+" – "+(t.n||"útok"),1,20,parseInt(t.b)||0,mode)}
 else if(a=="cpdmg"){const q=c.comp[+d.i],t=q.atk[+d.j];rollExpr(q.n+" – "+(t.n||"útok")+" (zranenie)",t.d)}
 else if(a=="again"){if(lastRoll)roll(...lastRoll)}
 else if(a=="madd"){c.mac.push({n:"",x:"1d20"});R()}
 else if(a=="mdel"){c.mac.splice(+d.i,1);R()}
 else if(a=="mrun"){const q=c.mac[+d.i];rollExpr(c.name+" – "+(q.n||"makro"),q.x)}
 else if(a=="preset"){const cl=CLASSES[c.cls],rc=RACES[c.race];if(!cl&&rc==null)return alert("Zadaj triedu alebo rasu z ponuky (napr. Bojovník, Elf).");if(!confirm("Nastaví kocky životov, záchrany, čarovanie, sloty kúziel a max HP (priemerom) podľa triedy a levelu a rýchlosť podľa rasy. Pokračovať?"))return;
  if(cl){const[hd,sv,sa,t]=cl,cm=mod(c.ab.con);c.hd=c.lvl+"d"+hd;c.sv={};sv.forEach(k=>c.sv[k]=1);c.sa=sa;c.sl=slotsFor(t,c.lvl);c.hp=Math.max(1,hd+cm+(c.lvl-1)*(Math.floor(hd/2)+1+cm));c.hpc=c.hp}
  if(rc!=null)c.spd=rc;R()}
 else if(a=="as"){const v=document.getElementById("spi").value.trim();if(!v)return;const f=[...SPELLS,...D.cspells].map(x=>x.split("|")).find(x=>x[1]==v);let s;if(f)s={n:f[1],l:+f[0],d:f[2]};else{const l=prompt("Vlastné kúzlo – úroveň (0–9):","1");if(l==null)return;const dd=prompt("Krátky popis (voliteľné, napr. 2k8 ohňa):","")||"";s={n:v,l:Math.min(9,Math.max(0,+l||0)),d:dd};D.cspells.push(`${s.l}|${v}|${dd}`)}c.spl.push({id:rid(),...s,p:false,k:false});R()}
 else if(a=="sprep"){const s=c.spl[+d.i];s.p=!s.p;R()}
 else if(a=="skon"){const s=c.spl[+d.i];s.k=!s.k;R()}
 else if(a=="scast"){const s=c.spl[+d.i];let lv=s.l;if(lv>0){const hi=Object.keys(c.sl).map(Number).filter(n=>n>=s.l&&c.sl[n].u<c.sl[n].m);if(!hi.length)return alert("Nemáš voľný slot "+s.l+". úrovne alebo vyššieho.");lv=hi[0];if(hi.length>1){const r=prompt(`Úroveň slotu (voľné: ${hi.join(", ")}):`,hi[0]);if(r===null)return;lv=hi.includes(+r)?+r:hi[0]}c.sl[lv].u++}if(s.k)c.conc=s.id;toast("✨","",c.name+": "+s.n+(lv>s.l?` (slot ${lv}. úr.)`:""));R()}
 else if(a=="sroll"){const s=c.spl[+d.i],m=s.d.match(/(\d+)k(\d+)(\+\d+)?/);if(m)rollExpr(s.n,m[1]+"d"+m[2]+(m[3]||""))}
 else if(a=="sdel"){const s=c.spl[+d.i];if(c.conc==s.id)c.conc="";c.spl.splice(+d.i,1);R()}
 else if(a=="cend"){c.conc="";R()}
 else if(a=="pic"){picT=d.t;document.getElementById("pic").click()}
 else if(a=="picx"){const tg=d.t=="m"?MO():c;if(tg){tg.img="";R()}}
 else if(a=="iadd"){c.inv.push({n:"",q:1,w:0});R()}
 else if(a=="idel"){c.inv.splice(+d.i,1);R()}
 else if(a=="cd"){const i=+d.n,k=c.cond.indexOf(i);k<0?c.cond.push(i):c.cond.splice(k,1);R()}
 else if(a=="snd"){snd=!snd;render()}
 else if(a=="imp")document.getElementById("imp").click();
 else if(a=="hdr"){if((c.hdu||0)>=c.lvl)return alert("Nemáš žiadnu kocku životov.");const m=String(c.hd).match(/d(\d+)/),r=roll("Kocka životov (liečenie)",1,m?+m[1]:8,mod(c.ab.con));c.hpc=Math.min(c.hp,c.hpc+Math.max(0,r));c.hdu=(c.hdu||0)+1;R()}
 else if(a=="lr"){if(confirm("Dlhý odpočinok obnoví HP, záchrany proti smrti a sloty kúziel.")){c.hpc=c.hp;c.hpt=0;c.ds=0;c.df=0;c.conc="";c.hdu=Math.max(0,(c.hdu||0)-Math.max(1,Math.floor(c.lvl/2)));c.ex=Math.max(0,c.ex-1);c.cnt.forEach(q=>q.u=0);Object.values(c.sl).forEach(s=>s.u=0);R()}}
 else if(a=="pip"){const s=c.sl[d.l];s.u=+d.j<s.u?s.u-1:Math.min(s.m,s.u+1);R()}
 else if(a=="dl"||a=="dlf"){const u=URL.createObjectURL(new Blob([dataText(a=="dlf")],{type:"text/javascript"})),x=document.createElement("a");x.href=u;x.download=a=="dlf"?"data-plne.js":"data.js";x.click();URL.revokeObjectURL(u);try{if(a=="dl")localStorage.setItem(KEY+"-dirty","0")}catch(y){}banner()}
 else if(a=="ghsave")ghSave();
 else if(a=="gh"){const c=ghCfg();document.getElementById("io").innerHTML=`<p>Ukladanie priamo do repozitára (bez ručného nahrávania). Údaje sa uložia len v tomto prehliadači a nikdy sa nedostanú do data.js.</p><div class="grid g2" style="color:var(--pa)"><label class="f" style="color:inherit">Používateľ GitHubu<input id="ghO" value="${e(c.owner)}"></label><label class="f" style="color:inherit">Repozitár<input id="ghR" value="${e(c.repo)}"></label><label class="f" style="color:inherit">Vetva<input id="ghB" value="${e(c.branch)}"></label><label class="f" style="color:inherit">Súbor<input id="ghP" value="${e(c.path)}"></label><label class="f" style="color:inherit">Token<input id="ghT" type="password" value="${e(c.token)}" autocomplete="off"></label></div><p class="mut" style="color:#e8d6a6">Token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Vyber len tento repozitár a oprávnenie Contents: Read and write. Nezadávaj ho na cudzom počítači.</p><button class="sm pri" data-a="ghs">Uložiť nastavenia</button>`}
 else if(a=="ghs"){const g=i=>document.getElementById(i).value.trim();localStorage.setItem(GHK,JSON.stringify({owner:g("ghO"),repo:g("ghR"),branch:g("ghB")||"main",path:g("ghP")||"data.js",token:g("ghT")}));banner();alert("Nastavenia uložené.")}
 else if(a=="bk"){let z=[];try{z=JSON.parse(localStorage.getItem(BK)||"[]")}catch(y){}document.getElementById("io").innerHTML=z.length?`<p>Zálohy (stav pred posledným upravovaním):</p>${z.map((q,i)=>`<div class="row"><span>${new Date(q.t).toLocaleString("sk-SK")}</span><button class="sm" data-a="bkr" data-i="${i}">Obnoviť</button></div>`).join("")}`:"<p>Zatiaľ žiadne zálohy.</p>"}
 else if(a=="bkr"){const z=JSON.parse(localStorage.getItem(BK)||"[]");if(z[+d.i]&&confirm("Obnoviť túto zálohu?")){D=JSON.parse(z[+d.i].d);fix();save();location.hash="#/";render()}}
 else if(a=="ex")document.getElementById("io").innerHTML=`<p>Skopíruj celý text a vlož ho do súboru data.js na GitHube.</p><textarea style="height:220px">${e(dataText())}</textarea>`;
 else if(a=="rs"){if(confirm("Zahodiť zmeny z tohto prehliadača a načítať data.js? Veci označené ako tajné, ktoré nie sú v data.js, sa stratia (ak nemáš plnú zálohu).")){localStorage.removeItem(KEY);localStorage.removeItem(KEY+"-dirty");location.reload()}}
});
document.querySelector(".bgart").innerHTML=ART.dragon+ART.wizard;
document.getElementById("gs").addEventListener("keydown",ev=>{if(ev.key=="Enter"&&ev.target.value.trim())location.hash="#/hladaj/"+encodeURIComponent(ev.target.value.trim())});
let picT="c";
document.getElementById("pic").addEventListener("change",ev=>{const f=ev.target.files[0];if(!f)return;const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const mp=picT=="mp",cv=document.createElement("canvas"),g=cv.getContext("2d");if(mp){const sc=Math.min(1,900/Math.max(im.width,im.height));cv.width=Math.round(im.width*sc);cv.height=Math.round(im.height*sc);g.drawImage(im,0,0,cv.width,cv.height)}else{const s=Math.min(im.width,im.height);cv.width=cv.height=192;g.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,192,192)}const o=cv.toDataURL("image/jpeg",mp?.7:.8);if(mp){const k=K();if(k)k.map.bg=o}else{const tg=picT=="m"?MO():D.players.find(x=>x.id==cur.p)?.chars.find(x=>x.id==cur.c);if(tg)tg.img=o}save();render();URL.revokeObjectURL(u);ev.target.value=""};im.src=u});
document.getElementById("imp").addEventListener("change",ev=>{const r=new FileReader();r.onload=()=>{try{const s=r.result,o=JSON.parse(s.slice(s.indexOf("{"),s.lastIndexOf("}")+1));if(!o.players)throw 0;D=o;fix();save();location.hash="#/";render()}catch(x){alert("Súbor sa nepodarilo načítať.")}};if(ev.target.files[0])r.readAsText(ev.target.files[0])});
route();
