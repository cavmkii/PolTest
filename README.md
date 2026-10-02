# Ten Axes

Two tests, each in a short or full version, taken separately or together:

- **Political** – ten axes, 49 ideologies, 50 divisive figures.
- **Philosophical** – nine axes built on the PhilPapers Survey structure, 34 schools of thought, 78 philosophers scored from their works.
- **Both** – adds a comparison of philosophical and political answers on four research-backed links.

A political alignment test in the style of 8values and 12axes. 78 statements, or a 50-statement short version (five per axis), plus one attention check, score you on ten axes,
match you to the nearest of 49 real ideologies, and show which of 50 divisive figures sits closest to you
on each axis and overall: dictators, militant and terrorist leaders, and notorious public figures.

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
- `js/ideology-notes.js` – long-form notes per ideology: core idea, policies, internal debates, where it exists today, research on supporters
- `js/phil-axes.js` – philosophy axes, PhilPapers 2020 distributions, statements
- `js/schools.js`, `js/philosophers.js` – philosophy profiles with primary works
- `js/gaps.js` – philosophy/politics comparison rules and citations
- `js/interpret.js` – plain-language readings of your scores: policy positions, two-dimension typology, psychological research
- `js/app.js` – scoring, matching, UI

## Scoring

Answers are +1, +½, 0, −½, −1; "No opinion" drops the statement. Each axis score is the weighted sum over the
maximum possible, scaled to ±100 (the 8values model). Every axis has statements keyed in both directions;
violence items are concrete scenarios (Westwood et al. 2022).

Matching is weighted RMS distance across all ten axes. Means counts half; each axis's weight can be raised or
lowered on the results page. A blank axis on a profile counts as a fixed gap (35 points for figures, 30 for
ideologies). Results report answer consistency, attention-check failure, and "no clear fit" when the top
ideologies are within 3 points.

## Sources

Figure economy scores were checked against Herre (2023), Global Leader Ideologies; party positions against
V-Party (Lührmann et al. 2020); regime type against V-Dem legitimation codes. Every figure and ideology lists
its sources in `js/figures.js` and `js/ideologies.js`; the Method tab has the methodological references.
Celebrities have no scholarly coding and are excluded from the overall ranking.

The test is not validated: no factor analysis, reliability or test-retest data exist for it.
