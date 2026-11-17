// The vault speaks: one-line event log entries with a keeper's voice.
import { BOONS, FEATS } from './config.js';
export const featName=id=>FEATS.find(f=>f.id===id)?.name||id;
export const boonLine=id=>BOONS.find(b=>b.id===id)?.line||(id==='score'?'Gain 250 points.':'A vault boon.');
export function logLine(state){return state.log?.at(-1)||'';}
export function announce(state,kind,data={}){const n=state.chamberIdx+1, lines={clear:`Chamber ${n} clear - ${data.score??state.lastClearScore??state.score} points.`,seated:'The Idol sits. The vault hums.',lit:'A brazier wakes.',latch:'The door latches open - for good.',heart:'Spikes! Nilo loses a heart.',reset:'The chamber resets. The vault forgets.',boon:`Boon taken: ${data.name||data.id||'unknown'}.`,win:"THE HEART TURNS. The vault is Nilo's.",lose:'No hearts left. The vault keeps its keeper.'};const line=lines[kind];if(!line)return '';state.log ||= [];state.log.push(line);if(state.log.length>40)state.log.splice(0,state.log.length-40);return line;}
