// Turns axis scores into plain-language readings. Practical readings come from your own scores, not the
// ideology label. Psychological readings use research on the broad economic and cultural dimensions,
// which is where nearly all the evidence is; they describe group averages, not individuals.

// [moderate (10–64), strong (65+)] text for each pole of each axis.
const AXIS_PRACTICE = {
  econ: {
    left: ['Universal public services, higher taxes on top earners, a higher minimum wage and pro-union labor law: a mainstream center-left economic agenda.',
      'Public ownership of major industries, single-payer healthcare, steep wealth taxes and much stronger unions: a democratic-socialist agenda or further left.'],
    right: ['Lower taxes, lighter regulation, means-tested rather than universal benefits, and skepticism of minimum-wage increases.',
      'Deep cuts to taxes and spending, privatization and deregulation, and opposition to most redistribution.']
  },
  power: {
    left: ['Civil liberties usually win over security for you: warrants for surveillance, tolerance of disruptive protest, skepticism of censorship.',
      'Strong limits on surveillance and police power, drug decriminalization, robust speech and gun rights, protection for whistleblowers.'],
    right: ['Security and order usually win for you: broader surveillance powers, limits on disruptive protest, support for decisive executive action.',
      'A strong executive that can act without courts or parliament in a crisis, and restrictions on dissent and on parties seen as dangerous.']
  },
  culture: {
    left: ['Same-sex marriage, legal abortion and general openness to social change.',
      'Full legal equality for LGBT people including gender recognition, broad abortion access, and active efforts to change traditional norms.'],
    right: ['Caution about rapid social change, likely support for some limits on abortion, and family policy built around traditional households.',
      'Restoring traditional family and gender roles, restricting abortion and opposing legal gender recognition.']
  },
  nation: {
    left: ['Support for trade agreements, alliances and international law.',
      'Pooling sovereignty in international institutions, open trade, and global governance for global problems.'],
    right: ['National interest first in trade and treaties, openness to tariffs, skepticism of international bodies.',
      'Withdrawal from or defiance of international bodies, broad protectionism, and sovereignty over treaty obligations.']
  },
  faith: {
    left: ['Religion kept out of lawmaking, though not necessarily out of public life.',
      'Strict church-state separation: no public money for religious schools and no religious exemptions from general law.'],
    right: ['Religious values as a legitimate guide for law and a public role for faith.',
      'Law grounded in religious teaching, with religious authorities given a formal role.']
  },
  belong: {
    left: ['Immigration seen as a net good, with citizenship open to anyone regardless of background.',
      'Generous immigration and asylum, birthright citizenship and strong anti-discrimination protection for minorities.'],
    right: ['Lower immigration and more emphasis on assimilation and national culture.',
      'Membership defined by ancestry or culture, and sharp restriction or exclusion of groups seen as incompatible.']
  },
  war: {
    left: ['Force as a last resort and skepticism of foreign interventions.',
      'Non-intervention, lower military spending, and diplomacy and sanctions before any use of force.'],
    right: ['A strong military and willingness to use it to deter or answer threats.',
      'Preemptive force, high defense spending, and using military power to shape other countries.']
  },
  justice: {
    left: ['Rehabilitation, alternatives to prison for nonviolent offenses, and attention to root causes of crime.',
      'Decarceration, abolition of the death penalty, and treating poverty and addiction as the main crime policy.'],
    right: ['Firmer sentencing and support for policing, with the death penalty acceptable for the worst crimes.',
      'Harsh sentences, the death penalty and expanded police power at the center of crime policy.']
  },
  ecology: {
    left: ['Ambitious climate policy and environmental regulation.',
      'Rapid decarbonization even at economic cost, limits on consumption and growth, strong protection of nature.'],
    right: ['Growth and energy security first, with environmental rules weighed against their economic cost.',
      'Expanded fossil fuel production and rollback of environmental regulation.']
  },
  method: {
    left: ['A strong preference for institutional routes and nonviolent protest.',
      'Change only through elections, courts and negotiation, including accepting defeat.'],
    right: ['Openness to disruptive or extra-legal action when institutions seem to fail.',
      'A willingness to see violence as legitimate for political ends. Few people score here, and the statements measuring it are the least reliable in the test.']
  }
};

function practiceFor(key, v) {
  const a = Math.abs(v);
  if (a < 10) return null;
  const side = v < 0 ? 'left' : 'right';
  return AXIS_PRACTICE[key][side][a >= 65 ? 1 : 0];
}

// Two research dimensions: economic (the Economy axis) and a cultural/authoritarian composite of
// State power, Culture, Religion, Membership and Justice. These five are expected to correlate
// (Feldman & Johnston 2014), so averaging them approximates the second dimension.
const CULTURAL_KEYS = ['power', 'culture', 'faith', 'belong', 'justice'];

function dimensions(u) {
  const idx = (k) => AXES.findIndex((a) => a.key === k);
  const econ = u[idx('econ')];
  const cultural = Math.round(CULTURAL_KEYS.reduce((t, k) => t + u[idx(k)], 0) / CULTURAL_KEYS.length);
  return { econ, cultural };
}

