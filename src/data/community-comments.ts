/**
 * Community feed generator.
 *
 * The community counters describe a large conversation (267k likes / 92k
 * comments), but nothing is materialised in the bundle: comments are produced
 * on demand, page by page, from a deterministic seeded generator. Only the
 * pages a visitor actually scrolls to are ever built.
 *
 * Tone: traders reacting BEFORE trying the Session Matrix — curiosity,
 * anticipation, technical questions, light healthy scepticism. No claimed
 * results, no invented profits, no features the indicator does not have.
 */

export type DemoComment = {
  id: string;
  author: string;
  handle: string;
  body: string;
  likes: number;
  /** Age in seconds at page load — entre 7 minutos e 24 horas. */
  ageSeconds: number;
};

/* ------------------------------------------------------------------ */
/* deterministic pseudo-randomness                                     */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: readonly T[], rnd: () => number) {
  return list[Math.floor(rnd() * list.length)] as T;
}

/* ------------------------------------------------------------------ */
/* names                                                               */
/* ------------------------------------------------------------------ */

const firstNames = [
  "Marcus", "Daniel", "James", "Sofia", "Tomás", "Nadia", "Ellis", "Rui",
  "Karim", "Hannah", "Lucas", "Priya", "Adrian", "Mira", "Owen", "Beatriz",
  "Kenji", "Ivan", "Chloe", "Dario", "Farah", "Gabriel", "Helena", "Iker",
  "Jonas", "Kwame", "Laura", "Mateo", "Nuno", "Olivia", "Pedro", "Quentin",
  "Rafael", "Sara", "Theo", "Ursula", "Victor", "Wanda", "Yara", "Zane",
  "Andrei", "Bruno", "Camila", "Dmitri", "Elena", "Felix", "Grace", "Hugo",
  "Ines", "Jasper", "Kira", "Leo", "Maya", "Niels", "Omar", "Paula",
  "Rita", "Samir", "Tessa", "Ulrich", "Vera", "Will", "Xavier", "Yusuf",
];

const lastInitials = [
  "", "R.", "K.", "M.", "T.", "S.", "L.", "B.", "P.", "D.", "A.", "C.",
  "G.", "N.", "V.", "F.", "H.", "J.", "W.", "Z.",
];

/* ------------------------------------------------------------------ */
/* comment building blocks                                             */
/* ------------------------------------------------------------------ */

const micro = [
  "First one here.",
  "Curious about this.",
  "I want to see this.",
  "Ok... interesting.",
  "Tomorrow we'll see.",
  "I'm in.",
  "This caught my attention.",
  "Now I'm curious.",
  "I want to understand this.",
  "Let's see.",
  "Different, at least.",
  "Questions. Many questions.",
  "Following this one.",
  "Waiting for the next email.",
  "That got interesting fast.",
  "Ok, noted.",
  "Watching.",
  "Show us already 😂",
  "Reading later, saving this.",
  "Fair enough. Curious.",
  "Hm. Go on.",
  "This one's for me.",
  "Right on time.",
  "Need to see the chart.",
  "Anyone else curious?",
];

const shortLines = [
  "Wasn't expecting this angle.",
  "This looks interesting. Tomorrow I'll pay attention.",
  "Ok, that woke up my curiosity.",
  "I want to see exactly how this works.",
  "If it does what I think it does, that's useful.",
  "Not drawing conclusions yet. Tomorrow we'll see.",
  "This arrived at the right moment for me.",
  "Now I want to see the next step.",
  "Timing is honestly my weakest part.",
  "Wait... so the idea is when to look, not where to enter?",
  "I've never seen a tool framed this way.",
  "Half sceptical, half interested.",
  "The framing is what got me, not the promise.",
  "I'll judge after I see it on a real chart.",
  "Sounds simple. Simple usually survives longer.",
  "Screen time is exactly the problem I have.",
  "I'd rather have fewer answers than more signals.",
  "Genuinely unsure, genuinely interested.",
  "Ok this is not the usual indicator pitch.",
  "Let's see if the logic holds up.",
];

const openings = [
  "I've been trading for a while and",
  "Honestly,",
  "Not going to lie,",
  "After years of staring at charts,",
  "The part that interests me is that",
  "What I keep coming back to is that",
  "I don't need another entry tool, so",
  "I've tried a few session tools before and",
  "My routine is already messy, so",
  "I trade around a job, so",
  "I keep two instruments open all day, so",
  "I've been through the ten-indicators phase, and",
];

