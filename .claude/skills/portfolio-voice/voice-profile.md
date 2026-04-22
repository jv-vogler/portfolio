---
name: portfolio-voice-profile
description: Cached voice profile for João Victor Vogler's blog. Covers rhythm, register, structural moves, humanizer-tell counters, and calibration passages — not just word-tics.
type: reference
source_posts:
  - tmp/blog-post-references/lua-101.md
  - tmp/blog-post-references/memento-pattern.md
  - tmp/blog-post-references/command-pattern.md
  - tmp/blog-post-references/seo-basics.md
  - tmp/blog-post-references/the-right-form-of-forming-forms.md
  - tmp/blog-post-references/redux-101.md
  - tmp/blog-post-references/crowdstrike-incident.md
  - tmp/blog-post-references/throttle-debounce.md
derived: 2026-04-18
revised: 2026-04-21
---

# Voice profile — João's portfolio blog

The one question this profile answers: **does this draft sound like João, or does it sound like a generic AI that memorized his tics?** Patterns below are structural and rhetorical — not just vocabulary.

## Core principle

João writes tutorials the way a friend explains a thing over a drink: concrete, opinionated, playful on the edges, precise in the middle. The silliness is scaffolding for the precision, never a replacement for it. Strip the jokes and the post still teaches; strip the precision and there's no post.

## Craft principles (load-bearing, not decorative)

Three books sit behind the voice. The rules below actively shape sentence choices — they are not a bibliography, they are the defaults the draft has to earn its way out of.

**From Strunk & White — _Elements of Style_:**

- **Omit needless words.** "Due to the fact that" → "because". "In order to" → "to". "At this point in time" → "now". "Really", "very", "basically", "essentially" — delete on sight unless the sentence breaks without them.
- **Active voice by default.** "The dog bit the man" beats "the man was bitten by the dog". Passive is legal only when the actor is genuinely unknown or irrelevant.
- **Positive form.** "He usually came late" beats "he was not often on time". Say what a thing _is_, not what it is not.
- **Plain over fancy.** "use" beats "utilize"; "start" beats "commence"; "help" beats "facilitate"; "about" beats "regarding".
- **Emphatic words at the end.** Sentence endings carry weight — use them for the point, not the throat-clear. Rearrange until the last word of the sentence is the word you want the reader to remember.

**From Stephen King — _On Writing_:**

- **Adverbs are suspects.** "He said it angrily" is telling-not-showing. Replace with a stronger verb ("he snapped") or a showing action ("he slammed the mug down"). One well-placed adverb survives; a paragraph of them means rewrite.
- **Tell the truth.** If a claim hedges because you don't actually know, say you don't know (or `<verify>` it) — never smooth it over with "arguably", "some say", "it's widely known". Readers smell phoniness.
- **Write with the door closed, rewrite with it open.** The voice layer is the door-closed pass; Strunk and humanizer are door-open passes. Don't let door-open anxiety bleed into the first draft.

**From Williams & Colomb — _Style: Lessons in Clarity and Grace_:**

- **Old before new.** Open a sentence with what the reader already knows; end with the new idea. Well-ordered old→new chains remove the need for connective scaffolding ("However", "Therefore", "Additionally" are often symptoms of bad ordering, not a fix for it).
- **Characters as subjects, actions as verbs.** "A review of the process was made" is weak because the subject is a noun-thing ("review") and the verb is a helper ("was made"). "We reviewed the process" puts a character in the subject slot and a real action in the verb slot. Most passive-voice instincts disappear once this rule is applied first.
- **Cohesion is the reader's job only if the writer failed first.** If a reader has to re-parse a sentence to follow the thread, that's a coherence bug — fix it in revision, not by dropping a transition word in front.
- **Clarity is ethical.** The reader's time is worth more than the author's cleverness. When in doubt, clearer.

## Sentence-hook variety

A conscious discipline: no two consecutive sentences start with the same hook, and no paragraph carries three sentences with the same syntactic onset.

Repeated openers that signal AI prose (and should never cluster):

