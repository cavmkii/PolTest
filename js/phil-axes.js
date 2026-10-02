// Philosophy test: nine axes, each scored from -100 (left pole) to +100 (right pole).
// The first three follow the main components Bourget & Chalmers (2014) found in the 2009 PhilPapers
// Survey (anti-naturalism, rationalism, realism/objectivism); the rest follow standard divides in ethics,
// free will, personal identity and philosophical method.
// survey: share of professional philosophers (target faculty, accept or lean) in the 2020 PhilPapers
// Survey (Bourget & Chalmers 2023) for the closest question, where one exists.
const PHIL_AXES = [
  {
    key: 'nat', name: 'Reality', left: 'Naturalism', right: 'Transcendence',
    lc: '#3f8f7a', rc: '#8a63b8',
    ldesc: 'Everything is part of the natural world science studies; mind is physical.',
    rdesc: 'God, soul or a reality beyond nature; mind is not merely physical.',
    survey: '2020 PhilPapers Survey: 66.9% of philosophers accept or lean atheism, 18.9% theism; 51.9% physicalism about mind, 32.1% non-physicalism.'
  },
  {
    key: 'know', name: 'Knowledge', left: 'Experience', right: 'Reason',
    lc: '#c0812b', rc: '#3c6fb0',
    ldesc: 'Empiricism: knowledge comes from the senses.',
    rdesc: 'Rationalism: reason alone can know substantial truths.',
    survey: '2020 PhilPapers Survey: 72.8% accept or lean toward the existence of a priori knowledge, 18.5% against.'
  },
  {
    key: 'real', name: 'Truth', left: 'Realism', right: 'Construction',
    lc: '#5b7d3a', rc: '#b5527a',
    ldesc: 'A mind-independent world; truth as correspondence to it.',
    rdesc: 'Truth and categories made by minds, language, practice or power.',
    survey: '2020 PhilPapers Survey: 79.5% accept or lean non-skeptical realism about the external world; 72.4% scientific realism.'
  },
  {
    key: 'moral', name: 'Morality', left: 'Objective', right: 'Subjective',
    lc: '#356fa0', rc: '#c25c3a',
    ldesc: 'Moral realism: some things are right or wrong whatever anyone thinks.',
    rdesc: 'Anti-realism: morality is feeling, convention or choice.',
    survey: '2020 PhilPapers Survey: 62.1% accept or lean moral realism, 26.1% anti-realism.'
  },
  {
    key: 'ethic', name: 'Right action', left: 'Outcomes', right: 'Duty',
    lc: '#c49a22', rc: '#5a5f8f',
    ldesc: 'Consequentialism: the best results decide what is right.',
    rdesc: 'Deontology: some acts are required or forbidden whatever the results.',
    survey: '2020 PhilPapers Survey: consequentialism 30.6%, deontology 32.1%, virtue ethics 37.0% (multiple answers allowed).'
  },
  {
    key: 'scope', name: 'Moral scope', left: 'Impartial', right: 'Particular',
    lc: '#2f8fa6', rc: '#a3683a',
    ldesc: 'Universal principles; everyone counts equally, near or far.',
    rdesc: 'Character, relationships and tradition shape what we owe.'
  },
  {
    key: 'will', name: 'Freedom', left: 'Determined', right: 'Free',
    lc: '#6b6f7a', rc: '#d0703a',
    ldesc: 'Choices are fully caused; libertarian free will is an illusion.',
    rdesc: 'We could genuinely have done otherwise.',
    survey: '2020 PhilPapers Survey: 59.2% accept or lean compatibilism, which this test scores just left of center; libertarian free will and no free will are minority views.'
  },
  {
    key: 'self', name: 'Self', left: 'Enduring', right: 'Fluid',
    lc: '#7c5a9e', rc: '#3f9a8a',
    ldesc: 'A soul, essence or single continuing self.',
    rdesc: 'No fixed self: a bundle, a process, or made by choice and situation.',
    survey: '2020 PhilPapers Survey: psychological view of personal identity 43.7%, biological view 19.1%, further-fact view 14.9%.'
  },
  {
    key: 'pmethod', name: 'Method', left: 'Analysis', right: 'Interpretation',
    lc: '#4a6fa5', rc: '#a5574a',
    ldesc: 'Clear argument, logic, continuity with science.',
    rdesc: 'Lived experience, history, texts and critique.'
  }
];

