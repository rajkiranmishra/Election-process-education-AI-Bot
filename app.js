/* ── NAVBAR ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ── PARTICLES ─────────────────────────────────────────── */
(function createParticles() {
  const container = document.getElementById('particles');
  const symbols = ['🗳️','⭐','📋','🏛️','🎖️','📣'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = symbols[i % symbols.length];
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*6}s;animation-duration:${6+Math.random()*8}s;font-size:${14+Math.random()*18}px;opacity:${0.08+Math.random()*0.12}`;
    container.appendChild(p);
  }
})();

/* ── INTERSECTION OBSERVER (cards) ────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll('.overview-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
  observer.observe(card);
});

/* ── TIMELINE ──────────────────────────────────────────── */
(function buildTimeline() {
  const monthsEl = document.getElementById('timelineMonths');
  const detailEl = document.getElementById('timelineDetail');
  const progressEl = document.getElementById('timelineProgress');
  let active = null;

  TIMELINE_DATA.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = 'tm-month';
    btn.innerHTML = `<span class="tm-dot" style="background:${item.color}"></span><span class="tm-label">${item.month}</span>`;
    btn.setAttribute('aria-label', item.label);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tm-month').forEach(b => b.classList.remove('tm-active'));
      btn.classList.add('tm-active');
      active = idx;
      const pct = (idx / (TIMELINE_DATA.length - 1)) * 100;
      progressEl.style.width = pct + '%';
      renderTimelineDetail(item, detailEl);
    });
    monthsEl.appendChild(btn);
  });
})();

function renderTimelineDetail(item, el) {
  el.innerHTML = `
    <div class="td-card" style="border-top:3px solid ${item.color}">
      <div class="td-header">
        <span class="td-badge" style="background:${item.color}20;color:${item.color}">${item.phase}</span>
        <span class="td-month-label">${item.label}</span>
      </div>
      <div class="td-title-row"><span class="td-big-icon">${item.icon}</span><h3>${item.title}</h3></div>
      <ul class="td-events">
        ${item.events.map(e => `<li><span class="td-check">✓</span>${e}</li>`).join('')}
      </ul>
      <div class="td-tip"><span>💡</span>${item.tip}</div>
    </div>`;
}

/* ── STEPS ACCORDION ───────────────────────────────────── */
(function buildSteps() {
  const container = document.getElementById('stepsContainer');
  STEPS_DATA.forEach((step, idx) => {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.innerHTML = `
      <button class="step-header" aria-expanded="false" id="step-btn-${idx}">
        <div class="step-left">
          <span class="step-num">${step.num}</span>
          <span class="step-icon">${step.icon}</span>
          <div class="step-title-wrap">
            <span class="step-tag">${step.tag}</span>
            <span class="step-title">${step.title}</span>
          </div>
        </div>
        <span class="step-chevron">▾</span>
      </button>
      <div class="step-body" id="step-body-${idx}" hidden>
        <p class="step-summary">${step.summary}</p>
        <div class="step-details">
          ${step.details.map(d => `
            <div class="step-detail-block">
              <h4>${d.heading}</h4>
              <p>${d.body}</p>
            </div>`).join('')}
        </div>
      </div>`;
    const btn = item.querySelector('.step-header');
    const body = item.querySelector('.step-body');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      // close all
      document.querySelectorAll('.step-header').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.step-item').querySelector('.step-body').hidden = true;
        b.closest('.step-item').classList.remove('step-open');
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        body.hidden = false;
        item.classList.add('step-open');
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
    });
    container.appendChild(item);
    observer.observe(item);
  });
})();

/* ── QUIZ ──────────────────────────────────────────────── */
let qIdx = 0, qScore = 0, qAnswered = false, qWrong = [];

document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('nextQBtn').addEventListener('click', nextQuestion);
document.getElementById('retakeBtn').addEventListener('click', retakeQuiz);

function startQuiz() {
  qIdx = 0; qScore = 0; qWrong = [];
  document.getElementById('quizStart').classList.add('hidden');
  document.getElementById('quizCard').classList.remove('hidden');
  document.getElementById('quizResults').classList.add('hidden');
  renderQuestion();
}

function renderQuestion() {
  qAnswered = false;
  const data = QUIZ_DATA[qIdx];
  document.getElementById('quizCounter').textContent = `Question ${qIdx + 1} / ${QUIZ_DATA.length}`;
  document.getElementById('quizFill').style.width = `${((qIdx) / QUIZ_DATA.length) * 100}%`;
  document.getElementById('liveScore').textContent = qScore;
  document.getElementById('quizQuestion').textContent = data.q;
  document.getElementById('quizExplanation').classList.add('hidden');
  document.getElementById('nextQBtn').classList.add('hidden');

  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  data.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65+i)}</span>${opt}`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    opts.appendChild(btn);
  });
}

