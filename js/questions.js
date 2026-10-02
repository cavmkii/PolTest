// Each statement moves one or more axes. A positive weight means agreeing pushes
// toward the right-hand pole of that axis (Markets, Authority, Tradition, ...).
// Every axis has statements in both directions to dampen agree-with-everything bias.
const QUESTIONS = [
  // Economy
  { t: 'Healthcare should be provided by the state and free at the point of use.', e: { econ: -1 } },
  { t: 'Minimum wage laws do more harm than good for low-skilled workers.', e: { econ: 1 } },
  { t: 'Key industries such as energy, rail and water should be publicly owned.', e: { econ: -1 } },
  { t: 'Taxes on the highest earners should be substantially increased.', e: { econ: -1 } },
  { t: 'Cutting regulations on business is usually good for the economy.', e: { econ: 1, ecology: 0.5 } },

  // State power
  { t: 'The government should be able to monitor communications without a warrant if it helps prevent terrorism.', e: { power: 1 } },
  { t: 'Most drugs should be legal for adults.', e: { power: -1, culture: -0.5 } },
  { t: 'In a crisis, a strong leader who does not have to answer to parliament or elections would be good for the country.', e: { power: 1, method: 0.5 } },
  { t: 'Private citizens should have the right to own firearms.', e: { power: -1, culture: 0.3 } },
  { t: 'The press should be free to publish state secrets when it is in the public interest.', e: { power: -1 } },

  // Culture
  { t: 'Same-sex marriage should be legal.', e: { culture: -1 } },
  { t: 'Abortion should be legal in most or all cases.', e: { culture: -1, faith: -0.5 } },
  { t: 'Traditional gender roles are best for families and for society.', e: { culture: 1 } },
  { t: 'A society is better off when it changes slowly and respects inherited institutions.', e: { culture: 1 } },
  { t: 'Modern society has lost something important by abandoning older moral codes.', e: { culture: 1, faith: 0.5 } },

  // Sovereignty
  { t: "My country's interests should come before those of any international organization.", e: { nation: 1 } },
  { t: 'International bodies like the UN should be able to enforce their decisions on member states.', e: { nation: -1 } },
  { t: 'Free trade agreements generally benefit the countries that sign them.', e: { nation: -1, econ: 0.5 } },
  { t: 'Domestic industries should be protected with tariffs, even if goods become more expensive.', e: { nation: 1, econ: -0.3 } },
  { t: 'I think of myself as a citizen of the world before a citizen of my country.', e: { nation: -1 } },

  // Religion
  { t: 'Religious values should guide the laws of the country.', e: { faith: 1 } },
  { t: 'Religion and the state should be strictly separated.', e: { faith: -1 } },
  { t: 'Blasphemy should be punishable by law.', e: { faith: 1, power: 0.5 } },
  { t: 'Religious leaders should have a formal role in government.', e: { faith: 1 } },
  { t: 'Laws should rest on reason and evidence, not on religious teaching.', e: { faith: -1 } },

  // Membership
  { t: 'Immigrants generally strengthen the country they move to.', e: { belong: -1, nation: -0.5 } },
  { t: 'A nation is fundamentally defined by shared ancestry.', e: { belong: 1, nation: 0.5 } },
  { t: "Anyone who commits to the country's laws should be able to become a full citizen, whatever their race or religion.", e: { belong: -1 } },
  { t: 'Some cultures are simply incompatible with ours, and their members should not be allowed to settle here.', e: { belong: 1 } },
  { t: "Mixing between ethnic groups weakens a nation's identity.", e: { belong: 1 } },

  // Force abroad
  { t: 'My country should be willing to use military force to spread its values abroad.', e: { war: 1 } },
  { t: 'War is almost never justified.', e: { war: -1 } },
  { t: 'A powerful military is the best guarantee of peace.', e: { war: 1 } },
  { t: "My country should stay out of other nations' conflicts.", e: { war: -1, nation: 0.3 } },
  { t: 'Striking first is justified against a hostile state that is developing dangerous weapons.', e: { war: 1 } },

  // Justice
  { t: 'The death penalty should be available for the worst crimes.', e: { justice: 1 } },
  { t: 'Prisons should focus on rehabilitation rather than punishment.', e: { justice: -1 } },
  { t: 'Harsher sentences reduce crime.', e: { justice: 1 } },
  { t: 'Police should have more power to fight crime, even at some cost to civil liberties.', e: { justice: 1, power: 0.5 } },
  { t: 'Crime is mainly a product of poverty and social conditions.', e: { justice: -1, econ: -0.3 } },

  // Environment
  { t: 'Climate change is a serious threat that requires rapid, large-scale government action.', e: { ecology: -1 } },
  { t: 'Economic growth should take priority over environmental protection.', e: { ecology: 1 } },
  { t: 'Fossil fuel production should be expanded to secure energy independence.', e: { ecology: 1, nation: 0.3 } },
  { t: 'Nature has value beyond what it provides to humans.', e: { ecology: -1 } },
  { t: 'Industrial civilization has been a disaster for the human race.', e: { ecology: -1, method: 0.3 } },

  // Means
  { t: 'Political violence is never justified in a democracy.', e: { method: -1 } },
  { t: 'Peaceful protest achieves more lasting change than violence does.', e: { method: -1 } },
  { t: 'Armed struggle is legitimate against a government that oppresses your people.', e: { method: 1 } },
  { t: 'Attacks on civilians can be justified if they serve a just cause.', e: { method: 1, war: 0.5 } },
  { t: 'Accepting the result of an election matters even when your side loses.', e: { method: -1 } }
];

const ANSWERS = [
  { label: 'Strongly agree', v: 1 },
  { label: 'Agree', v: 0.5 },
  { label: 'Neutral / unsure', v: 0 },
  { label: 'Disagree', v: -0.5 },
  { label: 'Strongly disagree', v: -1 }
];
