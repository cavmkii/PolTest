// Each statement moves one or more axes. A positive weight means agreeing pushes
// toward the right-hand pole of that axis (Markets, Authority, Tradition, ...).
// Every axis has statements in both directions to dampen agree-with-everything bias.
// s: 1 marks the 50 scored statements (five per axis) used by the short version.
// Violence items are concrete scenarios rather than abstract principles, following Westwood et al. (2022, PNAS).
const QUESTIONS = [
  // Economy
  { t: 'Healthcare should be paid for by the government through taxes.', s: 1, e: { econ: -1 } },
  { t: 'Minimum wage laws do more harm than good for low-skilled workers.', s: 1, e: { econ: 1 } },
  { t: 'Key industries such as energy, rail and water should be publicly owned.', s: 1, e: { econ: -1 } },
  { t: 'Inequality is not a problem in itself, as long as the poor are getting richer.', e: { econ: 1 } },
  { t: 'Labor unions should have more power to bargain with employers.', e: { econ: -1 } },
  { t: 'Taxes on the highest earners should be substantially increased.', s: 1, e: { econ: -1 } },
  { t: 'Private property is a natural right that the state should rarely override.', e: { econ: 1 } },
  { t: 'Cutting regulations on business is usually good for the economy.', s: 1, e: { econ: 1, ecology: 0.5 } },
  { t: 'Society would be better off if workers collectively owned the firms they work in.', e: { econ: -1 } },

  // State power
  { t: 'The government should be able to monitor communications without a warrant if it helps prevent terrorism.', s: 1, e: { power: 1 } },
  { t: 'Hate speech should be a criminal offense.', e: { power: 0.5, culture: -0.5 } },
  { t: 'Most drugs should be legal for adults.', s: 1, e: { power: -1, culture: -0.5 } },
  { t: 'In a national crisis, the head of government should be able to rule without parliament\'s approval.', s: 1, e: { power: 1, method: 0.5 } },
  { t: 'Private citizens should have the right to own firearms.', s: 1, e: { power: -1, culture: 0.3 } },
  { t: 'Schools should put more emphasis on obedience and respect for authority.', e: { power: 1, culture: 0.5 } },
  { t: 'The press should be free to publish state secrets when it is in the public interest.', s: 1, e: { power: -1 } },
  { t: 'Political parties that threaten national stability should be banned.', e: { power: 1 } },
  { t: 'Governments should not break up protests just because they are disruptive.', e: { power: -1 } },
  { t: 'Adults should be free to do what they want with their own bodies as long as they harm no one else.', e: { power: -1, culture: -0.5 } },

  // Culture
  { t: 'Same-sex marriage should be legal.', s: 1, e: { culture: -1 } },
  { t: 'Abortion should be legal in most or all cases.', s: 1, e: { culture: -1, faith: -0.5 } },
  { t: 'Traditional gender roles are best for families and for society.', s: 1, e: { culture: 1 } },
  { t: 'A society is better off when it changes slowly and respects inherited institutions.', s: 1, e: { culture: 1 } },
  { t: 'Schools should teach about systemic racism and the historical oppression of minorities.', e: { culture: -1, belong: -0.5 } },
  { t: 'Modern society has lost something important by abandoning older moral codes.', s: 1, e: { culture: 1, faith: 0.5 } },
  { t: 'People should be able to have their gender legally recognized regardless of their sex at birth.', e: { culture: -1 } },

  // Sovereignty
  { t: "My country's interests should come before those of any international organization.", s: 1, e: { nation: 1 } },
  { t: 'International bodies like the UN should be able to enforce their decisions on member states.', s: 1, e: { nation: -1 } },
  { t: 'Free trade agreements generally benefit the countries that sign them.', s: 1, e: { nation: -1, econ: 0.5 } },
  { t: 'Domestic industries should be protected with tariffs, even if goods become more expensive.', s: 1, e: { nation: 1, econ: -0.3 } },
  { t: 'I think of myself as a citizen of the world before a citizen of my country.', s: 1, e: { nation: -1 } },
  { t: 'National sovereignty matters more than international human rights treaties.', e: { nation: 1, power: 0.3 } },
  { t: 'Humanity would be better off with stronger global governance, even at the cost of national independence.', e: { nation: -1 } },

  // Attention check: not scored. Answering anything but Disagree flags the result.
  { t: 'To show you are reading carefully, choose "Disagree" for this statement.', s: 1, check: -0.5, e: {} },

  // Religion
  { t: 'Religious values should guide the laws of the country.', s: 1, e: { faith: 1 } },
  { t: 'Religion and the state should be strictly separated.', s: 1, e: { faith: -1 } },
  { t: 'Blasphemy should be punishable by law.', s: 1, e: { faith: 1, power: 0.5 } },
  { t: 'A society without a shared religion will eventually decay.', e: { faith: 1, culture: 0.5 } },
  { t: 'Religious leaders should have a formal role in government.', s: 1, e: { faith: 1 } },
  { t: 'Religious schools should not receive public money.', e: { faith: -1 } },
  { t: 'Public officials should keep their religious beliefs out of policy decisions.', e: { faith: -1 } },
  { t: 'Laws should rest on reason and evidence, not on religious teaching.', s: 1, e: { faith: -1 } },

  // Membership
  { t: 'My country should welcome immigrants who want to settle here permanently.', s: 1, e: { belong: -1, nation: -0.5 } },
  { t: 'A nation is fundamentally defined by shared ancestry.', s: 1, e: { belong: 1, nation: 0.5 } },
  { t: "Anyone who commits to the country's laws should be able to become a full citizen, whatever their race or religion.", s: 1, e: { belong: -1 } },
  { t: 'Some cultures are simply incompatible with ours, and their members should not be allowed to settle here.', s: 1, e: { belong: 1 } },
  { t: 'Members of minority religions should have exactly the same rights as the majority.', e: { belong: -1, faith: -0.3 } },
  { t: "Mixing between ethnic groups weakens a nation's identity.", s: 1, e: { belong: 1 } },
  { t: 'Immigration should be sharply reduced.', e: { belong: 0.5, nation: 0.5 } },

  // Force abroad
  { t: 'My country should be willing to use military force to spread its values abroad.', s: 1, e: { war: 1 } },
  { t: 'War is almost never justified.', s: 1, e: { war: -1 } },
  { t: 'Military spending should be cut and the money spent at home.', e: { war: -1, econ: -0.3 } },
  { t: 'A powerful military is the best guarantee of peace.', s: 1, e: { war: 1 } },
  { t: "My country should stay out of other nations' conflicts.", s: 1, e: { war: -1, nation: 0.3 } },
  { t: 'Striking first is justified against a hostile state that is developing dangerous weapons.', s: 1, e: { war: 1 } },
  { t: 'Dying in war for a righteous cause is among the most honorable things a person can do.', e: { war: 1, faith: 0.3 } },
  { t: 'Diplomacy and sanctions should always be exhausted before any military action.', e: { war: -1 } },

  // Justice
  { t: 'The death penalty should be available for the worst crimes.', s: 1, e: { justice: 1 } },
  { t: 'Prisons should focus on rehabilitation rather than punishment.', s: 1, e: { justice: -1 } },
  { t: 'Harsher sentences reduce crime.', s: 1, e: { justice: 1 } },
  { t: 'Police should have more power to fight crime, even at some cost to civil liberties.', s: 1, e: { justice: 1, power: 0.5 } },
  { t: 'Crime is mainly a product of poverty and social conditions.', s: 1, e: { justice: -1, econ: -0.3 } },
  { t: 'People convicted of nonviolent crimes should generally not go to prison.', e: { justice: -1 } },

  // Environment
  { t: 'Climate change is a serious threat that requires rapid, large-scale government action.', s: 1, e: { ecology: -1 } },
  { t: 'Economic growth should take priority over environmental protection.', s: 1, e: { ecology: 1 } },
  { t: 'We should consume less, even if it means a lower material standard of living.', e: { ecology: -1 } },
  { t: 'Fossil fuel production should be expanded to secure energy independence.', s: 1, e: { ecology: 1, nation: 0.3 } },
  { t: 'Nature has value beyond what it provides to humans.', s: 1, e: { ecology: -1 } },
  { t: 'Industrial civilization has been a disaster for the human race.', s: 1, e: { ecology: -1, method: 0.3 } },
  { t: 'Technological progress is, on the whole, good for humanity.', e: { ecology: 0.5, culture: -0.3 } },

  // Means
  { t: 'In a country with free elections, it is never acceptable to physically attack politicians or officials, even ones you see as dangerous.', s: 1, e: { method: -1 } },
  { t: 'The political system is so corrupt that it must be torn down rather than reformed.', e: { method: 1 } },
  { t: 'Using violence to stop a policy I strongly oppose would be justified if peaceful means had failed.', e: { method: 1 } },
  { t: 'Political change should come through elections, courts and legislation.', e: { method: -1 } },
  { t: 'If a government jailed opposition leaders and cancelled elections, citizens would be justified in taking up arms against it.', s: 1, e: { method: 0.5 } },
  { t: 'A movement fighting for a cause I support would be justified in bombing places where its opponents\' civilians gather.', s: 1, e: { method: 1, war: 0.5 } },
  { t: 'Compromising with political opponents is a sign of weakness.', e: { method: 0.5, power: 0.3, pop: 0.5 } },
  { t: 'Accepting the result of an election matters even when your side loses.', s: 1, e: { method: -1 } },

  // Populism (Akkerman, Mudde & Zaslove 2014, with reverse-worded items added)
  { t: 'The politicians in parliament need to follow the will of the people.', s: 1, e: { pop: 1 } },
  { t: 'The people, and not politicians, should make our most important policy decisions.', s: 1, e: { pop: 1 } },
  { t: 'The political differences between the elite and the people are larger than the differences among the people.', s: 1, e: { pop: 1 } },
  { t: 'Most political disagreements are honest differences of opinion, not a struggle between the people and a corrupt elite.', s: 1, e: { pop: -1 } },
  { t: 'Elected representatives should sometimes use their own judgment even when most voters disagree.', s: 1, e: { pop: -1 } },
  { t: 'I would rather be represented by an ordinary citizen than by a specialized politician.', e: { pop: 1 } },
  { t: 'Elected officials talk too much and take too little action.', e: { pop: 1 } },
  { t: 'Politics is ultimately a struggle between good and evil.', e: { pop: 1 } },
  { t: 'Courts, central banks and other independent institutions should be shielded from popular pressure.', e: { pop: -1 } },
  { t: 'Peaceful protest achieves more lasting change than violence does.', s: 1, e: { method: -1 } }
];

const ANSWERS = [
  { label: 'Strongly agree', v: 1 },
  { label: 'Agree', v: 0.5 },
  { label: 'Neutral', v: 0 },
  { label: 'Disagree', v: -0.5 },
  { label: 'Strongly disagree', v: -1 }
];