function selectAnswer(idx, btn) {
  if (qAnswered) return;
  qAnswered = true;
  const correct = QUIZ_DATA[qIdx].ans;
  const allBtns = document.querySelectorAll('.quiz-opt');
  allBtns.forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('opt-correct');
  });
  if (idx === correct) {
    qScore++;
    btn.classList.add('opt-correct');
  } else {
    btn.classList.add('opt-wrong');
    qWrong.push(qIdx);
  }
  document.getElementById('liveScore').textContent = qScore;
  const expEl = document.getElementById('quizExplanation');
  expEl.innerHTML = `<span class="exp-label">${idx === correct ? '✅ Correct!' : '❌ Incorrect'}</span> ${QUIZ_DATA[qIdx].exp}`;
  expEl.className = `quiz-explanation ${idx === correct ? 'exp-correct' : 'exp-wrong'}`;
  document.getElementById('nextQBtn').textContent = qIdx < QUIZ_DATA.length - 1 ? 'Next Question →' : 'See Results →';
  document.getElementById('nextQBtn').classList.remove('hidden');
}

function nextQuestion() {
  qIdx++;
  if (qIdx >= QUIZ_DATA.length) showResults();
  else renderQuestion();
}

function showResults() {
  document.getElementById('quizCard').classList.add('hidden');
  const res = document.getElementById('quizResults');
  res.classList.remove('hidden');
  document.getElementById('qrScore').textContent = qScore;
  const icons = ['😬','😕','🙂','😊','🌟','🏆'];
  const iconIdx = Math.floor((qScore / 10) * (icons.length - 1));
  document.getElementById('qrIcon').textContent = icons[iconIdx];
  const msgs = [
    [0,3,'Keep learning! Work through each section of this guide and try again.'],
    [4,6,'Good start! Review the steps and timeline sections to boost your score.'],
    [7,8,'Well done! You have a solid understanding of the election process.'],
    [9,10,'Outstanding! You\'re an election expert. Share this quiz with friends!']
  ];
  const [, , msg] = msgs.find(([lo, hi]) => qScore >= lo && qScore <= hi);
  document.getElementById('qrMessage').textContent = msg;
  const pct = Math.round((qScore / 10) * 100);
  document.getElementById('qrTitle').textContent = `Quiz Complete! You scored ${pct}%`;
  const bd = document.getElementById('qrBreakdown');
  bd.innerHTML = QUIZ_DATA.map((q, i) => {
    const ok = !qWrong.includes(i);
    return `<div class="bd-row ${ok ? 'bd-ok' : 'bd-fail'}"><span>${ok ? '✅' : '❌'}</span><span>${q.q}</span></div>`;
  }).join('');
}

function retakeQuiz() {
  document.getElementById('quizResults').classList.add('hidden');
  startQuiz();
}

/* ── AI CHAT ───────────────────────────────────────────── */
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');

chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

window.sendChip = function(btn) {
  chatInput.value = btn.textContent;
  sendMessage();
};

window.sendMessage = function() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  appendMessage(text, 'user');
  setTimeout(() => {
    appendMessage(null, 'bot', getResponse(text));
  }, 700);
};

function appendMessage(text, role, html) {
  const wrap = document.createElement('div');
  wrap.className = `chat-message ${role}-message`;
  if (role === 'bot') {
    wrap.innerHTML = `<div class="msg-avatar">🗳️</div><div class="msg-bubble"><div class="bot-resp-title">${html.icon} ${html.title}</div><p>${html.body}</p></div>`;
  } else {
    wrap.innerHTML = `<div class="msg-bubble user-bubble">${text}</div>`;
  }
  chatWindow.appendChild(wrap);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('register') || t.includes('sign up') || t.includes('eligible')) return AI_RESPONSES['register'];
  if (t.includes('electoral') || t.includes('college') || t.includes('electors')) return AI_RESPONSES['electoral college'];
  if (t.includes('count') || t.includes('tally') || t.includes('ballot')) return AI_RESPONSES['count'];
  if (t.includes('tie') || t.includes('no winner') || t.includes('270')) return AI_RESPONSES['tie'];
  return AI_RESPONSES['default'];
}

/* ── SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── ML SECTION ────────────────────────────────────────── */
(function buildMLSection() {
  const grid  = document.getElementById('mlGrid');
  const panel = document.getElementById('mlDetail');
  if (!grid) return;
  let firstCard = null;
  ML_DATA.forEach((item, idx) => {
    const card = document.createElement('button');
    card.className = 'ml-card';
    card.innerHTML = `
      <div class="ml-card-icon" style="background:${item.color}18;border-color:${item.color}40">${item.icon}</div>
      <div class="ml-card-tag" style="color:${item.color}">${item.tag}</div>
      <h4 class="ml-card-title">${item.title}</h4>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.ml-card').forEach(c => { c.classList.remove('ml-card-active'); c.style.borderColor=''; });
      card.classList.add('ml-card-active');
      card.style.borderColor = item.color;
      renderMLDetail(item, panel);
      panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
    grid.appendChild(card);
    if (idx === 0) firstCard = card;
  });
  if (firstCard) firstCard.click();
})();

function renderMLDetail(item, el) {
  const sc = ML_SCORES[item.title] || { impact:75, accuracy:75, riskPct:50 };
  el.innerHTML = `
    <div class="ml-detail-card" style="border-top:3px solid ${item.color}">
      <div class="ml-detail-header">
        <span class="ml-detail-icon">${item.icon}</span>
        <div>
          <div class="ml-detail-tag" style="color:${item.color}">${item.tag}</div>
          <h3 class="ml-detail-title">${item.title}</h3>
        </div>
      </div>
      <div class="ml-scores">
        ${scorebar('⚡ Impact Score',      sc.impact,   '#7c3aed')}
        ${scorebar('🎯 Accuracy Potential',sc.accuracy, '#14b8a6')}
        ${scorebar('⚠️ Ethical Risk',       sc.riskPct,  '#ef4444')}
      </div>
      <div class="ml-tabs">
        <button class="ml-tab ml-tab-active" data-tab="how">⚙️ How It Works</button>
        <button class="ml-tab" data-tab="risk">⚠️ Risks</button>
        <button class="ml-tab" data-tab="example">📌 Example</button>
      </div>
      <div class="ml-tab-body">
        <div data-panel="how" class="ml-panel">
          <ul class="ml-points">${item.points.map(p=>`<li>${p}</li>`).join('')}</ul>
        </div>
        <div data-panel="risk" class="ml-panel hidden"><p class="ml-risk-text">${item.risk}</p></div>
        <div data-panel="example" class="ml-panel hidden"><p class="ml-example-text">${item.example}</p></div>
      </div>
      <p class="ml-detail-summary">${item.summary}</p>
    </div>`;
  el.querySelectorAll('.ml-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.ml-tab').forEach(b=>b.classList.remove('ml-tab-active'));
      el.querySelectorAll('.ml-panel').forEach(p=>p.classList.add('hidden'));
      btn.classList.add('ml-tab-active');
      el.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.remove('hidden');
    });
  });
  requestAnimationFrame(() => {
    el.querySelectorAll('.score-fill').forEach(b=>{ b.style.width=b.dataset.val+'%'; });
  });
}

function scorebar(label, val, color) {
  return `<div class="score-row">
    <span class="score-label">${label}</span>
    <div class="score-track"><div class="score-fill" data-val="${val}" style="background:${color};width:0%"></div></div>
    <span class="score-num" style="color:${color}">${val}%</span>
  </div>`;
}

/* ── GLOBAL ELECTIONS SECTION ──────────────────────────── */
(function buildGlobalSection() {
  const tabsEl = document.getElementById('regionTabs');
  const gridEl = document.getElementById('countryGrid');
  if (!tabsEl) return;

  const chartEl = document.createElement('div');
  chartEl.id = 'turnoutChart';
  chartEl.className = 'turnout-chart';
  gridEl.parentNode.insertBefore(chartEl, gridEl);

  const regions = Object.keys(COUNTRIES_DATA);
  let activeRegion = regions[0];

  function renderTurnoutChart(region) {
    const countries = COUNTRIES_DATA[region];
    chartEl.innerHTML = `<div class="chart-title">📊 Voter Turnout Comparison — ${region}</div>` +
      countries.map(c => {
        const ex = COUNTRY_EXTRAS[c.name] || { turnoutNum:60 };
        const col = ex.turnoutNum >= 80 ? '#10b981' : ex.turnoutNum >= 60 ? '#3b82f6' : '#f59e0b';
        return `<div class="chart-row">
          <span class="chart-flag">${c.flag}</span>
          <span class="chart-name">${c.name}</span>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" data-val="${ex.turnoutNum}" style="background:${col};width:0%"></div>
          </div>
          <span class="chart-pct" style="color:${col}">${ex.turnoutNum}%</span>
        </div>`;
      }).join('');
    requestAnimationFrame(() => {
      chartEl.querySelectorAll('.chart-bar-fill').forEach(b=>{ b.style.width=b.dataset.val+'%'; });
    });
  }

  function renderCountries(region) {
    gridEl.innerHTML = '';
    COUNTRIES_DATA[region].forEach(c => {
      const ex = COUNTRY_EXTRAS[c.name] || {};
      const card = document.createElement('div');
      card.className = 'country-card';
      card.innerHTML = `
        <div class="cc-main">
          <div class="cc-flag">${c.flag}</div>
          <div class="cc-body">
            <h4 class="cc-name">${c.name}</h4>
            <div class="cc-system">${c.system}</div>
            <div class="cc-meta">
              <span class="cc-badge">${c.type}</span>
              <span class="cc-badge">${c.method}</span>
              <span class="cc-badge">Every ${c.cycle}</span>
              <span class="cc-badge cc-turnout">Turnout ${c.turnout}</span>
            </div>
          </div>
          <span class="cc-expand-icon">﹀</span>
        </div>
        <div class="cc-extra hidden">
          <p class="cc-fact">💡 ${c.fact}</p>
          <div class="cc-extra-grid">
            <div class="cc-extra-item"><span>🗓️ Last Election</span><strong>${ex.recentElection||'—'}</strong></div>
            <div class="cc-extra-item"><span>🔞 Voting Age</span><strong>${ex.voteAge||18}+</strong></div>
            <div class="cc-extra-item"><span>📋 Compulsory?</span><strong>${ex.compulsory?'✅ Yes':'❌ No'}</strong></div>
          </div>
          <div class="cc-turnout-bar-wrap">
            <span class="cc-tb-label">Turnout</span>
            <div class="cc-tb-track"><div class="cc-tb-fill" data-val="${ex.turnoutNum||60}" style="width:0%"></div></div>
            <span class="cc-tb-pct">${ex.turnoutNum||60}%</span>
          </div>
        </div>`;

      card.addEventListener('click', () => {
        const isOpen = !card.querySelector('.cc-extra').classList.contains('hidden');
        gridEl.querySelectorAll('.country-card').forEach(cd => {
          cd.querySelector('.cc-extra').classList.add('hidden');
          cd.classList.remove('cc-open');
          cd.querySelector('.cc-expand-icon').textContent = '﹀';
        });
        if (!isOpen) {
          card.querySelector('.cc-extra').classList.remove('hidden');
          card.classList.add('cc-open');
          card.querySelector('.cc-expand-icon').textContent = '︿';
          requestAnimationFrame(() => {
            const fill = card.querySelector('.cc-tb-fill');
            if (fill) fill.style.width = fill.dataset.val + '%';
          });
        }
      });
      gridEl.appendChild(card);
    });
    renderTurnoutChart(region);
  }

  regions.forEach(region => {
    const btn = document.createElement('button');
    btn.className = 'region-tab' + (region === activeRegion ? ' region-active' : '');
    btn.textContent = region;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.region-tab').forEach(b=>b.classList.remove('region-active'));
      btn.classList.add('region-active');
      activeRegion = region;
      gridEl.style.opacity = '0'; chartEl.style.opacity = '0';
      setTimeout(() => {
        renderCountries(region);
        gridEl.style.opacity = '1'; chartEl.style.opacity = '1';
      }, 220);
    });
    tabsEl.appendChild(btn);
  });

  renderCountries(activeRegion);
})();


