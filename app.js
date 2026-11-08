'use strict';
const $=s=>document.querySelector(s);
const defaults={name:'Muharramxon',wish:'Happy 19th birthday to a truly wonderful soul.\nMay this new chapter bring you gentle days, brave dreams, and people who make you feel loved. May your smile stay bright, your heart stay hopeful, and every little wish find its way to you.\nYou deserve a beautiful year, and so much happiness.',sender:'From someone taking steps toward better habits'};
let data={...defaults};
try{const saved=JSON.parse(localStorage.getItem('muharramxon-letter-v2')||'null');if(saved)data={...data,...saved};const params=new URLSearchParams(location.hash.slice(1));for(const key of Object.keys(defaults))if(params.has(key))data[key]=params.get(key).slice(0,key==='wish'?500:90);}catch{}
if(data.sender==='From: The person who was bad to everyone')data.sender=defaults.sender;
function renderText(){$('#heading').textContent=`Happy Birthday, ${data.name}!`;$('#message').textContent=data.wish;$('#signature').textContent=data.sender;}
renderText();
$('#edit').onclick=()=>{for(const [id,key] of [['name','name'],['wish','wish'],['sender','sender']])$('#'+id).value=data[key];$('#editor').showModal();};
$('#cancel').onclick=()=>$('#editor').close();$('#form').onsubmit=e=>{e.preventDefault();data={name:$('#name').value.trim()||defaults.name,wish:$('#wish').value.trim()||defaults.wish,sender:$('#sender').value.trim()||defaults.sender};try{localStorage.setItem('muharramxon-letter-v2',JSON.stringify(data));}catch{}renderText();$('#editor').close();};
$('#share').onclick=async()=>{const url=new URL(location.href);url.hash=new URLSearchParams(data).toString();try{await navigator.clipboard.writeText(url.href);$('#share').textContent='Link copied ✓';}catch{location.hash=url.hash;$('#share').textContent='Copy the address bar link';}setTimeout(()=>$('#share').textContent='Copy greeting link',3000);};
const canvas=$('#art'),ctx=canvas.getContext('2d');let width,height,ratio,scale,cx,cy;
function resize(){width=$('#scene').clientWidth;height=$('#scene').clientHeight;ratio=Math.min(devicePixelRatio||1,2);canvas.width=width*ratio;canvas.height=height*ratio;scale=Math.min(width/510,height/950,1.02);cx=width/2;cy=height*.43;}
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
let elapsed=0,last=0,paused=false,opened=false;let ambient=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function ease(t){return t*t*(3-2*t);}function clamp(t){return Math.max(0,Math.min(1,t));}
function draw(ms){requestAnimationFrame(draw);if(!last)last=ms;const dt=Math.min((ms-last)/1000,.05);last=ms;if(!paused){ambient+=dt;if(opened)elapsed+=dt;}const time=opened?(reduced?12:Math.max(0,elapsed-1.5)):0;
ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.translate(cx,cy);ctx.scale(scale,scale);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='8px monospace';
if(!opened||elapsed<1.5){drawGift(opened?elapsed/1.5:0,ambient);return;}
const build=ease(clamp(time/2.4));const morph=ease(clamp((time-3.4)/3.1));
// The initial amber field forms a rectangular letter with a folded diagonal.
points.forEach((p,i)=>{const cols=57,ex=(i%cols-28)*5.6,ey=(Math.floor(i/cols)-12)*6+18;const tx=ex+(p.x-ex)*morph,ty=ey+(p.y-ey)*morph;const b=ease(clamp((build-p.delay*.3)/.7));const x=p.originX+(tx-p.originX)*b,y=p.originY+(ty-p.originY)*b;const shimmer=.76+.24*Math.sin(time*2+p.phase);const fold=Math.abs(ey-(65-Math.abs(ex)*.55))<8?.35:1;const a=b*(.6*(1-morph)*fold+p.brightness*morph)*shimmer*1.45;const r=200+(p.color[0]-200)*morph,g=139+(p.color[1]-139)*morph,bl=85+(p.color[2]-85)*morph;ctx.fillStyle=`rgba(${r},${g},${bl},${a})`;ctx.shadowColor=`rgba(${r},${g},${bl},.4)`;ctx.shadowBlur=3*morph;ctx.fillText(p.char,x,y);});ctx.shadowBlur=0;
// Quiet sparks and long electric-blue trails behind the bloom.
for(const star of stars){let v=reduced?0:time;const alpha=(.2+.8*Math.max(0,Math.sin(v*1.4+star.p)))*.48*build;ctx.fillStyle=`rgba(161,181,178,${alpha})`;ctx.fillText(star.s>.9?'+':'.',star.x,star.y-Math.sin(v*.3+star.p)*10);}
if(morph>0){ctx.font='6px monospace';for(let j=0;j<14;j++){const y=-175+j*8;const span=65+Math.sin(j*2.1)*40;for(let x=-span;x<span;x+=7){const alpha=(.11+.1*Math.sin(time*2+j+x*.025))*morph;ctx.fillStyle=`rgba(85,119,232,${alpha})`;ctx.fillText('·',x+Math.sin(j)*45,y);}}}
$('#art').dataset.stage=time<3.4?'letter':time<6.5?'blooming':'rose';$('#art').dataset.particles=points.length;
$('.greeting').classList.toggle('show',time>7.2);$('#scene').classList.toggle('bloomed',time>7.2);$('#surprises').hidden=!(time>7.2);$('#discover').hidden=!(time>7.2);
}

