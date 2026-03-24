/* ═══════════════════════════════════════════════
   NAMRATA SHAJWANI — HOMEPAGE JS
   js/home.js
   Only loaded on index.html
   ═══════════════════════════════════════════════ */

// ── HERO SLIDESHOW + CIRCLE OVERRIDE ──
(function(){
  let cur=0, onHero=true;
  const slides=document.querySelectorAll('.slide');
  const circle=document.getElementById('navCircle');
  const nav=document.getElementById('nav');
  if(!slides.length || !circle || !nav) return;

  let autoTimer=setInterval(advance,3000);
  function advance(){slides[cur].classList.remove('active');cur=(cur+1)%slides.length;slides[cur].classList.add('active')}

  // Override the main.js circle click for homepage hero behavior
  circle.removeEventListener('click', circle._mainClickHandler);
  circle.addEventListener('click',function(){
    if(onHero){clearInterval(autoTimer);advance();circle.classList.add('advancing');setTimeout(()=>circle.classList.remove('advancing'),300);autoTimer=setInterval(advance,3000)}
    else window.scrollTo({top:0,behavior:'smooth'});
  });

  window.addEventListener('scroll',function(){
    const s=window.scrollY>window.innerHeight*.85;
    onHero=!s;
    nav.classList.toggle('scrolled',s);
  });
})();

// ── CATEGORY BROWSE ──
(function(){
  const browsePill=document.getElementById('browsePill');
  const catGroup=document.getElementById('catGroup');
  const catZone=document.getElementById('catZone');
  const catDim=document.getElementById('catDim');
  if(!browsePill||!catGroup||!catZone||!catDim) return;
  const catPills=catGroup.querySelectorAll('.cat-pill');
  let closeTimer=null;
  const isMobile=()=>window.innerWidth<=480;

  function openCats(){clearTimeout(closeTimer);browsePill.classList.add('open');catDim.classList.add('active');catPills.forEach(p=>p.classList.add('visible'))}
  function scheduleClose(){closeTimer=setTimeout(closeCats,4000)}
  function closeCats(){clearTimeout(closeTimer);browsePill.classList.remove('open');catDim.classList.remove('active');catPills.forEach(p=>p.classList.remove('visible'))}

  browsePill.addEventListener('mouseenter',()=>{if(!isMobile())openCats()});
  catZone.addEventListener('mouseenter',()=>{if(!isMobile())clearTimeout(closeTimer)});
  catZone.addEventListener('mouseleave',()=>{if(!isMobile())scheduleClose()});
  catPills.forEach(p=>{
    p.addEventListener('mouseenter',()=>{if(!isMobile())clearTimeout(closeTimer)});
    p.addEventListener('mouseleave',()=>{if(!isMobile())scheduleClose()});
  });
  browsePill.addEventListener('click',e=>{e.stopPropagation();catPills[0].classList.contains('visible')?closeCats():openCats()});
  document.addEventListener('click',e=>{const open=catPills[0].classList.contains('visible');if(!open)return;if(!catZone.contains(e.target))closeCats()},true);

  const catWrapEl=document.querySelector('.cat-wrap');
  if(catWrapEl && 'IntersectionObserver' in window){
    new IntersectionObserver(entries=>{if(isMobile()&&!entries[0].isIntersecting)closeCats()},{threshold:0}).observe(catWrapEl);
  }
})();

