/* Semil brain games: one short game per product. Scores are kept in this browser only (localStorage, optional). */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const store={get(k){try{return localStorage.getItem('semil-best-'+k)}catch(_){return null}},set(k,v){try{localStorage.setItem('semil-best-'+k,String(v))}catch(_){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* shared game frame: score, best, time, start button, rules and a status line */
function frame(el,id,o){
  el.innerHTML=`<div class="gbox"><div class="gbar"><div class="gstat"><small>${o.scoreLabel}</small><b class="gs">0</b></div><div class="gstat"><small>Best</small><b class="gb">–</b></div>${o.time?'<div class="gstat"><small>Time</small><b class="gt">0.0s</b></div>':''}<button type="button" class="btn primary gstart">Start</button></div>
  <p class="grules">${o.rules}</p><div class="gplay" tabindex="-1"><div class="gidle">Press <b>Start</b> to play.</div></div><p class="gmsg" role="status" aria-live="polite"></p></div>`;
  const q=s=>$(s,el);
  const api={play:q('.gplay'),start:q('.gstart'),
    score(v){q('.gs').textContent=v},
    msg(t,cls){const m=q('.gmsg');m.textContent=t;m.className='gmsg'+(cls?' '+cls:'')},
    best:null,
    showBest(){const b=store.get(id);q('.gb').textContent=b==null?'–':o.fmt(+b)},
    submit(v){const b=store.get(id);let nb=false;if(b==null||o.better(v,+b)){store.set(id,v);nb=true}api.showBest();return nb},
    timer:null,t0:0,
    startTimer(){api.stopTimer();api.t0=performance.now();const t=q('.gt');if(!t)return;api.timer=setInterval(()=>{t.textContent=((performance.now()-api.t0)/1000).toFixed(1)+'s'},100)},
    stopTimer(){clearInterval(api.timer);return (performance.now()-api.t0)/1000},
    cleanups:[],on(f){api.cleanups.push(f)},reset(){api.stopTimer();api.cleanups.splice(0).forEach(f=>f())}
  };
  api.showBest();return api;
}

/* 1. Neutags: Marketplace Match (memory) */
function memory(el){
  const g=frame(el,'memory',{scoreLabel:'Moves',time:true,rules:'Flip two cards at a time and match every pair of marketplace categories in as few moves as you can.',fmt:v=>v+' moves',better:(a,b)=>a<b});
  const cats=[["Fashion","#DCE8FF"],["Home","#E9E1FF"],["Tech","#D9F3FD"],["Books","#FFE9D6"],["Toys","#FFE3EC"],["Sports","#DDF3E8"]];
  g.start.onclick=()=>{
    g.reset();g.msg('');let moves=0,first=null,lock=false,found=0;g.score(0);
    g.play.innerHTML=`<div class="mgrid">${shuffle([...cats,...cats]).map((c,i)=>`<button type="button" class="mcard" data-k="${c[0]}" aria-label="Hidden card ${i+1}"><span class="mf"></span><span class="mb" style="background:${c[1]}">${c[0]}</span></button>`).join('')}</div>`;
    g.startTimer();g.start.textContent='Restart';
    $$('.mcard',g.play).forEach(c=>c.onclick=()=>{
      if(lock||c.classList.contains('up')||c.classList.contains('ok'))return;
      c.classList.add('up');c.setAttribute('aria-label',c.dataset.k);
      if(!first){first=c;return}
      moves++;g.score(moves);
      if(first.dataset.k===c.dataset.k){first.classList.add('ok');c.classList.add('ok');first=null;found++;
        if(found===cats.length){const t=g.stopTimer();const nb=g.submit(moves);g.msg(`All pairs found in ${moves} moves and ${t.toFixed(1)} seconds.${nb?' New best.':''}`,'win')}
      }else{lock=true;const a=first,b=c;first=null;setTimeout(()=>{a.classList.remove('up');b.classList.remove('up');a.setAttribute('aria-label','Hidden card');b.setAttribute('aria-label','Hidden card');lock=false},800)}
    });
  };
}

/* 2. Semil Food Delivery: Order Relay (sequence memory) */
function sequence(el){
  const g=frame(el,'sequence',{scoreLabel:'Level',rules:'Watch the order travel from the restaurant to the doorstep, then repeat the same sequence. Each round adds one more step.',fmt:v=>'Level '+v,better:(a,b)=>a>b});
  const pads=[["Restaurant","#F59E4B"],["Kitchen","#E76F9B"],["Rider","#315EFB"],["Doorstep","#16A36A"]];
  g.start.onclick=()=>{
    g.reset();g.msg('');g.start.textContent='Restart';
    g.play.innerHTML=`<div class="sgrid">${pads.map((p,i)=>`<button type="button" class="gpad" data-i="${i}" style="--c:${p[1]}" disabled>${p[0]}</button>`).join('')}</div>`;
    const els=$$('.gpad',g.play);let seq=[],pos=0,alive=true;g.on(()=>{alive=false});
    const lit=(i,ms=450)=>{els[i].classList.add('lit');setTimeout(()=>els[i].classList.remove('lit'),ms)};
    const round=()=>{
      if(!alive)return;seq.push(Math.floor(Math.random()*4));pos=0;g.score(seq.length-1);els.forEach(b=>b.disabled=true);g.msg('Watch carefully…');
      seq.forEach((s,k)=>setTimeout(()=>{if(alive)lit(s)},700+k*700));
      setTimeout(()=>{if(!alive)return;els.forEach(b=>b.disabled=false);g.msg('Your turn.')},700+seq.length*700);
    };
    els.forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i;lit(i,220);
      if(i!==seq[pos]){alive=false;els.forEach(x=>x.disabled=true);const lvl=seq.length-1;const nb=g.submit(lvl);g.msg(`Sequence broken. You completed ${lvl} ${lvl===1?'round':'rounds'}.${nb&&lvl>0?' New best.':''}`,'lose');return}
      pos++;if(pos===seq.length){g.score(seq.length);els.forEach(x=>x.disabled=true);g.msg('Correct.','win');setTimeout(round,900)}
    });
    round();
  };
}

/* 3. Semil Matrimony: Find the Match (pair up compatible interests) */
function pairs(el){
  const g=frame(el,'pairs',{scoreLabel:'Matched',time:true,rules:'Tap an item on the left, then the interest that goes with it on the right. Match all six as fast as you can.',fmt:v=>v.toFixed(1)+'s',better:(a,b)=>a<b});
  const P=[["Early riser","Morning walk"],["Bookworm","Library"],["Foodie","Cooking class"],["Traveller","Road trip"],["Music lover","Live concert"],["Gardener","Fresh blooms"]];
  g.start.onclick=()=>{
    g.reset();g.msg('');g.start.textContent='Restart';let sel=null,done=0;g.score('0 / 6');
    const L=shuffle(P.map((p,i)=>[p[0],i])),R=shuffle(P.map((p,i)=>[p[1],i]));
    g.play.innerHTML=`<div class="pairs"><div>${L.map(x=>`<button type="button" class="prow" data-s="l" data-i="${x[1]}">${esc(x[0])}</button>`).join('')}</div><div>${R.map(x=>`<button type="button" class="prow" data-s="r" data-i="${x[1]}">${esc(x[0])}</button>`).join('')}</div></div>`;
    g.startTimer();
    $$('.prow',g.play).forEach(b=>b.onclick=()=>{
      if(b.classList.contains('ok'))return;
      if(b.dataset.s==='l'){$$('.prow[data-s=l]',g.play).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b;return}
      if(!sel){g.msg('Pick an item on the left first.');return}
      if(sel.dataset.i===b.dataset.i){sel.classList.remove('sel');sel.classList.add('ok');b.classList.add('ok');sel=null;done++;g.score(done+' / 6');g.msg('');
        if(done===6){const t=g.stopTimer();const nb=g.submit(t);g.msg(`All matched in ${t.toFixed(1)} seconds.${nb?' New best.':''}`,'win')}}
      else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400);g.msg('Not a match. Try another.')}
    });
  };
}

