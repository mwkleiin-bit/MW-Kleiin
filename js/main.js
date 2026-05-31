// ==========================================
//  KLEIIN MW — main.js
//  Cybersecurity & Web Development
// ==========================================


// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) el.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// ── NAV ACTIVE HIGHLIGHT ──
const sections = document.querySelectorAll('section, #inicio');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? '#38bdf8' : '';
  });
});


// ── MATRIX RAIN INTRO ──
(function () {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');
  const intro  = document.getElementById('matrix-intro');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars    = '01クレインMWKLEIIN0110サイバーSECURITYWEB01';
  const fontSize = 14;
  const cols     = Math.floor(canvas.width / fontSize);
  const drops    = Array(cols).fill(1);
  const colors   = ['#38bdf8', '#1e6fa8', '#7dd3fc', '#0ea5e9'];

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(char, i * fontSize, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  const interval = setInterval(drawMatrix, 40);

  // Después de 2.5s → cortina baja y aparece la web
  setTimeout(() => {
    clearInterval(interval);
    intro.classList.add('hide');
    setTimeout(() => { intro.style.display = 'none'; }, 900);
  }, 2500);
})();


// ── CARRUSEL DE TRABAJOS ──
document.addEventListener("DOMContentLoaded", () => {
  const track        = document.getElementById("carouselTrack");
  const prevBtn      = document.getElementById("prevBtn");
  const nextBtn      = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const cards        = document.querySelectorAll(".carousel-card");

  if (!track || cards.length === 0 || !prevBtn || !nextBtn || !dotsContainer) {
    console.warn("Elementos del carrusel no encontrados.");
    return;
  }

  let currentIndex   = 0;
  let isDragging     = false;
  let startX         = 0;
  let currentTranslate = 0;
  let prevTranslate  = 0;
  let animationId    = 0;
  let userInteracted = false;

  // ── Crear dots ──
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("c-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".c-dot");

  // ── Mover carrusel ──
  function updateCarousel() {
    const cardWidth    = cards[0].offsetWidth + 16;
    currentTranslate   = -currentIndex * cardWidth;
    prevTranslate      = currentTranslate;
    track.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform  = `translateX(${currentTranslate}px)`;

    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
  }

  // ── Auto avance ──
  let autoPlay = setInterval(advance, 4000);

  function advance() {
    currentIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(advance, 4000);
  }

  // ── Flechas ──
  nextBtn.addEventListener("click", () => {
    currentIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
    resetAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
    updateCarousel();
    resetAutoPlay();
  });

  // ── Swipe táctil y drag mouse ──
  track.addEventListener("touchstart", touchStart, { passive: true });
  track.addEventListener("touchend",   touchEnd);
  track.addEventListener("touchmove",  touchMove, { passive: true });
  track.addEventListener("mousedown",  touchStart);
  track.addEventListener("mouseup",    touchEnd);
  track.addEventListener("mouseleave", touchEnd);
  track.addEventListener("mousemove",  touchMove);

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function touchStart(event) {
    isDragging = true;
    startX     = getPositionX(event);
    track.classList.add('dragging');
    track.style.transition = 'none';
    animationId = requestAnimationFrame(animation);
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentX   = getPositionX(event);
    currentTranslate = prevTranslate + (currentX - startX);
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationId);
    track.classList.remove('dragging');

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentIndex < cards.length - 1) currentIndex++;
    else if (movedBy > 50 && currentIndex > 0) currentIndex--;

    updateCarousel();
    resetAutoPlay();
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  // ── Recalcular en resize ──
  window.addEventListener("resize", updateCarousel);

  // ── Pausar autoplay si el usuario está sobre el carrusel ──
  track.addEventListener("mouseenter", () => clearInterval(autoPlay));
  track.addEventListener("mouseleave", () => {
    if (!isDragging) resetAutoPlay();
  });

  // Init
  updateCarousel();
});
