// Long-form notes for each ideology, shown on the results page and the Ideologies tab.
// core: the central claim. policy: what adherents typically push for in practice.
// tensions: the main internal disagreements. today: where it exists as a live movement.
// psych: research specific to adherents of this ideology, where any exists. Most psychological
// research is about broad dimensions, not named ideologies; that is generated from your scores instead.
const IDEOLOGY_NOTES = {
  'Anarcho-Communism': {
    core: 'The state and private ownership of the means of production are two faces of one hierarchy and should be abolished together. Production would be organized by voluntary federations of communes, and goods distributed according to need rather than work done.',
    policy: ['Abolish the state, police and prisons in favor of community self-defense and restorative justice', 'Common ownership of land, housing and workplaces', 'No wage system; distribution by need', 'Opposition to borders and national militaries'],
    tensions: 'How to defend a stateless society against organized enemies (the Spanish Civil War debate), and whether participating in elections or unions co-opts the movement.',
    today: 'Small activist networks, mutual-aid projects, and parts of the Rojava experiment in northern Syria. No anarcho-communist society has lasted at national scale.'
  },
  'Anarcho-Syndicalism': {
    core: 'Workers should take control of the economy directly through revolutionary unions, using the general strike rather than parliament, and then run society through federations of those unions.',
    policy: ['Union control of workplaces and industries', 'Direct action and general strikes over electoral politics', 'Abolition of the state and capital', 'Internationalism among workers'],
    tensions: 'Whether unions bargaining for better conditions now undermines the revolutionary goal, and how union federations would avoid becoming a new bureaucracy.',
    today: 'The CNT and CGT in Spain, the IWW in the US, scattered unions elsewhere. Historically strongest in Spain in the 1930s.'
  },
  'Anarcho-Capitalism': {
    core: 'Every function of the state, including courts, policing and defense, can be supplied by private firms competing in a market. Taxation is theft and the state is an illegitimate monopoly on force.',
    policy: ['Abolish taxation and the state', 'Private courts, arbitration and security agencies', 'Full legalization of voluntary exchange, including drugs and sex work', 'No central bank; private or commodity money'],
    tensions: 'Whether private defense agencies would simply become states, and whether the movement should ally with cultural conservatives (the paleolibertarian turn) or stay culturally liberal.',
    today: 'A presence in libertarian think tanks and online. Javier Milei describes himself as an anarcho-capitalist in philosophy while governing as a minarchist.',
    psych: 'Studies of self-identified libertarians (Iyer et al. 2012) find they weight liberty far above other moral concerns, score lower on empathizing and higher on systemizing than liberals or conservatives, and are disproportionately male.'
  },
  'Anarcho-Primitivism': {
    core: 'Domination began with agriculture and has deepened with each technological advance. Industrial civilization cannot be reformed and should be dismantled in favor of small foraging communities.',
    policy: ['Opposition to industrial technology and large infrastructure', 'Rewilding of land', 'Rejection of mass society, division of labor and, for some, symbolic culture itself', 'Hostility to reformist environmentalism'],
    tensions: 'Whether collapse should be awaited or hastened, and what would happen to billions of people who depend on industrial agriculture. Kaczynski\'s violence divides the milieu.',
    today: 'Writers and small online communities. No political organization of any size.'
  },
  'Libertarian Socialism': {
    core: 'Capitalism and the centralized state are both illegitimate concentrations of power. Ownership should be social, but exercised through workers\' councils, cooperatives and local democracy rather than a state.',
    policy: ['Worker cooperatives and workplace democracy', 'Decentralized, participatory planning', 'Strong civil liberties and opposition to surveillance', 'Anti-militarism'],
    tensions: 'How much coordination a complex economy needs and whether that recreates a state; whether to work through existing parties.',
    today: 'Intellectual influence through writers like Chomsky; practical experiments such as Mondragón-style cooperatives and participatory budgeting.'
  },
  'Democratic Confederalism': {
    core: 'Öcalan\'s reworking of Bookchin: the nation-state is the problem, and should be replaced by confederations of local assemblies with gender co-leadership, ecological planning and protection of every ethnic and religious group.',
    policy: ['Local assemblies as the main unit of government', 'Male-female co-chairs for every office', 'Cooperative economy and ecological limits', 'Autonomy within existing states rather than a new Kurdish state'],
    tensions: 'Its main real-world test, the Autonomous Administration of North and East Syria, runs on PKK-trained cadres and has faced criticism over conscription and press restrictions. Whether a movement born in armed struggle can govern this way is unsettled.',
    today: 'North and East Syria since 2012, under heavy pressure after the fall of Assad in 2024. Öcalan called on the PKK to disarm in 2025.'
  },
  'Marxism-Leninism': {
    core: 'A disciplined vanguard party should seize state power, rule on behalf of the working class, abolish private ownership of production and plan the economy centrally, as a transitional stage toward communism.',
    policy: ['One-party rule by the communist party', 'Nationalized industry and central planning', 'Collectivized agriculture', 'State atheism and control of media and education', 'Security services to suppress counter-revolution'],
    tensions: 'Whether market reforms (China after 1978, Vietnam\'s Đổi Mới) betray or adapt the model, and how to account for the famines and terror under Stalin and Mao.',
    today: 'The ruling parties of China, Vietnam, Laos and Cuba; communist parties elsewhere.'
  },
  'Maoism': {
    core: 'Marxism-Leninism adapted to agrarian societies: revolution is led by the peasantry through protracted guerrilla war from the countryside, and must be renewed continuously against new bureaucratic elites.',
    policy: ['People\'s war and rural base areas', 'Land redistribution and collectivization', 'Mass campaigns and struggle sessions against "revisionists"', 'Self-reliance in development'],
    tensions: 'Its record (the Great Leap famine, the Cultural Revolution) versus its appeal to insurgencies; the Chinese Communist Party itself now keeps Mao as a symbol while rejecting continuous revolution.',
    today: 'Naxalite insurgents in India, the remnants of the Shining Path, and the Communist Party of Nepal (Maoist Centre), which now governs through elections.'
  },
  'Trotskyism': {
    core: 'Socialism must be international and workers\' democracy real. Trotsky held that the Soviet Union degenerated under Stalin into bureaucratic rule and that revolution must be permanent and global.',
    policy: ['Transitional demands linking reforms to revolution', 'Workers\' councils rather than one-party bureaucracy', 'International revolutionary organization', 'Opposition to both capitalism and Stalinism'],
    tensions: 'Endless splits over tactics, especially "entryism" into larger left parties and how to classify states such as Cuba.',
    today: 'Small parties and groups worldwide; influence in some unions and protest movements.'
  },
  'Juche': {
    core: 'North Korea\'s official doctrine: national self-reliance in politics, economy and defense, embodied in the leader, combined with songun (military-first) policy and hereditary succession.',
    policy: ['Total state control of the economy and information', 'Military and nuclear priority', 'Leader cult and hereditary rule', 'Isolation from foreign influence'],
    tensions: 'Mostly a legitimation for the Kim dynasty; scholars debate how much it is a coherent ideology at all versus Korean ethnic nationalism in Marxist dress.',
    today: 'North Korea only.'
  },
  'Revolutionary Socialist Nationalism': {
    core: 'National liberation from colonial or imperial domination and social revolution are one struggle, pursued by armed force and followed by a socialist economy.',
    policy: ['Armed struggle against occupying or client regimes', 'Nationalization of land and foreign-owned industry', 'Non-alignment or alliance with the socialist bloc', 'Mass literacy and health campaigns'],
    tensions: 'Whether the nation or the class comes first, which shapes treatment of minorities and alliances; post-revolution, whether to hold elections.',
    today: 'Cuba\'s founding ideology; the PFLP; the heritage of many 1960s–70s liberation movements in Africa and the Middle East.'
  },
  'Militant Separatism': {
    core: 'A people defined by ethnicity, language or region is entitled to its own state and may fight for it. The national cause overrides other political commitments.',
    policy: ['Independence or deep autonomy for a homeland', 'Armed struggle when political routes are blocked', 'Language and cultural protection', 'Often a left-leaning economic program, though this varies'],
    tensions: 'Armed versus political wings (ETA and Batasuna, the IRA and Sinn Féin), and how to treat minorities within the claimed homeland.',
    today: 'Most such movements have disarmed or been defeated (ETA, the LTTE, the IRA). Armed separatism continues in parts of Myanmar, India and the Sahel.'
  },
  'Democratic Socialism': {
    core: 'The major industries and services should be socially owned and democratically run, and this should be achieved through elections, not revolution, with full civil liberties.',
    policy: ['Single-payer healthcare and free public higher education', 'Public or worker ownership of utilities, energy and transport', 'Much stronger unions and sectoral bargaining', 'Steep wealth and income taxes', 'Large public housing programs'],
    tensions: 'Whether the goal is replacing capitalism or only a much bigger welfare state (the line with social democracy), and how to keep capital from fleeing a socialist government.',
    today: 'The Democratic Socialists of America, the Corbyn-era Labour left, Die Linke in Germany, La France Insoumise.'
  },
  'Social Democracy': {
    core: 'A market economy is kept, but tamed: a large welfare state, strong unions, progressive taxation and public services make capitalism work for the majority.',
    policy: ['Universal public healthcare and generous unemployment insurance', 'Collective bargaining, often by sector', 'Progressive income taxes and high public spending', 'Active labor-market policy and public childcare'],
    tensions: 'How to keep a working-class base as parties shift toward educated urban voters, and how to respond to immigration and globalization without losing either wing.',
    today: 'The Nordic social democratic parties, Germany\'s SPD, the UK Labour Party, Spain\'s PSOE.'
  },
  'Eco-Socialism': {
    core: 'Capitalism\'s need for endless growth is the driver of ecological breakdown, so environmental survival requires replacing it with democratic planning oriented to human needs within ecological limits.',
    policy: ['Rapid fossil fuel phase-out with public ownership of energy', 'Degrowth or managed reductions in material throughput', 'Just transition guarantees for workers', 'Public transport and housing over private consumption'],
    tensions: 'Degrowth versus green growth, and whether nuclear power belongs in the plan.',
    today: 'Factions in green and left parties; writers such as Kohei Saito and Andreas Malm.'
  },
  'Green Politics': {
    core: 'Ecological sustainability is the precondition for everything else, joined to social justice, grassroots democracy and nonviolence (the four pillars of the 1979 German Greens).',
    policy: ['Carbon pricing and renewable buildout', 'Protection of biodiversity and land', 'Decentralized decision-making', 'Anti-militarism (softened in recent years)', 'Socially liberal positions'],
    tensions: 'Fundis versus realos: purity or coalition government. The war in Ukraine pushed many green parties away from their pacifist roots.',
    today: 'Germany\'s Greens, the European Green Party, green parties in Australia and New Zealand.'
  },
  '21st-Century Socialism': {
    core: 'A Latin American program that uses elected, plebiscitary governments to nationalize resources, redistribute income and build "participatory" institutions, framed against imperialism and traditional elites.',
    policy: ['Nationalization of oil, gas and mining', 'Social "missions" funded by resource revenues', 'New constitutions approved by referendum', 'Anti-US foreign policy and regional blocs such as ALBA'],
    tensions: 'Its dependence on commodity prices, the slide into authoritarian rule in Venezuela and Nicaragua, and whether Bolivia under Morales shows a more democratic version.',
    today: 'Venezuela (PSUV), Bolivia (MAS, now split), the legacy of Correa in Ecuador.',
    psych: 'The movements are strongly populist by any measure; the Global Populism Database gives Chávez nearly the maximum score.'
  },
  'Progressivism': {
    core: 'Government should actively remove barriers to equal standing, economic and social, and expand rights for groups historically excluded.',
    policy: ['Expanded healthcare coverage and a higher minimum wage', 'Anti-discrimination law covering race, sex, sexuality and gender identity', 'Climate policy through public investment', 'Criminal justice reform and reduced incarceration', 'Path to citizenship for undocumented immigrants'],
    tensions: 'Class-first versus identity-first priorities, and how far to push cultural issues that split its coalition.',
    today: 'The progressive wing of the US Democratic Party and similar wings of center-left parties elsewhere.'
  },
  'Social Liberalism': {
    core: 'Individual freedom is the goal, and the state should guarantee the conditions that make it real: education, healthcare, a safety net, and equal rights.',
    policy: ['Mixed economy with a welfare state', 'Civil liberties and anti-discrimination law', 'Support for international institutions and trade', 'Liberal immigration within managed systems'],
    tensions: 'How much redistribution liberty requires, and how to balance free speech against harm.',
    today: 'The mainstream center-left in most democracies; the UK Liberal Democrats, Canada\'s Liberals, much of the US Democratic Party.'
  },
  'Liberal Internationalism': {
    core: 'Peace and prosperity come from a rules-based order of international institutions, open trade and democratic states, which the leading democracies should build and defend, by force when necessary.',
    policy: ['NATO and alliance commitments', 'Free trade agreements and multilateral institutions', 'Humanitarian intervention and democracy promotion', 'Sanctions against aggressors'],
    tensions: 'Iraq and Libya discredited intervention for many; critics on left and right call it a cover for hegemony.',
    today: 'The postwar Atlantic foreign-policy establishment in the US and Europe.'
  },
  'Centrism': {
    core: 'Not a doctrine so much as a disposition: suspicion of both ends of the spectrum, a preference for evidence and compromise, and incremental change through institutions.',
    policy: ['Fiscal responsibility with a basic safety net', 'Moderate social positions', 'Pro-trade, pro-alliance foreign policy', 'Electoral and procedural reforms'],
    tensions: 'Critics argue the center is defined by wherever the two sides happen to be, and that "splitting the difference" is not a principle.',
    today: 'Macron\'s Renaissance, various centrist parties; also a large share of voters without strong partisan commitments.',
    psych: 'Many respondents land here because their answers point in different directions, not because they hold centrist convictions. Check your answer consistency above.'
  },
  'Georgism': {
    core: 'People should own what they produce, but land and natural resources belong to everyone. A tax on the unimproved value of land can fund government while discouraging speculation.',
    policy: ['Land value tax replacing taxes on income and buildings', 'Free trade', 'Public capture of resource rents', 'Often a citizen\'s dividend from land revenue'],
    tensions: 'How to assess land value fairly and whether a single tax could fund a modern state.',
    today: 'Revived interest among economists and housing reformers; partial land-value taxes in Pennsylvania cities, Estonia and elsewhere.'
  },
  'Neoliberalism': {
    core: 'Markets allocate better than states, so government should privatize, deregulate, open trade and keep inflation low, while maintaining the legal order markets need.',
    policy: ['Privatization of state enterprises', 'Independent central banks and inflation targeting', 'Free trade and capital mobility', 'Means-tested rather than universal welfare', 'Labor market flexibility'],
    tensions: 'The 2008 crisis and rising inequality damaged its standing; defenders point to large reductions in global poverty.',
    today: 'Less an identity than a policy consensus from the 1980s to the 2000s across center-right and "Third Way" center-left parties.'
  },
  'Classical Liberalism': {
    core: 'Individuals have natural rights to life, liberty and property; government exists to protect them under the rule of law and should otherwise stay out of the way.',
    policy: ['Limited government and low taxes', 'Free trade and sound money', 'Freedom of speech, religion and association', 'Constitutional limits and separation of powers'],
    tensions: 'Its historical record of excluding women and colonized peoples from the rights it proclaimed, and whether it implies any welfare state at all.',
    today: 'Think tanks such as the Cato and Adam Smith institutes; strands of center-right parties.'
  },
  'Minarchist Libertarianism': {
    core: 'The state should be limited to protecting people from force and fraud: police, courts and national defense. Almost everything else should be left to markets and voluntary associations.',
    policy: ['Large cuts to taxes and spending', 'End the drug war', 'Deregulation of business and occupations', 'Gun rights and civil liberties', 'Non-interventionist foreign policy'],
    tensions: 'Open versus restricted immigration, and alliance with conservatives versus progressives.',
    today: 'The US Libertarian Party, Milei\'s government in Argentina, the libertarian wing of the Republican Party.',
    psych: 'Iyer et al. (2012) found self-described libertarians rely on liberty as their dominant moral concern and score lower on empathy and higher on systemizing than other groups.'
  },
  'Paleolibertarianism': {
    core: 'Free markets and a minimal state, combined with cultural traditionalism, decentralization and restriction of immigration, on the view that strong families and communities are what make a free society possible.',
    policy: ['Abolish the Federal Reserve and income tax', 'Non-intervention abroad', 'States\' rights and decentralization', 'Restrictive immigration', 'Opposition to anti-discrimination law'],
    tensions: 'Its alliances with the nationalist right brought accusations of racism; many libertarians reject it.',
    today: 'The Mises Institute, Ron Paul\'s movement, Hans-Hermann Hoppe\'s followers.'
  },
  'Liberal Conservatism': {
    core: 'Free markets and liberal institutions are worth conserving, but they rest on inherited traditions and moral habits that should change slowly.',
    policy: ['Market economy with fiscal restraint', 'Strong defense and alliances', 'Tough on crime', 'Gradual, not sweeping, social change'],
    tensions: 'Pressure from the populist right over immigration and trade has split many such parties.',
    today: 'The postwar center-right: the British Conservatives before Brexit, the German CDU\'s liberal wing, much of the pre-2016 Republican Party.'
  },
  'Christian Democracy': {
    core: 'Politics guided by Christian social teaching: human dignity, subsidiarity (decisions at the lowest workable level), solidarity, and the family as the basic unit, within a social market economy.',
    policy: ['Social market economy with worker consultation', 'Family support: child benefits, tax breaks for marriage', 'European integration', 'Moderate positions on abortion and bioethics', 'Church-run welfare and schools with public funding'],
    tensions: 'Secularization has hollowed out its base; parties have split over migration and same-sex marriage.',
    today: 'Germany\'s CDU/CSU, the European People\'s Party, Christian democratic parties in Latin America.'
  },
  'Hamiltonian Federalism': {
    core: 'A strong national government should build national power: a central bank, protected industry, public investment in infrastructure, and commerce as the basis of national strength.',
    policy: ['Tariffs to protect strategic industries', 'Federal infrastructure investment', 'Strong central financial institutions', 'Industrial policy'],
    tensions: 'The line between developmental state and protection of favored interests.',
    today: 'Revived in bipartisan US industrial policy (CHIPS Act) and tariff politics. One of Walter Russell Mead\'s four American foreign-policy traditions.'
  },
  'Jeffersonian Agrarianism': {
    core: 'Liberty depends on a republic of independent property-owners, small government close to the people, and wariness of banks, standing armies and foreign entanglements.',
    policy: ['Decentralization and states\' rights', 'Non-intervention abroad', 'Strict construction of the Constitution', 'Suspicion of concentrated finance'],
    tensions: 'Its founding association with a slaveholding agrarian order, and its fit with an urban industrial economy.',
    today: 'A strand within both libertarian and populist politics in the US.'
  },
  'Jacksonian Populism': {
    core: 'The common people against eastern and financial elites, a strong executive acting for them, fierce national honor and loyalty, and hard war when the nation is attacked.',
    policy: ['Strong presidency', 'Hard line on crime and national security', 'Opposition to elite institutions and expertise', 'Protection of entitlements for "deserving" citizens'],
    tensions: 'Its historical link to Indian removal and white supremacy; its hostility to institutions that constrain the executive.',
    today: 'Mead (2001, 2017) argued Trump\'s base is the latest Jacksonian movement.'
  },
  'Neoconservatism': {
    core: 'American power should be used actively to promote democracy and defeat hostile regimes, joined to free markets and a moral seriousness about culture.',
    policy: ['High defense spending', 'Preemptive or preventive military action against threats', 'Democracy promotion', 'Strong support for Israel', 'Tax cuts and free trade'],
    tensions: 'The Iraq War\'s outcome badly damaged it; it now has little home in a Republican Party turned toward nationalism.',
    today: 'Foreign-policy think tanks and commentators; influence much reduced since 2016.'
  },
  'National Conservatism': {
    core: 'The nation, family and religion are the foundations of political order. Global institutions, free trade and mass immigration erode them and should be resisted.',
    policy: ['Immigration restriction', 'Tariffs and industrial policy', 'Pro-natalist family policy', 'Public role for religion', 'Skepticism of supranational bodies'],
    tensions: 'How far to break with free markets, and whether "illiberal democracy" (Orbán) is a model or a warning.',
    today: 'The NatCon conferences, Fidesz in Hungary, parts of the Trump coalition, Poland\'s PiS.'
  },
  'Paleoconservatism': {
    core: 'Tradition, local community, inherited religion and ethnic-cultural continuity should be conserved against both liberal universalism and neoconservative empire.',
    policy: ['Sharp immigration restriction', 'Non-intervention abroad', 'Protectionism', 'Decentralization', 'Opposition to civil-rights-era federal power'],
    tensions: 'Accusations of nativism and racism; its overlap with the far right.',
    today: 'Pat Buchanan\'s legacy, Chronicles magazine; many of its themes absorbed into the populist right.'
  },
  'Populist Radical Right': {
    core: 'Mudde\'s definition: nativism (the state should belong to the native group), authoritarianism (a strictly ordered society) and populism (a pure people against a corrupt elite). Economic policy is secondary and varies.',
    policy: ['Large cuts to immigration and asylum', 'Tough policing and sentencing', 'Opposition to the EU or global bodies', 'Welfare for natives ("welfare chauvinism")', 'Cultural protection against Islam or "globalism"'],
    tensions: 'Free-market versus welfare-chauvinist economics, and how close to stand to the extreme right.',
    today: 'National Rally (France), FPÖ (Austria), AfD (Germany), Brothers of Italy, Sweden Democrats.',
    psych: 'Support is better predicted by cultural threat and anti-immigrant attitudes than by economic hardship (Norris & Inglehart 2019; Mutz 2018 for the US), though the two interact.'
  },
  'Christian Nationalism': {
    core: 'The nation is, and should be, a Christian nation whose laws, symbols and identity reflect that faith, with Christians as its rightful core.',
    policy: ['Public religious symbols and school prayer', 'Abortion bans', 'Religious exemptions from anti-discrimination law', 'Restrictive immigration', 'Opposition to LGBT rights'],
    tensions: 'Whether it is a religious movement or an ethnic-political identity using religion; many devout Christians reject it.',
    today: 'Strong in the US religious right; analogues in Russia, Hungary, Poland and Brazil.',
    psych: 'Whitehead & Perry (2020) find Christian nationalism predicts views on guns, immigration and race even after controlling for religiosity itself, which suggests it is as much a political identity as a faith.'
  },
  'Catholic Integralism': {
    core: 'Political authority should be subordinate to the spiritual authority of the Church, since the state\'s purpose includes the salvation of souls. Liberal neutrality about the good is a mistake.',
    policy: ['Law shaped by Catholic moral teaching', 'Church role in education and family law', 'Rejection of liberal religious neutrality', 'Often economically communitarian'],
    tensions: 'Vatican II\'s declaration on religious freedom is hard to reconcile with it; it remains a small movement.',
    today: 'A small intellectual circle around writers such as Adrian Vermeule and Thomas Pink.'
  },
  'Reactionary Monarchism': {
    core: 'Legitimate authority is hereditary and sacred, not derived from popular consent. The French Revolution and its heirs destroyed a natural hierarchy that should be restored.',
    policy: ['Restoration of a ruling monarchy', 'Established church', 'Hierarchy of orders and estates', 'Rejection of popular sovereignty'],
    tensions: 'Who the legitimate monarch is; online "neoreaction" uses monarchist language for a CEO-style state, which traditionalists reject.',
    today: 'Marginal groups; intellectual influence on parts of the online right.'
  },
  'National Catholicism': {
    core: 'National unity and the Catholic faith are inseparable; an authoritarian state restores the Church\'s role in education and morals and suppresses liberalism, regional separatism and the left.',
    policy: ['Catholicism as state religion', 'Censorship and corporatist labor organization', 'Suppression of regional languages and movements', 'Anti-communism'],
    tensions: 'The Church itself moved away from it after Vatican II, which helped end the Franco regime.',
    today: 'A historical regime type (Franco\'s Spain, Salazar\'s Portugal); nostalgic fringe movements.'
  },
  'Authoritarian Capitalism': {
    core: 'Market economics and private property without political freedom: an unelected or dominant-party regime delivers order and growth and represses dissent.',
    policy: ['Pro-business, pro-investment policy', 'Suppression of unions and opposition', 'Harsh criminal justice', 'Controlled press'],
    tensions: 'Whether growth eventually forces democratization (the modernization thesis) or authoritarian capitalism is stable.',
    today: 'Singapore and Gulf monarchies are frequent examples; scholars debate where China fits.'
  },
  'Islamism': {
    core: 'Islam is a complete system for public as well as private life, and sharia should be the basis of law. Most Islamist movements pursue this through preaching, social services and elections rather than violence.',
    policy: ['Sharia as a source of legislation', 'Religious education and public morality laws', 'Charity and social welfare networks', 'Anti-corruption appeals'],
    tensions: 'Participation versus revolution; how to treat religious minorities and women; the Egyptian Brotherhood\'s fall in 2013 hardened the debate.',
    today: 'The Muslim Brotherhood and its offshoots, Tunisia\'s Ennahda, Turkey\'s AKP in its roots.'
  },
  'Khomeinism': {
    core: 'Velayat-e faqih: in the absence of the Hidden Imam, a senior Shia jurist should hold supreme authority, combined with export of the revolution and resistance to Western and Israeli power.',
    policy: ['Clerical supreme leader above elected bodies', 'Mandatory religious codes, including on dress', 'Support for allied militias abroad', 'Populist economic rhetoric with large state and religious foundations'],
    tensions: 'Many senior Shia clerics reject velayat-e faqih; the 2022 protests showed deep public opposition to its social codes.',
    today: 'The Islamic Republic of Iran; Hezbollah and allied groups.'
  },
  'Salafi-Jihadism': {
    core: 'Violent jihad is an individual duty to overthrow regimes that do not rule by a literalist reading of sharia and to expel Western influence, as the path to restoring a caliphate.',
    policy: ['Armed attacks on the "far enemy" (the US and allies) and "near enemy" (local regimes)', 'Strict hudud punishments', 'Rejection of democracy and nation-states', 'Ultimately a global caliphate'],
    tensions: 'Al-Qaeda\'s leadership criticized indiscriminate killing of Muslims; ISIS embraced it. Which enemy to fight first.',
    today: 'Al-Qaeda and its affiliates, notably in the Sahel and Somalia (al-Shabaab).',
    psych: 'Radicalization research (Kruglanski et al. 2014, "significance quest") finds that personal humiliation or loss of significance, a group narrative offering it back, and social networks matter more than religious knowledge or poverty.'
  },
  'Takfiri Jihadism': {
    core: 'The most extreme current: Muslims who deviate, especially Shia, are apostates who may be killed, and a caliphate should be declared and governed now.',
    policy: ['Territorial caliphate with its own courts and taxes', 'Mass killing and enslavement of religious minorities', 'Destruction of shrines and heritage', 'Global terror attacks'],
    tensions: 'Rejected by nearly all Muslim scholars and by al-Qaeda itself as excessive.',
    today: 'ISIS and its provinces in Africa and Afghanistan after the territorial caliphate fell in 2019.',
    psych: 'As with Salafi-jihadism, significance-quest and network explanations outperform poverty or piety as predictors (Kruglanski et al. 2014).'
  },
  'Ethnonationalism': {
    core: 'The nation is a community of shared descent, and the state exists to serve and preserve that people. Citizenship and belonging follow ancestry.',
    policy: ['Immigration limited by ethnicity or culture', 'Citizenship by descent', 'Opposition to intermarriage or multiculturalism (in stronger forms)', 'Preferential treatment for the core group'],
    tensions: 'Civic versus ethnic definitions of the nation; its stronger forms shade into white nationalism and racial supremacism.',
    today: 'Organized white nationalism in the US and Europe; ethnic-majoritarian politics in many states.'
  },
  'Fascism': {
    core: 'Griffin\'s "palingenetic ultranationalism": the nation is in decay and must be reborn through a mass movement under a leader, which subordinates the individual, class conflict and liberal institutions to national unity and strength.',
    policy: ['Single-party state and leader cult', 'Corporatist economy joining employers and labor under the state', 'Militarism and territorial expansion', 'Suppression of opponents, free press and unions'],
    tensions: 'Scholars still debate its definition (Paxton\'s "stages" versus Griffin\'s core) and how to apply the term to present-day movements.',
    today: 'No fascist state exists; small parties and groups continue the tradition.',
    psych: 'Research on the "authoritarian personality" began as an attempt to explain fascism (Adorno et al. 1950); its modern successors are right-wing authoritarianism (Altemeyer) and Stenner\'s (2005) finding that authoritarian predispositions are activated by perceived threats to social unity.'
  },
  'National Socialism': {
    core: 'Fascism organized around biological racism: history as struggle between races, the "Aryan" nation as master race, Jews as the mortal enemy, and conquest of living space in the east.',
    policy: ['Racial laws and genocide', 'Total state and leader principle', 'War of conquest', 'Rearmament and state-directed private economy'],
    tensions: 'Historically, between its "socialist" wing and its alliance with industry, ended by the 1934 purge.',
    today: 'Neo-Nazi groups, banned in many countries.'
  },
  'Apocalyptic Millenarianism': {
    core: 'The end of the world is imminent and will separate the saved from the damned. Some groups wait for it; a few try to bring it about.',
    policy: ['Total obedience to the leader', 'Withdrawal from society', 'In violent cases, attacks meant to trigger the end'],
    tensions: 'Most millenarian groups are peaceful; scholars study why a few (Aum Shinrikyo) turn to mass violence.',
    today: 'Many small groups; few violent ones.',
    psych: 'Lifton (1999) traces the turn to violence in Aum to the guru\'s total control and the group\'s need to "force the end" when prophecy did not come.'
  },
  'Distributism': {
    core: 'Productive property should be spread as widely as possible among families, through small farms, shops, crafts and cooperatives, avoiding both concentrated capitalism and state socialism.',
    policy: ['Support for small business and family farms', 'Antitrust and limits on concentration', 'Cooperatives and guilds', 'Subsidiarity and local government'],
    tensions: 'Whether it can work in an economy of scale and global supply chains.',
    today: 'Catholic social thought circles; influence on "post-liberal" and "red Tory" writers.'
  }
};