- **Transition words as openers:** "Since", "While", "Additionally", "Moreover", "Furthermore", "Also", "Thus", "Hence", "However", "Therefore". One instance per paragraph is fine; two is a yellow flag; three is a rewrite.
- **Filler starts:** "This is", "There is", "There are", "It is important to note", "It should be mentioned".
- **Pronoun echoes:** three "It"-starts in a row, or three "You"-starts in a row, reads as a checklist even when the content is good.

Vary the onset by switching between:

- Subject-first statement vs clause-first setup
- Question vs statement
- Fragment vs full sentence
- Proper noun vs pronoun
- Short imperative vs long explanatory

The test: read the first two words of each sentence in a paragraph aloud. If a pattern emerges ("Since the…", "While the…", "Because the…"), rewrite until it doesn't.

## Ten structural markers

These are the deep ones — the things that separate a post that "sounds like João" from a post that just has "POOF!" sprinkled in.

1. **Fake-reader archetype.** Posts address an imagined you who already tried the obvious thing and is frustrated about it. Not a beginner being taught; a peer being unstuck. "But what if we need to dispatch that same action in different places? Well, that's what action creators are for."
2. **Strikethrough as punchline setup.** The ~~crossed~~ correct pattern is self-correction as humor: "Uncle Ben ~~Parker~~ Linus". The joke is in the fact that the narrator is thinking out loud and chose the wrong reference first. Use sparingly — two or three per post, never more.
3. **Structural callbacks.** The closing image loops back to the opener: memento-pattern opens with _memento mori_ and closes on "capturing moments in code just as we do in life." The command-pattern post signs off with "your wish is my command." This is load-bearing — the post feels finished because the closing rhymes with the opening.
4. **Borrowed jokes get signaled, not stolen.** When a line is HIMYM, LOTR, Spiderman, etc., it's flagged as a reference ("Kids, I'm gonna tell you…"). Never passed off as original. The reader is in on the wink.
5. **Boring / real / gamer triptych.** When a concept has multiple framings, João offers the textbook one, then the street-level one, then an absurd example: "Computers store data… or, okay, picture a Pokémon save file." The third frame is the one that lands; the first two earn it.
6. **Double-dot beat (`…`) for deadpan.** Ellipses are comic timing, not dramatic pause. Used when the sentence is about to undercut itself: "If someone ever told you that disk size doesn't matter, I'm sorry to be the one giving you the bad news… but you've been lied to." Max one per section.
7. **Gradual backpedal.** A bold claim lands, then gets qualified over the next two sentences — never in the same sentence, never in a hedge word. "Redux is the answer. Well — it's _an_ answer. For apps of a certain size." The confidence shape is: assert → step back → name the condition.
8. **Meta-asides about writing.** Occasional parentheticals acknowledge the post itself: "(after you finish reading this blog post, of course)", "I apologize in advance because I can't explain it any better than this short page of the Redux docs." Self-aware, never self-deprecating about the work itself.
9. **Dark humor via absurd specifics.** When the post touches on failure modes, the examples go concrete and a little grim: fired employees, lied-to users, deleted files, global outages. Never punching down — the butt of the joke is the system, not a person.
10. **Every post earns its "not a silver bullet" beat.** Somewhere near the end, a sentence says _here's what this depends on_ and names the condition specifically. "It's all about trade-offs" on its own is the AI version; João's version names what the trade is against.

## Rhythm

Default to medium-to-long sentences with real connective tissue between clauses. Clause-heavy setups get punctured by short lines — but short lines are punctuation, not a default. A paragraph where every sentence could stand alone as a line of marketing copy has had its connective tissue cut, not written.

**Concrete floor:** no more than two consecutive sentences under eight words. Three in a row is staccato — rewrite.

**The em-dash trap.** When reducing em-dashes, reach for parentheticals and commas first. Semicolons next. Periods are the last resort. Splitting "It doesn't reveal the whole battle — you have to pick who to scan — but when you do…" into three full-stop sentences trades one AI-tell (em-dash cloud) for a worse one (staccato cluster). The natural fix is almost always a comma, a parenthetical, or a single em-dash kept in place — not a full stop.

**Fragments earn their keep by sitting after a long build.** "Yup." after two paragraphs of setup is a punchline. A floating fragment under a full sentence it barely modifies ("First time I've touched the language." appended to "I recently joined a _secret_ Elixir codebase at work.") is edit-pass residue — fold it back into the previous sentence with a comma or an em-dash aside.

