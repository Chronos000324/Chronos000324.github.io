(function(){
'use strict';
const world=window.RPG_DATA,engine=window.RPG_ENGINE,portfolio=window.PORTFOLIO;
const $=s=>document.querySelector(s),canvas=$('#world-canvas'),ctx=canvas.getContext('2d'),dialog=$('#rpg-dialog');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validUrl=s=>/^(https?:\/\/|\/assets\/)/i.test(s||'');
let saved={};try{saved=JSON.parse(sessionStorage.getItem('fazlil-world')||'{}')||{}}catch{}
const discovered=new Set(Array.isArray(saved.discovered)?saved.discovered:[]);
const player={...world.spawn,facing:-Math.PI/2};
if(Number.isFinite(saved.x)&&Number.isFinite(saved.y)&&!engine.blocked(saved.x,saved.y,13,world)){player.x=saved.x;player.y=saved.y;}
let completionDismissed=!!saved.completed,keys=new Set(),nearest=null,moving=false,last=0,frame=0,viewW=0,viewH=0,scale=1,cam={x:player.x,y:player.y},typing=0,fullLine='',sound=false,audioContext=null,leaving=false,focusBefore=null;
world.portals.forEach(p=>{p.project=portfolio.projects.find(q=>q.slug===p.id);p.name=p.project.name;});
const objects=[...world.npcs,...world.portals,world.gate];
function save(){try{sessionStorage.setItem('fazlil-world',JSON.stringify({x:player.x,y:player.y,discovered:[...discovered],completed:completionDismissed}))}catch{}}
function tone(f=380,d=.08){if(!sound)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.022,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+d);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+d);}catch{sound=false;$('#sound').textContent='SOUND OFF';$('#sound').setAttribute('aria-pressed','false');}}
function updateProgress(){
  const all=[...world.quests.map(q=>q[0]),...world.portals.map(p=>p.id)],count=all.filter(id=>discovered.has(id)).length,percent=Math.round(count/all.length*100);
  $('#progress').textContent='WORLD DISCOVERED · '+percent+'%';$('#progress-fill').style.width=percent+'%';
  $('#quests').innerHTML=world.quests.map(([id,text])=>`<li class="${discovered.has(id)?'done':''}"><span>${discovered.has(id)?'✓':'□'}</span>${text}</li>`).join('')+`<li class="${world.portals.every(p=>discovered.has(p.id))?'done':''}"><span>◇</span>Explore projects · ${world.portals.filter(p=>discovered.has(p.id)).length}/4</li>`;
  $('#completion').hidden=count!==all.length||completionDismissed;
}
function discover(id){if(!discovered.has(id)){discovered.add(id);save();updateProgress();$('#game-announcement').textContent='Discovered: '+(objects.find(o=>o.id===id)?.label||objects.find(o=>o.id===id)?.name);tone(610,.15);}}
function finishText(){clearInterval(typing);typing=0;$('#dialog-line').textContent=fullLine;$('#skip-text').hidden=true;}
function closeDialog(){finishText();dialog.close();keys.clear();save();canvas.focus({preventScroll:true});}
function openDialog(speaker,title,line,content='',actions=[]){
  clearInterval(typing);keys.clear();moving=false;fullLine=line;$('#dialog-speaker').textContent=speaker;$('#dialog-title').textContent=title;$('#dialog-line').textContent='';$('#dialog-line').hidden=!line;$('#dialog-content').innerHTML=content;$('#dialog-scroll').scrollTop=0;
  $('#dialog-actions').replaceChildren();actions.forEach(({label,run,href})=>{const b=document.createElement(href?'a':'button');b.textContent=label;if(href)b.href=href;else b.onclick=()=>{finishText();tone();run();};$('#dialog-actions').append(b);});
  if(!dialog.open){focusBefore=document.activeElement;dialog.showModal();}
  if(line&&!reduced){let i=0;$('#skip-text').hidden=false;typing=setInterval(()=>{$('#dialog-line').textContent=line.slice(0,++i);if(i>=line.length)finishText()},14);}else finishText();
  ($('#dialog-actions').firstElementChild||$('#dialog-close')).focus({preventScroll:true});
}
function returnAction(){return {label:'CONTINUE EXPLORING →',run:closeDialog}}
function projectLinks(){return world.portals.map((p,i)=>`<a class="portal-link" data-portal="${p.id}" href="/projects/${p.id}/?from=play"><span>0${i+1} / ${escape(p.name)}</span><span>ENTER ↗</span></a>`).join('')}
function showContent(npc){
  let content='';
  if(npc.paragraphs){if(portfolio.portrait&&validUrl(portfolio.portrait))content+=`<img class="rpg-portrait" src="${escape(portfolio.portrait)}" alt="Fazlil">`;content+=npc.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('');}
  if(npc.groups)content=npc.groups.map(([name,...items])=>`<div class="skill-group"><h3>${name}</h3>${items.map(s=>`<span>${s}</span>`).join('')}</div>`).join('');
  if(npc.levels)content=npc.levels.map((s,i)=>`<div class="rpg-level"><small>LEVEL 0${i+1}</small><p>${s}</p></div>`).join('');
  if(npc.id==='projects')content='<p>Walk north to enter a portal, or choose a project here. Each opens its case study; Return to Hub brings you back.</p>'+projectLinks();
  openDialog(npc.name,npc.title,'',content,[returnAction()]);discover(npc.id);
}
function contact(){
  const content='<p>LET’S BUILD SOMETHING PLAYABLE.</p>'+[['email','Email'],['linkedin','LinkedIn'],['github','GitHub'],['itch','Itch.io']].map(([key,label])=>{const val=portfolio.contacts[key];let url=key==='email'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)?'mailto:'+val:validUrl(val)?val:'';return `<div class="rpg-contact">${url?`<a href="${escape(url)}" ${key==='email'?'':'target="_blank" rel="noopener noreferrer"'}>${label} ↗</a>`:`<strong>${label}</strong><span>[ ADD ${label.toUpperCase()} ]</span>`}</div>`}).join('');
  openDialog('FINAL GATE','READY FOR THE NEXT MISSION?','',content,[returnAction(),{label:'QUICK VIEW ↗',href:'/#contact'}]);discover('contact');
}
function enterProject(p){if(leaving)return;discover('projects');discover(p.id);save();leaving=true;keys.clear();tone(190,.25);document.body.classList.add('leaving');setTimeout(()=>location.assign('/projects/'+p.id+'/?from=play'),reduced?0:230);}
function interact(){if(dialog.open||leaving||!nearest)return;tone();if(world.portals.includes(nearest)){enterProject(nearest);return;}if(nearest.id==='contact'){contact();return;}const npc=nearest;openDialog(npc.name,npc.label,npc.line,'',[{label:npc.choice,run:()=>showContent(npc)},{label:'Maybe later',run:closeDialog}]);}
function help(first=false){openDialog('PLAYER 01 / CONTROLS',first?'WELCOME TO MY WORLD.':'HOW TO EXPLORE','',`<p>Move with <strong>WASD</strong> or the <strong>arrow keys</strong>. On touch screens, hold a direction on the pad.</p><p>Approach a guide or portal, then press <strong>E</strong> or tap <strong>INTERACT</strong>. Use ↑↓ to choose and Enter / Space to continue. Esc closes dialogue or opens the menu.</p><p>Visit the guides around the hub. Project portals are north; the contact gate is south. <strong>QUICK VIEW</strong> is always available.</p>`,[{label:'GOT IT — LET’S EXPLORE',run:()=>{try{localStorage.setItem('fazlil-world-help','1')}catch{}closeDialog()}},{label:'QUICK VIEW ↗',href:'/#top'}]);}
function menu(){openDialog('PORTFOLIO WORLD','TAKE YOUR TIME.','Your exploration is saved for this browser session.','',[returnAction(),{label:'CONTROLS',run:()=>help()},{label:'QUICK VIEW ↗',href:'/#top'}]);}
$('#dialog-close').onclick=closeDialog;$('#skip-text').onclick=finishText;dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});dialog.addEventListener('close',()=>{clearInterval(typing);typing=0;keys.clear()});
$('#dialog-content').addEventListener('click',e=>{const link=e.target.closest('[data-portal]');if(link){e.preventDefault();enterProject(world.portals.find(p=>p.id===link.dataset.portal));}});
$('#help').onclick=()=>help();$('#interaction').onclick=interact;$('#touch-interact').onclick=interact;
$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'SOUND ON':'SOUND OFF';$('#sound').setAttribute('aria-pressed',String(sound));tone();};
$('#complete-contact').onclick=contact;$('#keep-exploring').onclick=()=>{completionDismissed=true;save();updateProgress()};
if(matchMedia('(max-width:760px)').matches)$('#quest-panel').open=false;
const movementKeys=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'];
window.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();if(dialog.open){
    if(k==='escape')return;
    if(k==='enter'||k===' '){if(typing){e.preventDefault();finishText();return;}if(e.target.tagName!=='BUTTON'&&e.target.tagName!=='A'){e.preventDefault();$('#dialog-actions').firstElementChild?.click();}else if(k===' '&&e.target.tagName==='A'){e.preventDefault();e.target.click();}return;}
    if(['arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();const options=[...dialog.querySelectorAll('#dialog-content a,#dialog-actions button,#dialog-actions a')];const idx=options.indexOf(document.activeElement);options[(idx+(k==='arrowup'||k==='arrowleft'?-1:1)+options.length)%options.length]?.focus();}return;
  }
  // Keyboard users can tab through the HUD without movement stealing activation.
  if(movementKeys.includes(k)){e.preventDefault();keys.add(k);}
  if(k==='e'&&!e.repeat){e.preventDefault();interact();}
  if(k==='escape'){e.preventDefault();menu();}
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();save()});document.addEventListener('visibilitychange',()=>{keys.clear();save();last=0;});window.addEventListener('pagehide',save);
const dirMap={up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright'};
document.querySelectorAll('[data-dir]').forEach(b=>{const key=dirMap[b.dataset.dir];b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(key)});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>keys.delete(key));});
canvas.addEventListener('pointerdown',()=>canvas.focus({preventScroll:true}));
function resize(){const r=canvas.getBoundingClientRect();viewW=r.width;viewH=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(viewW*dpr);canvas.height=Math.round(viewH*dpr);scale=viewW<760?.86:Math.min(1.12,Math.max(.78,viewH/850));}
new ResizeObserver(resize).observe(canvas);resize();
function rect(x,y,w,h,fill,stroke){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(x,y,w,h)}}
function line(x1,y1,x2,y2,color,width=1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function circle(x,y,r,color,fill=false){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx[fill?'fillStyle':'strokeStyle']=color;ctx.lineWidth=1.4;ctx[fill?'fill':'stroke']();}
function label(text,x,y,size=12,color='#aaa5b8',align='center'){ctx.fillStyle=color;ctx.font=`${size}px "IBM Plex Mono",monospace`;ctx.textAlign=align;ctx.fillText(text,x,y);}
function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
function avatar(x,y,color,angle,t,walk=false){
  ctx.save();ctx.translate(x,y);ctx.scale(1,.48);circle(0,32,23,'#0006',true);ctx.restore();
  const bounce=reduced?0:walk?Math.sin(t*12)*2:Math.sin(t*1.7)*1.1;
  rect(x-10,y+9,7,9+(walk?Math.sin(t*12)*3:0),'#69677b');rect(x+3,y+9,7,9-(walk?Math.sin(t*12)*3:0),'#69677b');
  ctx.beginPath();ctx.moveTo(x-14,y+9+bounce);ctx.lineTo(x-11,y-8+bounce);ctx.lineTo(x+11,y-8+bounce);ctx.lineTo(x+14,y+9+bounce);ctx.closePath();ctx.fillStyle=color;ctx.fill();
  circle(x,y-14+bounce,10,'#1b1e2a',true);circle(x,y-14+bounce,10,color);const fx=Math.cos(angle)*4,fy=Math.sin(angle)*3;line(x-4+fx,y-15+bounce+fy,x+4+fx,y-15+bounce+fy,'#ece4ff',2);
}
function portal(p,t){
  const active=nearest===p,pulse=reduced?0:Math.sin(t*1.5+p.shape)*3;glow(p.x,p.y,80,p.color+'16');
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.52);circle(0,30,48,p.color+'55');circle(0,30,39,p.color+'33');ctx.restore();
  ctx.strokeStyle=p.color;ctx.lineWidth=active?3:1.5;
  ctx.beginPath();if(p.shape===0){ctx.rect(p.x-22,p.y-45,44,62);}else if(p.shape===1){ctx.ellipse(p.x,p.y-13,25,35,0,0,Math.PI*2);}else if(p.shape===2){ctx.moveTo(p.x-27,p.y+14);ctx.lineTo(p.x-20,p.y-43);ctx.lineTo(p.x+25,p.y-35);ctx.lineTo(p.x+20,p.y+16);ctx.closePath();}else{ctx.moveTo(p.x-25,p.y+14);ctx.lineTo(p.x-25,p.y-24);ctx.lineTo(p.x,p.y-48);ctx.lineTo(p.x+25,p.y-24);ctx.lineTo(p.x+25,p.y+14);ctx.closePath();}ctx.stroke();
  rect(p.x-13,p.y-29,26,35,p.color+'12');line(p.x-9,p.y-14+pulse,p.x+9,p.y-14+pulse,p.color+'99');label('0'+(p.shape+1),p.x,p.y-63,11,p.color);label(p.name,p.x,p.y+54,12,active?'#fff':p.color);if(discovered.has(p.id))label('✓',p.x+35,p.y-42,14,p.color);
}
function draw(t,dt){
  const dpr=Math.min(devicePixelRatio||1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,viewW,viewH);ctx.fillStyle='#0a0d14';ctx.fillRect(0,0,viewW,viewH);
  const halfW=viewW/scale/2,halfH=viewH/scale/2;
  const tx=halfW>world.width/2?world.width/2:Math.max(halfW,Math.min(world.width-halfW,player.x));
  const ty=halfH>world.height/2?world.height/2:Math.max(halfH,Math.min(world.height-halfH,player.y));
  const easing=reduced?1:1-Math.exp(-dt*7);cam.x+=(tx-cam.x)*easing;cam.y+=(ty-cam.y)*easing;
  ctx.translate(viewW/2-cam.x*scale,viewH/2-cam.y*scale);ctx.scale(scale,scale);
  rect(35,45,930,820,'#11151e','#343040');rect(50,60,900,790,'#131821','#222a35');
  for(let x=50;x<=950;x+=50)line(x,60,x,850,'#a0aacc08');for(let y=60;y<=850;y+=50)line(50,y,950,y,'#a0aacc08');
  // Navigation paths and electrical node markings are functional world geometry.
  rect(458,185,84,558,'#1b1d2a');rect(225,342,550,78,'#1a1d27');rect(170,190,660,40,'#1b1d28');
  line(490,230,490,720,'#aa91d41a');line(510,230,510,720,'#aa91d41a');
  for(let y=245;y<720;y+=58){line(498,y,502,y,'#b5a0d75a');}
  glow(500,390,260,'#7a65bc13');circle(500,383,91,'#9e85c12b');circle(500,383,75,'#a98bdc20');
  for(let a=0;a<4;a++){const angle=a*Math.PI/2;line(500+Math.cos(angle)*80,383+Math.sin(angle)*80,500+Math.cos(angle)*98,383+Math.sin(angle)*98,'#b9a0df50',2)}
  label('ENTER MY',500,375,13,'#b7a4d0');label('WORLD',500,397,21,'#d3c4e5');
  label('PROJECT PORTALS',500,85,12,'#9e92b2');label('SPAWN / PLAYER 01',500,696,11,'#77728c');
  for(const b of world.obstacles){rect(b.x+5,b.y+7,b.w,b.h,'#070a1080');rect(b.x,b.y,b.w,b.h,'#242733','#494255');rect(b.x+8,b.y+7,b.w-16,15,'#111922','#52627b');line(b.x+14,b.y+14,b.x+b.w-20,b.y+14,'#859dcc55');for(let i=0;i<3;i++)rect(b.x+10+i*12,b.y+30,6,3,'#635b76');}
  // Blueprint nodes along the sides of the hub.
  for(const x of [100,875]){rect(x,575,25,18,'#1a1d28','#544961');rect(x-7,625,40,18,'#1a1d28','#544961');line(x+12,593,x+12,625,'#78658b60');circle(x+12,609,3,'#b0a0d0',true);}
  world.portals.forEach(p=>portal(p,t));
  const gate=world.gate;glow(gate.x,gate.y,95,'#9575c420');ctx.lineWidth=2;ctx.strokeStyle=gate.color;ctx.beginPath();ctx.moveTo(460,800);ctx.lineTo(460,756);ctx.lineTo(540,756);ctx.lineTo(540,800);ctx.stroke();rect(470,764,60,34,'#9b78c918');label('FINAL GATE / CONTACT',500,830,12,gate.color);label(discovered.has('contact')?'✓':'◇',500,788,22,'#d6b8ff');
  // Depth-sort characters so feet anchor correctly when passing one another.
  [...world.npcs,{...player,isPlayer:true}].sort((a,b)=>a.y-b.y).forEach(n=>{if(n.isPlayer){circle(n.x,n.y+12,23,'#bca4e650');avatar(n.x,n.y,'#d4c9e9',player.facing,t,moving);label('YOU',n.x,n.y-42,10,'#e2d4fc');}else{const facing=Math.atan2(player.y-n.y,player.x-n.x);avatar(n.x,n.y,n.color,nearest===n?facing:Math.PI/2,t);label(n.label,n.x,n.y+44,12,nearest===n?'#fff':n.color);label(discovered.has(n.id)?'✓':'!',n.x,n.y-43,16,n.color);if(nearest===n)circle(n.x,n.y+5,35,n.color+'66');}});
  if(!reduced)for(let i=0;i<12;i++){const x=110+(i*137)%800,y=230+(i*113+t*7)%460;circle(x,y,1,'#b8a0d733',true);}
}
let lastNearestId='';
function loop(now){const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;if(!document.hidden){
  const dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
  moving=!dialog.open&&!leaving&&engine.move(player,dx,dy,dt,world);
  nearest=engine.nearest(player,objects);const id=nearest?.id||'';
  if(id!==lastNearestId){lastNearestId=id;$('#interaction').hidden=!nearest;$('#touch-interact').disabled=!nearest;if(nearest){const action=world.portals.includes(nearest)?'ENTER PROJECT':nearest.id==='contact'?'OPEN FINAL GATE':'TALK';$('#interaction').textContent='[ E ] '+action+' / '+(nearest.label||nearest.name);$('#game-announcement').textContent=$('#interaction').textContent;}}
  $('#player-state').textContent='PLAYER 01 / '+(moving?'WALK':'IDLE');draw(now/1000,dt);
  if(moving&&frame%28===0){save();tone(90,.025)}frame++;
}requestAnimationFrame(loop);}
updateProgress();requestAnimationFrame(loop);
let seen=false;try{seen=localStorage.getItem('fazlil-world-help')==='1'}catch{}if(!seen)help(true);else canvas.focus({preventScroll:true});
})();
