# The political axes in three surveys

The test's own statements have not been answered by a real sample. These checks use three large surveys
that ask comparable questions to see whether the axes behave as separate dimensions. Each script recodes
survey items so that higher = the axis's right-hand pole, then reports reliability, correlations between
axis scores, correlations with self-placement, and an exploratory factor analysis (principal axis, promax,
parallel analysis). Shared code: `axis_check.py`. None of the survey data is redistributed here.

| Survey | Respondents | Coverage | Axes it can test | Script / output |
|---|---|---|---|---|
| World Values Survey Wave 7 (2017–2022) | 97,220 | 66 countries | 10 (not populism) | `wvs7_recode.py`, `wvs7_analysis.py` / `wvs7_results.txt`, details in `wvs7_axis_check.md` |
| European Social Survey round 11 (2023–24) | 50,116 | 30 European countries | 7 (no force abroad, justice, means, populism) | `ess11_check.py` / `ess11_results.txt` |
| ANES 2024 Time Series | 5,521 | United States | 10 incl. populism proxies (no sovereignty) | `anes2024_check.py` / `anes2024_results.txt` |

Citations: Haerpfer et al. (2022), WVS Round Seven v6.0, doi:10.14281/18241.24; European Social Survey
European Research Infrastructure (ESS ERIC) (2025), ESS11 integrated file, edition 4.2; American National
Election Studies (2026), ANES 2024 Time Series Study, release of 19 May 2026.

## What holds across all three

**State power, Culture, Religion and Membership form a cultural cluster everywhere.** Their pairwise
correlations are positive in every survey: within countries about 0.2 on average in the WVS, 0.03 to 0.33 in
the ESS, and 0.28 to 0.61 in the US. This supports the composite "cultural" score used in the results map.

**Approval of political violence is its own dimension.** In the WVS it forms a clean factor (reliability 0.84);
in the ANES the single item is unrelated to liberal-conservative self-placement (r = 0.01) and to the economic,
cultural, religious and immigration axes (|r| ≤ 0.08). It correlates modestly with State power (0.19) and loads
with doubts about democracy. This supports keeping Means
separate and treating closeness to militants on that axis as distinct from left or right.

**Identity-based nationalism does not form a nationalism-versus-globalism scale.** In the WVS, closeness to
one's country and to the world go together rather than in opposition; in the ESS, attachment to one's country
and attachment to Europe likewise fail to form a scale (reliability −0.06). In Europe, the sovereignty items, mostly skepticism of EU
unification, correlate 0.39 with immigration attitudes within countries, and the EU item loads with the
immigration items rather than with national attachment.

## Where the US is different

**In the US one dimension dominates.** The first factor's eigenvalue is 10.3, against 2.5 for the second.
Economy correlates with Culture at 0.62, with Environment at 0.70 and with Membership at 0.53, and
liberal-conservative self-placement correlates 0.62 to 0.72 with all four. Outside the US the same links are
near zero: within countries, Economy correlates −0.13 to −0.02 with the cultural axes in the WVS and
−0.03 to 0.07 in the ESS. American politics is sorted along one line to a degree European and global publics
are not. That fits Malka, Lelkes & Soto (2019) on economic and cultural conservatism, and research on US
partisan sorting.

The practical consequence for the test: "market liberal" and "left-communitarian" combinations, which look
cross-pressured in the US, are ordinary elsewhere. The results now say so.

**Economic attitudes are a coherent scale in the US (reliability 0.87) but not in the WVS (0.30).** The
WVS economic questions are abstract trade-offs (equality versus incentives, competition good or harmful).
The ANES questions are concrete policies (services, health insurance, taxes on millionaires). The test's own
economic statements are concrete policies, which suggests they will behave more like the ANES items.

**Justice behaves differently by country.** In the US, support for the death penalty loads with immigration
restriction and defense spending, an authoritarian-nationalist cluster that matches Stenner's account. In the
WVS, finding the death penalty justifiable runs slightly against cultural traditionalism within countries.
The cultural composite therefore leaves Justice out, since the link is not general.

**Environment.** In the US, environmental attitudes are almost part of the economic dimension (r = 0.70).
In Europe they go with immigration and EU attitudes (r = 0.26 and 0.21), not with economics (0.13). In the
WVS the single growth-versus-environment item relates weakly to everything.

## Populism proxies (ANES only)

ANES 2024 has no standard populism battery. Its nearest items split into two unrelated groups: distrust of
government and politicians (corruption, "run by a few big interests"), and preferring anyone to elected
politicians, where agreeing that experts should decide goes with agreeing that referendums should decide
(reliability of the six proxies together 0.34). This cannot validate the test's populism scale, which uses
Akkerman et al. items the ANES does not ask, but it is consistent with populism being about hostility to the
political class rather than one policy direction.

## Left-right labels

Self-placement tracks the axes strongly in the US (up to 0.72), moderately in Europe (up to 0.31) and weakly
worldwide (up to 0.21). This is a reason the test reports ten axes rather than a single left-right score.

## Not tested

The test's own statements; Force abroad outside the US; Sovereignty as policy (UN, trade, treaties) rather than
identity; populism with a validated scale; and anything in the philosophy test.
