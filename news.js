/* ═══════════════════════════════════════════════════════
   ElectIQ — AI Hub · news.js
   Features:
   • Live Google News RSS via rss2json
   • Chain-of-thought thinking panel
   • Auto-fallback to news when KB lacks knowledge
   • Conversational memory (last topic, user name)
   • Natural dialogue, greetings, follow-ups
   ═══════════════════════════════════════════════════════ */

/* ── CONFIG ── */
const RSS_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const GNEWS   = 'https://news.google.com/rss/search?q=';
const SUFFIX  = '&hl=en-US&gl=US&ceid=US:en';

const POS = ['win','wins','lead','leads','surge','ahead','strong','popular','victory','rise','gain','majority','favored','dominant','success','triumph'];
const NEG = ['lose','loses','scandal','controversy','drops','behind','weak','defeat','crisis','corrupt','fraud','fall','failing','trouble','resign','impeach'];

/* ── CONVERSATION MEMORY ── */
const HUB_MEM = { lastTopic: null, msgCount: 0, userName: null };

/* ── FETCH ── */
async function fetchNews(query) {
  const rss = GNEWS + encodeURIComponent(query) + SUFFIX;
  const r   = await fetch(RSS_API + encodeURIComponent(rss));
  const d   = await r.json();
  return d.items || [];
}

/* ── SENTIMENT ── */
function analyzeSentiment(articles) {
  let pos = 0, neg = 0;
  articles.forEach(a => {
    const t = ((a.title||'') + ' ' + (a.description||'')).toLowerCase();
    POS.forEach(w => { if (t.includes(w)) pos++; });
    NEG.forEach(w => { if (t.includes(w)) neg++; });
  });
  const total = pos + neg || 1;
  const fav = Math.min(95, Math.max(5, Math.round((pos / total) * 100)));
  return { fav, sentiment: fav>=60?'Positive':fav<=40?'Negative':'Mixed', pos, neg, count: articles.length };
}

/* ── TAB SWITCH ── */
window.switchHub = function(panel, btn) {
  document.querySelectorAll('.hub-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.hub-tab').forEach(b => b.classList.remove('hub-active'));
  document.getElementById('hub-' + panel).classList.remove('hidden');
  btn.classList.add('hub-active');
};

/* ── NEWS SEARCH ── */
window.searchNews = async function() {
  const q  = document.getElementById('newsQuery').value.trim();
  if (!q) return;
  const el = document.getElementById('newsResults');
  el.innerHTML = '<div class="hub-loading"><div class="hub-spinner"></div><p>Fetching from Google News…</p></div>';
  try {
    const arts = await fetchNews(q);
    if (!arts.length) { el.innerHTML = '<div class="hub-empty"><span>😔</span><p>No results found. Try a different term.</p></div>'; return; }
    el.innerHTML = arts.slice(0,9).map(a => newsCard(a)).join('');
  } catch(e) {
    el.innerHTML = '<div class="hub-empty"><span>⚠️</span><p>Could not load news. Check your connection.</p></div>';
  }
};

