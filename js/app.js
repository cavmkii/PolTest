(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const N = AXES.length;
  const MIN_SHARED_FIGURE = 5;   // axes a figure must share with you to be ranked overall
  const MIN_SHARED_IDEOLOGY = 5;

  // ---------- scoring ----------

  function computeScores(answers) {
    const sum = Array(N).fill(0);
    const max = Array(N).fill(0);
    QUESTIONS.forEach((q, i) => {
      const a = answers[i];
      if (a == null) return;
      AXES.forEach((ax, k) => {
        const w = q.e[ax.key];
        if (!w) return;
        sum[k] += a * w;
        max[k] += Math.abs(w);
      });
    });
    return sum.map((s, k) => (max[k] ? Math.round((s / max[k]) * 100) : 0));
  }

  // Root-mean-square distance across all axes. An axis the profile leaves blank counts as a fixed
  // gap of `gap` points instead of being dropped, so sparse profiles don't win by default.
  const FIGURE_GAP = 35;
  const IDEOLOGY_GAP = 30;
  function distance(u, v, gap) {
    let ss = 0, n = 0;
    for (let k = 0; k < N; k++) {
      if (v[k] == null) { ss += (gap || 0) ** 2; continue; }
      const d = u[k] - v[k];
      ss += d * d;
      n++;
    }
    if (!n) return { d: Infinity, n: 0 };
    return { d: Math.sqrt(ss / (gap ? N : n)), n };
  }
  const similarity = (d) => Math.max(0, Math.round(100 * (1 - d / 200)));

  function rankIdeologies(u) {
    return IDEOLOGIES.map((ide) => ({ ide, ...distance(u, ide.v, IDEOLOGY_GAP) }))
      .filter((r) => r.n >= MIN_SHARED_IDEOLOGY)
      .sort((a, b) => a.d - b.d);
  }

  function rankFigures(u) {
    return FIGURES.map((f) => ({ f, ...distance(u, f.v, FIGURE_GAP) }))
      .filter((r) => r.n >= MIN_SHARED_FIGURE)
      .sort((a, b) => a.d - b.d);
  }

  function closestOnAxis(u, k, count) {
    return FIGURES.filter((f) => f.v[k] != null)
      .map((f) => ({ f, d: Math.abs(f.v[k] - u[k]), tie: distance(u, f.v, FIGURE_GAP).d }))
      .sort((a, b) => a.d - b.d || a.tie - b.tie)
      .slice(0, count);
  }

  function strengthLabel(v, ax) {
    const a = Math.abs(v);
    if (a < 10) return 'Centered';
    const pole = v < 0 ? ax.left : ax.right;
    if (a < 35) return 'Leans ' + pole;
    if (a < 65) return 'Firmly ' + pole;
    return 'Strongly ' + pole;
  }
  const signed = (v) => (v > 0 ? '+' + v : String(v));

  // ---------- views ----------

  const views = ['test', 'figures', 'ideologies', 'method'];
  function showView(name) {
    views.forEach((v) => { $('#view-' + v).hidden = v !== name; });
    document.querySelectorAll('.nav a').forEach((a) => {
      a.setAttribute('aria-current', a.dataset.view === name ? 'page' : 'false');
    });
  }

  // ---------- quiz ----------

  let answers = [];
  let idx = 0;
  let currentScores = null;

  function startQuiz() {
    answers = Array(QUESTIONS.length).fill(null);
    idx = 0;
    $('#intro').hidden = true;
    $('#results').hidden = true;
    $('#quiz').hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const q = QUESTIONS[idx];
    $('#q-count').textContent = `Statement ${idx + 1} of ${QUESTIONS.length}`;
    $('#q-text').textContent = q.t;
    $('#q-progress').style.width = ((idx / QUESTIONS.length) * 100).toFixed(1) + '%';
    $('#q-back').disabled = idx === 0;
    const box = $('#q-answers');
    box.textContent = '';
    ANSWERS.forEach((opt, i) => {
      const b = el('button', 'answer', opt.label);
      b.type = 'button';
      b.id = 'ans-' + i;
      b.dataset.tone = String(opt.v);
      if (answers[idx] === opt.v) b.classList.add('chosen');
      b.addEventListener('click', () => choose(opt.v));
      box.appendChild(b);
    });
  }

  function choose(v) {
    answers[idx] = v;
    if (idx < QUESTIONS.length - 1) {
      idx++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    const scores = computeScores(answers);
    currentScores = scores;
    try { history.replaceState(null, '', '#r.' + scores.join('.')); } catch (e) { /* sandboxed */ }
    renderResults(scores);
  }

  // ---------- results ----------

  function axisBar(ax, k, value, opts) {
    const wrap = el('div', 'bar');
    wrap.style.setProperty('--lc', ax.lc);
    wrap.style.setProperty('--rc', ax.rc);
    const track = el('div', 'bar-track');
    if (opts && opts.ticks) {
      FIGURES.forEach((f) => {
        if (f.v[k] == null) return;
        const t = el('span', 'tick');
        t.style.left = ((f.v[k] + 100) / 2) + '%';
        t.title = `${f.n}: ${signed(f.v[k])}`;
        track.appendChild(t);
      });
    }
    if (value != null) {
      const m = el('span', 'marker');
      m.style.left = ((value + 100) / 2) + '%';
      m.title = signed(value);
      track.appendChild(m);
    }
    wrap.appendChild(track);
    return wrap;
  }

  function figureChip(f, extra) {
    const b = el('button', 'chip');
    b.type = 'button';
    b.appendChild(el('span', 'chip-name', f.n));
    if (extra) b.appendChild(el('span', 'chip-meta', extra));
    b.addEventListener('click', () => openFigure(f));
    return b;
  }

  function renderResults(u) {
    showView('test');
    $('#intro').hidden = true;
    $('#quiz').hidden = true;
    $('#results').hidden = false;

    const ideos = rankIdeologies(u);
    const top = ideos[0];
    $('#r-ideology').textContent = top.ide.name;
    $('#r-ideology-desc').textContent = top.ide.d;
    $('#r-ideology-sim').textContent = similarity(top.d) + '% match';

    const runners = $('#r-runners');
    runners.textContent = '';
    ideos.slice(1, 5).forEach((r) => {
      const li = el('li');
      li.appendChild(el('span', 'runner-name', r.ide.name));
      li.appendChild(el('span', 'num', similarity(r.d) + '%'));
      runners.appendChild(li);
    });

    // Per-axis results with nearest figures on each axis
    const axesBox = $('#r-axes');
    axesBox.textContent = '';
    AXES.forEach((ax, k) => {
      const row = el('section', 'axis-row');
      const head = el('div', 'axis-head');
      const name = el('h3', 'axis-name', ax.name);
      const verdict = el('span', 'axis-verdict', strengthLabel(u[k], ax));
      const val = el('span', 'num axis-val', signed(u[k]));
      head.append(name, verdict, val);

      const poles = el('div', 'poles');
      poles.append(el('span', 'pole pole-l', ax.left), el('span', 'pole pole-r', ax.right));

      const near = el('div', 'near');
      near.appendChild(el('span', 'near-label', 'Closest on this axis'));
      const chips = el('div', 'chips');
      closestOnAxis(u, k, 4).forEach((r) => chips.appendChild(figureChip(r.f, signed(r.f.v[k]))));
      near.appendChild(chips);

      row.append(head, poles, axisBar(ax, k, u[k], { ticks: true }), near);
      axesBox.appendChild(row);
    });

    // Overall nearest and farthest figures
    const figs = rankFigures(u);
    const nearList = $('#r-near');
    nearList.textContent = '';
    figs.slice(0, 10).forEach((r) => nearList.appendChild(matchRow(r)));
    const farList = $('#r-far');
    farList.textContent = '';
    figs.slice(-5).reverse().forEach((r) => farList.appendChild(matchRow(r)));

    const skipped = FIGURES.filter((f) => distance(u, f.v).n < MIN_SHARED_FIGURE).map((f) => f.n);
    $('#r-skipped').textContent = skipped.length
      ? `Left out of the overall ranking for lack of public record on enough axes: ${skipped.join(', ')}. They still appear in the per-axis matches where a score exists.`
      : '';

    const code = '#r.' + u.join('.');
    $('#r-code').value = code;
    window.scrollTo({ top: 0 });
  }

  function matchRow(r) {
    const li = el('li', 'match');
    const b = el('button', 'match-btn');
    b.type = 'button';
    const left = el('span', 'match-who');
    left.appendChild(el('span', 'match-name', r.f.n));
    left.appendChild(el('span', 'match-sub', `${r.f.l} · ${FIGURE_CATEGORIES[r.f.c]}`));
    const pct = el('span', 'num match-pct', similarity(r.d) + '%');
    const meter = el('span', 'meter');
    const fill = el('span', 'meter-fill');
    fill.style.width = similarity(r.d) + '%';
    meter.appendChild(fill);
    b.append(left, meter, pct);
    b.addEventListener('click', () => openFigure(r.f));
    li.appendChild(b);
    return li;
  }

  // ---------- figure dialog ----------

  function profileTable(v, compareTo) {
    const box = el('div', 'profile');
    AXES.forEach((ax, k) => {
      const row = el('div', 'profile-row');
      row.appendChild(el('span', 'profile-axis', ax.name));
      if (v[k] == null) {
        const na = el('span', 'profile-na', 'No record');
        row.appendChild(na);
        row.appendChild(el('span', 'num profile-val', '—'));
      } else {
        const bar = axisBar(ax, k, v[k]);
        if (compareTo) {
          const you = el('span', 'marker marker-you');
          you.style.left = ((compareTo[k] + 100) / 2) + '%';
          you.title = 'You: ' + signed(compareTo[k]);
          bar.firstChild.appendChild(you);
        }
        row.appendChild(bar);
        row.appendChild(el('span', 'num profile-val', signed(v[k])));
      }
      box.appendChild(row);
    });
    return box;
  }

  function openFigure(f) {
    const d = $('#fig-dialog');
    $('#fd-name').textContent = f.n;
    $('#fd-sub').textContent = `${f.y} · ${FIGURE_CATEGORIES[f.c]}`;
    $('#fd-label').textContent = f.l;
    const conf = $('#fd-conf');
    conf.textContent = f.conf + ' confidence';
    conf.dataset.conf = f.conf;
    $('#fd-note').textContent = f.note;
    const scored = f.v.filter((x) => x != null).length;
    $('#fd-nearest').textContent = scored >= 4
      ? 'Nearest ideology profile on these scores: ' + nearestIdeologyFor(f.v)
      : 'Too few scored axes to compute a nearest ideology.';
    const prof = $('#fd-profile');
    prof.textContent = '';
    prof.appendChild(profileTable(f.v, currentScores));
    $('#fd-legend').hidden = !currentScores;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }

  // Ideology nearest to a figure, using only axes both define.
  function nearestIdeologyFor(v) {
    let best = null;
    IDEOLOGIES.forEach((ide) => {
      let ss = 0, n = 0;
      for (let k = 0; k < N; k++) {
        if (v[k] == null || ide.v[k] == null) continue;
        ss += (v[k] - ide.v[k]) ** 2; n++;
      }
      if (n < 4) return;
      const d = Math.sqrt(ss / n);
      if (!best || d < best.d) best = { name: ide.name, d };
    });
    return best ? best.name : 'n/a';
  }

  // ---------- figures browser ----------

  function renderBrowser() {
    const filter = $('#fig-filter').value;
    const q = $('#fig-search').value.trim().toLowerCase();
    const list = $('#fig-list');
    list.textContent = '';
    FIGURES.filter((f) => (filter === 'all' || f.c === filter) &&
      (!q || f.n.toLowerCase().includes(q) || f.l.toLowerCase().includes(q)))
      .forEach((f) => {
        const li = el('li');
        const b = el('button', 'fig-card');
        b.type = 'button';
        const top = el('span', 'fig-top');
        top.appendChild(el('span', 'fig-name', f.n));
        const c = el('span', 'conf', f.conf);
        c.dataset.conf = f.conf;
        top.appendChild(c);
        b.appendChild(top);
        b.appendChild(el('span', 'fig-sub', f.y));
        b.appendChild(el('span', 'fig-label', f.l));
        const spark = el('span', 'spark');
        AXES.forEach((ax, k) => {
          const s = el('span', 'spark-col');
          s.title = `${ax.name}: ${f.v[k] == null ? 'no record' : signed(f.v[k])}`;
          if (f.v[k] != null) {
            const bar = el('span', 'spark-bar');
            const h = Math.abs(f.v[k]) / 2;
            bar.style.height = h + '%';
            bar.style.background = f.v[k] < 0 ? ax.lc : ax.rc;
            bar.style[f.v[k] < 0 ? 'top' : 'bottom'] = '50%';
            s.appendChild(bar);
          } else {
            s.classList.add('spark-na');
          }
          spark.appendChild(s);
        });
        b.appendChild(spark);
        b.addEventListener('click', () => openFigure(f));
        li.appendChild(b);
        list.appendChild(li);
      });
    $('#fig-count').textContent = list.children.length + ' shown';
  }

  function renderIdeologies() {
    const list = $('#ide-list');
    list.textContent = '';
    IDEOLOGIES.forEach((ide) => {
      const li = el('li', 'ide');
      li.appendChild(el('h3', 'ide-name', ide.name));
      li.appendChild(el('p', 'ide-desc', ide.d));
      li.appendChild(profileTable(ide.v));
      list.appendChild(li);
    });
  }

  function renderMethodAxes() {
    const box = $('#method-axes');
    box.textContent = '';
    AXES.forEach((ax) => {
      const dt = el('dt', null, `${ax.name}: ${ax.left} ↔ ${ax.right}`);
      const dd = el('dd', null, `${ax.left}: ${ax.ldesc} ${ax.right}: ${ax.rdesc}`);
      const count = QUESTIONS.filter((q) => q.e[ax.key]).length;
      dd.appendChild(el('span', 'dd-count', ` ${count} statements touch this axis.`));
      box.append(dt, dd);
    });
  }

  // ---------- boot ----------

  function parseHash() {
    const h = (location.hash || '').slice(1);
    if (h.startsWith('r.')) {
      const parts = h.slice(2).split('.').map(Number);
      if (parts.length === N && parts.every((x) => Number.isFinite(x) && x >= -100 && x <= 100)) return { scores: parts };
    }
    if (views.includes(h)) return { view: h };
    return {};
  }

  function boot() {
    $('#q-total').textContent = QUESTIONS.length;
    $('#fig-total').textContent = FIGURES.length;
    $('#ide-total').textContent = IDEOLOGIES.length;
    $('#start').addEventListener('click', startQuiz);
    $('#retake').addEventListener('click', startQuiz);
    $('#q-back').addEventListener('click', () => { if (idx > 0) { idx--; renderQuestion(); } });
    $('#q-skip').addEventListener('click', () => choose(null));
    $('#fig-filter').addEventListener('change', renderBrowser);
    $('#fig-search').addEventListener('input', renderBrowser);
    $('#fd-close').addEventListener('click', () => $('#fig-dialog').close());
    $('#fig-dialog').addEventListener('click', (e) => { if (e.target.id === 'fig-dialog') e.target.close(); });
    $('#copy-code').addEventListener('click', () => {
      const input = $('#r-code');
      const done = () => { $('#copy-code').textContent = 'Copied'; setTimeout(() => { $('#copy-code').textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(done, () => { input.select(); });
      } else { input.select(); }
    });
    $('#load-code').addEventListener('click', () => {
      const v = $('#paste-code').value.trim().replace(/^.*#/, '#');
      const parts = v.replace(/^#?r\./, '').split('.').map(Number);
      if (parts.length === N && parts.every((x) => Number.isFinite(x) && Math.abs(x) <= 100)) {
        currentScores = parts;
        renderResults(parts);
        $('#paste-error').hidden = true;
      } else {
        $('#paste-error').hidden = false;
      }
    });
    document.querySelectorAll('.nav a, .brand').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showView(a.dataset.view);
        window.scrollTo({ top: 0 });
      });
    });
    keyboard();

    renderBrowser();
    renderIdeologies();
    renderMethodAxes();

    const st = parseHash();
    if (st.scores) { currentScores = st.scores; renderResults(st.scores); }
    else showView(st.view || 'test');
  }

  // 1–5 keys answer while the quiz is open.
  function keyboard() {
    document.addEventListener('keydown', (e) => {
      if ($('#quiz').hidden || $('#view-test').hidden) return;
      if (e.target.tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= 5) choose(ANSWERS[n - 1].v);
      else if (e.key === 'Backspace' && idx > 0) { idx--; renderQuestion(); }
    });
  }

  boot();
})();