function typology(d) {
  const L = d.econ < -20, R = d.econ > 20, P = d.cultural < -20, T = d.cultural > 20;
  if (L && P) return {
    name: 'Consistent left',
    text: 'Your economic and cultural views line up the way the left-right divide in most Western democracies expects: redistribution together with social liberalism. Center-left, green and left parties offer this combination, so you are among the best-represented groups in most party systems.'
  };
  if (R && T) return {
    name: 'Consistent right',
    text: 'Your economic and cultural views line up on the right: markets together with tradition and order. Center-right and national-conservative parties offer this combination, though where those parties have turned protectionist you may now be cross-pressured on trade.'
  };
  if (R && P) return {
    name: 'Market liberal',
    text: 'Economically you sit with the right, culturally with the left. This libertarian-leaning combination is a minority in most electorates and is usually split between parties: liberal parties in Europe, and in the US neither major party fits, which is why such voters often swing or abstain.'
  };
  if (L && T) return {
    name: 'Left-communitarian',
    text: 'Economically left but culturally traditional or order-minded. This combination is common among voters, but Lefkofridi, Wagner & Willmann (2014) found that West European parties rarely offer it, leaving these voters to choose which half of their views to trade away. Many such voters have moved to populist-right parties that pair welfare for natives with cultural protection, or to Christian-democratic and religious parties.'
  };
  return {
    name: 'Mixed or moderate',
    text: 'You are near the center on at least one of the two main dimensions. Treier & Hillygus (2009) found that respondents in the middle often hold strong views that cut across the usual left-right package, not an absence of views. Check your strongest commitments below; they are a better guide than the label.'
  };
}

// Research findings keyed to where you sit. Every line is an average difference between groups.
function psychology(u, d) {
  const idx = (k) => AXES.findIndex((a) => a.key === k);
  const out = [];
  if (d.cultural > 20) {
    out.push('People with more traditional and order-focused views score on average somewhat higher on conscientiousness and lower on openness to experience (Carney et al. 2008; Gerber et al. 2010). In moral judgments they give more weight to loyalty, authority and purity alongside care and fairness (Graham, Haidt & Nosek 2009).');
    out.push('Stenner (2005) found that preferences for conformity and order are a stable predisposition that becomes politically active when people perceive their community as fragmenting or norms as eroding. In calm times the same people can be quite tolerant; under perceived threat they support restrictions more strongly than others.');
  } else if (d.cultural < -20) {
    out.push('People with more socially liberal and liberty-focused views score on average higher on openness to experience and lower on conscientiousness (Carney et al. 2008; Gerber et al. 2010). In moral judgments they rely mainly on care and fairness and give less weight to loyalty, authority and purity (Graham, Haidt & Nosek 2009).');
    out.push('Practically, this tends to mean comfort with novelty and diversity, and moral arguments framed around harm and rights. It can also mean difficulty seeing the moral weight others place on community, tradition or sanctity, which Haidt argues is a source of mutual incomprehension across the divide.');
  } else {
    out.push('Your cultural scores are near the center, where the personality correlations found in the research are weakest. People here often weigh individual-rights and community-and-order concerns case by case.');
  }
  if (d.econ < -20) {
    out.push('Economic views relate less to personality than cultural views do (Gerber et al. 2010; Feldman & Johnston 2014). Your economic position fits the view of fairness as equality and meeting need. Concern for care and harm also predicts support for redistribution (Graham, Haidt & Nosek 2009).');
  } else if (d.econ > 20) {
    out.push('Economic views relate less to personality than cultural views do (Gerber et al. 2010; Feldman & Johnston 2014). Your economic position fits the view of fairness as proportionality, where people should keep what they earn, and a stronger emphasis on personal responsibility and liberty from state control.');
  }
  if (u[idx('power')] > 30 && d.econ < -20) {
    out.push('You combine left economics with support for state authority. Costello et al. (2022) show that left-wing authoritarianism is a measurable trait, with support for coercion and censorship in pursuit of egalitarian goals, which older research often missed by measuring authoritarianism only on the right.');
  }
  if (u[idx('method')] > 30) {
    out.push('Your answers show openness to extra-legal or violent means. Research on radicalization (Kruglanski et al. 2014) finds the path to violence runs less through ideology itself than through a sense of lost significance, a narrative that offers it back, and a network that rewards action. Westwood et al. (2022) also show that survey measures like these overstate real support for violence.');
  }
  return out;
}

const PSYCH_CAVEAT = 'These are average differences between groups, with small-to-moderate effect sizes (correlations mostly around 0.1–0.3). They describe tendencies, not you. Some well-known findings have not held up: physiological threat reactions do not reliably predict conservatism (Bakker et al. 2020), and much of the research comes from the US and Western Europe.';

// How a respondent's scores differ from an ideology profile.
function compareToIdeology(u, ide) {
  const same = [], apart = [], open = [];
  AXES.forEach((ax, k) => {
    const v = ide.v[k];
    if (v == null) { open.push(ax.name); return; }
    const d = u[k] - v;
    if (Math.abs(d) < 15) same.push(ax.name);
    else if (Math.abs(d) >= 30) apart.push({ ax, you: u[k], it: v, d });
  });
  apart.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  return { same, apart, open };
}
