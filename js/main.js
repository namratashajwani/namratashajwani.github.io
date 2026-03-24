/* ═══════════════════════════════════════════════
   NAMRATA SHAJWANI — SHARED JS
   js/main.js
   Loaded on every page: nav scroll behavior
   ═══════════════════════════════════════════════ */

// ── NAV SCROLL (only on pages with a hero behind the nav) ──
// Pages with class "has-hero" on <body> get the transparent→solid transition.
// Pages without it (inner pages) use nav-solid class set in HTML.
(function(){
  const nav = document.getElementById('nav');
  const circle = document.getElementById('navCircle');
  if(!nav || !circle) return;

  const isHeroPage = document.body.classList.contains('has-hero');

  if(isHeroPage){
    // Hero pages: transparent nav that turns solid on scroll
    window.addEventListener('scroll', function(){
      const scrolled = window.scrollY > window.innerHeight * 0.85;
      nav.classList.toggle('scrolled', scrolled);
    });
    // Circle click on hero = scroll to top
    // (homepage overrides this in home.js for slideshow advance)
    circle.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  } else {
    // Inner pages: circle always goes home
    circle.addEventListener('click', function(){
      window.location.href = '/';
    });
  }
})();