Over-clustering short sentences ("The fix. Was easy. Like this.") reads worse than one flat sentence.

One-word paragraphs that do land: "Yup." / "Phew!" / "WHAAAT?" — always as reactions, never as statements.

## Register

Casual-technical. Precision sits next to "POOF!", "voilà", "phew!". The silly register is reserved for:

- Transitions between sections
- Moments of genuine surprise in the material
- Postmortems and failure examples (measured — a laugh, not a stand-up set)

The silly register is NOT for: definitions, code explanations, the actual teaching prose. That part stays dry and exact. Ratio across a full post: roughly one playful move per 200–300 words of teaching prose.

## Openings

No mandatory shape. Three ranges, all in-voice:

- **Scene / analogy opener** — "Memento mori…", "Just like the Moon…", "Imagine you just got paid…". The tech connection lands a paragraph later.
- **Confrontation opener** — "This is the day. You will finally learn how to use Redux once and for all, or get all of the money you've spent to be able to read this post refunded." Addresses the reader directly, stakes the post.
- **Flat opener** — "Package managers are boring until one of them takes down your CI for a day." Topic-first, but with a hook clause. In-voice when the topic itself is strong enough to carry the opening.

**Never** open with: "Let's explore", "In this post we'll", "dive in", "deep dive", "In today's fast-paced world of X".

## Closings

Three ingredients: **callback** (to the opening image), **tradeoff** (never a verdict), **sign-off** (usually a callback joke, sometimes a dry well-wish).

Verbatim examples:

- "If you need anything, your wish is my command."
- "Mastering that judgment is what separates good design from just memorizing diagrams."
- "Good luck on your Redux journey!"
- "Like any design pattern, the Memento Pattern isn't a silver bullet; it's all about trade-offs."

Never: "In conclusion", "To summarize", "At the end of the day", "Hopefully this was helpful!" (fake enthusiasm), "Happy coding!" (corporate outro).

## Punctuation habits

- **Em-dashes** — present, but spread. Three or more in a single paragraph reads AI. Use parentheticals or separate sentences to break them up.
- **Parentheticals** — frequent, short, used for asides and half-jokes.
- **Strikethrough** — see marker 2. Self-correcting jokes only.
- **Ellipses** — the double-dot beat from marker 6. Deadpan, not dramatic.
- **ALL CAPS** — single words only ("WHAAAT?", "NEVER"). Never a phrase.
- **Exclamation points** — rare. One per paragraph ceiling. Zero is better than one when in doubt.
- **Curly quotes / em-dash clouds / decorative bullets** — never. These are the cleanest AI tells.

## Pronouns

- **`we`** — default for walkthroughs, explanations, analogies, anything collaborative. "Let's say we want to select a piece of state…". Reader is in the kitchen with the author.
- **`you`** — direct advice, warnings, stakes. "If someone ever told you disk size doesn't matter, you've been lied to."
- **`I`** — personal anecdote, opinion, apology. Rare but load-bearing: "I apologize in advance because I can't explain it any better than…". When `I` shows up, something personal is actually being said.

Never switch pronouns mid-paragraph without a reason. Switching signals a tonal shift (walkthrough → direct advice).

## Rhetorical moves

- **Fake reader Q&A.** "Okay, but how does X actually…?" / "I'm glad you asked!" One or two per post, not a structural backbone.
- **Pop-culture drops as analogies.** LOTR, Star Wars, Spiderman, HIMYM, Pokémon. Signaled as references (marker 4).
- **Thematic headings.** Puns, references, thematic wordplay. But: **the skill proposes flat descriptive headings by default.** Author tunes them to puns. Skill doesn't guess personality-heavy headings — it'll get them wrong more often than right.
- **Glossaries and "what's next" sections.** Posts frequently end with a reference block (glossary, further reading). Honored as part of the structure; don't strip them.

## Profanity ceiling

`heck`, `hell`, `shit`, `wtf` — in range.
`fuck` — not in range. Stops at the line.

Used for emphasis on genuine frustration (a bug that took a day, a spec that lies). Never for cheap shock or punchline.

