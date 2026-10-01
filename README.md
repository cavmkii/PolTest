# Ten Axes

A political alignment test in the style of 8values and 12axes. 77 statements score you on ten axes,
match you to the nearest of 49 real ideologies, and show which of 90 scored people sit closest to you
on each axis and overall: every US president, militant and terrorist leaders, 20th-century dictators,
activists, and a few notorious public figures.

Open `index.html` in a browser. No build step, no dependencies.

## Axes

| Axis | −100 | +100 |
|---|---|---|
| Economy | Equality | Markets |
| State power | Liberty | Authority |
| Culture | Progress | Tradition |
| Sovereignty | Globalism | Nationalism |
| Religion | Secular | Religious |
| Membership | Pluralism | Exclusion |
| Force abroad | Restraint | Militarism |
| Justice | Rehabilitation | Punishment |
| Environment | Ecology | Industry |
| Means | Reform | Upheaval |

## Files

- `js/axes.js` – axis definitions
- `js/questions.js` – statements and their axis weights
- `js/ideologies.js` – reference ideology profiles (`null` = no characteristic position)
- `js/figures.js` – figure profiles, each with a confidence level and the evidence behind it
- `js/app.js` – scoring, matching, UI

## Scoring

Answers are +1, +½, 0, −½, −1; each axis score is the weighted sum over the maximum possible, scaled to ±100
(the 8values model). Every axis has statements keyed in both directions.

Matching is RMS distance across all ten axes. An axis a profile leaves blank counts as a fixed gap
(35 points for figures, 30 for ideologies) rather than being skipped; without that, sparse profiles
(e.g. Joseph Kony, scored on six axes) out-matched well-documented ones. Figures need five scored axes to
enter the overall ranking. Per-axis matches use anyone scored on that axis.

A simulation that answers the test as each well-documented figure would recovers that figure in its own
top 3 for 81 of 82 profiles; an all-neutral respondent lands on Centrism.

## Scoring the figures

Positions come from what each person did and wrote, placed on the present-day spectrum, not relative to
their era. Low-confidence profiles (Combs, Epstein, several celebrities) are mostly blank because there is
little stated politics to score. See the Method tab for limits.
