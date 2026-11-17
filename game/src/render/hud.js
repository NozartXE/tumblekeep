// The keeper's instruments: score, hearts, goals and the turning track, around the room.
import { CHAMBERS } from '../chambers.js';
import { BOONS } from '../config.js';
import { evaluateGoals } from '../goals.js';
import { gravVec } from '../turning.js';
import { TILES } from '../config.js';

const card=(c,x,y,w,h,title)=>{c.fillStyle='rgba(9,35,33,.94)';c.fillRect(x,y,w,h);c.strokeStyle='#9d7840';c.lineWidth=1;c.strokeRect(x,y,w,h);c.fillStyle='#d5b45f';c.font='bold 12px sans-serif';c.fillText(title,x+10,y+16);};
const text=(c,s,x,y,size=14,color='#eee0bf',font='bold')=>{c.fillStyle=color;c.font=`${font} ${size}px sans-serif`;c.fillText(s,x,y);};
export function drawHUD(ctx,state,stage){
 const name=state.chamber?.name||'THE TUMBLING VAULT',wing=state.chamber?.wing||'EVERDEEP';
 ctx.fillStyle='#102827';ctx.fillRect(0,0,1280,88);text(ctx,`CHAMBER ${String((state.chamberIdx||0)+1).padStart(2,'0')} - ${name}`,640,32,21,'#f2dfb5');ctx.textAlign='right';text(ctx,wing,1258,31,14,'#d5b45f');ctx.textAlign='left';ctx.strokeStyle='#b38b47';ctx.beginPath();ctx.moveTo(16,74);ctx.lineTo(1264,74);ctx.stroke();
 card(ctx,16,96,256,102,'SCORE');text(ctx,String(state.score||0),28,151,30);text(ctx,`BEST ${stage?.best??state.best??0}`,29,179,13,'#d5b45f');
 card(ctx,16,205,256,62,'STEADY');if((state.chain||0)>=2){text(ctx,`STEADY x${state.chain}`,28,239,16);text(ctx,`BEST CHAIN ${state.bestChain||0}`,28,257,11,'#c6b37f');}else text(ctx,`BEST CHAIN ${state.bestChain||0}`,28,246,14);
 card(ctx,16,274,256,50,'HEARTS');for(let i=0;i<4;i++){ctx.font='24px sans-serif';ctx.fillStyle=i<(state.hearts||0)?'#d94d49':'#65716b';ctx.fillText('♥',29+i*34,312);}
 card(ctx,16,331,256,52,'TURNS');text(ctx,`${state.turnsUsed||0} / PAR ${state.chamber?.par||0}`,28,365,17);
 card(ctx,16,390,256,89,'CHAMBER TRACK');for(let i=0;i<12;i++){const x=32+(i%4)*54,y=416+Math.floor(i/4)*18,done=i<(state.stats?.chambersCleared||0),cur=i===(state.chamberIdx||0);ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=done?'#d7b65b':cur?`rgba(245,229,189,${.55+.45*Math.sin((state.tick||0)*.08)})`:'#52605a';ctx.fill();}
 const goals=evaluateGoals(state), live=[];
 if(goals.idolSeated!==null)live.push([goals.idolSeated?'IDOL SEATED':'IDOL LOOSE',goals.idolSeated]);
 if(goals.braziersTotal)live.push([goals.braziersLit?'BRAZIER LIT':'BRAZIER DARK',goals.braziersLit]);
 if(goals.switchesTotal){const [dc,dr]=gravVec(state);let pressed=0;for(let r=0;r<(state.tiles||[]).length;r++)for(let c=0;c<(state.tiles[r]||[]).length;c++)if(state.tiles[r][c]===TILES.SWITCH&&state.entities.some(e=>e.c+dc===c&&e.r+dr===r))pressed++;live.push([state.switchLatch?'DOOR LATCHED':`SWITCHES ${pressed}/${goals.switchesTotal}`,state.switchLatch||pressed===goals.switchesTotal]);}
 live.push([state.doorOpen?'DOOR OPEN':'DOOR SHUT',state.doorOpen]);
 const oh=112+Math.max(1,live.length)*22;card(ctx,16,486,256,oh,'OBJECTIVES');live.forEach((a,i)=>text(ctx,a[0],28,520+i*22,12,a[1]?'#e3bf5e':'#9a9c8b'));
 const owned=(state.boons||[]).map(id=>BOONS.find(b=>b.id===id)).filter(Boolean);const by=486+oh+7;card(ctx,16,by,256,owned.length?53:38,'BOONS');owned.slice(0,7).forEach((b,i)=>{const x=34+i*34;ctx.beginPath();ctx.arc(x,by+37,11,0,Math.PI*2);ctx.fillStyle='#a77f3b';ctx.fill();text(ctx,b.name[0],x,by+41,12,'#fff0c9');});
 ctx.fillStyle='#132f2d';ctx.fillRect(0,744,1280,56);ctx.strokeStyle='#9d7840';ctx.beginPath();ctx.moveTo(16,744);ctx.lineTo(1264,744);ctx.stroke();const last=state.log?.at(-1)||'';text(ctx,last.slice(0,70),20,778,13,'#d7c9a8','normal');ctx.textAlign='right';text(ctx,'ARROWS MOVE - Q/E TURN - R RESET - ESC PAUSE',1260,778,12,'#d7c9a8');ctx.textAlign='left';
 if(state.banner==='win'||state.banner==='lose'){ctx.fillStyle=state.banner==='win'?'rgba(244,224,177,.96)':'rgba(88,24,26,.96)';ctx.fillRect(360,350,560,104);ctx.strokeStyle='#c49a50';ctx.strokeRect(360,350,560,104);ctx.textAlign='center';text(ctx,state.banner==='win'?'CHAMBER CLEAR':'THE VAULT RESETS',640,393,28,state.banner==='win'?'#173b35':'#fff0dc');text(ctx,state.banner==='win'?`+${state.lastClearScore||0}`:'-1 HEART',640,430,18,state.banner==='win'?'#916b22':'#ffc4b2');ctx.textAlign='left';}
}
