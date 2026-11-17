// The title's living window: chamber one, turning itself forever.
import { createRun, applyAction, loadChamber } from './sim.js';
import { CHAMBERS } from './chambers.js';
export function createDemo(seed=1){const s=createRun(seed,'turning');s._demoTick=0;s._demoIndex=0;return s;}
const plan=CHAMBERS[0].solution;
export function demoStep(demo){demo._demoTick++;if(demo.mode!=='play'||demo.chamberIdx!==0)loadChamber(demo,0);if(demo._demoTick%45===0){applyAction(demo,plan[demo._demoIndex%plan.length]);demo._demoIndex++;if(demo.mode!=='play'||demo.chamberIdx!==0){loadChamber(demo,0);demo._demoIndex=0;}}return demo;}
