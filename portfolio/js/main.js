/* ===========================
   Custom Cursor
   =========================== */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

let mx = 0, my = 0;
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

// Smooth ring follow
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card, .stat').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform += ' scale(1.6)';
    ring.style.borderColor = 'rgba(56,189,248,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.borderColor = 'rgba(56,189,248,0.4)';
  });
});

/* ===========================
   Scroll Reveal
   =========================== */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 100;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

/* ===========================
   Mobile Nav Toggle
   =========================== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ===========================
   Active nav link on scroll
   =========================== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===========================
   Typewriter effect on hero tag
   =========================== */
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const original = heroTag.textContent;
  heroTag.textContent = '';
  let i = 0;
  const type = () => {
    if (i < original.length) {
      heroTag.textContent += original[i++];
      setTimeout(type, 40);
    }
  };
  // Start after fade-in animation delay
  setTimeout(type, 200);
}

/* ===========================
   Hide cursor when leaving window
   =========================== */
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  ring.style.opacity = '1';
});
