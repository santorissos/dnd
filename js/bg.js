// Animované pozadie: iskry, runy a pomaly sa otáčajúce k20
(()=>{const c=document.getElementById('bg'),x=c.getContext('2d'),still=matchMedia('(prefers-reduced-motion: reduce)').matches,RU='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ',rn=(a,b)=>a+Math.random()*(b-a);
let W,H,E=[],U=[],D=[];
function size(){const r=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*r;c.height=H*r;x.setTransform(r,0,0,r,0,0)}
const mkE=f=>({x:rn(0,W),y:f?rn(0,H):H+10,v:rn(.25,.8),s:rn(1,2.8),p:rn(0,6.28),h:rn(25,48)});
const mkU=f=>({x:rn(0,W),y:f?rn(0,H):H+30,v:rn(.08,.25),g:RU[Math.random()*RU.length|0],s:rn(18,40),a:rn(.07,.2),p:rn(0,6.28)});
const mkD=()=>({x:rn(0,W),y:rn(0,H),r:rn(40,90),a:rn(0,6.28),w:rn(-.003,.003),dx:rn(-.12,.12),dy:rn(-.08,.08)});
function init(){size();const n=W<700?28:60;E=Array.from({length:n},()=>mkE(1));U=Array.from({length:W<700?7:14},()=>mkU(1));D=Array.from({length:W<700?2:4},mkD)}
function d20(o){x.save();x.translate(o.x,o.y);x.rotate(o.a);x.strokeStyle='rgba(167,123,255,.22)';x.lineWidth=2;const p=k=>[Math.cos(k*Math.PI/3-Math.PI/2)*o.r,Math.sin(k*Math.PI/3-Math.PI/2)*o.r];
x.beginPath();for(let k=0;k<6;k++){const[a,b]=p(k);k?x.lineTo(a,b):x.moveTo(a,b)}x.closePath();x.stroke();
x.beginPath();for(const k of[0,2,4]){const[a,b]=p(k);x.lineTo(a,b)}x.closePath();x.stroke();
x.beginPath();for(let k=0;k<6;k++){const[a,b]=p(k);x.moveTo(a,b);x.lineTo(a*.5,b*.5)}x.stroke();x.restore()}
let t=0;
function frame(){t+=.016;x.clearRect(0,0,W,H);
 D.forEach(o=>{if(!still){o.a+=o.w;o.x+=o.dx;o.y+=o.dy;if(o.x<-100||o.x>W+100)o.dx*=-1;if(o.y<-100||o.y>H+100)o.dy*=-1}d20(o)});
 x.textAlign='center';U.forEach((o,i)=>{if(!still){o.y-=o.v;if(o.y<-40)U[i]=mkU()}x.font=o.s+'px serif';x.fillStyle=`rgba(190,150,255,${o.a*(.6+.4*Math.sin(t+o.p))})`;x.fillText(o.g,o.x,o.y)});
 E.forEach((o,i)=>{if(!still){o.y-=o.v;o.x+=Math.sin(t*1.3+o.p)*.4;if(o.y<-10)E[i]=mkE()}const a=.35+.45*Math.sin(t*3+o.p);x.fillStyle=`hsla(${o.h},100%,62%,${Math.max(.1,a)})`;x.shadowColor=`hsl(${o.h},100%,55%)`;x.shadowBlur=10;x.beginPath();x.arc(o.x,o.y,o.s,0,6.28);x.fill()});
 x.shadowBlur=0;if(!still)requestAnimationFrame(frame)}
addEventListener('resize',()=>{size();if(still)frame()});init();frame()})();
