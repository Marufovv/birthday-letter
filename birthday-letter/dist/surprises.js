'use strict';
(() => {
const wishes=[
'May you always feel loved, exactly as you are.',
'May your smile find a thousand little reasons to stay.',
'May brave dreams lead you to beautiful places.',
'May good friends make every ordinary day feel special.',
'May your heart find peace in the little things.',
'May you be proud of the person you are becoming.',
'May kindness find you wherever you go.',
'May new adventures leave you with wonderful stories.',
'May you laugh until your cheeks hurt.',
'May your hard work bloom into something beautiful.',
'May you always have the courage to be yourself.',
'May every difficult day be followed by a gentler one.',
'May the people around you see how special you are.',
'May you make memories you will treasure for years.',
'May you give yourself the same kindness you give others.',
'May unexpected little joys brighten your days.',
'May your nineteenth year bring a little extra magic.',
'May your wishes grow bigger than your worries.',
'May this be the beginning of your happiest chapter yet.'
];
const root=document.querySelector('#balloons'),count=document.querySelector('#balloonCount'),list=document.querySelector('#wishList');let popped=new Set();
function updateWish(i){document.querySelector('#wishNumber').textContent=`WISH ${String(i+1).padStart(2,'0')} · JUST FOR YOU`;document.querySelector('#revealedWish').textContent=wishes[i];}
function reset(){popped.clear();root.replaceChildren();list.replaceChildren();count.textContent='0 of 19 wishes opened';document.querySelector('#wishNumber').textContent='YOUR FIRST WISH IS WAITING';document.querySelector('#revealedWish').textContent='Choose any balloon. There is no wrong place to begin.';document.querySelector('#allWishes').hidden=true;document.querySelector('#wishCollection').open=false;
wishes.forEach((wish,i)=>{const b=document.createElement('button');b.type='button';b.className='balloon';b.setAttribute('aria-label',`Pop balloon ${i+1}`);b.style.setProperty('--delay',`${-i*.37}s`);b.style.setProperty('--balloon-color',['#d59c79','#b96f87','#a997cb'][i%3]);b.style.setProperty('--fill',['#a85c3126','#a83f6426','#65589a26'][i%3]);const shape=document.createElement('span');shape.className='balloon-body';shape.textContent=String(i+1).padStart(2,'0');b.append(shape);b.onclick=()=>{updateWish(i);if(popped.has(i))return;popped.add(i);b.classList.add('popped','pop-now');b.setAttribute('aria-label',`Read wish ${i+1} again`);shape.textContent='✦';setTimeout(()=>b.classList.remove('pop-now'),700);count.textContent=`${popped.size} of 19 wishes opened`;const li=document.createElement('li');li.value=i+1;li.textContent=wish;list.append(li);document.querySelector('#allWishes').hidden=popped.size!==19;};root.append(b);});}
reset();document.querySelector('#resetBalloons').onclick=reset;
const c=document.querySelector('#nameStars'),g=c.getContext('2d'),mask=document.createElement('canvas');mask.width=820;mask.height=150;const m=mask.getContext('2d');m.font='bold 102px Georgia';m.textAlign='center';m.textBaseline='middle';m.fillStyle='#fff';m.fillText('Muharramxon',410,76,780);const pixels=m.getImageData(0,0,820,150).data;const dots=[];let seed=19;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let y=0;y<150;y+=4)for(let x=0;x<820;x+=4)if(pixels[(y*820+x)*4+3]>130)dots.push({x,y,sx:rand()*1000-90,sy:rand()*370-110,phase:rand()*6.28});
let active=false,start=null,frame=null;const motion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function paint(ts){if(!active){frame=null;return;}if(start===null)start=ts;const age=(ts-start)/1000,t=motion?1:Math.min(1,age/4.5),e=t*t*(3-2*t);const w=c.clientWidth,h=c.clientHeight,d=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);const s=Math.min(w/880,h/210);g.translate(w/2-410*s,h/2-75*s);g.scale(s,s);g.shadowColor='#ffd6ad';g.shadowBlur=5;for(const p of dots){const x=p.sx+(p.x-p.sx)*e,y=p.sy+(p.y-p.sy)*e;g.fillStyle=`rgba(255,${Math.round(185+50*Math.sin(p.phase))},177,${motion?.9:.7+.3*Math.sin(age*2+p.phase)})`;g.fillRect(x,y,2.3,2.3);}g.shadowBlur=0;c.dataset.stage=t===1?'name':'gathering';if(!motion&&t<1)frame=requestAnimationFrame(paint);else{frame=null;active=false;}}
const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&start===null){active=true;frame=requestAnimationFrame(paint);}},{threshold:.2});observer.observe(c);
document.querySelector('#replayStars').onclick=()=>{if(frame)cancelAnimationFrame(frame);start=null;active=true;frame=requestAnimationFrame(paint);};addEventListener('resize',()=>{if(start!==null&&!active){active=true;frame=requestAnimationFrame(paint);}});
})();
