// Each statement moves one or more axes. A positive weight means agreeing pushes
// toward the right-hand pole of that axis (Markets, Authority, Tradition, ...).
// Every axis has statements in both directions to dampen agree-with-everything bias.
const QUESTIONS = [
  // Economy
  { t: 'Healthcare should be provided by the state and free at the point of use.', e: { econ: -1 } },
  { t: 'Minimum wage laws do more harm than good for low-skilled workers.', e: { econ: 1 } },
  { t: 'Key industries such as energy, rail and water should be publicly owned.', e: { econ: -1 } },
  { t: 'Inequality is not a problem in itself, as long as the poor are getting richer.', e: { econ: 1 } },
  { t: 'Labor unions should have more power to bargain with employers.', e: { econ: -1 } },
  { t: 'Taxes on the highest earners should be substantially increased.', e: { econ: -1 } },
  { t: 'Private property is a natural right that the state should rarely override.', e: { econ: 1 } },
  { t: 'Cutting regulations on business is usually good for the economy.', e: { econ: 1, ecology: 0.5 } },
  { t: 'Society would be better off if workers collectively owned the firms they work in.', e: { econ: -1 } },

  // State power
  { t: 'The government should be able to monitor communications without a warrant if it helps prevent terrorism.', e: { power: 1 } },
  { t: 'Hate speech should be a criminal offense.', e: { power: 0.5, culture: -0.5 } },
  { t: 'Most drugs should be legal for adults.', e: { power: -1, culture: -0.5 } },
  { t: 'In a crisis, a strong leader who does not have to answer to parliament or elections would be good for the country.', e: { power: 1, method: 0.5 } },
  { t: 'Private citizens should have the right to own firearms.', e: { power: -1, culture: 0.3 } },
  { t: 'Obedience and respect for authority are among the most important things children can learn.', e: { power: 1, culture: 0.5 } },
  { t: 'The press should be free to publish state secrets when it is in the public interest.', e: { power: -1 } },
  { t: 'Political parties that threaten national stability should be banned.', e: { power: 1 } },
  { t: 'Governments should not break up protests just because they are disruptive.', e: { power: -1 } },
  { t: 'Adults should be free to do what they want with their own bodies as long as they harm no one else.', e: { power: -1, culture: -0.5 } },

  // Culture
  { t: 'Same-sex marriage should be legal.', e: { culture: -1 } },
  { t: 'Abortion should be legal in most or all cases.', e: { culture: -1, faith: -0.5 } },
  { t: 'Traditional gender roles are best for families and for society.', e: { culture: 1 } },
  { t: 'A society is better off when it changes slowly and respects inherited institutions.', e: { culture: 1 } },
  { t: 'Schools should teach about systemic racism and the historical oppression of minorities.', e: { culture: -1, belong: -0.5 } },
  { t: 'Modern society has lost something important by abandoning older moral codes.', e: { culture: 1, faith: 0.5 } },
  { t: 'People should be able to have their gender legally recognized regardless of their sex at birth.', e: { culture: -1 } },

  // Sovereignty
  { t: "My country's interests should come before those of any international organization.", e: { nation: 1 } },
  { t: 'International bodies like the UN should be able to enforce their decisions on member states.', e: { nation: -1 } },
  { t: 'Free trade agreements generally benefit the countries that sign them.', e: { nation: -1, econ: 0.5 } },
  { t: 'Domestic industries should be protected with tariffs, even if goods become more expensive.', e: { nation: 1, econ: -0.3 } },
  { t: 'I think of myself as a citizen of the world before a citizen of my country.', e: { nation: -1 } },
  { t: 'National sovereignty matters more than international human rights treaties.', e: { nation: 1, power: 0.3 } },
  { t: 'Humanity would be better off with stronger global governance, even at the cost of national independence.', e: { nation: -1 } },

  // Religion
  { t: 'Religious values should guide the laws of the country.', e: { faith: 1 } },
  { t: 'Religion and the state should be strictly separated.', e: { faith: -1 } },
  { t: 'Blasphemy should be punishable by law.', e: { faith: 1, power: 0.5 } },
  { t: 'A society without a shared religion will eventually decay.', e: { faith: 1, culture: 0.5 } },
  { t: 'Religious leaders should have a formal role in government.', e: { faith: 1 } },
  { t: 'Religious schools should not receive public money.', e: { faith: -1 } },
  { t: 'Public officials should keep their religious beliefs out of policy decisions.', e: { faith: -1 } },
  { t: 'Laws should rest on reason and evidence, not on religious teaching.', e: { faith: -1 } },

  // Membership
  { t: 'Immigrants generally strengthen the country they move to.', e: { belong: -1, nation: -0.5 } },
  { t: 'A nation is fundamentally defined by shared ancestry.', e: { belong: 1, nation: 0.5 } },
  { t: "Anyone who commits to the country's laws should be able to become a full citizen, whatever their race or religion.", e: { belong: -1 } },
  { t: 'Some cultures are simply incompatible with ours, and their members should not be allowed to settle here.', e: { belong: 1 } },
  { t: 'Members of minority religions should have exactly the same rights as the majority.', e: { belong: -1, faith: -0.3 } },
  { t: "Mixing between ethnic groups weakens a nation's identity.", e: { belong: 1 } },
  { t: 'Immigration should be sharply reduced.', e: { belong: 0.5, nation: 0.5 } },

  // Force abroad
  { t: 'My country should be willing to use military force to spread its values abroad.', e: { war: 1 } },
  { t: 'War is almost never justified.', e: { war: -1 } },
  { t: 'Military spending should be cut and the money spent at home.', e: { war: -1, econ: -0.3 } },
  { t: 'A powerful military is the best guarantee of peace.', e: { war: 1 } },
  { t: "My country should stay out of other nations' conflicts.", e: { war: -1, nation: 0.3 } },
  { t: 'Striking first is justified against a hostile state that is developing dangerous weapons.', e: { war: 1 } },
  { t: 'Dying in war for a righteous cause is among the most honorable things a person can do.', e: { war: 1, faith: 0.3 } },
  { t: 'Diplomacy and sanctions should always be exhausted before any military action.', e: { war: -1 } },

  // Justice
  { t: 'The death penalty should be available for the worst crimes.', e: { justice: 1 } },
  { t: 'Prisons should focus on rehabilitation rather than punishment.', e: { justice: -1 } },
  { t: 'Harsher sentences reduce crime.', e: { justice: 1 } },
  { t: 'Police should have more power to fight crime, even at some cost to civil liberties.', e: { justice: 1, power: 0.5 } },
  { t: 'Crime is mainly a product of poverty and social conditions.', e: { justice: -1, econ: -0.3 } },
  { t: 'People convicted of nonviolent crimes should generally not go to prison.', e: { justice: -1 } },

  // Environment
  { t: 'Climate change is a serious threat that requires rapid, large-scale government action.', e: { ecology: -1 } },
  { t: 'Economic growth should take priority over environmental protection.', e: { ecology: 1 } },
  { t: 'We should consume less, even if it means a lower material standard of living.', e: { ecology: -1 } },
  { t: 'Fossil fuel production should be expanded to secure energy independence.', e: { ecology: 1, nation: 0.3 } },
  { t: 'Nature has value beyond what it provides to humans.', e: { ecology: -1 } },
  { t: 'Industrial civilization has been a disaster for the human race.', e: { ecology: -1, method: 0.3 } },
  { t: 'Technological progress is, on the whole, good for humanity.', e: { ecology: 0.5, culture: -0.3 } },

  // Means
  { t: 'Political violence is never justified in a democracy.', e: { method: -1 } },
  { t: 'The political system is so corrupt that it must be torn down rather than reformed.', e: { method: 1 } },
  { t: 'Political change should come through elections, courts and legislation.', e: { method: -1 } },
  { t: 'Armed struggle is legitimate against a government that oppresses your people.', e: { method: 1 } },
  { t: 'Attacks on civilians can be justified if they serve a just cause.', e: { method: 1, war: 0.5 } },
  { t: 'Compromising with political opponents is a sign of weakness.', e: { method: 0.5, power: 0.3 } },
  { t: 'Accepting the result of an election matters even when your side loses.', e: { method: -1 } },
  { t: 'Peaceful protest achieves more lasting change than violence does.', e: { method: -1 } }
];

const ANSWERS = [
  { label: 'Strongly agree', v: 1 },
  { label: 'Agree', v: 0.5 },
  { label: 'Neutral / unsure', v: 0 },
  { label: 'Disagree', v: -0.5 },
  { label: 'Strongly disagree', v: -1 }
];
