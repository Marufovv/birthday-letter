'use strict';
const $=s=>document.querySelector(s);
const defaults={name:'[Name]',wish:'May your day be as beautiful as a rose,\nand your year full of love and little wonders.',sender:'With love, [Your name]'};
let data={...defaults};
try{const saved=JSON.parse(localStorage.getItem('birthday-letter')||'null');if(saved)data={...data,...saved};const params=new URLSearchParams(location.hash.slice(1));for(const key of Object.keys(defaults))if(params.has(key))data[key]=params.get(key).slice(0,key==='wish'?240:45);}catch{}
function renderText(){$('#heading').textContent=`Happy Birthday, ${data.name}!`;$('#message').textContent=data.wish;$('#signature').textContent=data.sender;}
renderText();
$('#edit').onclick=()=>{for(const [id,key] of [['name','name'],['wish','wish'],['sender','sender']])$('#'+id).value=data[key];$('#editor').showModal();};
$('#cancel').onclick=()=>$('#editor').close();$('#form').onsubmit=e=>{e.preventDefault();data={name:$('#name').value.trim()||defaults.name,wish:$('#wish').value.trim()||defaults.wish,sender:$('#sender').value.trim()||defaults.sender};try{localStorage.setItem('birthday-letter',JSON.stringify(data));}catch{}renderText();$('#editor').close();};
$('#share').onclick=async()=>{const url=new URL(location.href);url.hash=new URLSearchParams(data).toString();try{await navigator.clipboard.writeText(url.href);$('#share').textContent='Link copied ✓';}catch{location.hash=url.hash;$('#share').textContent='Copy the address bar link';}setTimeout(()=>$('#share').textContent='Copy greeting link',3000);};
const canvas=$('#art'),ctx=canvas.getContext('2d');let width,height,ratio,scale,cx,cy;
function resize(){width=innerWidth;height=innerHeight;ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;scale=Math.min(width/510,height/790,1.14);cx=width/2;cy=height*.40;}
addEventListener('resize',resize);resize();
let seed=73;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}const chars='.:;=+*xX#@%0127';const points=[];
function point(x,y,color,brightness=1){points.push({x,y,color,brightness,char:chars[Math.floor(random()*chars.length)],delay:random(),phase:random()*6.28,originX:(random()-.5)*650,originY:(random()-.5)*620});}
// Dense, irregular, layered character petals, sampled from a rose silhouette.
for(let y=-151;y<-17;y+=5.2)for(let x=-84;x<84;x+=4.5){const nx=x/77,ny=(y+87)/66,r=Math.hypot(nx,ny),a=Math.atan2(ny,nx);const edge=.88+.08*Math.sin(5*a)+.045*Math.cos(9*a);if(r<edge){const fold=Math.sin(19*r-4.1*a)+.5*Math.cos(12*nx+8*ny);if(random()>.13 && (fold>-.8||random()>.6)){const b=.35+.55*(fold+1.5)/3+.12*random();point(x,y,[237,77+random()*32,76+random()*25],Math.min(b,1));}}}
// Curved stem and the paired, pointed leaves.
for(let y=-20;y<183;y+=5){let x=4+Math.sin((y+20)/83)*9-(y+20)*.09;point(x,y,[111,166,126],.65);if(y%3<1.8)point(x+4,y,[94,138,109],.4);}
for(const leaf of [{x:2,y:67,s:-1},{x:0,y:117,s:1},{x:4,y:29,s:1}])for(let u=0;u<1;u+=.047){let lx=leaf.x+leaf.s*u*74,ly=leaf.y-u*48;let spread=Math.sin(Math.PI*u)*17;for(let v=-spread;v<spread;v+=5){if(random()>.17)point(lx,ly+v,[104+random()*30,160+random()*35,131],.4+random()*.4);}}
for(let i=0;i<150;i++){const y=-202+random()*150;const x=(random()-.5)*(220+(y+202)*.7);point(x,y,[80,113,207],.15+random()*.5);}
const stars=Array.from({length:95},()=>({x:(random()-.5)*430,y:(random()-.5)*440,p:random()*6.28,s:random()}));
let elapsed=0,last=0,paused=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function ease(t){return t*t*(3-2*t);}function clamp(t){return Math.max(0,Math.min(1,t));}
function draw(ms){requestAnimationFrame(draw);if(!last)last=ms;const dt=Math.min((ms-last)/1000,.05);last=ms;if(!paused)elapsed+=dt;const time=reduced?12:elapsed;
ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);ctx.translate(cx,cy);ctx.scale(scale,scale);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='8px monospace';
const build=ease(clamp(time/2.4));const morph=ease(clamp((time-3.4)/3.1));
// The initial amber field forms a rectangular letter with a folded diagonal.
points.forEach((p,i)=>{const cols=57,ex=(i%cols-28)*5.6,ey=(Math.floor(i/cols)-12)*6+18;const tx=ex+(p.x-ex)*morph,ty=ey+(p.y-ey)*morph;const b=ease(clamp((build-p.delay*.3)/.7));const x=p.originX+(tx-p.originX)*b,y=p.originY+(ty-p.originY)*b;const shimmer=.76+.24*Math.sin(time*2+p.phase);const fold=Math.abs(ey-(65-Math.abs(ex)*.55))<8?.35:1;const a=b*(.6*(1-morph)*fold+p.brightness*morph)*shimmer*1.45;const r=200+(p.color[0]-200)*morph,g=139+(p.color[1]-139)*morph,bl=85+(p.color[2]-85)*morph;ctx.fillStyle=`rgba(${r},${g},${bl},${a})`;ctx.shadowColor=`rgba(${r},${g},${bl},.4)`;ctx.shadowBlur=3*morph;ctx.fillText(p.char,x,y);});ctx.shadowBlur=0;
// Quiet sparks and long electric-blue trails behind the bloom.
for(const star of stars){let v=reduced?0:time;const alpha=(.2+.8*Math.max(0,Math.sin(v*1.4+star.p)))*.48*build;ctx.fillStyle=`rgba(161,181,178,${alpha})`;ctx.fillText(star.s>.9?'+':'.',star.x,star.y-Math.sin(v*.3+star.p)*10);}
if(morph>0){ctx.font='6px monospace';for(let j=0;j<14;j++){const y=-175+j*8;const span=65+Math.sin(j*2.1)*40;for(let x=-span;x<span;x+=7){const alpha=(.11+.1*Math.sin(time*2+j+x*.025))*morph;ctx.fillStyle=`rgba(85,119,232,${alpha})`;ctx.fillText('·',x+Math.sin(j)*45,y);}}}
$('#art').dataset.stage=time<3.4?'letter':time<6.5?'blooming':'rose';$('#art').dataset.particles=points.length;
$('.greeting').classList.toggle('show',time>7.2);
}
$('#replay').onclick=()=>{elapsed=0;paused=false;$('#pause').textContent='Ⅱ Pause';$('.greeting').classList.remove('show');};$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'▷ Play':'Ⅱ Pause';};
requestAnimationFrame(draw);