const middles = [
  "the question of when the market actually deserves attention is the one I never solved",
  "knowing which session behaves differently on a given instrument would change how I plan my day",
  "most tools add lines to the chart instead of removing decisions",
  "I still open charts almost at random and hope something happens",
  "session behaviour clearly isn't the same across instruments, but I've never measured it properly",
  "I usually end up doing this analysis manually in a spreadsheet",
  "the hard part was never finding setups, it was deciding when to sit down",
  "I want something that tells me when to look, not what to click",
  "an objective way to organise screen time is worth more to me than another oscillator",
  "I've never found a timing tool that actually fit my routine",
  "treating every market hour as equally important never made sense to me",
  "I'd rather understand the reasoning than trust a signal",
];

const closings = [
  "so I'm curious to see how this handles it.",
  "so I'll wait for the next email before deciding anything.",
  "so tomorrow I'll be paying attention.",
  "so I want to see it on a real chart first.",
  "so I'm interested, but not convinced yet.",
  "so let's see what shows up tomorrow.",
  "so I'd like to know exactly what data it uses.",
  "so if the logic is clear, I'm testing it.",
  "so I'm keeping an eye on this one.",
  "so I'll hold my opinion until I see the details.",
  "so this is the first thing in a while I actually want to try.",
  "so I hope the technical part gets explained properly.",
];

const standalone = [
  "I'm mostly curious about how the session windows are defined. Fixed hours, or something based on how the sessions have actually behaved historically?",
  "I've tried plenty of timing indicators and none of them really solved the problem for me. I want to see what's being done differently here.",
  "If this genuinely helps me know when it's worth being in front of the chart, that alone would interest me a lot.",
  "I'm curious mainly about the reasoning behind it. I don't want another indicator full of signals.",
  "I'll admit I'm sitting here waiting to see what comes tomorrow.",
  "I'm now in that state where I want to understand everything immediately.",
  "I hope the next email explains this better, because I got genuinely curious.",
  "I'm trying not to build up expectations, but this idea of knowing when to pay attention is exactly a problem I have.",
  "I don't know if it will work as well as it sounds, but I definitely want to test it before forming an opinion.",
  "This sounds good enough that I don't want to judge it from the description alone. Tomorrow I'll find out.",
  "I've seen a lot of tools promising to solve similar problems. The difference here seems to be the approach. I want to see it in practice.",
  "I'm not saying this will change my routine yet... but I'm definitely interested in finding out.",
  "After so many years looking at charts, I realised a huge part of the problem isn't finding setups, it's knowing when it's actually worth being in front of the market.",
  "I have plenty of indicators for analysis. What's usually missing is an objective way to organise my time. That's why I'm curious about the Session Matrix.",
  "I've been through the phase of putting ten indicators on a chart. These days I prefer tools that answer one specific question. I want to see if this one does.",
  "One thing that always bothered me is treating every market hour as if it had the same weight. If the Session Matrix can put that in historical context, I want to see it.",
  "Ok, that was unexpected 😂",
  "Wait... so the idea is knowing when to look and not where to enter? Now I get it.",
  "I don't know exactly where this is going, but I'm following it.",
  "I've tried several session indicators and ended up quitting because the chart got more confusing than before. I want to see if this approach is different.",
  "I tested a few timing tools in the past, but I never found one that actually fit my routine.",
  "I've used volatility indicators, session boxes and a bunch of dashboards. I'm curious whether the Session Matrix approaches the problem differently.",
  "I've looked for exactly this kind of information in several places and I normally end up doing everything by hand.",
  "I'll wait for the next email before drawing any conclusions.",
  "If tomorrow's email covers the technical side, I'm interested.",
  "I want to see the real example before deciding what I think.",
  "Tomorrow's explanation will probably answer my questions.",
  "I'm still trying to understand how this can be available at no cost. Tomorrow we'll see.",
  "If it's genuinely possible to test at no cost, I at least want to try it.",
  "Not going to complain about something free 😂 I want to see what comes tomorrow.",
  "I'll admit I got suspicious when I saw I could try it at no cost, but I'm too curious to ignore it.",
  "How exactly does it decide the windows? That's the part I'd want explained.",
  "I want to see the data before I form an opinion.",
  "Ok, now I need to know what comes tomorrow.",
  "After years in the market, timing is still one of the hardest things to structure.",
  "I'd like to understand exactly which historical data is being used.",
  "Finally someone decided to talk about when to look at the chart 😂",
  "I'm the guy with three screens open doing nothing for six hours. If this fixes that, great.",
  "Does it cover instruments outside crypto? That's my main question so far.",
  "The bit I like is that it doesn't claim to predict anything. That's rare.",
  "I'd want to know how much history it looks at before calling a session active or quiet.",
  "My concern is chart clutter. If it stays clean, I'm interested.",
  "Sounds like a planning tool more than an indicator. That's actually what I'm missing.",
  "I'm going to read this properly tonight when I'm not in a trade.",
  "Honestly the reason I clicked was the phrase about when to watch. That's my whole problem.",
  "Kill zones are everywhere online but nobody ever shows the historical evidence behind them. Curious if this does.",
  "Not convinced yet, but I'll follow along to see what happens tomorrow.",
  "I keep hearing that session timing matters and I've never had a systematic way to check it. Interested.",
  "If it just tells me which window has historically been the most active for the instrument I trade, that's already something.",
  "Slightly sceptical of anything with a dashboard, but the question it's asking is the right one.",
  "I'd rather have one tool answering one question than five answering none.",
  "Ok you have my attention. Don't waste it 😂",
];

