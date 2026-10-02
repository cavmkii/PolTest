// Ten axes. Every score runs from -100 (left pole) to +100 (right pole).
// "Left" and "right" here are only positions on the bar, not the political left/right.
const AXES = [
  {
    key: 'econ', name: 'Economy', left: 'Equality', right: 'Markets',
    lc: '#c4472f', rc: '#c79a1d',
    ldesc: 'Redistribution, public ownership, labor power.',
    rdesc: 'Private property, free exchange, low taxes and regulation.',
    survey: 'Professional philosophers (2020 PhilPapers Survey, target faculty): socialism 53.0%, capitalism 29.5%.'
  },
  {
    key: 'power', name: 'State power', left: 'Liberty', right: 'Authority',
    lc: '#2f9c8c', rc: '#5b6378',
    ldesc: 'Civil liberties, limits on surveillance and coercion.',
    rdesc: 'Order, obedience, a strong executive, restrictions on dissent.'
  },
  {
    key: 'culture', name: 'Culture', left: 'Progress', right: 'Tradition',
    lc: '#8a5bd1', rc: '#a0703c',
    ldesc: 'Social change, sexual and gender liberalism.',
    rdesc: 'Inherited morals, family structure, slow change.'
  },
  {
    key: 'nation', name: 'Sovereignty', left: 'Globalism', right: 'Nationalism',
    lc: '#3b82c4', rc: '#b4433f',
    ldesc: 'International institutions, open trade, shared sovereignty.',
    rdesc: 'National interest first, protectionism, sovereignty over treaties.'
  },
  {
    key: 'faith', name: 'Religion', left: 'Secular', right: 'Religious',
    lc: '#4f8fa8', rc: '#9b7a2a',
    ldesc: 'Separation of religion and state.',
    rdesc: 'Religion shapes law and public life.'
  },
  {
    key: 'belong', name: 'Membership', left: 'Pluralism', right: 'Exclusion',
    lc: '#3c9a5f', rc: '#8c3a52',
    ldesc: 'Equal standing regardless of ethnicity or creed; open to immigrants.',
    rdesc: 'The nation belongs to one people, faith or bloodline.'
  },
  {
    key: 'war', name: 'Force abroad', left: 'Restraint', right: 'Militarism',
    lc: '#5d9fd6', rc: '#a5462b',
    ldesc: 'Non-intervention, diplomacy, smaller militaries.',
    rdesc: 'Military strength, intervention, preemption.'
  },
  {
    key: 'justice', name: 'Justice', left: 'Rehabilitation', right: 'Punishment',
    lc: '#4aa39a', rc: '#6b4d8f',
    ldesc: 'Root causes, decarceration, no death penalty.',
    rdesc: 'Deterrence, harsh sentences, police power.',
    survey: 'Professional philosophers (2020 PhilPapers Survey, target faculty): capital punishment impermissible 75.1%, permissible 17.7%.'
  },
  {
    key: 'ecology', name: 'Environment', left: 'Ecology', right: 'Industry',
    lc: '#4f9a3a', rc: '#7a6a5a',
    ldesc: 'Environmental protection over growth; skepticism of industrialism.',
    rdesc: 'Growth, extraction and development first.',
    survey: 'Professional philosophers (2020 PhilPapers Survey, target faculty): non-anthropocentric environmental ethics 50.7%, anthropocentric 42.3%.'
  },
  {
    key: 'method', name: 'Means', left: 'Reform', right: 'Upheaval',
    lc: '#5a7fb8', rc: '#c23b3b',
    ldesc: 'Elections, courts, compromise, accepting losses.',
    rdesc: 'Willingness to break the legal order, up to armed violence.'
  },
  {
    key: 'pop', name: 'Populism', left: 'Pluralist', right: 'Populist', thin: true, noGap: true,
    lc: '#6f7f99', rc: '#d0782e',
    ldesc: 'Politics as bargaining among legitimate interests through representatives and institutions.',
    rdesc: 'Politics as a pure people against a corrupt elite, with the popular will above institutions.'
  }
];
// Populism is a "thin" ideology (Mudde 2004): it attaches to a host ideology rather than being a position
// on the other axes, so the results show it in its own panel. Its statements follow Akkerman, Mudde &
// Zaslove (2014), with reverse-worded items added. Figures are scored from the Global Populism Database.

// Reference points for the populism panel: mean speech score across terms, Global Populism Database v2.1
// (Hawkins et al.), on its 0–2 scale. 0 = few or no populist elements, 1 = clearly populist but inconsistent,
// 2 = close to the ideal type.
const GPD_REFERENCE = [
  { n: 'Hugo Chávez', s: 1.78, roster: true }, { n: 'Nicolás Maduro', s: 1.60 }, { n: 'Rafael Correa', s: 1.50 },
  { n: 'Rodrigo Duterte', s: 1.38, roster: true }, { n: 'Evo Morales', s: 1.32 }, { n: 'Mahmoud Ahmadinejad', s: 1.17 },
  { n: 'Andrés Manuel López Obrador', s: 0.96 }, { n: 'Recep Tayyip Erdoğan', s: 0.84, roster: true },
  { n: 'Silvio Berlusconi', s: 0.81 }, { n: 'Viktor Orbán', s: 0.69 }, { n: 'Narendra Modi', s: 0.55 },
  { n: 'Jair Bolsonaro', s: 0.50, roster: true }, { n: 'Nayib Bukele', s: 0.50 }, { n: 'Benjamin Netanyahu', s: 0.31 },
  { n: 'Vladimir Putin', s: 0.27, roster: true }, { n: 'Lula da Silva', s: 0.25 }, { n: 'Emmanuel Macron', s: 0.15 },
  { n: 'Angela Merkel', s: 0.03 }
];
// Mapping from the GPD 0–2 scale to this test's -100..+100 axis: v = 75s - 50, so 0 -> -50, 1 -> +25, 2 -> +100.
// A leader with no populist rhetoric is placed at -50, not -100: absence of populism is not active pluralism.
const gpdToAxis = (s) => Math.round(75 * s - 50);
const axisToGpd = (v) => Math.max(0, Math.min(2, (v + 50) / 75));