// ── PHYSICS PHOTO STACK ──
(function(){
  const photoSrcs=['images/namrata-photo-1.webp','images/namrata-photo-2.webp','images/namrata-photo-3.webp'];
  const cards=[document.getElementById('pc1'),document.getElementById('pc2'),document.getElementById('pc3')];
  if(!cards[0]||!cards[1]||!cards[2]) return;

  const rest=[{x:0,y:20,r:-6},{x:110,y:0,r:4},{x:55,y:120,r:-2}];
  let zOrder=[0,1,2];
  const state=cards.map((_,i)=>({x:20,y:10,r:[-5,2,-1][i],vx:0,vy:0,dragging:false,ox:0,oy:0,moved:false}));

  function applyZ(){zOrder.forEach((ci,rank)=>cards[ci].style.zIndex=String(rank+1))}
  function bringTop(i){zOrder=zOrder.filter(v=>v!==i);zOrder.push(i);applyZ()}
  applyZ();

  setTimeout(()=>{
    cards.forEach((card,i)=>{
      card.style.transition=`transform ${.6+i*.15}s cubic-bezier(.34,1.56,.64,1),left ${.6+i*.15}s cubic-bezier(.34,1.56,.64,1),top ${.6+i*.15}s cubic-bezier(.34,1.56,.64,1)`;
      card.style.left=rest[i].x+'px';card.style.top=rest[i].y+'px';
      card.style.transform=`rotate(${rest[i].r}deg)`;
      state[i].x=rest[i].x;state[i].y=rest[i].y;
    });
  },400);

  cards.forEach((card,i)=>{
    const start=e=>{
      const s=e.touches?e.touches[0]:e;
      e.preventDefault&&e.preventDefault();
      bringTop(i);
      card.style.transition='box-shadow .2s';
      state[i].dragging=true;state[i].moved=false;
      state[i].ox=s.clientX-state[i].x;state[i].oy=s.clientY-state[i].y;
      state[i].vx=0;state[i].vy=0;
    };
    card.addEventListener('mousedown',start);
    card.addEventListener('touchstart',start,{passive:false});
  });

  const move=e=>{
    const s=e.touches?e.touches[0]:e;
    cards.forEach((card,i)=>{
      if(!state[i].dragging)return;
      const nx=s.clientX-state[i].ox,ny=s.clientY-state[i].oy;
      const dx=nx-state[i].x,dy=ny-state[i].y;
      if(Math.abs(dx)>4||Math.abs(dy)>4)state[i].moved=true;
      state[i].vx=dx;state[i].vy=dy;state[i].x=nx;state[i].y=ny;
      const tilt=Math.max(-18,Math.min(18,state[i].vx*.8));
      card.style.left=nx+'px';card.style.top=ny+'px';
      card.style.transform=`rotate(${rest[i].r+tilt}deg)`;
    });
  };
  document.addEventListener('mousemove',move);
  document.addEventListener('touchmove',move,{passive:true});

  // Photo preview
  const preview=document.getElementById('photoPreview');
  const previewImg=document.getElementById('previewImg');
  const previewClose=document.getElementById('previewClose');
  const previewPrev=document.getElementById('previewPrev');
  const previewNext=document.getElementById('previewNext');
  let previewIdx=0;

  function openPreview(idx){previewIdx=idx;previewImg.src=photoSrcs[idx];preview.classList.add('active');document.body.style.overflow='hidden'}
  function closePreview(){preview.classList.remove('active');document.body.style.overflow=''}
  function showPreview(idx){previewIdx=((idx%3)+3)%3;previewImg.src=photoSrcs[previewIdx]}

  if(previewClose) previewClose.addEventListener('click',closePreview);
  if(previewPrev) previewPrev.addEventListener('click',e=>{e.stopPropagation();showPreview(previewIdx-1)});
  if(previewNext) previewNext.addEventListener('click',e=>{e.stopPropagation();showPreview(previewIdx+1)});
  if(preview) preview.addEventListener('click',e=>{if(e.target===preview)closePreview()});

  const release=()=>cards.forEach((card,i)=>{
    if(!state[i].dragging)return;
    const wasDragged=state[i].moved;
    state[i].dragging=false;
    card.style.transition='left .5s cubic-bezier(.34,1.4,.64,1),top .5s cubic-bezier(.34,1.4,.64,1),transform .5s cubic-bezier(.34,1.4,.64,1)';
    card.style.left=rest[i].x+'px';card.style.top=rest[i].y+'px';
    card.style.transform=`rotate(${rest[i].r}deg)`;
    state[i].x=rest[i].x;state[i].y=rest[i].y;
    if(!wasDragged){
      const topIdx=zOrder[zOrder.length-1];
      if(topIdx===i){
        if(card.dataset.tapped==='1'){openPreview(i);card.dataset.tapped='0'}
        else{card.dataset.tapped='1';setTimeout(()=>{if(card.dataset.tapped==='1')card.dataset.tapped='0'},2000)}
      } else card.dataset.tapped='0';
    }
  });
  document.addEventListener('mouseup',release);
  document.addEventListener('touchend',release);

  let swipeStartX=0;
  if(previewImg){
    previewImg.addEventListener('touchstart',e=>{swipeStartX=e.touches[0].clientX},{passive:true});
    previewImg.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-swipeStartX;if(Math.abs(dx)>50)showPreview(dx<0?previewIdx+1:previewIdx-1)},{passive:true});
  }
})();