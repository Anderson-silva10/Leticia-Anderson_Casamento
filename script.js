/* =========================================================
   EDITE AQUI: data do casamento e links
   ========================================================= */

// Data e hora do casamento (formato: ano, mês-1, dia, hora, minuto)
const WEDDING_DATE = new Date(2027, 0, 21, 17, 30); // 21 de Janeiro de 2027, 17h30

// Link da lista de presentes (ex: link de loja, Vivara, Amazon, etc.)
const GIFT_LIST_URL = "https://www.havan.com.br/";

// Link para confirmar presença (ex: Google Forms, WhatsApp, Typeform)
const RSVP_URL = "https://wa.me/5512997047086?utm_source=chatgpt.com";

// Endereço do local (usado para gerar o link do Google Maps automaticamente)
const VENUE_ADDRESS = "Recanto VIP, Rodovia Aristeu Vieira Vilela N°601, Guaratinguetá, SP";

/* ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setupLinks();
  setupCarousel();
  setupCountdown();
  setupReveal();
});

/* ---------- links configuráveis ---------- */
function setupLinks(){
  const gift = document.getElementById('presentes');
  const rsvp = document.getElementById('presenca');
  const venue = document.getElementById('local');
  const venueAddressEl = document.getElementById('venueAddress');

  if(gift) gift.href = GIFT_LIST_URL;
  if(rsvp) rsvp.href = RSVP_URL;
  if(venueAddressEl) venueAddressEl.textContent = VENUE_ADDRESS;
  if(venue) venue.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(VENUE_ADDRESS);
}

/* ---------- carrossel ---------- */
function setupCarousel(){
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const carousel = document.getElementById('carousel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let index = 0;
  let autoplayTimer = null;

  dotsWrap.innerHTML = slides.map((_, i) => `<button class="carousel-dot${i===0?' active':''}" data-i="${i}" aria-label="Ir para foto ${i+1}"></button>`).join('');
  const dots = Array.from(dotsWrap.children);

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function startAutoplay(){
    if(reduceMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, 5000);
  }
  function stopAutoplay(){ if(autoplayTimer) clearInterval(autoplayTimer); }

  prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.i); startAutoplay(); }));

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  carousel.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft'){ prev(); startAutoplay(); }
    if(e.key === 'ArrowRight'){ next(); startAutoplay(); }
  });

  // swipe (touch) para mobile
  let touchStartX = 0, touchDeltaX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });
  track.addEventListener('touchend', () => {
    if(touchDeltaX > 50) prev();
    else if(touchDeltaX < -50) next();
    touchDeltaX = 0;
    startAutoplay();
  });

  goTo(0);
  startAutoplay();
}

/* ---------- contagem regressiva ---------- */
function setupCountdown(){
  const els = {
    days: document.getElementById('cdDays'),
    hours: document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds')
  };
  const pad = n => String(Math.max(n, 0)).padStart(2, '0');

  function tick(){
    const diff = WEDDING_DATE.getTime() - Date.now();
    if(diff <= 0){
      els.days.textContent = '00'; els.hours.textContent = '00';
      els.minutes.textContent = '00'; els.seconds.textContent = '00';
      const label = document.querySelector('.section-eyebrow');
      if(label) label.textContent = 'Já somos casados!';
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------- reveal on scroll ---------- */
function setupReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}
