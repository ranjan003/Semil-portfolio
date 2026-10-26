/* Semil motion layer: splash, scroll progress, word reveals, parallax, counters, magnetic buttons, spotlight, scroll-linked effects. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const PAGE=document.body.dataset.page||'';
const ready=()=>{document.body.classList.add('ready');$$('.hero .split,.dhero .split').forEach(h=>h.classList.add('in'))};

/* splash (home only, once per session, skippable) */
function splash(){
  let seen=false;try{seen=sessionStorage.getItem('semil-splash')==='1'}catch(_){}
  if(PAGE!=='home'||seen||RM){ready();return}
  const s=document.createElement('div');s.id='splash';
  s.innerHTML=`<div class="sp-in"><svg class="sp-mono" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="spg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#315EFB"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs><path pathLength="1" d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z"/><path pathLength="1" d="M66 36 C66 28 34 26 34 40 C34 54 66 46 66 60 C66 74 34 72 34 64"/></svg><div class="sp-word">SEMIL</div><div class="sp-tag">ONE COMPANY. MANY POSSIBILITIES.</div></div><button type="button" class="sp-skip">Skip intro</button>`;
  document.body.appendChild(s);document.body.style.overflow='hidden';
  let done=false;
  const end=()=>{if(done)return;done=true;s.classList.add('out');document.body.style.overflow='';try{sessionStorage.setItem('semil-splash','1')}catch(_){}setTimeout(()=>s.remove(),900);ready()};
  $('.sp-skip',s).onclick=end;setTimeout(end,2900);
}

/* scroll progress + timeline fill */
function scrollFx(){
  const bar=$('#prog');
  const tl=$('#tlfill'),tlEl=tl&&tl.closest('.tl');
  const onS=()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    if(bar)bar.style.transform=`scaleX(${h>0?Math.min(1,scrollY/h):0})`;
    if(tlEl){const r=tlEl.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.7-r.top)/r.height));tl.style.height=(p*100)+'%'}
    $$('[data-sy]').forEach(el=>{const r=el.getBoundingClientRect();const k=(r.top+r.height/2-innerHeight/2)*(+el.dataset.sy);el.style.transform=`translateY(${(-k).toFixed(1)}px)`});
  };
  addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS);onS();
}

/* word-by-word headline reveals */
function split(){
  $$('.split').forEach(h=>{
    if(h.dataset.done)return;h.dataset.done=1;let i=0;
    h.innerHTML=h.innerHTML.replace(/(<[^>]+>)|([^<\s]+)/g,(m,tag,w)=>tag?tag:`<span class="w"><span style="--i:${i++}">${w}</span></span> `);
  });
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
  $$('.split').forEach(h=>{if(!h.closest('.hero,.dhero'))io.observe(h)});
}

/* reveal on scroll */
function reveal(){
  const els=$$('.rv,.tile,.bcard,.dir,.step,.stat,.fq,.evos').filter(e=>e.getBoundingClientRect().top>innerHeight*.95);
  els.forEach((e,i)=>{e.classList.add('rv','pre');e.style.transitionDelay=Math.min(i%4,3)*70+'ms'});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{threshold:.1});
  $$('.pre').forEach(e=>io.observe(e));
}

/* counters (counts are taken from site data, never invented) */
function counters(){
  const els=$$('[data-count]');if(!els.length)return;
  const run=el=>{const to=+el.dataset.count;if(RM){el.textContent=to;return}const t0=performance.now(),d=1100;
    const f=n=>{const p=Math.min(1,(n-t0)/d),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run(e.target);io.unobserve(e.target)}}),{threshold:.6});
  els.forEach(e=>{e.textContent='0';io.observe(e)});
}

/* pointer parallax for hero scene, magnetic buttons, spotlight, card tilt */
function pointer(){
  if(!FINE||RM)return;
  const scene=$('.scene');
  if(scene){let tx=0,ty=0,x=0,y=0,vis=true;
    new IntersectionObserver(es=>vis=es[0].isIntersecting).observe(scene);
    addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
    const layers=$$('.layer',scene);
    (function f(){requestAnimationFrame(f);if(!vis)return;x+=(tx-x)*.07;y+=(ty-y)*.07;
      layers.forEach(l=>{const d=+l.dataset.depth||0;l.style.transform=`translate(${(-x*d).toFixed(1)}px,${(-y*d*.7).toFixed(1)}px)`})})();
  }
  $$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${((e.clientX-r.left)/r.width-.5)*10}px,${((e.clientY-r.top)/r.height-.5)*8}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
  $$('.glow,.bcard').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}));
  $$('.bcard').forEach(c=>{
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--ty',((e.clientX-r.left)/r.width-.5)*6+'deg');c.style.setProperty('--tx',(.5-(e.clientY-r.top)/r.height)*6+'deg')});
    c.addEventListener('pointerleave',()=>{c.style.setProperty('--tx','0deg');c.style.setProperty('--ty','0deg')});
  });
}

/* about: ecosystem grows as the stages scroll past */
function evo(){
  const stages=$$('.evos');if(!stages.length)return;
  const set=n=>{$$('.evon').forEach(c=>c.classList.toggle('on',+c.dataset.k<=n));$$('.evoe').forEach(p=>p.classList.toggle('on',+p.dataset.k<=n));stages.forEach(s=>s.classList.toggle('act',+s.dataset.n===n))};
  set(1);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set(+e.target.dataset.n)}),{rootMargin:'-45% 0px -45% 0px'});
  stages.forEach(s=>io.observe(s));
}

/* parallax on hero visuals of detail pages */
function visParallax(){
  if(RM)return;const v=$('[data-depthbox]');if(!v)return;
  addEventListener('scroll',()=>{const y=Math.min(scrollY,500);v.style.transform=`translateY(${y*.08}px) rotate(${y*.004}deg)`},{passive:true});
}

function boot(){split();splash();scrollFx();reveal();counters();pointer();evo();visParallax()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
