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

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, .prompt').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform += ' scale(1.6)';
    ring.style.borderColor = 'rgba(255,255,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.borderColor = 'rgba(255,255,255,0.4)';
  });
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  ring.style.opacity = '1';
});

/* ===========================
   Typewriter helper
   =========================== */
function typeInto(el, text, speed, done) {
  let i = 0;
  el.textContent = '';
  (function step() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(step, speed);
    } else if (done) {
      done();
    }
  })();
}

/* ===========================
   Prompt typewriter
   =========================== */
const promptText = document.getElementById('promptText');
const hint = document.getElementById('hint');

typeInto(promptText, 'me@minjung ~ $', 45, () => {
  hint.style.opacity = '0.5';
});

/* ===========================
   Easter egg: click prompt to run whoami
   =========================== */
const promptEl = document.getElementById('prompt');
const egg = document.getElementById('egg');
let eggShown = false;

const eggLines = [
  { type: 'cmd', text: '$ whoami' },
  { type: 'out', text: 'Aspiring New-Tech Research Engineer with a passion for systems at the intersection of data, cloud infrastructure & generative AI.' },
  { type: 'out', text: '對新技術充滿好奇，專注於雲端、資料庫與 AI 整合應用的研究與開發。' }
];

function runWhoami() {
  if (eggShown) return;
  eggShown = true;
  hint.style.opacity = '0';

  let delay = 0;
  eggLines.forEach(line => {
    const div = document.createElement('div');
    div.className = 'line ' + line.type;
    egg.appendChild(div);
    setTimeout(() => {
      div.style.opacity = '1';
      typeInto(div, line.text, 12);
    }, delay);
    delay += line.text.length * 12 + 300;
  });
}

promptEl.addEventListener('click', runWhoami);