function newsCard(a) {
  const date = a.pubDate ? new Date(a.pubDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '';
  const src  = a.source?.name || '';
  const desc = (a.description||'').replace(/<[^>]*>/g,'').slice(0,110)+'…';
  const img  = a.enclosure?.link ? `<img src="${a.enclosure.link}" class="nc-img" onerror="this.style.display='none'" />` : '';
  return `<a class="news-card" href="${a.link}" target="_blank" rel="noopener">
    ${img}
    <div class="nc-body">
      <div class="nc-meta"><span class="nc-source">${src}</span><span class="nc-date">${date}</span></div>
      <h4 class="nc-title">${a.title}</h4>
      <p class="nc-desc">${desc}</p>
    </div>
  </a>`;
}

/* ── PREDICT ── */
window.predictOutcome = async function() {
  const q  = document.getElementById('predictQuery').value.trim();
  if (!q) return;
  const el = document.getElementById('predictResult');
  el.innerHTML = `<div class="hub-loading"><div class="hub-spinner"></div><p>Analysing sentiment for <strong>${q}</strong>…</p></div>`;
  try {
    const arts = await fetchNews(q + ' election poll vote');
    if (!arts.length) { el.innerHTML = '<div class="hub-empty"><span>📭</span><p>No news found. Try a different topic.</p></div>'; return; }
    const s   = analyzeSentiment(arts);
    const col = s.fav>=60?'#10b981':s.fav<=40?'#ef4444':'#f59e0b';
    const ico = s.fav>=70?'🟢':s.fav>=50?'🟡':'🔴';
    el.innerHTML = `
      <div class="predict-card">
        <div class="predict-header">
          <div><div class="predict-topic">${q}</div><div class="predict-label">AI Sentiment Prediction</div></div>
          <div class="predict-score" style="color:${col}">${s.fav}%</div>
        </div>
        <div class="predict-track"><div class="predict-fill" id="pFill" data-val="${s.fav}" style="background:${col};width:0%"></div></div>
        <div class="predict-verdict">${ico} <strong>${s.sentiment} Sentiment</strong> — ${s.count} articles · ${s.pos} positive · ${s.neg} negative</div>
        <div class="predict-headlines">
          <div class="ph-title">📰 Key Headlines</div>
          ${arts.slice(0,5).map(a=>`<a class="ph-row" href="${a.link}" target="_blank">${a.title}</a>`).join('')}
        </div>
        <div class="predict-note">⚠️ Sentiment-based analysis for educational purposes only. Not a real election forecast.</div>
      </div>`;
    requestAnimationFrame(() => { const f=document.getElementById('pFill'); if(f) f.style.width=f.dataset.val+'%'; });
  } catch(e) {
    el.innerHTML = '<div class="hub-empty"><span>⚠️</span><p>Could not fetch data. Check your connection.</p></div>';
  }
};

/* ══════════════════════════════════════════════════════════
   HUB CHAT — with thinking, memory, and news fallback
   ══════════════════════════════════════════════════════════ */
window.hubChip = function(btn) { document.getElementById('hubChatInput').value = btn.textContent; sendHubMessage(); };

window.sendHubMessage = async function() {
  const input = document.getElementById('hubChatInput');
  const win   = document.getElementById('hubChatWindow');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  HUB_MEM.msgCount++;
  hubMsg(text, 'user', win);

  const tl = text.toLowerCase();

  /* ── 1. CONVERSATIONAL INTENTS (no thinking needed) ── */
  const convReply = getConversationalReply(tl, text);
  if (convReply) {
    await delay(420);
    hubBotText(convReply, win);
    maybeAskFollowUp(win);
    return;
  }

  /* ── 2. Classify intent ── */
  const isPredict = /(predict|forecast|who will win|outcome|leading|ahead|poll|chance|likelihood)/i.test(tl);
  const isNews    = /(news|latest|current|today|headline|recent|update)/i.test(tl);

  /* ── 3. Try knowledge base first ── */
  const kbAnswer = getKB(tl);
  const kbKnown  = kbAnswer !== null; // null = no match; string = known answer

  /* ── 4. Build contextual thinking steps ── */
  let steps;
  if (isPredict) {
    steps = [
      '🔍 Identifying election topic from your query…',
      '🌐 Connecting to Google News RSS feed…',
      '📥 Downloading latest articles…',
      '📊 Scanning for positive signals: "win", "leads", "surge"…',
      '⚖️ Scanning for negative signals: "scandal", "defeat", "drops"…',
      '🧮 Computing sentiment favorability score…',
      '🔮 Generating prediction summary…',
    ];
  } else if (isNews) {
    steps = [
      '🔍 Parsing search query…',
      '🌐 Connecting to Google News RSS…',
      '📥 Fetching latest articles…',
      '🗂️ Ranking by relevance and recency…',
      '🖊️ Formatting results…',
    ];
  } else if (kbKnown) {
    steps = [
      '🧠 Tokenising your question…',
      '📚 Searching election knowledge base…',
      '🔗 Cross-referencing civic data…',
      '✍️ Composing answer…',
    ];
  } else {
    // No KB match → will auto-fetch news as fallback
    steps = [
      '🧠 Reading your question…',
      '📚 Searching knowledge base… not found',
      '🔄 Knowledge gap detected — switching to live news…',
      '🌐 Connecting to Google News RSS…',
      '📥 Fetching relevant articles to learn about this topic…',
      '💡 Synthesising response from live data…',
    ];
  }

  const thinkEl = await showThinking(steps, win);

  /* ── 5. Respond ── */
  try {
    if (isPredict) {
      const q    = extractTopic(text);
      const arts = await fetchNews(q + ' election poll vote');
      collapseThinking(thinkEl, '✅ Prediction analysis complete');
      HUB_MEM.lastTopic = q;
      if (!arts.length) { hubBotText(`I couldn't find recent news on "${q}". Try a more specific name!`, win); return; }
      const s   = analyzeSentiment(arts);
      const col = s.fav>=60?'#10b981':s.fav<=40?'#ef4444':'#f59e0b';
      hubBotRich(`<strong>🔮 Sentiment Prediction for "${q}"</strong><br/>
        <div style="margin:10px 0">
          <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:5px"><span>Favorability Score</span><span style="color:${col};font-weight:700">${s.fav}%</span></div>
          <div style="height:10px;background:#1e2d4a;border-radius:5px;overflow:hidden"><div style="height:100%;width:${s.fav}%;background:${col};border-radius:5px;transition:width 1.2s ease"></div></div>
        </div>
        <strong>${s.sentiment} Sentiment</strong> · ${s.count} articles analysed · ${s.pos} positive · ${s.neg} negative<br/><br/>
        <strong>Key Headlines:</strong><br/>
        ${arts.slice(0,3).map(a=>`• <a href="${a.link}" target="_blank" style="color:#3b82f6;line-height:1.8">${a.title}</a>`).join('<br/>')}`, win);
      hubBotText(`Would you like me to dig deeper into any of these headlines, or compare "${q}" with another candidate?`, win);

    } else if (isNews) {
      const q    = extractTopic(text);
      const arts = await fetchNews(q + ' election');
      collapseThinking(thinkEl, '✅ News loaded');
      HUB_MEM.lastTopic = q;
      if (!arts.length) { hubBotText(`No recent articles found for "${q}". Try rephrasing!`, win); return; }
      hubBotRich(`<strong>📰 Latest Election News: "${q}"</strong><br/><br/>
        ${arts.slice(0,5).map(a=>`<div style="margin-bottom:12px;padding:10px;background:rgba(255,255,255,.04);border-radius:10px">
          <a href="${a.link}" target="_blank" style="color:#e8edf8;font-weight:600;font-size:.88rem;line-height:1.4">${a.title}</a>
          <div style="font-size:.73rem;color:#64748b;margin-top:4px">${a.source?.name||'News'} · ${a.pubDate?new Date(a.pubDate).toLocaleDateString('en-US',{month:'short',day:'numeric'}):''}</div>
        </div>`).join('')}`, win);
      hubBotText(`I found ${arts.length} articles on "${q}". Want me to run a sentiment prediction on this topic?`, win);

    } else if (kbKnown) {
      await delay(steps.length * 200);
      collapseThinking(thinkEl, '✅ Answer found in knowledge base');
      HUB_MEM.lastTopic = extractTopic(text);
      hubBotText(kbAnswer, win);
      maybeAskFollowUp(win);

    } else {
      // ── AUTO NEWS FALLBACK: KB doesn't know → learn from news ──
      const q    = extractTopic(text);
      const arts = await fetchNews(q + ' election');
      collapseThinking(thinkEl, '✅ Learned from live news');
      HUB_MEM.lastTopic = q;
      if (!arts.length) {
        hubBotText(`I don't have built-in knowledge about "${q}", and I couldn't find recent news either. Try rephrasing or ask about a different election topic!`, win);
        return;
      }
      const s = analyzeSentiment(arts);
      hubBotRich(`<strong>💡 I looked this up in live news for you!</strong><br/><br/>
        I don't have built-in information on <em>"${q}"</em>, so I fetched <strong>${arts.length} live articles</strong> to answer you:<br/><br/>
        ${arts.slice(0,4).map(a=>`<div style="margin-bottom:10px;padding:8px;background:rgba(255,255,255,.04);border-radius:8px">
          <a href="${a.link}" target="_blank" style="color:#e8edf8;font-weight:600;font-size:.87rem">${a.title}</a>
          <div style="font-size:.72rem;color:#64748b;margin-top:3px">${a.source?.name||''} · ${a.pubDate?new Date(a.pubDate).toLocaleDateString('en-US',{month:'short',day:'numeric'}):''}</div>
        </div>`).join('')}
        <br/>Overall news sentiment: <strong style="color:${s.fav>=60?'#10b981':s.fav<=40?'#ef4444':'#f59e0b'}">${s.sentiment} (${s.fav}%)</strong>`, win);
      hubBotText(`Want me to do a full sentiment prediction on "${q}", or search for something more specific?`, win);
    }
  } catch(e) {
    collapseThinking(thinkEl, '⚠️ Error');
    hubBotText("I hit a snag fetching live data. My internet connection might be limited right now — but I can still answer general election questions!", win);
  }
};

/* ── CONVERSATIONAL REPLY ── */
function getConversationalReply(tl, raw) {
  const name = HUB_MEM.userName || (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('electiq_user')||'null')?.name?.split(' ')[0]) || '';
  const greet = name ? `, ${name}` : '';

  if (/^(hi|hello|hey|hiya|howdy|sup)\b/.test(tl))
    return HUB_MEM.msgCount <= 1
      ? `Hello${greet}! 👋 I'm your AI Election Assistant. I can fetch live news, predict election outcomes using sentiment analysis, and answer questions about voting systems worldwide. What would you like to explore?`
      : `Hey again${greet}! 😊 What else can I help you with?`;

  if (/(how are you|how r u|you okay|you good)/.test(tl))
    return `I'm running great${greet}! 🤖 My news feed is live and my thinking engine is warmed up. Ask me anything about elections!`;

  if (/(what('s| is) your name|who are you|what can you do)/.test(tl))
    return `I'm the <strong>ElectIQ AI Hub</strong> — your smart election companion${greet}. I can:\n• 📰 Search live Google News on any election topic\n• 🔮 Predict outcomes using news sentiment analysis\n• 🧠 Answer general election questions\n• 🌍 Explain voting systems from 16+ countries\n\nJust ask!`;

  if (/(thank you|thanks|thx|ty\b|great|awesome|perfect|amazing|helpful)/.test(tl))
    return pickRandom([
      `You're welcome${greet}! 😊 Is there anything else about elections you'd like to explore?`,
      `Happy to help${greet}! 🗳️ Want me to search for more news or run a prediction?`,
      `Anytime${greet}! Ask me anything else — I'm always learning from live news.`,
    ]);

  if (/(bye|goodbye|see you|cya|exit)/.test(tl))
    return `Goodbye${greet}! 🗳️ Stay informed and vote wisely! Come back anytime.`;

  if (/(what.*topic|last topic|we were|talking about)/.test(tl))
    return HUB_MEM.lastTopic
      ? `We were just discussing <strong>${HUB_MEM.lastTopic}</strong>. Want to go deeper on that?`
      : `We haven't discussed a specific topic yet${greet}. What election subject would you like to explore?`;

  if (/(yes|yeah|sure|go ahead|tell me more|more details)/.test(tl) && HUB_MEM.lastTopic)
    return null; // Fall through to news search with lastTopic

  return null; // Not a conversational match
}

/* ── FOLLOW-UP PROMPTS ── */
function maybeAskFollowUp(win) {
  if (HUB_MEM.msgCount % 3 !== 0) return;
  const prompts = [
    '💬 Want to search for live news on any election topic?',
    '🔮 Would you like me to run a sentiment prediction on a candidate or country?',
    '🌍 Curious how another country runs its elections? Just ask!',
    '📊 I can compare voter turnout across regions — just say "compare turnout"!',
  ];
  setTimeout(() => hubBotText(pickRandom(prompts), win), 800);
}

/* ── KNOWLEDGE BASE (returns null if no match) ── */
function getKB(t) {
  if (/(how.*register|voter registration|sign up.*vote)/.test(t))
    return "To register to vote in the US: visit your state's official election website, the DMV, or <a href='https://vote.gov' target='_blank'>vote.gov</a>. Deadlines are 15–30 days before Election Day. Some states offer same-day registration!";
  if (/(electoral college|how.*president.*elected|what.*270)/.test(t))
    return "The Electoral College has <strong>538 electors</strong>. A candidate needs <strong>270</strong> to win the presidency. Each state gets electors equal to its senators + representatives. Most states are winner-take-all.";
  if (/(primary|caucus|nominee)/.test(t))
    return "Primaries let party members vote to select their nominee for the general election. <strong>Open primaries</strong> allow any registered voter; <strong>closed primaries</strong> restrict to party members. Caucuses are party meetings where voters publicly group by candidate.";
  if (/(mail.*vote|absentee|vote by mail)/.test(t))
    return "Mail-in (absentee) voting is available in <strong>all 50 US states</strong>. Request your ballot early — deadlines vary. Several states (Oregon, Washington, Colorado) automatically mail ballots to every registered voter.";
  if (/(india|lok sabha|modi)/.test(t))
    return "India is the world's <strong>largest democracy</strong> with ~970 million eligible voters. It uses First-Past-The-Post across 543 Lok Sabha constituencies. General elections span multiple phases over several weeks.";
  if (/(uk|britain|parliament|westminster|boris|keir)/.test(t))
    return "The UK uses <strong>First-Past-The-Post</strong> in 650 constituencies. The party winning the most seats forms the government; its leader becomes <strong>Prime Minister</strong> — they are never directly elected by the public.";
  if (/(germany|bundestag|merkel|scholz)/.test(t))
    return "Germany uses <strong>Mixed-Member Proportional (MMP)</strong> representation. Voters cast two ballots: one for a local candidate, one for a party list. This produces a broadly proportional parliament.";
  if (/(fraud|rigged|stolen election)/.test(t))
    return "Election fraud is statistically very rare. Modern systems use ML anomaly detection, bipartisan observers, paper ballot audits, and signature verification to protect election integrity.";
  if (/(count|how.*vote.*counted|tally)/.test(t))
    return "After polls close: ballots are scanned by optical machines → bipartisan teams observe counting → mail-in ballots are signature-verified → provisional ballots are reviewed → results are audited then officially certified days later.";
  if (/(debate|presidential debate)/.test(t))
    return "Presidential debates are organized by the Commission on Presidential Debates — typically 2–3 televised debates. VP candidates debate once. A strong debate performance can shift polls by several points.";
  if (/(super pac|campaign finance|dark money)/.test(t))
    return "Super PACs are independent expenditure committees that can raise <strong>unlimited funds</strong> from corporations, unions, and individuals. They can support or oppose candidates but <strong>cannot coordinate directly</strong> with a campaign.";
  if (/(inauguration|sworn in|january 20)/.test(t))
    return "The US Presidential Inauguration is held on <strong>January 20</strong> following the election. The President-elect takes the Oath of Office at the US Capitol and delivers an inaugural address.";
  if (/(turnout|voter turnout|who votes)/.test(t))
    return "US voter turnout averages 55–65% in presidential elections. Highest globally: Singapore (~95%, compulsory), Sweden (~84%), Brazil (~79%). Lowest: Nigeria (~35–44%). Compulsory voting laws significantly boost turnout.";
  if (/(gerrymandering|redistrict|district)/.test(t))
    return "Gerrymandering is the manipulation of district boundaries to favour one party. ML models now generate thousands of neutral maps using MCMC simulations to detect statistically unfair maps.";
  return null; // Signal: no KB match → trigger news fallback
}

/* ── HELPERS ── */
function extractTopic(text) {
  if (HUB_MEM.lastTopic && /(yes|yeah|sure|more|that|it|this)/.test(text.toLowerCase()))
    return HUB_MEM.lastTopic;
  return text
    .replace(/latest|news|current|today|predict|forecast|outcome|who.*win|poll|headline|tell me about|what.*about|search|find|show|get/gi, '')
    .trim() || text;
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── UI HELPERS ── */
function hubMsg(text, role, win) {
  const d = document.createElement('div');
  d.className = `chat-message ${role}-message`;
  d.innerHTML = role === 'user'
    ? `<div class="msg-bubble user-bubble">${text}</div>`
    : `<div class="msg-avatar">🤖</div><div class="msg-bubble"><p>${text}</p></div>`;
  win.appendChild(d); win.scrollTop = win.scrollHeight;
}
function hubBotRich(html, win) {
  const d = document.createElement('div');
  d.className = 'chat-message bot-message';
  d.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${html}</div>`;
  win.appendChild(d); win.scrollTop = win.scrollHeight;
}
function hubBotText(text, win) { hubBotRich(`<p>${text}</p>`, win); }

/* ── THINKING ENGINE ── */
async function showThinking(steps, win) {
  const uid  = 'think-' + Date.now();
  const wrap = document.createElement('div');
  wrap.className = 'chat-message bot-message';
  wrap.id = uid;
  wrap.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="think-bubble">
      <div class="think-header" onclick="this.closest('.think-bubble').classList.toggle('think-collapsed')">
        <span class="think-pulse"></span>
        <span class="think-label">Thinking…</span>
        <span class="think-toggle">▾</span>
      </div>
      <div class="think-steps" id="ts-${uid}"></div>
    </div>`;
  win.appendChild(wrap);
  win.scrollTop = win.scrollHeight;

  const stepsEl = document.getElementById('ts-' + uid);
  for (const step of steps) {
    await delay(440 + Math.random() * 280);
    const s = document.createElement('div');
    s.className = 'think-step';
    s.innerHTML = `<span class="think-step-dot"></span>${step}`;
    stepsEl.appendChild(s);
    win.scrollTop = win.scrollHeight;
  }
  return wrap;
}

function collapseThinking(el, label = '✅ Done thinking') {
  const lbl   = el.querySelector('.think-label');
  const pulse = el.querySelector('.think-pulse');
  if (lbl)   lbl.textContent = label + '  (click to expand)';
  if (pulse) pulse.classList.add('think-done-dot');
  el.querySelector('.think-bubble')?.classList.add('think-collapsed', 'think-done');
}
