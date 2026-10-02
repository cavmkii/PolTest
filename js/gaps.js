// Comparing philosophical and political answers, for people who take both tests.
// Each rule pairs a philosophy axis with a political one where published research finds a link.
// The links are modest correlations in general-population or philosopher samples. A "gap" means the
// combination is less common than the research would predict, not that it is inconsistent: each gap
// note names a philosophical tradition that holds that combination on principle.

const GAP_THRESHOLD = 25;
const fmtScore = (v) => (v > 0 ? "+" + v : String(v));

function gapAnalysis(pol, phil) {
  const P = (k) => pol[AXES.findIndex((a) => a.key === k)];
  const F = (k) => phil[PHIL_AXES.findIndex((a) => a.key === k)];
  const cultural = dimensions(pol).cultural;
  const T = GAP_THRESHOLD;
  const out = [];
  const side = (v) => (v >= T ? 1 : v <= -T ? -1 : 0);

  // 1. Free will and punishment
  {
    const w = side(F('will')), j = side(P('justice'));
    const base = {
      title: 'Free will and punishment',
      pair: `Freedom ${fmtScore(F('will'))} · Justice ${fmtScore(P('justice'))}`,
      cite: 'Carey & Paulhus (2013); Shariff et al. (2014); Everett et al. (2021)'
    };
    if (w && j && w === j) out.push({ ...base, status: 'aligned',
      text: w > 0
        ? 'You believe people genuinely choose, and you favor punishment. Research finds exactly this pairing: belief in free will predicts more punitive attitudes and more conservative views generally, and weakening it reduces support for retribution.'
        : 'You doubt free will and favor rehabilitation. This matches the research: people who see behavior as caused are less retributive, and experiments that weaken free-will belief reduce desire for retributive punishment.' });
    else if (w > 0 && j < 0) out.push({ ...base, status: 'gap',
      text: 'You believe in free will but lean toward rehabilitation. Research would expect a free-will believer to be more punitive. The combination is coherent if you think responsibility settles who answers for a wrong but not how society should respond, as restorative-justice and many religious traditions of mercy hold.' });
    else if (w < 0 && j > 0) out.push({ ...base, status: 'gap',
      text: 'You doubt free will but favor tougher punishment. Research would expect the opposite. The view is coherent if punishment is justified by deterrence and public protection rather than desert, which is roughly Hobbes\'s and Bentham\'s position. Free-will skeptics such as Pereboom argue it rules out retribution but allows incapacitation.' });
    else out.push({ ...base, status: 'neutral', text: 'At least one of these is near the middle for you, so there is no clear pattern to compare.' });
  }

  // 2. Transcendence and religion in public life
  {
    const n = side(F('nat')), f = side(P('faith'));
    const base = {
      title: 'Belief and the role of religion in law',
      pair: `Reality ${fmtScore(F('nat'))} · Religion ${fmtScore(P('faith'))}`,
      cite: 'Bourget & Chalmers (2014) on the anti-naturalism cluster; Goodwin & Darley (2008)'
    };
    if (n && f && n === f) out.push({ ...base, status: 'aligned',
      text: n > 0
        ? 'Your religious or transcendent worldview goes with wanting it reflected in public life, the most common pattern.'
        : 'Your naturalism goes with keeping religion out of lawmaking, the most common pattern.' });
    else if (n > 0 && f < 0) out.push({ ...base, status: 'gap',
      text: 'You hold a religious or transcendent view of reality but want a secular state. This is a long and principled tradition: Roger Williams, Locke\'s Letter Concerning Toleration, and many Baptist and dissenting churches argued that faith is corrupted by state power.' });
    else if (n < 0 && f > 0) out.push({ ...base, status: 'gap',
      text: 'You are a naturalist but favor a public role for religion. That is usually defended on social rather than theological grounds: religion as a source of cohesion and shared morals (a Durkheimian or Burkean argument), the position of self-described "cultural Christians".' });
    else out.push({ ...base, status: 'neutral', text: 'At least one of these is near the middle for you, so there is no clear pattern to compare.' });
  }

  // 3. Moral objectivism and cultural traditionalism
  {
    const m = side(F('moral')), c = side(cultural);
    const base = {
      title: 'Moral objectivity and tradition',
      pair: `Morality ${fmtScore(F('moral'))} · Cultural ${fmtScore(cultural)}`,
      cite: 'Goodwin & Darley (2008); Wright, Cullum & Schwab (2008)'
    };
    if (m < 0 && c > 0) out.push({ ...base, status: 'aligned',
      text: 'You see morality as objective and lean culturally traditional. In general-population research, objectivism goes with grounding ethics in religion. Objectivists are also less tolerant of people who disagree on moral questions, a tendency worth knowing about in yourself.' });
    else if (m > 0 && c < 0) out.push({ ...base, status: 'aligned',
      text: 'You see morality as subjective or conventional and lean culturally liberal, a common pairing. Research links relativism with greater tolerance of moral disagreement.' });
    else if (m < 0 && c < 0) out.push({ ...base, status: 'note',
      text: 'You see morality as objective but lean culturally liberal. In the general public, objectivism goes more with religious traditionalism. Among professional philosophers, though, moral realism is the majority view, held by 62% in 2020, and most lean left. Universal human rights are the classic form of this pairing.' });
    else if (m > 0 && c > 0) out.push({ ...base, status: 'gap',
      text: 'You see morality as subjective yet lean culturally traditional. Research would predict the opposite. The pairing is coherent as conventionalist conservatism: if there is no higher moral standard, inherited customs deserve respect because they are ours and have worked. Hume and, in a different key, Oakeshott argued along these lines.' });
    else out.push({ ...base, status: 'neutral', text: 'At least one of these is near the middle for you, so there is no clear pattern to compare.' });
  }

  // 4. Impartial ethics and national loyalty
  {
    const s = side(F('scope')), n = side(P('nation'));
    const base = {
      title: 'Impartial ethics and the nation',
      pair: `Moral scope ${fmtScore(F('scope'))} · Sovereignty ${fmtScore(P('nation'))}`,
      cite: 'Kahane et al. (2018)'
    };
    if (s && n && s === n) out.push({ ...base, status: 'aligned',
      text: s < 0
        ? 'Your impartial ethics goes with globalist politics. Kahane et al. found that impartial concern for everyone\'s welfare goes with identifying with all of humanity rather than one\'s own group.'
        : 'Your particularist ethics, with special duties to your own, goes with putting the nation first. The pairing is common and consistent.' });
    else if (s < 0 && n > 0) out.push({ ...base, status: 'gap',
      text: 'You think everyone counts equally, yet you favor putting your nation first. The usual reconciliation is institutional: national states may be the best available way to serve everyone, or "associative duties" may sit on top of universal ones. David Miller\'s On Nationality (1995) defends this view.' });
    else if (s > 0 && n < 0) out.push({ ...base, status: 'gap',
      text: 'Your ethics gives priority to your own people and relationships, yet your politics is globalist. That is coherent if international institutions are valued as protection for many particular communities rather than as an expression of impartial concern.' });
    else out.push({ ...base, status: 'neutral', text: 'At least one of these is near the middle for you, so there is no clear pattern to compare.' });
  }

  return out;
}

const GAP_INTRO = 'Research links a few philosophical views to political ones. These links are modest correlations, mostly from US and European samples. A gap means your combination is less common than the research predicts, not that it is inconsistent. Each gap below names a tradition that holds that combination on principle.';