/* ------------------------------------------------------------------ */
/* personalities                                                       */
/* ------------------------------------------------------------------ */

/**
 * Each persona has its own voice bank, so two comments of the same length
 * still read like two different people. No persona claims results, profits or
 * features the indicator does not have — everything stays pre-trial: timing,
 * sessions, historical context, curiosity about tomorrow's email.
 */
const personas: readonly (readonly string[])[] = [
  // the curious one
  [
    "How exactly does it decide the windows?",
    "Curious how the sessions get scored in the first place.",
    "What decides that a session deserves attention? That's my question.",
    "I'd like to know whether the windows are fixed or measured from history.",
    "Is the scoring per instrument or the same everywhere?",
  ],
  // the sceptic who stays interested
  [
    "I want to see the data before I form an opinion.",
    "Not fully convinced yet, but I'll follow it to see what happens tomorrow.",
    "Sounds good enough that I don't want to judge it from a description alone.",
    "I don't know if it'll be as good as it sounds, but tomorrow I'll find out.",
    "I've heard similar promises before. The approach here looks different though.",
  ],
  // the anxious one
  [
    "Ok, now I need to know what comes tomorrow.",
    "I'm literally waiting for the next email.",
    "I'm in that state where I want to understand everything right now.",
    "Trying not to build expectations, but this is exactly a problem I have.",
    "Please don't make us wait too long 😂",
  ],
  // the veteran
  [
    "After years in the market, timing is still the hardest thing to structure.",
    "Finding setups was never my problem. Deciding when to sit down was.",
    "I've been through the ten-indicators phase. Now I want one clear question answered.",
    "Treating every market hour as equally important never made sense to me.",
    "Most tools add lines. Very few remove decisions.",
  ],
  // the technical one
  [
    "I'd like to understand exactly which historical data is used.",
    "How much history does it look at before calling a session active or quiet?",
    "Is the session split by clock hours or by measured behaviour?",
    "I want to know how the ranking is computed, not just what it shows.",
    "The methodology is the part I care about.",
  ],
  // the impatient one
  [
    "Can you just show it already 😂",
    "Enough teasing, I want the chart.",
    "Tomorrow feels far away right now.",
    "Show us the panel and let us judge.",
    "Ok, hurry up 😅",
  ],
  // the spontaneous one
  [
    "First one here.",
    "Ok that was unexpected 😂",
    "Wait... so it's about when to look, not where to enter?",
    "Hm. Go on.",
    "Different, at least.",
  ],
  // the busy one
  [
    "Reading this properly tonight when I'm not in a trade.",
    "Saving it for later, but I'm interested.",
    "I trade around a job, so screen time is my whole problem.",
    "Bookmarking. I'll come back to this.",
    "Short on time today, but this one I'll read.",
  ],
  // the observer
  [
    "Interesting. I'll follow along.",
    "Watching this one quietly.",
    "Noted. Let's see where it goes.",
    "I'll hold my opinion until I see the details.",
    "Following.",
  ],
  // the enthusiast
  [
    "Ok, now I'm genuinely interested.",
    "This is the first thing in a while I actually want to try.",
    "I needed exactly something like this.",
    "The framing got me, not the promise.",
    "This one's for me.",
  ],
  // the doubtful but willing
  [
    "Half sceptical, half interested.",
    "I'm still trying to understand how this can be available at no cost.",
    "I got suspicious about the free part, but I'm too curious to ignore it.",
    "If it's really testable at no cost, I'll at least try it.",
    "Genuinely unsure, genuinely interested.",
  ],
  // the funny one
  [
    "Finally someone talks about when to look at the chart 😂",
    "I'm the guy with three screens open doing nothing for six hours.",
    "My charts are a Christmas tree already, so a clean panel would help lol",
    "Not complaining about something free 😂",
    "Ok you have my attention. Don't waste it 😂",
  ],
];

