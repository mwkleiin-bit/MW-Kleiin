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
// ── LÓGICA DEL CARRUSEL DE TRABAJOS (KLEIIN MW) ──

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("carouselDots");
  const cards = document.querySelectorAll(".carousel-card");

  // Validación por si acaso no encuentra los elementos en el HTML
  if (!track || cards.length === 0 || !prevBtn || !nextBtn || !dotsContainer) {
    console.warn("No se encontraron los elementos del carrusel en el HTML.");
    return;
  }

  let currentIndex = 0;

  // 1. Crear los puntos (dots) dinámicamente según las tarjetas que tengas
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("c-dot");
    if (index === 0) dot.classList.add("active"); // El primero arranca activo
    
    // Al hacer clic en un punto, va directo a esa tarjeta
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".c-dot");

  // 2. Función para mover el carrusel y actualizar los puntos
  function updateCarousel() {
    // Tomamos el ancho real de una tarjeta + los 20px de gap que configuraste en CSS
    const cardWidth = cards[0].getBoundingClientRect().width + 20; 
    
    // Desplazamos el contenedor track hacia la izquierda
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

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
      currentIndex = 0; // Al llegar al final, vuelve al inicio
    }
    updateCarousel();
  });

  // 4. Control de la flecha "Anterior"
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1; // Si está al inicio y va para atrás, va al final
    }
    updateCarousel();
  });

  // 5. Ajustar la posición si el usuario cambia el tamaño de la ventana (Resize)
  window.addEventListener("resize", updateCarousel);
});
