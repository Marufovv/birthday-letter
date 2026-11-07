from pathlib import Path
p=Path('birthday-letter/dist/app.js')
s=p.read_text()
s=s.replace("const defaults={name:'[Name]',wish:'May your day be as beautiful as a rose,\\nand your year full of love and little wonders.',sender:'With love, [Your name]'};", "const defaults={name:'Muharramxon',wish:'Happy 19th birthday to a truly wonderful soul.\\nMay this new chapter bring you gentle days, brave dreams, and people who make you feel loved. May your smile stay bright, your heart stay hopeful, and every little wish find its way to you.\\nYou deserve a beautiful year, and so much happiness.',sender:'From: The person who was bad to everyone'};")
s=s.replace("'birthday-letter'","'muharramxon-letter-v2'").replace("key==='wish'?240:45", "key==='wish'?500:90")
s=s.replace("width=innerWidth;height=innerHeight", "width=$('#scene').clientWidth;height=$('#scene').clientHeight")
s=s.replace("scale=Math.min(width/510,height/790,1.14);cx=width/2;cy=height*.40;", "scale=Math.min(width/510,height/950,1.02);cx=width/2;cy=height*.43;")
s=s.replace("let elapsed=0,last=0,paused=false;", "let elapsed=0,last=0,paused=false,opened=false;let ambient=0;")
s=s.replace("if(!paused)elapsed+=dt;const time=reduced?12:elapsed;", "if(!paused){ambient+=dt;if(opened)elapsed+=dt;}const time=opened?(reduced?12:Math.max(0,elapsed-1.5)):0;")
s=s.replace("ctx.fillStyle='#000';ctx.fillRect(0,0,width,height);", "ctx.clearRect(0,0,width,height);")
s=s.replace("const build=ease(clamp(time/2.4));", "if(!opened||elapsed<1.5){drawGift(opened?elapsed/1.5:0,ambient);return;}\nconst build=ease(clamp(time/2.4));")
s=s.replace("$('.greeting').classList.toggle('show',time>7.2);", "$('.greeting').classList.toggle('show',time>7.2);$('#scene').classList.toggle('bloomed',time>7.2);")
s=s[:s.index("$('#replay').onclick=")]+'''
function drawGift(progress,t){
  const lift=ease(clamp(progress));const glow=reduced?1:.83+.17*Math.sin(t*2);
  ctx.save();ctx.globalAlpha=1-lift;ctx.shadowColor='#da9674';ctx.shadowBlur=6;ctx.font='9px monospace';
  for(let y=-55;y<=90;y+=6)for(let x=-105;x<=105;x+=5){const edge=Math.abs(x)>98||y<-49||y>84,ribbon=Math.abs(x)<13;ctx.fillStyle=edge?'#dfa58b':ribbon?'#f0b996':`rgba(170,100,73,${.24*glow})`;ctx.fillText(edge||ribbon?'*':'.',x,y);}
  ctx.save();ctx.translate(0,-lift*160);ctx.rotate(-lift*.22);
  for(let y=-77;y<=-56;y+=6)for(let x=-116;x<=116;x+=5){ctx.fillStyle=Math.abs(x)<13?'#f6c2a2':'#ce9376';ctx.fillText('+',x,y);}
  for(let side of [-1,1])for(let a=0;a<Math.PI*2;a+=.12){ctx.fillStyle='#efb695';ctx.fillText('*',side*(31+29*Math.cos(a)),-100+19*Math.sin(a));}
  ctx.restore();ctx.restore();$('#art').dataset.stage=opened?'opening':'gift';
}
const photoCaptions=['LITTLE JOYS','YOUR BEAUTIFUL SMILE','TOGETHER','GOLDEN MOMENTS','WARM MEMORIES','DAYS TO REMEMBER'];
for(let i=0;i<6;i++){const fig=document.createElement('figure');fig.className='photo';fig.style.setProperty('--left',`${[5,76,17,66,1,83][i]}%`);fig.style.setProperty('--delay',`${-i*6.8-4}s`);fig.style.setProperty('--tilt',`${[-8,7,5,-6,-4,8][i]}deg`);const img=document.createElement('img');img.src=`photos/0${i+1}.jpg`;img.alt=`Birthday memory ${i+1}: friends sharing a happy moment`;img.decoding='async';const cap=document.createElement('figcaption');cap.textContent=photoCaptions[i];fig.append(img,cap);$('#memories').append(fig);}
for(let i=0;i<16;i++){const e=document.createElement('span');e.className='emoji';e.textContent=['✨','💖','🌷','🦋','🎂','💕','🌸','⭐'][i%8];e.style.setProperty('--left',`${8+(i*29)%85}%`);e.style.setProperty('--size',`${16+i%4*4}px`);e.style.setProperty('--delay',`${-i*1.5}s`);$('#emojis').append(e);}
const birth=new Date('2007-11-09T00:00:00+05:00').getTime();
function updateClock(){let n=Math.max(0,Math.floor((Date.now()-birth)/1000));$('#days').textContent=Math.floor(n/86400).toLocaleString('en-US');for(const [id,value] of [['hours',Math.floor(n/3600)%24],['minutes',Math.floor(n/60)%60],['seconds',n%60]])$('#'+id).textContent=String(value).padStart(2,'0');}
updateClock();setInterval(updateClock,1000);
function startMusic(){if(!$('#musicPanel').hidden)return;$('#musicPanel').hidden=false;const frame=document.createElement('iframe');frame.title='Sabrina Carpenter — Espresso (Official Audio)';frame.src='https://www.youtube.com/embed/51zjlMhdSTE?autoplay=1&playsinline=1&rel=0';frame.allow='autoplay; encrypted-media; picture-in-picture';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;$('#player').append(frame);$('#music').textContent='♫ Stop music';}
function stopMusic(){$('#player').replaceChildren();$('#musicPanel').hidden=true;$('#music').textContent='♫ Music';}
$('#music').onclick=()=>$('#musicPanel').hidden?startMusic():stopMusic();$('#stopMusic').onclick=stopMusic;
$('#openGift').onclick=()=>{opened=true;elapsed=0;paused=false;$('#scene').classList.add('opened');$('#scene').classList.remove('paused');$('#openGift').disabled=true;$('#pause').focus();startMusic();};
$('#replay').onclick=()=>{elapsed=0;opened=false;paused=false;$('#pause').textContent='Ⅱ Pause';$('.greeting').classList.remove('show');$('#scene').classList.remove('bloomed','opened','paused');$('#openGift').disabled=false;$('#openGift').focus();stopMusic();};
$('#pause').onclick=()=>{paused=!paused;$('#scene').classList.toggle('paused',paused);$('#pause').textContent=paused?'▷ Play':'Ⅱ Pause';};
requestAnimationFrame(draw);
'''
p.write_text(s)
p=Path('birthday-letter/dist/index.html');p.write_text(p.read_text().replace('MUHARRAMMXON','MUHARRAMXON'))
