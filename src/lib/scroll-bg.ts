// A small, scroll-linked paper treatment. No video, frames, network requests or perpetual animation loop.
// Full motion moves the margin rules by at most 24px. Calm leaves them still; Off and low-stim use plain paper.
import {motion} from './motion';
let wired=false,root:HTMLDivElement|null=null,queued=false;
function paint(){queued=false;if(!root)return;const html=document.documentElement;const blocked=motion()==='off'||html.dataset.lowstim==='on'||matchMedia('(prefers-reduced-motion: reduce)').matches;root.hidden=blocked;const range=Math.max(1,document.documentElement.scrollHeight-innerHeight);const progress=Math.min(1,Math.max(0,scrollY/range));root.style.setProperty('--paper-drift',`${motion()==='full'?progress*24:0}px`);}
function queue(){if(queued)return;queued=true;requestAnimationFrame(paint);}
export function wireScrollBackground(){if(wired)return;wired=true;const attach=()=>{if(!root){root=document.createElement('div');root.className='scroll-bg scroll-bg--paper';root.setAttribute('aria-hidden','true');}if(!root.isConnected)document.body.prepend(root);paint();};document.addEventListener('astro:page-load',attach);document.addEventListener('motionchange',paint);document.addEventListener('studysite:prefs',paint);addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});if(document.readyState!=='loading')attach();}