function drawGift(progress,t){
  const lift=ease(clamp(progress));const glow=reduced?1:.83+.17*Math.sin(t*2);
  ctx.save();ctx.globalAlpha=1-lift;ctx.shadowColor='#da9674';ctx.shadowBlur=6;ctx.font='9px monospace';
  for(let y=-55;y<=90;y+=6)for(let x=-105;x<=105;x+=5){const edge=Math.abs(x)>98||y<-49||y>84,ribbon=Math.abs(x)<13;ctx.fillStyle=edge?'#dfa58b':ribbon?'#f0b996':`rgba(170,100,73,${.24*glow})`;ctx.fillText(edge||ribbon?'*':'.',x,y);}
  ctx.save();ctx.translate(0,-lift*160);ctx.rotate(-lift*.22);
  for(let y=-77;y<=-56;y+=6)for(let x=-116;x<=116;x+=5){ctx.fillStyle=Math.abs(x)<13?'#f6c2a2':'#ce9376';ctx.fillText('+',x,y);}
  for(let side of [-1,1])for(let a=0;a<Math.PI*2;a+=.12){ctx.fillStyle='#efb695';ctx.fillText('*',side*(31+29*Math.cos(a)),-100+19*Math.sin(a));}
  ctx.restore();ctx.restore();$('#art').dataset.stage=opened?'opening':'gift';
}
const photoCaptions=['LITTLE JOYS','YOUR BEAUTIFUL SMILE','TOGETHER','GOLDEN MOMENTS','WARM MEMORIES','DAYS TO REMEMBER','BEST DAY','UNFORGETTABLE DAYS'];
for (let i = 0; i < 8; i++) {
  const fig = document.createElement('figure');
  fig.className = 'photo';
  // Massivga yana 2 ta raqam qo'shildi (jami 8 ta bo'ldi)
  fig.style.setProperty('--left', `${[5, 76, 17, 66, 1, 83, 35, 55][i]}%`);
  fig.style.setProperty('--delay', `${-i * 6.8 - 4}s`);
  fig.style.setProperty('--tilt', `${[-8, 7, 5, -6, -4, 8, 4, -3][i]}deg`);
  
  const img = document.createElement('img');
  img.src = `photos/0${i + 1}.jpg`;
  img.alt = `Birthday memory ${i + 1}: friends sharing a happy moment`;
  img.decoding = 'async';
  
  const cap = document.createElement('figcaption');
  cap.textContent = photoCaptions[i]; // photoCaptions massivida ham 8 ta matn borligiga e'tibor bering!
  
  fig.append(img, cap);
  $('#memories').append(fig);
}for(let i=0;i<16;i++){const e=document.createElement('span');e.className='emoji';e.textContent=['✨','💖','🌷','🦋','🎂','💕','🌸','⭐'][i%8];e.style.setProperty('--left',`${8+(i*29)%85}%`);e.style.setProperty('--size',`${16+i%4*4}px`);e.style.setProperty('--delay',`${-i*1.5}s`);$('#emojis').append(e);}
const birth=new Date('2007-11-09T00:00:00+05:00').getTime();
function updateClock(){let n=Math.max(0,Math.floor((Date.now()-birth)/1000));$('#days').textContent=Math.floor(n/86400).toLocaleString('en-US');for(const [id,value] of [['hours',Math.floor(n/3600)%24],['minutes',Math.floor(n/60)%60],['seconds',n%60]])$('#'+id).textContent=String(value).padStart(2,'0');}
updateClock();setInterval(updateClock,1000);
const soundtrack=$('#soundtrack');soundtrack.volume=.55;let musicMuted=false;
function musicState(){$('#music').textContent=soundtrack.paused?'♫ Sound on':'♫ Sound off';$('#music').setAttribute('aria-label',soundtrack.paused?'Play background music':'Mute background music');}
async function startMusic(){if(musicMuted)return;try{await soundtrack.play();}catch{}musicState();}
function stopMusic(){soundtrack.pause();musicState();}
$('#music').onclick=()=>{if(soundtrack.paused){musicMuted=false;startMusic();}else{musicMuted=true;stopMusic();}};
soundtrack.addEventListener('play',musicState);soundtrack.addEventListener('pause',musicState);
soundtrack.addEventListener('error',()=>{$('#music').textContent='Music unavailable';});
startMusic();document.addEventListener('pointerdown',()=>{if(soundtrack.paused&&!musicMuted)startMusic();},{once:true});document.addEventListener('keydown',()=>{if(soundtrack.paused&&!musicMuted)startMusic();},{once:true});
$('#openGift').onclick=()=>{opened=true;elapsed=0;paused=false;$('#scene').classList.add('opened');$('#scene').classList.remove('paused');$('#openGift').disabled=true;$('#pause').focus();startMusic();};
$('#replay').onclick=()=>{elapsed=0;opened=false;paused=false;$('#pause').textContent='Ⅱ Pause';$('.greeting').classList.remove('show');$('#scene').classList.remove('bloomed','opened','paused');$('#openGift').disabled=false;$('#openGift').focus();$('#surprises').hidden=true;$('#discover').hidden=true;};
$('#pause').onclick=()=>{paused=!paused;$('#scene').classList.toggle('paused',paused);$('#pause').textContent=paused?'▷ Play':'Ⅱ Pause';};
requestAnimationFrame(draw);
@media (max-width: 768px) {
  .photo {
    /* Mobil ekranda rasmlar bir-biriga ustma-ust chiqib qolmasligi uchun positionni to'g'rilaymiz */
    position: relative !important;
    left: auto !important;
    margin: 15px auto;
    width: 80%;
    max-width: 300px;
    transform: none !important; /* Qiyshayishini olib tashlab, tekis turishini ta'minlaymiz */
  }
};
