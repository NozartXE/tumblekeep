// Dust, streaks and floating words: the vault's applause.
import { FEATS } from '../config.js';
import { boardPoint } from './vault.js';

export function createStage(){return{angle:0,entityPos:new Map(),particles:[],floaters:[],shake:0,flash:0};}
export function spawnDust(stage, x, y, n=8, tint='#cbb98e') { const rand=rng(stage); for(let i=0;i<n;i++){const a=rand()*Math.PI*2,s=0.7+rand()*2.4; push(stage,{x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-0.8,life:18+rand()*22,max:40,size:1.5+rand()*3,color:tint});} }
export function spawnStreak(stage,x,y,vx,vy){push(stage,{x,y,vx:vx*-.32,vy:vy*-.32,life:9,max:9,size:2,color:'rgba(211,235,222,.48)',streak:true});}
export function spawnFloater(stage,x,y,text,color='#f2dcaa'){stage.floaters.push({x,y,text,color,life:70});}
function push(s,p){s.particles.push(p);if(s.particles.length>400)s.particles.splice(0,s.particles.length-400);}
function rng(s){s._fxSeed=(s._fxSeed||0)+1;let a=(0x6d2b79f5+s._fxSeed*0x9e3779b9)>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function drainEvents(stage,state){const ev=state.events||[];while(ev.length){const e=ev.shift();const p=(c,r)=>boardPoint(state,c,r);const hero=state.entities.find(x=>x.id===state.heroId);const idol=state.entities.find(x=>x.kind==='idol');const door=state.tiles.flatMap((row,r)=>row.map((t,c)=>t===5?{c,r}:null)).find(Boolean)||{c:7,r:1};let q;
 if(e.type==='seated'){q=p(e.c??0,e.r??0);spawnFloater(stage,q.x,q.y,'+300 SEATED','#f4cb57');spawnDust(stage,q.x,q.y,18,'#e9bd48');}
 else if(e.type==='door-open'){if(idol){q=p(idol.c,idol.r);spawnFloater(stage,q.x,q.y,'+300 SEATED','#f4cb57');}for(const orb of state.entities.filter(x=>(x.kind==='orb'||x.kind==='ember')&&x.seated)){q=p(orb.c,orb.r);spawnFloater(stage,q.x,q.y,'+300 LIT','#ffad4c');}q=p(door.c,door.r);spawnFloater(stage,q.x,q.y,'DOOR OPEN','#f5e4bf');spawnDust(stage,q.x,q.y,30,'#eac35a');}
 else if(e.type==='switch-latched'||e.type==='pressed'){q=p(door.c,door.r);spawnFloater(stage,q.x,q.y,'LATCHED!','#e4bf67');}
 else if(e.type==='crate-lost'){if(Number.isFinite(e.c)&&Number.isFinite(e.r)){q=p(e.c,e.r);spawnDust(stage,q.x,q.y,20,'#99958b');}}
 else if(e.type==='shattered'){q=p(e.c??0,e.r??0);spawnDust(stage,q.x,q.y,25,'#d48655');spawnFloater(stage,q.x,q.y,'SHATTERED','#d99070');}
 else if(e.type==='spike-hero'){if(hero)q=p(hero.c,hero.r);else q=p(e.c??0,e.r??0);spawnFloater(stage,q.x,q.y,'-1 HEART','#ff6262');stage.flash=8;}
 else if(e.type==='spike-crushed'){if(idol){q=p(idol.c,idol.r);spawnDust(stage,q.x,q.y,20,'#c7a56a');}}
 else if(e.type==='boon'){q={x:640,y:180};spawnFloater(stage,q.x,q.y,`BOON: ${e.name||e.id||''}`,'#70d5c5');}
 else if(e.type==='feat'){const f=FEATS.find(x=>x.id===e.id);q={x:640,y:180};spawnFloater(stage,q.x,q.y,`FEAT: ${f?.name||e.id||''}`,'#e8ce79');}
 }}
export function updateFx(stage){for(const p of stage.particles){p.x+=p.vx;p.y+=p.vy;p.vy+=0.035;p.vx*=.985;p.life--;}stage.particles=stage.particles.filter(p=>p.life>0);for(const f of stage.floaters){f.y-=.7;f.life--;}stage.floaters=stage.floaters.filter(f=>f.life>0);if(stage.flash>0)stage.flash--;if(stage.shake>0)stage.shake*=.82;}
export function drawFx(ctx,stage){for(const p of stage.particles){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;if(p.streak){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*5,p.y-p.vy*5);ctx.lineWidth=p.size;ctx.strokeStyle=p.color;ctx.stroke();}else{ctx.beginPath();ctx.arc(p.x,p.y,p.size*Math.max(.1,p.life/p.max),0,Math.PI*2);ctx.fill();}}ctx.globalAlpha=1;for(const f of stage.floaters){ctx.globalAlpha=Math.min(1,f.life/12);ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(18,31,31,.85)';ctx.strokeText(f.text,f.x,f.y);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y);}ctx.globalAlpha=1;}
