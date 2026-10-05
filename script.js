// Custom cursor
const cursor = document.getElementById('cursor');
let cx = 0, cy = 0, tx = 0, ty = 0;
window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
function loop(){
  cx += (tx - cx) * 0.18;
  cy += (ty - cy) * 0.18;
  cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
  requestAnimationFrame(loop);
}
loop();
document.querySelectorAll('a, .film, .tile, .fact, .fear').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
});

// Scroll progress + nav
const progress = document.getElementById('progress');
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = pct + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 40);
});

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:0.15, rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Trigger hero immediately
requestAnimationFrame(()=>{
  document.querySelectorAll('.hero .reveal').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('in'), 150 + i*180);
  });
});

// Hero parallax
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll',()=>{
  const y = window.scrollY;
  if(y < window.innerHeight){
    heroBg.style.transform = `scale(1.05) translateY(${y*0.35}px)`;
  }
},{passive:true});

// Smooth in-page scroll
document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id = a.getAttribute('href');
    if(id && id.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// Gallery hover lightbox — zeigt Bild in voller Größe bei Hover
(function(){
  const overlay = document.createElement('div');
  overlay.className = 'tile-lightbox';
  overlay.innerHTML = '<img alt="">';
  document.body.appendChild(overlay);
  const bigImg = overlay.querySelector('img');
  let currentTile = null;

  document.querySelectorAll('.gallery .tile').forEach(tile=>{
    const img = tile.querySelector('img');
    if(!img) return;
    tile.addEventListener('mouseenter',()=>{
      currentTile = tile;
      bigImg.src = img.currentSrc || img.src;
      bigImg.alt = img.alt || '';
      overlay.classList.add('show');
    });
    tile.addEventListener('mouseleave',()=>{
      if(currentTile === tile){
        overlay.classList.remove('show');
        currentTile = null;
      }
    });
  });
  // Escape / click closes
  overlay.addEventListener('click',()=>overlay.classList.remove('show'));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') overlay.classList.remove('show'); });
})();
