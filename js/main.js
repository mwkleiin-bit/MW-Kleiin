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


// ── LÓGICA DEL CARRUSEL DE TRABAJOS OPTIMIZADA (KLEIIN MW) ──

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const cards = document.querySelectorAll(".carousel-card");

  if (!track || cards.length === 0 || !prevBtn || !nextBtn || !dotsContainer) {
    console.warn("No se encontraron los elementos del carrusel en el HTML.");
    return;
  }

  let currentIndex = 0;

  // Variables para la lógica táctil (Swipe) en celulares
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationId = 0;

  // 1. Crear los puntos (dots) dinámicamente según las tarjetas
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("c-dot");
    if (index === 0) dot.classList.add("active");
    
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".c-dot");

  // 2. Función clave para mover el carrusel calculando el ancho real exacto
  function updateCarousel() {
    // Tomamos offsetWidth de la tarjeta + 16px de gap que definimos en el CSS optimizado
    const cardWidth = cards[0].offsetWidth + 16; 
    
    currentTranslate = -currentIndex * cardWidth;
    prevTranslate = currentTranslate;
    
    track.style.transform = `translateX(${currentTranslate}px)`;

    // Actualizamos el estado visual del punto activo
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // 3. Control de la flecha "Siguiente"
  nextBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Vuelve al inicio al llegar al final
    }
    updateCarousel();
  });

  // 4. Control de la flecha "Anterior"
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1; // Va al final si retrocede desde el inicio
    }
    updateCarousel();
  });

  // 5. SOPORTE INTERACTIVO TÁCTIL (Swipe para Mobile / Drag para PC)
  track.addEventListener("touchstart", touchStart);
  track.addEventListener("touchend", touchEnd);
  track.addEventListener("touchmove", touchMove);

  track.addEventListener("mousedown", touchStart);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", touchEnd);
  track.addEventListener("mousemove", touchMove);

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function touchStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    track.classList.add('dragging');
    animationId = requestAnimationFrame(animation);
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const currentPosition = prevTranslate + (currentX - startX);
    currentTranslate = currentPosition;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationId);
    track.classList.remove('dragging');

    const movedBy = currentTranslate - prevTranslate;

    // Si arrastró más de 50px, cambia de tarjeta
    if (movedBy < -50 && currentIndex < cards.length - 1) {
      currentIndex++;
    } else if (movedBy > 50 && currentIndex > 0) {
      currentIndex--;
    }

    updateCarousel();
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  // 6. Recalcular posición si rota la pantalla o cambia el tamaño (Resize)
  window.addEventListener("resize", updateCarousel);
});
