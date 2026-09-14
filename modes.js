(function(){
  
  window.addEventListener('portfolio:start',()=>{
    const d=document.createElement('dialog');d.className='mode-dialog';d.innerHTML='<div class="eyebrow">ENTER MY WORLD</div><h2>CHOOSE YOUR<br>EXPERIENCE.</h2><p>Explore at your own pace.</p><div class="mode-options"><a href="/play/"><small>01 / EXPLORE</small><strong>PLAY MODE ↗</strong><span>Walk the world. Meet the guides. Discover the projects.</span></a><a href="/#top" data-quick><small>02 / BROWSE</small><strong>QUICK VIEW ↗</strong><span>The complete portfolio, ready to browse.</span></a></div><button class="mode-dismiss">BACK TO PORTFOLIO</button>';document.body.append(d);d.showModal();d.querySelector('[data-quick]').onclick=()=>d.close();d.querySelector('button').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());
  });
  const nav=document.querySelector('.nav');if(nav){const a=document.createElement('a');a.className='play-switch';a.href='/play/';a.textContent='PLAY MODE ◇';nav.insertBefore(a,nav.querySelector('.menu'));}
  if(new URLSearchParams(location.search).get('from')==='play'){
    try{const state=JSON.parse(sessionStorage.getItem('fazlil-world')||'{}');const slug=location.pathname.split('/')[2];if(window.PORTFOLIO.projects.some(p=>p.slug===slug)){state.discovered=[...new Set([...(state.discovered||[]),'projects',slug])];sessionStorage.setItem('fazlil-world',JSON.stringify(state));}}catch{}
    const bar=document.createElement('div');bar.className='hub-return';bar.innerHTML='<a href="/play/">← RETURN TO HUB</a><a href="/#top">QUICK VIEW ↗</a>';document.body.append(bar);document.body.classList.add('from-hub');
    document.querySelectorAll('a[href^="/projects/"]').forEach(a=>a.href+='?from=play');
  }
})();
