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

function bindRingHover(el) {
  el.addEventListener('mouseenter', () => {
    ring.style.transform += ' scale(1.6)';
    ring.style.borderColor = 'rgba(255,255,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.borderColor = 'rgba(255,255,255,0.4)';
  });
}
document.querySelectorAll('a').forEach(bindRingHover);

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  ring.style.opacity = '1';
});

/* ===========================
   Terminal command engine
   =========================== */
const output = document.getElementById('output');
const input = document.getElementById('cmdInput');

const links = {
  github: 'https://github.com/Peter930427',
  linkedin: 'https://linkedin.com/in/閔容-薛-466235297',
  instagram: 'https://www.instagram.com/xue_minrong?igsh=MWdpNHRsYzd5bDY5bA%3D%3D&utm_source=qr',
  email: 'mailto:skrmeaning@gmail.com'
};

const projects = [
  { name: 'News Digest Bot', zh: '新聞摘要機器人', stack: 'Python · BeautifulSoup · OpenAI API', desc: '自動爬取新聞並用生成式 AI 產生摘要，展示 API 串接與 LLM 整合。' },
  { name: 'Expense Tracker', zh: '個人支出追蹤系統', stack: 'Python · SQLite · Flask', desc: '個人財務管理全端 CRUD 應用，著重資料庫結構設計與資料完整性。' },
  { name: 'Open Data Dashboard', zh: '公開資料視覺化儀表板', stack: 'JavaScript · Chart.js · data.gov.tw', desc: '將台灣政府開放資料轉化為互動式圖表與地圖。' },
  { name: 'RAG Q&A Prototype', zh: 'RAG 知識問答原型', stack: 'Python · LlamaIndex · OpenAI · Vector DB', desc: '檢索增強生成原型，將文件建立向量索引並回答自然語言問題。' }
];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function printLine(html, cls) {
  const div = document.createElement('div');
  div.className = 'term-line' + (cls ? ' ' + cls : '');
  div.innerHTML = html;
  output.appendChild(div);
  div.querySelectorAll('a').forEach(bindRingHover);
}

function printBlock(text) {
  const div = document.createElement('div');
  div.className = 'term-block';
  div.textContent = text;
  output.appendChild(div);
}

const commands = {
  help() {
    printBlock(
      'available commands:\n' +
      '  whoami      show a short bio\n' +
      '  skills      list technical skills\n' +
      '  projects    list selected projects\n' +
      '  contact     show contact links\n' +
      '  clear       clear the terminal'
    );
  },
  whoami() {
    printBlock(
      'Aspiring New-Tech Research Engineer with a passion for systems at the\n' +
      'intersection of data, cloud infrastructure & generative AI.\n' +
      '對新技術充滿好奇，專注於雲端、資料庫與 AI 整合應用的研究與開發。'
    );
  },
  skills() {
    printBlock(
      'backend    Python · REST API · Web Scraping · Node.js\n' +
      'data       MySQL · SQLite · MongoDB · SQL\n' +
      'cloud/ai   OpenAI API · RAG · AWS · GCP\n' +
      'frontend   HTML/CSS · JavaScript · Chart.js · Figma'
    );
  },
  projects() {
    projects.forEach((p, i) => {
      printLine(`<span class="idx">${String(i + 1).padStart(2, '0')}</span> <span class="proj-name">${escapeHtml(p.name)}</span> <span class="proj-zh">${escapeHtml(p.zh)}</span>`);
      printLine(`&nbsp;&nbsp;&nbsp;<span class="proj-stack">${escapeHtml(p.stack)}</span>`);
      printLine(`&nbsp;&nbsp;&nbsp;${escapeHtml(p.desc)}`);
    });
    printLine('run <span class="cmd-hl">github</span> to see the full source code.');
  },
  contact() {
    printLine(`email      <a href="${links.email}">skrmeaning@gmail.com</a>`);
    printLine(`github     <a href="${links.github}" target="_blank">github.com/Peter930427</a>`);
    printLine(`linkedin   <a href="${links.linkedin}" target="_blank">linkedin.com/in/閔容-薛-466235297</a>`);
    printLine(`instagram  <a href="${links.instagram}" target="_blank">instagram.com/xue_minrong</a>`);
  },
  github() {
    window.open(links.github, '_blank');
    printLine('opening github…');
  },
  linkedin() {
    window.open(links.linkedin, '_blank');
    printLine('opening linkedin…');
  },
  instagram() {
    window.open(links.instagram, '_blank');
    printLine('opening instagram…');
  },
  email() {
    window.location.href = links.email;
    printLine('opening mail client…');
  },
  clear() {
    output.innerHTML = '';
  },
  sudo() {
    printLine('Permission denied: nice try. 😏');
  }
};
commands.about = commands.whoami;
commands.links = commands.contact;
commands.ls = commands.help;

const history = [];
let historyIndex = -1;

function runCommand(raw) {
  const cmd = raw.trim();
  printLine(`<span class="echo-prompt">me@minjung ~ $</span>${escapeHtml(cmd)}`, 'echo');
  if (!cmd) return;

  history.push(cmd);
  historyIndex = history.length;

  const fn = commands[cmd.toLowerCase()];
  if (fn) {
    fn();
  } else {
    printLine(`bash: ${escapeHtml(cmd)}: command not found — type <span class="cmd-hl">help</span>`);
  }

  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    runCommand(input.value);
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    if (history.length) {
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || '';
      e.preventDefault();
    }
  } else if (e.key === 'ArrowDown') {
    if (history.length) {
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || '';
      e.preventDefault();
    }
  }
});

document.addEventListener('click', e => {
  if (!e.target.closest('a')) input.focus();
});
input.focus();
