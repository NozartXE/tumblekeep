// The title's living window: EVERYTHING FALLS, held in its settled west cluster.
import { createRun, applyAction, loadChamber } from './sim.js';
export function createDemo(seed=1){const s=createRun(seed,'turning');loadChamber(s,10);applyAction(s,{t:'L'});applyAction(s,{t:'R'});s._demoTick=0;return s;}
export function demoStep(demo){demo._demoTick++;if(demo.mode!=='play'||demo.chamberIdx!==10){loadChamber(demo,10);applyAction(demo,{t:'L'});applyAction(demo,{t:'R'});}return demo;}