// Each statement moves one or more philosophy axes; s: 1 marks the short version.
const PHIL_QUESTIONS = [
  // Reality
  { t: 'God exists.', s: 1, e: { nat: 1 } },
  { t: 'The mind is entirely a product of physical processes in the brain.', s: 1, e: { nat: -1 } },
  { t: 'Everything that exists is ultimately part of the natural world that science studies.', s: 1, e: { nat: -1 } },
  { t: 'Some truths about reality can only be grasped through religious or mystical experience.', s: 1, e: { nat: 1, pmethod: 0.3 } },
  { t: 'Consciousness will eventually be fully explained by neuroscience.', s: 1, e: { nat: -1 } },
  { t: 'A being physically identical to you in every way could lack conscious experience.', e: { nat: 1 } },
  { t: 'The universe has a purpose beyond whatever purposes humans give it.', e: { nat: 1, moral: -0.3 } },
  { t: 'Miracles that break the laws of nature are possible.', e: { nat: 1 } },

  // Knowledge
  { t: 'Some important truths can be known by reason alone, without relying on experience.', s: 1, e: { know: 1 } },
  { t: 'All knowledge about the world ultimately comes from the senses.', s: 1, e: { know: -1 } },
  { t: 'Mathematical truths exist independently of human minds.', s: 1, e: { know: 1, real: -0.5 } },
  { t: 'Ideas like cause and substance are habits of thought, not features we know the world to have.', s: 1, e: { know: -1, real: 0.3 } },
  { t: 'Philosophers can make real discoveries by careful thought, without running experiments.', s: 1, e: { know: 1 } },
  { t: 'Science, not philosophy, is the best guide to what exists.', e: { know: -0.5, nat: -0.5, pmethod: -0.5 } },
  { t: 'Humans are born with some innate ideas or knowledge.', e: { know: 1 } },
  { t: 'A claim that could never be tested by observation, even in principle, is meaningless.', e: { know: -1, pmethod: -0.5 } },

  // Truth
  { t: 'There is a world that exists independently of how anyone thinks or talks about it.', s: 1, e: { real: -1 } },
  { t: 'What we call "truth" is what works for us or what our community agrees on.', s: 1, e: { real: 1 } },
  { t: 'Our best scientific theories are approximately true, including about things we cannot observe.', s: 1, e: { real: -1 } },
  { t: 'Categories like gender, race or madness are mainly made by society and language, not found in nature.', s: 1, e: { real: 1 } },
  { t: 'We can never step outside language to compare our words with reality itself.', s: 1, e: { real: 1, pmethod: 0.3 } },
  { t: 'A statement is true when it corresponds to the facts.', e: { real: -1 } },
  { t: 'Reality is, at bottom, mental or spiritual rather than material.', e: { real: 0.5, nat: 0.5 } },
  { t: 'People in different cultures can live in genuinely different worlds, not just hold different beliefs about one world.', e: { real: 1 } },

  // Attention check
  { t: 'To show you are reading carefully, choose "Agree" for this statement.', s: 1, check: 0.5, e: {} },

  // Morality
  { t: 'Some actions are wrong regardless of what any person or culture believes.', s: 1, e: { moral: -1 } },
  { t: 'Moral claims express feelings or attitudes rather than facts.', s: 1, e: { moral: 1 } },
  { t: 'Morality is something humans invented.', s: 1, e: { moral: 1, nat: -0.3 } },
  { t: 'Torturing an innocent person for fun would be wrong even in a society that approved of it.', s: 1, e: { moral: -1 } },
  { t: 'Life has no meaning except what each person creates for themselves.', s: 1, e: { moral: 1, nat: -0.3, self: 0.3 } },
  { t: 'There are objective facts about what makes a human life go well.', e: { moral: -1 } },
  { t: 'Beauty is in the eye of the beholder.', e: { moral: 0.5, real: 0.3 } },
  { t: 'When two cultures disagree about morality, neither is simply right.', e: { moral: 1 } },

  // Right action
  { t: 'The right action is whichever one produces the best overall consequences.', s: 1, e: { ethic: -1 } },
  { t: 'Some things must never be done, even to prevent a greater harm.', s: 1, e: { ethic: 1 } },
  { t: 'It is right to divert a runaway trolley so that it kills one person instead of five.', s: 1, e: { ethic: -1 } },
  { t: 'It would be wrong for a surgeon to kill one healthy patient to save five others with the organs.', s: 1, e: { ethic: 1 } },
  { t: 'Lying is wrong even when it would make things turn out better.', s: 1, e: { ethic: 1 } },
  { t: 'Rights matter only because respecting them usually leads to good results.', e: { ethic: -1 } },
  { t: 'A machine that gave you perfect experiences for the rest of your life would be as good as a real life.', e: { ethic: -0.5, real: 0.3 } },
  { t: 'Using a person merely as a tool is wrong even if everyone ends up better off.', e: { ethic: 1 } },

  // Moral scope
  { t: 'Everyone\'s interests count equally, including strangers on the other side of the world.', s: 1, e: { scope: -1 } },
  { t: 'We owe more to our family, community and country than to strangers.', s: 1, e: { scope: 1 } },
  { t: 'Being good is more about character and practical wisdom than about following rules or calculating outcomes.', s: 1, e: { scope: 1 } },
  { t: 'Moral principles should apply in the same way to everyone, in every culture and era.', s: 1, e: { scope: -1, moral: -0.3 } },
  { t: 'We learn what is right mainly through the traditions and practices we grow up in.', s: 1, e: { scope: 1, moral: 0.3 } },
  { t: 'Caring relationships, more than abstract principles, are the heart of morality.', e: { scope: 1 } },
  { t: 'Spending money on luxuries while others die of preventable causes is morally wrong.', e: { scope: -1, ethic: -0.3 } },
  { t: 'A just society is one that people would choose without knowing what position they would hold in it.', e: { scope: -1 } },

  // Freedom
  { t: 'Every event, including every human choice, is caused by prior events.', s: 1, e: { will: -1 } },
  { t: 'People can genuinely choose otherwise than they do.', s: 1, e: { will: 1 } },
  { t: 'Free will is an illusion.', s: 1, e: { will: -1 } },
  { t: 'People deserve blame or praise for what they do, not just because blaming and praising change behavior.', s: 1, e: { will: 1 } },
  { t: 'We are always responsible for choosing who we are, whatever our circumstances.', s: 1, e: { will: 1, self: 0.3 } },
  { t: 'Even if science showed that all our choices are caused, we would still be free in the way that matters.', e: { will: -0.5 } },
  { t: 'Our characters and choices are shaped by forces we do not control: genes, upbringing, class, the unconscious.', e: { will: -1 } },
  { t: 'The future is genuinely open, not fixed in advance.', e: { will: 1 } },

  // Self
  { t: 'There is a single continuing self that remains the same person through a whole life.', s: 1, e: { self: -1 } },
  { t: 'The self is a bundle of experiences with no owner underneath.', s: 1, e: { self: 1 } },
  { t: 'Who you are is shaped mostly by your body, situation and relationships rather than by an inner essence.', s: 1, e: { self: 1 } },
  { t: 'Each person has a soul or inner essence that makes them who they are.', s: 1, e: { self: -1, nat: 0.5 } },
  { t: 'Clinging to a fixed sense of self is a source of suffering.', s: 1, e: { self: 1 } },
  { t: 'If you were perfectly copied and the original destroyed, the copy would be you.', e: { self: 0.5, nat: -0.3 } },
  { t: 'Human beings have a fixed nature that determines what is good for them.', e: { self: -1, moral: -0.5 } },
  { t: 'We first exist, and only afterward define what we are.', e: { self: 1, will: 0.3 } },

  // Method
  { t: 'Philosophy should make its arguments as clear and precise as possible, ideally in logical form.', s: 1, e: { pmethod: -1 } },
  { t: 'Understanding human life means describing lived experience from the inside, not explaining it from outside.', s: 1, e: { pmethod: 1 } },
  { t: 'An idea or text can only be understood in its historical and cultural context.', s: 1, e: { pmethod: 1, real: 0.3 } },
  { t: 'Philosophy should be continuous with the sciences.', s: 1, e: { pmethod: -1, nat: -0.3 } },
  { t: 'The deepest philosophical truths cannot be fully stated in plain propositions.', s: 1, e: { pmethod: 1 } },
  { t: 'Many philosophical problems come from confusions about how language works.', e: { pmethod: -0.5 } },
  { t: 'Reason itself is shaped by power, history and interests, and must be critiqued.', e: { pmethod: 1, real: 0.5 } },
  { t: 'Intuitions about thought experiments are good evidence in philosophy.', e: { pmethod: -1, know: 0.3 } }
];
