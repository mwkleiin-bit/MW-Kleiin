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