const connectors = [
  " ",
  " Also, ",
  " Either way, ",
  " Honestly, ",
  " That said, ",
];

/* ------------------------------------------------------------------ */
/* generator                                                           */
/* ------------------------------------------------------------------ */

/**
 * Length tiers are drawn independently from persona, so size, tone and idea
 * mix organically instead of forming blocks.
 * micro ~2-6 words, short ~7-20, medium ~21-50, long ~51-100+.
 */
function buildBody(rnd: () => number, persona: readonly string[]) {
  const roll = rnd();

  // micro
  if (roll < 0.16) return rnd() < 0.5 ? pick(micro, rnd) : pick(persona, rnd);

  // short
  if (roll < 0.42) {
    return rnd() < 0.5 ? pick(shortLines, rnd) : pick(persona, rnd);
  }

  // medium
  if (roll < 0.76) {
    const parts = [pick(persona, rnd)];
    parts.push(rnd() < 0.5 ? pick(standalone, rnd) : pick(shortLines, rnd));
    return parts.join(pick(connectors, rnd));
  }

  // long — composed opinion plus the persona's own idea
  const parts = [`${pick(openings, rnd)} ${pick(middles, rnd)}, ${pick(closings, rnd)}`];
  parts.push(pick(persona, rnd));
  if (rnd() < 0.55) parts.push(pick(standalone, rnd));
  if (rnd() < 0.25) parts.push(pick(shortLines, rnd));
  return parts.join(" ");
}

/**
 * Age of comment #index, in seconds, at load time.
 * Index 0 is the newest (7 min) and the last index sits exactly on the 24h
 * edge, spread exponentially so the top of the feed moves in minutes and the
 * tail in hours. Monotonic, so the feed is strictly chronological.
 */
export function commentAgeSeconds(index: number) {
  const span = Math.max(1, TOTAL_COMMENTS - 1);
  const t = Math.min(1, Math.max(0, index / span));
  const min = 7 * 60;
  const max = 24 * 60 * 60;
  return Math.round(min * Math.exp(Math.log(max / min) * t));
}

/**
 * Name for #index. First name and initial are derived from the index through
 * co-prime strides, so the full name only repeats after every
 * firstNames × lastInitials combination has been used.
 */
function buildName(index: number) {
  const first = firstNames[(index * 37) % firstNames.length] as string;
  const initial = lastInitials[
    (Math.floor(index / firstNames.length) * 7 + index) % lastInitials.length
  ] as string;
  return {
    author: initial ? `${first} ${initial}` : first,
    handle: `@${first.toLowerCase().replace(/[^a-z]/g, "")}${100 + (index % 900)}`,
  };
}

function buildComment(index: number): DemoComment {
  const rnd = mulberry32(index * 2654435761 + 1013904223);
  const { author, handle } = buildName(index);
  const persona = personas[index % personas.length] as readonly string[];
  return {
    id: `c-${index}`,
    author,
    handle,
    body: buildBody(rnd, persona),
    likes: Math.floor(rnd() * rnd() * 420),
    ageSeconds: commentAgeSeconds(index),
  };
}

/**
 * Total conversation size represented by the community counters.
 * Comments are never all materialised — only requested pages are built.
 */
export const TOTAL_COMMENTS = 92_000;

/** Build one page of the feed on demand. */
export function getCommentPage(page: number, pageSize: number): DemoComment[] {
  const start = page * pageSize;
  const end = Math.min(start + pageSize, TOTAL_COMMENTS);
  const out: DemoComment[] = [];
  const seenBody = new Set<string>();
  const seenName = new Set<string>();
  for (let i = start; i < end; i += 1) {
    let comment = buildComment(i);
    // no duplicate bodies or names inside a visible page
    let attempt = 0;
    while ((seenBody.has(comment.body) || seenName.has(comment.author)) && attempt < 8) {
      attempt += 1;
      comment = { ...buildComment(i + attempt * 7919), id: `c-${i}` };
    }
    seenBody.add(comment.body);
    seenName.add(comment.author);
    out.push(comment);
  }
  return out;
}