/* 4. Semil Logistical Services: Parcel Sequence (number order, attention) */
function parcel(el){
  const g=frame(el,'parcel',{scoreLabel:'Next parcel',time:true,rules:'Parcels are scattered across the warehouse floor. Tap them in order from 1 to 16 as quickly as you can. Each wrong tap adds half a second.',fmt:v=>v.toFixed(1)+'s',better:(a,b)=>a<b});
  g.start.onclick=()=>{
    g.reset();g.msg('');g.start.textContent='Restart';let next=1,miss=0;g.score(1);
    g.play.innerHTML=`<div class="pgrid4">${shuffle([...Array(16).keys()].map(n=>n+1)).map(n=>`<button type="button" class="parc" data-n="${n}">${n}</button>`).join('')}</div>`;
    g.startTimer();
    $$('.parc',g.play).forEach(b=>b.onclick=()=>{
      if(b.classList.contains('ok'))return;
      if(+b.dataset.n===next){b.classList.add('ok');next++;g.score(next>16?'Done':next);
        if(next>16){const t=g.stopTimer()+miss*.5;const nb=g.submit(t);g.msg(`All 16 sorted in ${t.toFixed(1)} seconds${miss?` (including ${miss} wrong ${miss===1?'tap':'taps'})`:''}.${nb?' New best.':''}`,'win')}}
      else{miss++;b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),300)}
    });
  };
}

