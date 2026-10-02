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

  // Scores one test's axes from the answers. Statements that touch none of these axes (the other
  // test's statements, attention checks) are ignored.
  function computeFor(qs, answers, axes) {
    const sum = Array(axes.length).fill(0);
    const max = Array(axes.length).fill(0);
    qs.forEach((q, i) => {
      const a = answers[i];
      if (a == null) return;
      axes.forEach((ax, k) => {
        const w = q.e[ax.key];
        if (!w) return;
        sum[k] += a * w;
        max[k] += Math.abs(w);
      });
    });
    return sum.map((s, k) => (max[k] ? Math.round((s / max[k]) * 100) : 0));
  }

  // Weighted root-mean-square distance across all axes. An axis the profile leaves blank counts as a
  // fixed gap of `gap` points instead of being dropped, so sparse profiles don't win by default.
  // Means is down-weighted: its statements are the hardest to measure well (Westwood et al. 2022)
  // and it alone would otherwise pull respondents toward militants.
  const FIGURE_GAP = 35;
  const IDEOLOGY_GAP = 30;
  const BASE_WEIGHT = AXES.map((ax) => (ax.key === 'method' ? 0.5 : 1));
  const IMPORTANCE = [{ label: 'Low', w: 0.5 }, { label: 'Normal', w: 1 }, { label: 'High', w: 2 }];
  let importance = Array(N).fill(1);
  const weights = () => BASE_WEIGHT.map((b, k) => b * importance[k]);

  function distance(u, v, gap, wIn) {
    const w = wIn || weights();
    let ss = 0, ws = 0, n = 0;
    for (let k = 0; k < v.length; k++) {
      if (v[k] == null) {
        if (gap) { ss += w[k] * gap * gap; ws += w[k]; }
        continue;
      }
      const d = u[k] - v[k];
      ss += w[k] * d * d;
      ws += w[k];
      n++;
    }
    if (!n || !ws) return { d: Infinity, n: 0 };
    return { d: Math.sqrt(ss / ws), n };
  }
  const similarity = (d) => Math.max(0, Math.round(100 * (1 - d / 200)));
  const approx = (d) => '≈' + similarity(d) + '%';

  function rankIdeologies(u) {
    return IDEOLOGIES.map((ide) => ({ ide, ...distance(u, ide.v, IDEOLOGY_GAP) }))
      .filter((r) => r.n >= MIN_SHARED_IDEOLOGY)
      .sort((a, b) => a.d - b.d);
  }

  // Celebrities and notorious figures have no scholarly coding, so they are kept out of the overall ranking.
  const rankable = (f) => f.c !== 'public' && f.v.filter((x) => x != null).length >= MIN_SHARED_FIGURE;

  function rankFigures(u) {
    return FIGURES.filter(rankable)
      .map((f) => ({ f, ...distance(u, f.v, FIGURE_GAP) }))
      .sort((a, b) => a.d - b.d);
  }

  // Answer quality: attention check, how many statements fed each axis, and how much the answers on
  // each axis agree with one another. Low agreement is the "unconstrained" pattern Converse (1964)
  // found to be common in mass publics; it is reported, not corrected.
  function answerQuality(qs, ans, axes) {
    const checks = qs.map((q, i) => i).filter((i) => qs[i].check != null && ans[i] != null);
    const attention = checks.length ? checks.every((i) => ans[i] === qs[i].check) : null;
    const perAxis = axes.map((ax) => {
      let sum = 0, abs = 0, count = 0;
      qs.forEach((q, i) => {
        const w = q.e[ax.key];
        if (!w || ans[i] == null) return;
        count++;
        if (Math.abs(w) < 1) return;
        const c = ans[i] * Math.sign(w);
        sum += c; abs += Math.abs(c);
      });
      return { count, agreement: abs ? Math.abs(sum) / abs : null };
    });
    const scored = perAxis.filter((a) => a.agreement != null);
    const overall = scored.length ? scored.reduce((t, a) => t + a.agreement, 0) / scored.length : null;
    const skipped = ans.filter((a, i) => a == null && qs[i].check == null).length;
    return { attention, perAxis, overall, skipped };
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

  const views = ['test', 'figures', 'ideologies', 'philosophy', 'method'];
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
  let currentQuality = null;   // only known right after taking the test, not from a pasted code
  let currentPhil = null;
  let philQuality = null;
  const SHORT = QUESTIONS.filter((q) => q.s);
  PHIL_QUESTIONS.forEach((q) => { q.phil = true; });
  PHILOSOPHERS.forEach((p) => { p.phil = true; });
  const PHIL_SHORT = PHIL_QUESTIONS.filter((q) => q.s);
  let quiz = QUESTIONS;
  const mode = { pol: true, phil: false, len: 'short' };

  function buildQuiz() {
    const short = mode.len === 'short';
    return [].concat(mode.pol ? (short ? SHORT : QUESTIONS) : [], mode.phil ? (short ? PHIL_SHORT : PHIL_QUESTIONS) : []);
  }

  function startQuiz() {
    quiz = buildQuiz();
    answers = Array(quiz.length).fill(null);
    idx = 0;
    $('#intro').hidden = true;
    $('#results').hidden = true;
    $('#quiz').hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz[idx];
    $('#q-count').textContent = `Statement ${idx + 1} of ${quiz.length}` +
      (mode.pol && mode.phil ? (q.phil ? ' · Philosophy' : ' · Politics') : '');
    $('#q-text').textContent = q.t;
    $('#q-progress').style.width = ((idx / quiz.length) * 100).toFixed(1) + '%';
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
    if (idx < quiz.length - 1) {
      idx++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    const pick = (phil) => {
      const qs = [], ans = [];
      quiz.forEach((q, i) => { if (!!q.phil === phil) { qs.push(q); ans.push(answers[i]); } });
      return { qs, ans };
    };
    currentScores = currentQuality = currentPhil = philQuality = null;
    if (mode.pol) {
      const p = pick(false);
      currentScores = computeFor(p.qs, p.ans, AXES);
      currentQuality = answerQuality(p.qs, p.ans, AXES);
      currentQuality.mode = mode.len;
    }
    if (mode.phil) {
      const p = pick(true);
      currentPhil = computeFor(p.qs, p.ans, PHIL_AXES);
      philQuality = answerQuality(p.qs, p.ans, PHIL_AXES);
      philQuality.mode = mode.len;
    }
    try { history.replaceState(null, '', '#' + resultCode().slice(1)); } catch (e) { /* sandboxed */ }
    showResults();
  }

  // Result codes: "#r.<10 political scores>", "#p.<9 philosophy scores>", or both joined by ".".
  function resultCode() {
    const parts = [];
    if (currentScores) parts.push('r.' + currentScores.join('.'));
    if (currentPhil) parts.push('p.' + currentPhil.join('.'));
    return '#' + parts.join('.');
  }

  function parseCode(str) {
    const h = str.trim().replace(/^.*#/, '');
    const out = {};
    const take = (tag, n) => {
      const m = h.match(new RegExp('(?:^|\\.)' + tag + '\\.((?:-?\\d+\\.?){' + n + '})'));
      if (!m) return null;
      const nums = m[1].replace(/\.$/, '').split('.').map(Number);
      return nums.length === n && nums.every((x) => Number.isFinite(x) && Math.abs(x) <= 100) ? nums : null;
    };
    out.pol = take('r', N);
    out.phil = take('p', PHIL_AXES.length);
    return out.pol || out.phil ? out : null;
  }

  function showResults() {
    showView('test');
    $('#intro').hidden = true;
    $('#quiz').hidden = true;
    $('#results').hidden = false;
    $('#pol-results').hidden = !currentScores;
    $('#phil-results').hidden = !currentPhil;
    $('#gap-results').hidden = !(currentScores && currentPhil);
    $('#results-jump').hidden = !(currentScores && currentPhil);
    if (currentScores) renderResults(currentScores, true);
    if (currentPhil) renderPhil(currentPhil);
    if (currentScores && currentPhil) renderGaps(currentScores, currentPhil);
    $('#r-code').value = resultCode();
    window.scrollTo({ top: 0 });
  }

  // ---------- results ----------

  function axisBar(ax, k, value, opts) {
    const wrap = el('div', 'bar');
    wrap.style.setProperty('--lc', ax.lc);
    wrap.style.setProperty('--rc', ax.rc);
    const track = el('div', 'bar-track');
    if (opts && opts.ticks) {
      (opts.ticksFrom || FIGURES).forEach((f) => {
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

  const CLEAR_FIT_GAP = 3;   // similarity points the top ideology must lead by
  const WEAK_FIT = 75;       // below this, no profile fits well

  // Renders the political half of the results. Called again when an importance setting changes.
  function renderResults(u) {
    const ideos = rankIdeologies(u);
    const top = ideos[0];
    const close = ideos.filter((r) => similarity(top.d) - similarity(r.d) < CLEAR_FIT_GAP);
    const weak = similarity(top.d) < WEAK_FIT;
    $('#r-eyebrow').textContent = close.length > 1 ? 'No clear fit: closest ideologies' : 'Closest ideology';
    $('#r-ideology').textContent = close.length > 1 ? close.slice(0, 3).map((r) => r.ide.name).join(' / ') : top.ide.name;
    $('#r-ideology-desc').textContent = close.length > 1
      ? `These are within ${CLEAR_FIT_GAP} points of each other; the test cannot separate them. ${top.ide.name}: ${top.ide.d}`
      : top.ide.d;
    $('#r-ideology-sim').textContent = approx(top.d) + ' match' + (weak ? ' · no profile fits closely' : '');
    $('#r-ideology-src').textContent = top.ide.src ? 'Profile follows ' + top.ide.src + '.' : '';

    renderQuality(currentQuality, 'r', 'ideology');
    renderDeepTabs(u, ideos.slice(0, 5));
    renderPractice(u);
    renderPsych(u);

    // Per-axis results with nearest figures on each axis
    const axesBox = $('#r-axes');
    axesBox.textContent = '';
    AXES.forEach((ax, k) => {
      const row = el('section', 'axis-row');
      const head = el('div', 'axis-head');
      const name = el('h3', 'axis-name', ax.name);
      const verdict = el('span', 'axis-verdict', strengthLabel(u[k], ax));
      head.append(name, verdict);
      const pa = currentQuality && currentQuality.perAxis[k];
      if (pa && pa.agreement != null && pa.agreement < 0.4) {
        const tag = el('span', 'tag', 'Mixed answers');
        tag.title = 'Your answers on this axis pulled in opposite directions, so the score sits near the middle for that reason.';
        head.appendChild(tag);
      }
      if (pa && pa.count < 3) head.appendChild(el('span', 'tag', `Only ${pa.count} answered`));
      const imp = el('label', 'imp');
      imp.append(el('span', 'imp-label', 'Matters'));
      const sel = el('select');
      sel.id = 'imp-' + ax.key;
      IMPORTANCE.forEach((o) => {
        const opt = el('option', null, o.label);
        opt.value = String(o.w);
        if (o.w === importance[k]) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', () => { importance[k] = Number(sel.value); renderResults(u); });
      imp.appendChild(sel);
      const val = el('span', 'num axis-val', signed(u[k]));
      head.append(imp, val);

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

    const skipped = FIGURES.filter((f) => !rankable(f)).map((f) => f.n);
    $('#r-skipped').textContent = skipped.length
      ? `Not in the overall ranking because no scholarly source codes their politics, or the record covers too few axes: ${skipped.join(', ')}. They still appear in the per-axis matches where a score exists.`
      : '';

  }

  // ---------- ideology deep dive ----------

  function renderDeepTabs(u, list) {
    const tabs = $('#r-deep-tabs');
    tabs.textContent = '';
    const select = (i) => {
      [...tabs.children].forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
      renderDeep(u, list[i].ide);
    };
    list.forEach((r, i) => {
      const b = el('button', 'deep-tab');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.appendChild(el('span', null, r.ide.name));
      b.appendChild(el('span', 'num deep-tab-pct', approx(r.d)));
      b.addEventListener('click', () => select(i));
      tabs.appendChild(b);
    });
    select(0);
  }

  // Lists where a respondent agrees and disagrees with a profile, as sentences.
  function renderCompare(box, c, who) {
    box.textContent = '';
    if (c.same.length) box.appendChild(el('p', null, 'You match it closely on ' + listText(c.same) + '.'));
    if (c.apart.length) {
      const ul = el('ul', 'deep-list');
      c.apart.forEach((x) => {
        const itPole = x.it < 0 ? x.ax.left : x.ax.right;
        const yourPole = x.you < 0 ? x.ax.left : x.ax.right;
        const sameSide = Math.sign(x.you) === Math.sign(x.it) && Math.abs(x.you) >= 10;
        const how = Math.abs(x.you) < Math.abs(x.it) && (sameSide || Math.abs(x.you) < 10)
          ? `you are much less firmly on the ${itPole} side`
          : sameSide ? `you go further toward ${yourPole}`
          : Math.abs(x.it) < 10 ? `you lean toward ${yourPole} where it sits in the middle`
          : `you lean the other way, toward ${yourPole}`;
        ul.appendChild(el('li', null, `${x.ax.name}: you ${signed(x.you)}, ${who} ${signed(x.it)}. ${how[0].toUpperCase() + how.slice(1)}.`));
      });
      box.appendChild(el('p', null, 'You part ways with it on:'));
      box.appendChild(ul);
    } else {
      box.appendChild(el('p', null, 'There is no axis where you differ from it by 30 points or more.'));
    }
    if (c.open.length) box.appendChild(el('p', 'sub', 'It takes no fixed position on ' + listText(c.open) + ', so those axes were not used.'));
  }

  function renderDeep(u, ide) {
    const n = IDEOLOGY_NOTES[ide.name] || {};
    $('#r-deep-name').textContent = ide.name;
    $('#r-deep-core').textContent = n.core || ide.d;
    const pol = $('#r-deep-policy');
    pol.textContent = '';
    (n.policy || []).forEach((t) => pol.appendChild(el('li', null, t)));
    $('#r-deep-tensions').textContent = n.tensions || '';
    $('#r-deep-today').textContent = n.today || '';
    $('#r-deep-psych').textContent = n.psych || '';
    $('#r-deep-psych-wrap').hidden = !n.psych;
    $('#r-deep-src').textContent = ide.src ? 'Further reading: ' + ide.src + '.' : '';

    renderCompare($('#r-deep-compare'), compareToIdeology(u, ide), 'typical supporter');
  }

  function listText(a) {
    if (a.length < 2) return a.join('');
    return a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  }

  function renderPractice(u) {
    const ol = $('#r-practice');
    ol.textContent = '';
    const order = AXES.map((ax, k) => ({ ax, k, v: u[k] })).sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
    const center = [];
    order.forEach(({ ax, v }) => {
      const t = practiceFor(ax.key, v);
      if (!t) { center.push(ax.name); return; }
      const li = el('li', 'practice-item');
      const head = el('div', 'practice-head');
      head.appendChild(el('span', 'practice-axis', ax.name));
      head.appendChild(el('span', 'practice-verdict', strengthLabel(v, ax)));
      head.appendChild(el('span', 'num practice-val', signed(v)));
      li.appendChild(head);
      li.appendChild(el('p', null, t));
      ol.appendChild(li);
    });
    $('#r-practice-center').textContent = center.length
      ? 'No strong pull either way on ' + listText(center) + '.'
      : '';
  }

  function renderPsych(u) {
    const d = dimensions(u);
    const t = typology(d);
    $('#r-type-name').textContent = t.name;
    $('#r-type-text').textContent = t.text;
    $('#r-dims').textContent = `Economic ${signed(d.econ)} · Cultural ${signed(d.cultural)}`;
    $('#r-map').innerHTML = dimMap(d);
    const box = $('#r-psych');
    box.textContent = '';
    psychology(u, d).forEach((p) => box.appendChild(el('p', null, p)));
    $('#r-psych-caveat').textContent = PSYCH_CAVEAT;
  }

  // Small two-dimensional map. x = economic (Equality to Markets), y = cultural (Progress/Liberty at the
  // bottom, Tradition/Authority at the top).
  function dimMap(d) {
    const S = 220, P = 28, W = S - 2 * P;
    const x = P + ((d.econ + 100) / 200) * W;
    const y = P + ((100 - d.cultural) / 200) * W;
    const q = (tx, ty, label, anchor) => `<text x="${tx}" y="${ty}" text-anchor="${anchor}" class="map-q">${label}</text>`;
    return `<svg viewBox="0 0 ${S} ${S}" role="img">
      <rect x="${P}" y="${P}" width="${W}" height="${W}" class="map-box"/>
      <line x1="${S / 2}" y1="${P}" x2="${S / 2}" y2="${S - P}" class="map-axis"/>
      <line x1="${P}" y1="${S / 2}" x2="${S - P}" y2="${S / 2}" class="map-axis"/>
      ${q(P + 4, P + 12, 'Left-communitarian', 'start')}
      ${q(S - P - 4, P + 12, 'Consistent right', 'end')}
      ${q(P + 4, S - P - 6, 'Consistent left', 'start')}
      ${q(S - P - 4, S - P - 6, 'Market liberal', 'end')}
      <text x="${S / 2}" y="${S - 8}" text-anchor="middle" class="map-lab">Equality ← economic → Markets</text>
      <text x="10" y="${S / 2}" text-anchor="middle" class="map-lab" transform="rotate(-90 10 ${S / 2})">Liberty ← cultural → Order</text>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" class="map-you"/>
    </svg>`;
  }

  function renderQuality(q, prefix, noun) {
    const box = $('#' + (prefix || 'r') + '-quality');
    box.hidden = !q;
    if (!q) return;
    const lines = [];
    if (q.attention === false) lines.push({ cls: 'warn', t: 'You missed the attention-check statement. Treat this result with caution.' });
    if (q.overall != null) {
      const pct = Math.round(q.overall * 100);
      lines.push({ cls: pct < 50 ? 'warn' : '', t: `Answer consistency ${pct}%. This is how often your answers on the same axis point the same way. Below about 50%, your views don't line up on these axes, which is common (Converse 1964; Kinder & Kalmoe 2017), and the nearest ${noun || 'ideology'} means less.` });
    }
    if (q.skipped) lines.push({ cls: '', t: `${q.skipped} statement${q.skipped === 1 ? '' : 's'} answered "No opinion" and left out of scoring.` });
    if (q.mode === 'short') lines.push({ cls: '', t: 'Short version: five statements per axis, so each score is less reliable than in the full test.' });
    const ul = $('#' + (prefix || 'r') + '-quality-list');
    ul.textContent = '';
    lines.forEach((l) => { const li = el('li', l.cls, l.t); ul.appendChild(li); });
  }

  function matchRow(r) {
    const li = el('li', 'match');
    const b = el('button', 'match-btn');
    b.type = 'button';
    const left = el('span', 'match-who');
    left.appendChild(el('span', 'match-name', r.f.n));
    left.appendChild(el('span', 'match-sub', r.f.phil ? `${r.f.l} · ${r.f.y}` : `${r.f.l} · ${FIGURE_CATEGORIES[r.f.c]}`));
    const pct = el('span', 'num match-pct', approx(r.d));
    const meter = el('span', 'meter');
    const fill = el('span', 'meter-fill');
    fill.style.width = similarity(r.d) + '%';
    meter.appendChild(fill);
    b.append(left, meter, pct);
    b.addEventListener('click', () => openFigure(r.f));
    li.appendChild(b);
    return li;
  }

  // ---------- philosophy results ----------

  const PHIL_W = PHIL_AXES.map(() => 1);
  const rankSchools = (u) => SCHOOLS.map((sc) => ({ sc, ...distance(u, sc.v, IDEOLOGY_GAP, PHIL_W) }))
    .filter((r) => r.n >= 5).sort((a, b) => a.d - b.d);
  const rankPhilosophers = (u) => PHILOSOPHERS.filter((p) => p.v.filter((x) => x != null).length >= 5)
    .map((f) => ({ f, ...distance(u, f.v, FIGURE_GAP, PHIL_W) })).sort((a, b) => a.d - b.d);

  function renderPhil(u) {
    const schools = rankSchools(u);
    const top = schools[0];
    const close = schools.filter((r) => similarity(top.d) - similarity(r.d) < CLEAR_FIT_GAP);
    $('#p-eyebrow').textContent = close.length > 1 ? 'No clear fit: closest schools of thought' : 'Closest school of thought';
    $('#p-school').textContent = close.length > 1 ? close.slice(0, 3).map((r) => r.sc.name).join(' / ') : top.sc.name;
    $('#p-sim').textContent = approx(top.d) + ' match' + (similarity(top.d) < WEAK_FIT ? ' · no profile fits closely' : '');
    $('#p-desc').textContent = close.length > 1
      ? `These are within ${CLEAR_FIT_GAP} points of each other; the test cannot separate them.`
      : top.sc.core;
    const phils = rankPhilosophers(u);
    $('#p-top-phil').textContent = phils.length ? `Closest philosopher: ${phils[0].f.n} (${approx(phils[0].d)}).` : '';

    renderQuality(philQuality, 'p', 'school');

    // School tabs
    const tabs = $('#p-deep-tabs');
    tabs.textContent = '';
    const list = schools.slice(0, 5);
    const select = (i) => {
      [...tabs.children].forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
      const sc = list[i].sc;
      $('#p-deep-name').textContent = sc.name;
      $('#p-deep-core').textContent = sc.core;
      const ul = $('#p-deep-claims');
      ul.textContent = '';
      sc.claims.forEach((t) => ul.appendChild(el('li', null, t)));
      $('#p-deep-debates').textContent = sc.debates;
      $('#p-deep-src').textContent = 'Key texts: ' + sc.src + '.';
      renderCompare($('#p-deep-compare'), compareToIdeology(u, sc, PHIL_AXES), 'the school');
      const members = PHILOSOPHERS.filter((p) => p.l === sc.name);
      const box = $('#p-deep-people');
      box.textContent = '';
      $('#p-deep-people-wrap').hidden = !members.length;
      members.forEach((p) => box.appendChild(figureChip(p, approx(distance(u, p.v, FIGURE_GAP, PHIL_W).d))));
    };
    list.forEach((r, i) => {
      const b = el('button', 'deep-tab');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.appendChild(el('span', null, r.sc.name));
      b.appendChild(el('span', 'num deep-tab-pct', approx(r.d)));
      b.addEventListener('click', () => select(i));
      tabs.appendChild(b);
    });
    select(0);

    // Axes
    const box = $('#p-axes');
    box.textContent = '';
    PHIL_AXES.forEach((ax, k) => {
      const row = el('section', 'axis-row');
      const head = el('div', 'axis-head');
      head.append(el('h3', 'axis-name', ax.name), el('span', 'axis-verdict', strengthLabel(u[k], ax)));
      const pa = philQuality && philQuality.perAxis[k];
      if (pa && pa.agreement != null && pa.agreement < 0.4) head.appendChild(el('span', 'tag', 'Mixed answers'));
      const val = el('span', 'num axis-val', signed(u[k]));
      val.style.marginLeft = 'auto';
      head.appendChild(val);
      const poles = el('div', 'poles');
      poles.append(el('span', 'pole pole-l', ax.left), el('span', 'pole pole-r', ax.right));
      const near = el('div', 'near');
      near.appendChild(el('span', 'near-label', 'Closest on this axis'));
      const chips = el('div', 'chips');
      PHILOSOPHERS.filter((f) => f.v[k] != null)
        .map((f) => ({ f, d: Math.abs(f.v[k] - u[k]), tie: distance(u, f.v, FIGURE_GAP, PHIL_W).d }))
        .sort((a, b) => a.d - b.d || a.tie - b.tie).slice(0, 4)
        .forEach((r) => chips.appendChild(figureChip(r.f, signed(r.f.v[k]))));
      near.appendChild(chips);
      row.append(head, poles, axisBar(ax, k, u[k], { ticks: true, ticksFrom: PHILOSOPHERS }), near);
      if (ax.survey) row.appendChild(el('p', 'survey', ax.survey));
      box.appendChild(row);
    });

    const nearList = $('#p-near');
    nearList.textContent = '';
    phils.slice(0, 10).forEach((r) => nearList.appendChild(matchRow(r)));
    const farList = $('#p-far');
    farList.textContent = '';
    phils.slice(-5).reverse().forEach((r) => farList.appendChild(matchRow(r)));
  }

  function renderGaps(pol, phil) {
    $('#g-intro').textContent = GAP_INTRO;
    const list = $('#g-list');
    list.textContent = '';
    const items = gapAnalysis(pol, phil);
    const gaps = items.filter((g) => g.status === 'gap').length;
    $('#g-summary').textContent = gaps
      ? `${gaps} of ${items.length} research-backed links show a less common combination for you.`
      : `None of the ${items.length} research-backed links show an unusual combination for you.`;
    const LABEL = { aligned: 'Matches research', gap: 'Less common', note: 'Worth noting', neutral: 'No clear pattern' };
    items.forEach((g) => {
      const li = el('li', 'gap-item');
      li.dataset.status = g.status;
      const head = el('div', 'gap-head');
      head.append(el('span', 'gap-title', g.title), el('span', 'gap-status', LABEL[g.status]));
      li.append(head, el('p', 'num sub gap-pair', g.pair), el('p', null, g.text), el('p', 'sub', 'Research: ' + g.cite));
      list.appendChild(li);
    });
  }

  // ---------- test chooser ----------

  const SECONDS_PER_STATEMENT = 8;
  function setupChooser() {
    const update = () => {
      document.querySelectorAll('[data-test]').forEach((b) => {
        const t = b.dataset.test;
        b.setAttribute('aria-pressed', String((t === 'pol' && mode.pol && !mode.phil) || (t === 'phil' && mode.phil && !mode.pol) || (t === 'both' && mode.pol && mode.phil)));
      });
      document.querySelectorAll('[data-len]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.len === mode.len)));
      const qs = buildQuiz();
      const mins = Math.max(1, Math.round(qs.length * SECONDS_PER_STATEMENT / 60));
      const checks = qs.filter((q) => q.check != null).length;
      $('#start-summary').textContent = `${qs.length - checks} statements + ${checks} attention check${checks === 1 ? '' : 's'} · about ${mins} min` +
        (mode.len === 'short' ? ' · five per axis, less reliable' : '');
    };
    document.querySelectorAll('[data-test]').forEach((b) => b.addEventListener('click', () => {
      mode.pol = b.dataset.test !== 'phil';
      mode.phil = b.dataset.test !== 'pol';
      update();
    }));
    document.querySelectorAll('[data-len]').forEach((b) => b.addEventListener('click', () => { mode.len = b.dataset.len; update(); }));
    update();
  }

  // ---------- philosophy browser ----------

  function sparkFor(v, axes) {
    const spark = el('span', 'spark');
    spark.style.gridTemplateColumns = `repeat(${axes.length}, 1fr)`;
    axes.forEach((ax, k) => {
      const s = el('span', 'spark-col');
      s.title = `${ax.name}: ${v[k] == null ? 'no position' : signed(v[k])}`;
      if (v[k] != null) {
        const bar = el('span', 'spark-bar');
        bar.style.height = (Math.abs(v[k]) / 2) + '%';
        bar.style.background = v[k] < 0 ? ax.lc : ax.rc;
        bar.style[v[k] < 0 ? 'top' : 'bottom'] = '50%';
        s.appendChild(bar);
      } else {
        s.classList.add('spark-na');
      }
      spark.appendChild(s);
    });
    return spark;
  }

  function renderPhilBrowser() {
    const q = $('#phil-search').value.trim().toLowerCase();
    const list = $('#phil-list');
    list.textContent = '';
    PHILOSOPHERS.filter((f) => !q || f.n.toLowerCase().includes(q) || f.l.toLowerCase().includes(q)).forEach((f) => {
      const li = el('li');
      const b = el('button', 'fig-card');
      b.type = 'button';
      const top = el('span', 'fig-top');
      top.appendChild(el('span', 'fig-name', f.n));
      const c = el('span', 'conf', f.conf);
      c.dataset.conf = f.conf;
      top.appendChild(c);
      b.append(top, el('span', 'fig-sub', f.y), el('span', 'fig-label', f.l), sparkFor(f.v, PHIL_AXES));
      b.addEventListener('click', () => openFigure(f));
      li.appendChild(b);
      list.appendChild(li);
    });
    $('#phil-count').textContent = list.children.length + ' shown';

    const sl = $('#school-list');
    if (sl.children.length) return;
    SCHOOLS.forEach((sc) => {
      const li = el('li', 'ide');
      li.appendChild(el('h3', 'ide-name', sc.name));
      li.appendChild(el('p', 'ide-desc', sc.core));
      li.appendChild(el('p', 'ide-src', 'Key texts: ' + sc.src));
      li.appendChild(profileTable(sc.v, null, PHIL_AXES));
      const det = el('details', 'ide-more');
      det.appendChild(el('summary', null, 'Read more'));
      const ul = el('ul', 'deep-list');
      sc.claims.forEach((t) => ul.appendChild(el('li', null, t)));
      det.append(el('h4', 'h-small', 'What it holds'), ul, el('h4', 'h-small', 'Arguments inside it'), el('p', null, sc.debates));
      const members = PHILOSOPHERS.filter((p) => p.l === sc.name).map((p) => p.n);
      if (members.length) det.append(el('h4', 'h-small', 'Philosophers scored here'), el('p', null, listText(members)));
      li.appendChild(det);
      sl.appendChild(li);
    });
  }

  // ---------- figure dialog ----------

  function profileTable(v, compareTo, axes) {
    const box = el('div', 'profile');
    (axes || AXES).forEach((ax, k) => {
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
    $('#fd-sub').textContent = f.phil ? `${f.y} · Philosopher` : `${f.y} · ${FIGURE_CATEGORIES[f.c]}`;
    $('#fd-label').textContent = f.l;
    const conf = $('#fd-conf');
    conf.textContent = f.conf + ' confidence';
    conf.dataset.conf = f.conf;
    $('#fd-note').textContent = f.note;
    $('#fd-flag').textContent = f.flag || '';
    $('#fd-flag').hidden = !f.flag;
    const src = $('#fd-src');
    src.textContent = '';
    (f.src || []).forEach((t) => src.appendChild(el('li', null, t)));
    $('#fd-src-wrap').hidden = !(f.src && f.src.length);
    const scored = f.v.filter((x) => x != null).length;
    $('#fd-src-h').textContent = f.phil ? 'Works the scores rest on' : 'Sources';
    $('#fd-nearest').textContent = scored < 4 ? 'Too few scored axes to compute a nearest match.'
      : f.phil ? 'Nearest school profile on these scores: ' + nearestFor(f.v, SCHOOLS)
      : 'Nearest ideology profile on these scores: ' + nearestFor(f.v, IDEOLOGIES);
    const compare = f.phil ? currentPhil : currentScores;
    const prof = $('#fd-profile');
    prof.textContent = '';
    prof.appendChild(profileTable(f.v, compare, f.phil ? PHIL_AXES : AXES));
    $('#fd-legend').hidden = !compare;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }

  // Profile nearest to a figure or philosopher, using only axes both define.
  function nearestFor(v, list) {
    let best = null;
    list.forEach((ide) => {
      let ss = 0, n = 0;
      for (let k = 0; k < v.length; k++) {
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
      if (ide.src) li.appendChild(el('p', 'ide-src', 'Source: ' + ide.src));
      li.appendChild(profileTable(ide.v));
      const n = IDEOLOGY_NOTES[ide.name];
      if (n) {
        const det = el('details', 'ide-more');
        det.appendChild(el('summary', null, 'Read more'));
        det.appendChild(el('p', null, n.core));
        const ul = el('ul', 'deep-list');
        n.policy.forEach((t) => ul.appendChild(el('li', null, t)));
        det.append(el('h4', 'h-small', 'What its supporters push for'), ul,
          el('h4', 'h-small', 'Arguments inside it'), el('p', null, n.tensions),
          el('h4', 'h-small', 'Where it exists today'), el('p', null, n.today));
        if (n.psych) det.append(el('h4', 'h-small', 'Research on its supporters'), el('p', null, n.psych));
        li.appendChild(det);
      }
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
      if (ax.key === 'method') dd.appendChild(el('span', 'dd-count', ' Counts half as much as other axes in matching.'));
      const shortCount = SHORT.filter((q) => q.e[ax.key]).length;
      dd.appendChild(el('span', 'dd-count', ` ${count} statements touch this axis (${shortCount} in the short version).`));
      box.append(dt, dd);
    });
  }

  // ---------- boot ----------

  function parseHash() {
    const h = (location.hash || '').slice(1);
    const code = parseCode('#' + h);
    if (code) return { code };
    if (views.includes(h)) return { view: h };
    return {};
  }

  function loadCode(code) {
    currentScores = code.pol;
    currentPhil = code.phil;
    currentQuality = philQuality = null;
    showResults();
  }

  function boot() {
    $('#fig-total').textContent = FIGURES.length;
    $('#ide-total').textContent = IDEOLOGIES.length;
    $('#phil-total').textContent = PHILOSOPHERS.length;
    $('#school-total').textContent = SCHOOLS.length;
    setupChooser();
    $('#start').addEventListener('click', startQuiz);
    $('#retake').addEventListener('click', () => {
      $('#results').hidden = true;
      $('#quiz').hidden = true;
      $('#intro').hidden = false;
      try { history.replaceState(null, '', '#test'); } catch (e) { /* sandboxed */ }
      window.scrollTo({ top: 0 });
    });
    $('#q-back').addEventListener('click', () => { if (idx > 0) { idx--; renderQuestion(); } });
    $('#q-skip').addEventListener('click', () => choose(null));
    $('#fig-filter').addEventListener('change', renderBrowser);
    $('#fig-search').addEventListener('input', renderBrowser);
    $('#phil-search').addEventListener('input', renderPhilBrowser);
    document.querySelectorAll('[data-jump]').forEach((b) => b.addEventListener('click', () => {
      document.getElementById(b.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
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
      const code = parseCode($('#paste-code').value);
      $('#paste-error').hidden = !!code;
      if (code) loadCode(code);
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
    renderPhilBrowser();
    renderMethodAxes();

    const st = parseHash();
    if (st.code) loadCode(st.code);
    else showView(st.view || 'test');
  }

  // 1–5 keys answer while the quiz is open.
  function keyboard() {
    document.addEventListener('keydown', (e) => {
      if ($('#quiz').hidden || $('#view-test').hidden) return;
      if (e.target.tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= 5) choose(ANSWERS[n - 1].v);
      else if (n === 6) choose(null);
      else if (e.key === 'Backspace' && idx > 0) { idx--; renderQuestion(); }
    });
  }

  boot();
})();