## Humanizer AI-tells — NOT USED

These are the tells `humanizer` catches. The voice profile actively avoids them; when Strunk strips personality and these slip in, humanizer's job is to scrub them out. Counter-examples from the corpus.

- **-ing tail clauses.** AI: "Redux is a library, providing centralized state management, making it easier to…". João: "Redux is an event-based JavaScript library for centralized state management." Verb-first, no participle chains.
- **Rule-of-three listicle sentences.** AI: "Redux is fast, reliable, and scalable." João: picks one adjective and defends it, or picks two that cut against each other.
- **"Testament to X" / "showcase" / "speaks volumes".** Zero instances in corpus. If a draft has one, delete it.
- **Vague attributions.** "Many developers believe…", "It's widely known that…", "Some argue…". João either names the source or owns the claim directly.
- **Promotional register.** "Powerful", "seamless", "robust", "cutting-edge", "leverage" (as verb), "delve". Allergy-level avoidance.
- **Em-dash clouds.** Three+ em-dashes in one paragraph — instant AI. Parentheticals or separate sentences break them up.
- **Announcer prose.** "Here's the thing:", "What's interesting is…", "The real question is…". João just says the thing.
- **Setup-undercut filler.** "I did X. But there's more to it than X." The second sentence announces its own function. Either say both in one sentence or drop the announcer.
- **Curly quotes / smart apostrophes.** Straight quotes only (markdown source).
- **Emoji-decorated bullets.** Never in body prose. Headings can carry personality; bullets stay text.

## Anti-patterns

Covered by humanizer taxonomy above, plus:

- **Fabricated personal content.** "X taught me that Y is life", "I've always loved Z", "there's something magical about W". The cheesiest AI tell. If the author hasn't written the personal hook, a `<placeholder>` block describes what belongs there — nothing gets invented.
- **Apologetic openings.** "This is a bit of a long one…", "I'm no expert but…". If a disclaimer is needed, it's an aside, not a cold open.
- **Corporate hedging without the tradeoff named.** "It depends" alone is lazy; name what it depends on.

## Calibration passages

Full openings and closings, verbatim. When in doubt, match the shape of one of these.

**Opening — confrontation + stakes (Redux 101):**

> This is the day. You will finally learn how to use Redux once and for all, or get all of the money you've spent to be able to read this post refunded. We'll cover what Redux is, some good practices, useful tools to use alongside it, and how to decide if it is even the right tool for your project.

**Opening — scene + tech reveal (Memento pattern):**

> Memento mori. There are only two guaranteed things in life…

**Opening — kids-I'm-gonna-tell-you (SEO basics):**

> Kids, I'm gonna tell you an incredible story. The story of how I met your website.

**Closing — callback + tradeoff (Memento pattern):**

> Like any design pattern, the Memento Pattern isn't a silver bullet; it's all about trade-offs.

**Closing — callback + sign-off (Command pattern):**

> If you need anything, your wish is my command.

**Closing — dry well-wish (Redux 101):**

> Hopefully, this can help you get started with Redux. I will leave a glossary below with some of the keywords that you can reference to because I know all those fancy terms can get a bit overwhelming when you're first starting out. Good luck on your Redux journey!

**Mid-post aside — deadpan tradeoff:**

> If someone ever told you that disk size doesn't matter, I'm sorry to be the one giving you the bad news… but you've been lied to.

**Mid-post aside — self-aware meta:**

> I apologize in advance because I can't explain it any better than this short page of the Redux docs.

## Dev-log sanity floor

Posts under `content/blog/devlog-*` also answer to `docs/project-ascension/devlog.md §3.3`: first-person singular, past tense for shipped work, no apologies, one joke max, no em-dash-heavy AI prose. A floor for dev logs, not a ceiling for other posts.

## What the skill owns vs what the author owns

**Skill owns:** structure, register, pronoun choice, anti-patterns, humanizer-tell avoidance, opening/closing _shapes_, the tradeoff beat.

**Author owns:** final heading puns, personality-heavy asides, specific pop-culture references, the exact joke that lands in a given section. The skill proposes flat defaults; the author tunes. Trying to guess the author's humor is how posts go off the rails — leave that surface area open.
