// Tumblekeep: wires the vault, the keeper and the screens together.
import { createRun, applyAction, stepTick, resetChamber, startEndless } from './sim.js';
import { createStage, drainEvents, updateFx, drawFx } from './render/fx.js';
import { drawRoomBackdrop, drawBoard } from './render/vault.js';
import { drawThings } from './render/things.js';
import { drawHUD } from './render/hud.js';
import { drawTitle, drawDraft, drawResults } from './render/screens.js';
import { createDemo, demoStep } from './titledemo.js';
import { attachInput } from './input.js';
import { createAudio } from './audio.js';
import { loadSave, recordRun, persistSave } from './save.js';
import { pickBoon, rerollDraft } from './draft.js';
import { DIFFICULTIES } from './config.js';
import { initTesthook } from './testhook.js';

const canvas=document.getElementById('board'),ctx=canvas?.getContext('2d');
if(canvas&&ctx){
 const SHOT=new URLSearchParams(location.search).has('shot');
 const stage=createStage(),save=loadSave(),audio=createAudio();let diff=localStorage.getItem('tumblekeep-difficulty')||'turning';if(!DIFFICULTIES[diff])diff='turning';
 const seed=1000+save.history.length*77+(save.best%997),state=createRun(seed,diff);state.mode='title';state.best=save.best;state.feats=save.feats||{};state.endless=!!save.won;
 const demo=createDemo(2077),demoStage=createStage();let lastEvents=new Set(),recorded=false,paused=false;
 const byId=id=>document.getElementById(id),hide=id=>byId(id)?.classList.add('hidden'),show=id=>byId(id)?.classList.remove('hidden');
 function overlays(){const sub=['howto-screen','options-screen','guide-screen'].some(id=>byId(id)?.classList.contains('open'));if(SHOT){['title-screen','howto-screen','options-screen','guide-screen','pause-screen'].forEach(hide);return;}['title-screen','howto-screen','options-screen','guide-screen','pause-screen'].forEach(hide);if(state.mode==='title'&&!sub)show('title-screen');if(state.mode==='pause')show('pause-screen');}
 function setMode(m){state.mode=m;overlays();}
 function newRun(){const s=createRun(1000+save.history.length*77+(save.best%997),diff);Object.assign(state,s);recorded=false;paused=false;audio.start();overlays('play');}
 function panel(which){const el=byId(`${which}-screen`);if(!el)return;const title=el.querySelector('h2'),body=el.querySelector('.panel-body');if(title)title.textContent=which==='howto'?'HOW TO PLAY':which==='options'?'OPTIONS':'VAULT GUIDE';if(body)body.innerHTML=which==='howto'?'<h3>Turn the vault</h3><p>Q/E rotates the room. Gravity carries Nilo and every loose object. Seat the Idol, light the braziers, latch switches and reach the open door.</p><p>Arrows or A/D walk along the floor. Up, W or Space hops. R resets the chamber.</p>':which==='options'?`<h3>Audio</h3><p>Audio is ${audio.enabled?'on':'off'}.</p><button id="audio-toggle">TOGGLE AUDIO</button>`:'<h3>The wings</h3><p>DAWN chambers 1-4 · NOON chambers 5-8 · DUSK chambers 9-12. Draft a boon after each of the first two wings.</p>';el.classList.add('open');show(`${which}-screen`);overlays();el.querySelector('.back-button')?.addEventListener('click',()=>{el.classList.remove('open');overlays();},{once:true});byId('audio-toggle')?.addEventListener('click',()=>{audio.setEnabled(!audio.enabled);panel('options');});}
 const title=byId('title-screen');if(title)title.style.background='transparent';
 byId('wordmark')&&(byId('wordmark').textContent='TUMBLEKEEP');byId('rule-scope')&&(byId('rule-scope').textContent='12 CHAMBERS · 5 LOOSE RELICS · 9 BOONS · 3 DIFFICULTIES · ENDLESS EVERDEEP');byId('title-best')&&(byId('title-best').textContent=String(save.best));byId('feats-count')&&(byId('feats-count').textContent=`${Object.values(save.feats||{}).filter(Boolean).length}/6`);
 const ruleRows=['TURN: Q/E rotates the whole vault 90 degrees','WIN: seat the Idol, light the braziers, walk out','LOSE: spikes cost a heart - lose them all, run ends','SWITCHES: weight latches the door open for good','SLOPES: orbs roll - momentum carries them','DRAFT: a boon after the DAWN and NOON wings'];const rules=byId('title-rules');if(rules){rules.replaceChildren();for(const line of ruleRows){const row=document.createElement('div');row.className='rules-row';const icon=document.createElement('span');icon.className='rules-icon';icon.textContent=line.split(':')[0][0];const body=document.createElement('span');body.textContent=line;row.append(icon,body);rules.append(row);}}
 byId('start-hint')&&(byId('start-hint').textContent='ENTER TO BEGIN YOUR RUN');byId('everdeep-line')&&(byId('everdeep-line').textContent=save.won?'V - EVERDEEP ENDLESS':'');byId('keycaps')&&(byId('keycaps').innerHTML='<span>ARROWS MOVE</span><span>Q / E TURN</span><span>H HOW TO PLAY</span><span>O OPTIONS</span><span>G VAULT GUIDE</span>');
 const picker=byId('difficulty-picker');if(picker){picker.replaceChildren();for(const [key,d] of Object.entries(DIFFICULTIES)){const b=document.createElement('button');b.textContent=d.name;b.className=key===diff?'selected':'';b.setAttribute('aria-pressed',String(key===diff));b.addEventListener('click',()=>{diff=key;localStorage.setItem('tumblekeep-difficulty',diff);[...picker.children].forEach(x=>{const active=x===b;x.classList.toggle('selected',active);x.setAttribute('aria-pressed',String(active));});});picker.append(b);}}
 byId('play-button')?.addEventListener('click',newRun);byId('howto-button')?.addEventListener('click',()=>panel('howto'));byId('options-button')?.addEventListener('click',()=>panel('options'));byId('guide-button')?.addEventListener('click',()=>panel('guide'));
 byId('resume-button')?.addEventListener('click',()=>{paused=false;setMode('play');});
 const key= k=>{if(k==='mute'){audio.setEnabled(!audio.enabled);return;}if(k==='howto'||k==='options'||k==='guide'){if(state.mode==='title')panel(k);return;}if(k==='pause'){if(state.mode==='play'){paused=!paused;state.mode=paused?'pause':'play';if(paused){ctx.fillStyle='rgba(0,0,0,.68)';ctx.fillRect(0,0,1280,800);ctx.fillStyle='#f3e6c3';ctx.font='bold 36px sans-serif';ctx.textAlign='center';ctx.fillText('PAUSED - ENTER OR ESC TO RESUME',640,400);ctx.textAlign='left';}}return;}if(k==='confirm'){if(state.mode==='title')newRun();else if(state.mode==='pause'){paused=false;state.mode='play';}else if(state.mode==='results'){setMode('title');}return;}if(state.mode==='title'&&k==='everdeep'&&save.won){startEndless(state);overlays('play');return;}if(state.mode==='play'){if(k==='reset')resetChamber(state);return;}if(state.mode==='draft'){if(k==='reset'){rerollDraft(state);return;}if(k.startsWith('pick')){const i=Number(k.slice(4))-1;if(pickBoon(state,i)){const id=state.boons.at(-1);audio.lit();}}return;}if(state.mode==='results'){if(k==='reset'){newRun();return;}}};
 attachInput(canvas,{action:a=>{audio.start();if(state.mode==='play'&&!paused){if(a.t==='R'||a.t==='L')audio.turn();applyAction(state,a);}},key});
 for(const b of document.querySelectorAll('.back-button'))b.addEventListener('click',()=>overlays('title'));
 function sounds(){for(const e of state.events||[]){const k=e.type;if(k==='seated')audio.seat();else if(k==='door-open')audio.clear();else if(k==='switch-latched'||k==='pressed')audio.latch();else if(k==='spike-hero')audio.hurt();else if(k==='boon')audio.lit();}}
 function frame(){requestAnimationFrame(frame);overlays();if(state.mode==='title'){demoStep(demo);stepTick(demo);}
  else if(state.mode==='play'&&!paused){stepTick(state);}
  if(state.mode==='results'&&!recorded){recorded=true;if(!SHOT){state.previousBest=save.best||0;recordRun(save,state);save.won=!!state.won;persistSave(save);}}
  sounds();if(state.mode==='title'){drawTitle(ctx,{...state,best:save.best,feats:save.feats,endless:save.won},demo,demoStage);}
  else if(state.mode==='results'){drawResults(ctx,state,save);}
  else{drawRoomBackdrop(ctx,state);drawBoard(ctx,state,stage);drawThings(ctx,state,stage);drainEvents(stage,state);updateFx(stage);drawFx(ctx,stage);drawHUD(ctx,state,{...stage,best:save.best});if(state.mode==='draft')drawDraft(ctx,state);}
 }
 window.__TK={state,stage,save};initTesthook();overlays();requestAnimationFrame(frame);
}