/* 5. Semil Payment Gateway: Quick Checkout (mental arithmetic) */
function checkout(el){
  const g=frame(el,'checkout',{scoreLabel:'Correct',rules:'Five baskets, ten seconds each. Pick the right total before the timer runs out.',fmt:v=>v+' / 5',better:(a,b)=>a>b});
  g.start.onclick=()=>{
    g.reset();g.msg('');g.start.textContent='Restart';let r=0,right=0;g.score('0 / 5');let alive=true;g.on(()=>{alive=false});
    const names=["Notebook","Headset","Backpack","Lamp","Mug","Charger","Cap","Bottle"];
    const next=()=>{
      if(!alive)return;
      if(r===5){const nb=g.submit(right);g.play.innerHTML=`<div class="gidle"><b>${right} of 5 correct.</b></div>`;g.msg(nb&&right>0?'New best.':'Round complete. Start again to improve.','win');return}
      r++;const items=shuffle(names).slice(0,3).map(n=>[n,10*(2+Math.floor(Math.random()*48))+[0,5,9][Math.floor(Math.random()*3)]]);
      const total=items.reduce((a,b)=>a+b[1],0);const opts=new Set([total]);while(opts.size<3){const d=[-20,-10,-9,-1,1,9,10,11,20][Math.floor(Math.random()*9)];if(total+d>0)opts.add(total+d)}
      let left=100,locked=false;
      g.play.innerHTML=`<div class="basket"><p class="slate" style="font-size:13px">Basket ${r} of 5</p><ul>${items.map(i=>`<li><span>${i[0]}</span><b>₹${i[1]}</b></li>`).join('')}</ul><div class="tbar"><i id="tb"></i></div><div class="opts">${shuffle([...opts]).map(o=>`<button type="button" class="opt" data-v="${o}">₹${o}</button>`).join('')}</div></div>`;
      g.msg('What is the total?');
      const tb=$('#tb',g.play),iv=setInterval(()=>{left-=1;tb.style.width=left+'%';if(left<=0){clearInterval(iv);if(!locked&&alive){locked=true;g.msg(`Time is up. The total was ₹${total}.`,'lose');setTimeout(next,1300)}}},100);
      g.on(()=>clearInterval(iv));
      $$('.opt',g.play).forEach(b=>b.onclick=()=>{if(locked)return;locked=true;clearInterval(iv);const ok=+b.dataset.v===total;b.classList.add(ok?'ok':'bad');if(ok){right++;g.score(right+' / 5');g.msg('Correct.','win')}else{g.msg(`Not quite. The total was ₹${total}.`,'lose');$$('.opt',g.play).find(x=>+x.dataset.v===total).classList.add('ok')}setTimeout(next,1200)});
    };
    next();
  };
}

const GAMES={memory,sequence,pairs,parcel,checkout};
function boot(){$$('[data-game]').forEach(el=>{const f=GAMES[el.dataset.game];f&&f(el)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
