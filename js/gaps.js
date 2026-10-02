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

  // 5. Worldview and cultural politics, from the philosophers' own answers
  {
    const n = side(F('nat')), c = side(P('culture'));
    const base = {
      title: 'Worldview and cultural politics',
      pair: `Reality ${fmtScore(F('nat'))} · Culture ${fmtScore(P('culture'))}`,
      cite: 'Bourget & Chalmers (2023), 2020 PhilPapers Survey, Table 19'
    };
    if (n && c && n === c) out.push({ ...base, status: 'aligned',
      text: n > 0
        ? 'Your transcendent worldview goes with cultural traditionalism. This is the strongest politics-related pattern among professional philosophers: theism correlates with judging abortion impermissible at r = -0.65, and libertarian free will (-0.44) and objective meaning of life (-0.45) point the same way.'
        : 'Your naturalism goes with cultural liberalism, the majority pattern among professional philosophers: physicalism about the mind and naturalism both correlate with judging abortion permissible (r = 0.43 each), and theism correlates against it (r = -0.65).' });
    else if (n > 0 && c < 0) out.push({ ...base, status: 'gap',
      text: 'You hold a religious or transcendent worldview but are culturally liberal. Among professional philosophers this is the less common pairing: theism correlates with judging abortion impermissible at r = -0.65. It has a long tradition, though: liberal Protestantism, the religious left, and Catholic thinkers who separate moral teaching from law.' });
    else if (n < 0 && c > 0) out.push({ ...base, status: 'gap',
      text: 'You are a naturalist but culturally traditional. Among professional philosophers, naturalism goes with liberal views on abortion (r = 0.43). The secular case for tradition rests on social stability and inherited wisdom rather than revelation, as in Hume, Burke read secularly, or Oakeshott.' });
    else out.push({ ...base, status: 'neutral', text: 'At least one of these is near the middle for you, so there is no clear pattern to compare.' });
  }

  // 6. Social construction and economics, from the philosophers' own answers
  {
    const r = side(F('real')), e = side(P('econ'));
    const base = {
      title: 'Social construction and economics',
      pair: `Truth ${fmtScore(F('real'))} · Economy ${fmtScore(P('econ'))}`,
      cite: 'Bourget & Chalmers (2023), Table 19'
    };
    if (r && e && r !== e) out.push({ ...base, status: 'aligned',
      text: r > 0
        ? 'You see more of reality as socially constructed and lean economically left. Among professional philosophers, holding that race is biological correlates with capitalism at r = 0.37, and wanting to preserve gender categories at r = 0.38, so the reverse pairing you hold is the common one. The link is modest and runs through views on race and gender in particular.'
        : 'You lean realist about categories and economically right, matching a modest pattern among professional philosophers: biological views of race correlate with capitalism at r = 0.37.' });
    else if (r && e && r === e) out.push({ ...base, status: 'note',
      text: r > 0
        ? 'You see much of reality as socially constructed but lean economically right. Among professional philosophers the more common pairing is constructionism with socialism (r about 0.37 to 0.38 for the race and gender questions). The link is modest; libertarian constructivists exist, often influenced by Hayek\'s view of social orders as spontaneous constructions.'
        : 'You lean realist about categories and economically left. Among professional philosophers realism about race and gender leans slightly toward capitalism (r about 0.37), but the link is modest, and realist egalitarians such as Rawlsians and Marxist materialists are common.' });
    else out.push({ ...base, status: 'neutral', text: 'At least one of these is near the middle for you, so there is no clear pattern to compare.' });
  }

  return out;
}

const GAP_INTRO = 'Research links a few philosophical views to political ones. The first four checks use studies of the general public; the last two use the 2020 PhilPapers Survey of professional philosophers. All are modest correlations, mostly from US and European samples. A gap means your combination is less common than the research predicts, not that it is inconsistent. Each gap below names a tradition that holds that combination on principle.';
