# Checking the political axes against the World Values Survey

Data: World Values Survey Wave 7 (2017–2022), country-pooled datafile v6.0, 97,220 respondents in 66 countries.
Haerpfer, C. et al. (eds.) (2022). *World Values Survey: Round Seven – Country-Pooled Datafile Version 6.0.*
Madrid & Vienna: JD Systems Institute & WVSA Secretariat. doi:10.14281/18241.24.
The dataset itself is not in this repository (WVS forbids redistribution). `wvs7_recode.py` and
`wvs7_analysis.py` reproduce every number below from the official CSV; `wvs7_results.txt` is the full output.

## What was tested

WVS does not ask this test's statements. It asks questions on the same topics, so this is a check of
whether the *axes* behave as separate dimensions in real responses, not a validation of the test's own items.
Each WVS item was recoded so that higher = the axis's right-hand pole (Markets, Authority, Tradition, …).

| Axis | WVS items |
|---|---|
| Economy | Q106 incomes/incentives, Q107 private/government ownership, Q108 state/individual responsibility, Q109 competition, Q241 and Q247 (taxing the rich, equalizing incomes as essential to democracy) |
| State power | Q235 strong leader, Q237 army rule, Q45 respect for authority, Q17 obedience as a child quality, Q150 security over freedom, Q248 obeying rulers, Q246 civil rights |
| Culture | Q182 homosexuality, Q184 abortion, Q185 divorce, Q29 men as political leaders, Q33 men's priority for jobs |
| Religion | Q164 importance of God, Q169 religion over science, Q239 religious-law government, Q242 clerics interpreting law |
| Membership | Q170 only my religion acceptable, Q19/Q21/Q23/Q26 unwanted neighbors (other race, immigrants, other religion, other language), Q121 immigration impact, Q130 immigration policy, Q124/Q129 immigration and crime/conflict |
| Sovereignty | Q34 natives first for jobs, Q254 national pride, Q257 closeness to country, Q259 closeness to the world |
| Force abroad | Q151 willing to fight for country |
| Justice | Q195 death penalty justifiable |
| Environment | Q111 growth over environment |
| Means | Q191 violence, Q192 terrorism, Q194 political violence justifiable |
| Populism | no WVS equivalent |

Two versions of every analysis: pooled across countries, and within-country (country means subtracted),
which isolates differences between individuals in the same society. Correlations weighted by S018.

## Findings

**1. The axes do not collapse into two dimensions.** Parallel analysis on 41 items (N = 53,236 complete
cases, within-country) retains 12 factors, and a forced two-factor solution explains only 11.9% of variance.
Within countries, the correlations between axes are modest: the largest is 0.29 (Culture and Religion).
This supports keeping separate axes rather than reporting only an economic and a cultural score.

**2. A cultural/authoritarian cluster exists, and about half of it is between countries.** State power,
Culture, Religion and Membership correlate positively with each other: on average r = 0.37 pooled, but only
r = 0.21 within countries. Roughly half the variance in Culture (0.49) and Religion (0.48) lies between
countries, against 0.08 for Economy. So "traditional vs progressive" is to a large degree a difference
between societies, and a weaker one between individuals within a society.

**3. Economic attitudes are not one dimension in WVS.** The six economic items have a Cronbach's alpha of
0.30, and they split into three separate factors: equality versus incentives plus state versus self-reliance;
private versus government ownership plus competition; and whether redistribution is "essential to democracy",
which groups with other "what democracy means" items. Economy correlates near zero with every cultural axis
(−0.13 to 0.04 within countries). That matches Malka, Lelkes & Soto (2019): economic and cultural
conservatism are not reliably aligned outside the US and Western Europe. The test's own economic statements
are policy questions (taxes, healthcare, unions), so this does not show they fail, only that WVS cannot
confirm them.

**4. Sovereignty is not a nationalism-versus-globalism line in identity terms.** National pride, closeness
to one's country and distance from the world do not form a scale (alpha ≈ 0). People who feel close to their
country tend to feel close to the world as well; attachments are not zero-sum. The test's Sovereignty axis
uses policy statements (UN enforcement, tariffs, free trade, treaties), which WVS does not ask, so it is
untested here, but the identity result is a caution against reading it as "love of country".

**5. Means is the cleanest dimension.** The three violence items form one strong factor (alpha 0.84, loadings
0.77–0.82) separate from everything else. Its within-country correlation with cultural traditionalism is
slightly negative (−0.19). Part of this is how WVS asks: all three sit in a "how justifiable is…" battery,
and respondents who use the top of that scale do so across items. The death-penalty item from the same
battery loads partly with them, which is why…

**6. Justice does not belong in the cultural composite.** In WVS, finding the death penalty justifiable
correlates *negatively* with cultural traditionalism within countries (−0.19), and it loads with the
violence items rather than with authority or religion. US research ties punitiveness to authoritarianism, but
across 66 countries the link does not hold. The cultural score used for the two-dimension map in the results
now averages State power, Culture, Religion and Membership only.

**7. Left-right self-placement is a weak summary.** Self-placement (Q240) correlates at most 0.21 with any
axis pooled (Religion), and only 0.05 to 0.08 with Economy. What "left" and "right" mean varies a great deal
across countries, which is one reason the test reports separate axes rather than a single left-right score.

## Not tested

Force abroad, Justice and Environment each have one WVS item, so their reliability cannot be estimated.
Populism and the philosophy test have no WVS counterparts. None of this validates the test's own statements;
that needs people to take the test itself.
