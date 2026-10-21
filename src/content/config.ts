// Content collections for StudySite. Every schema is strict: unknown fields fail the build.
// Ids are the file basename (e.g. laws2400-w01, laws2400-duty-of-care), so seed/ subfolders never leak into ids.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const basename = ({ entry }: { entry: string }) =>
  entry.split('/').pop()!.replace(/\.(md|mdx)$/, '');

const loader = (dir: string) =>
  glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}`, generateId: basename });

// Stamped on every generated file (CLAUDE.md rule 14).
const common = {
  seed: z.boolean().default(false),
  'source-hash': z.string().min(1),
  'generator-version': z.string().min(1),
  'generated-at': z.union([z.string().min(1), z.date()]),
  locked: z.boolean().default(false),
  verify: z.boolean().default(false),
};

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are lowercase kebab-case');

const units = defineCollection({
  loader: loader('units'),
  schema: z
    .object({
      ...common,
      code: z.string().regex(/^[A-Z]{4}\d{4}$/),
      name: z.string(),
      /** Sydney calendar day of the exam. Generated with everything below from raw/<unit>/unit.yaml by
       *  scripts/units.mjs — the single source for exam details; never edit these by hand. */
      'exam-date': z.coerce.date(),
      'answer-style': z.enum(['problem', 'essay']),
      'weeks-expected': z.number().int().positive(),
      /** Exam start instant (ISO with offset; Sydney local time). Units sort by this everywhere. */
      'exam-start': z.coerce.date(),
      /** Total minutes on the timetable, and its parts where the timetable states them. */
      'exam-duration': z.number().int().positive(),
      'exam-reading': z.number().int().nonnegative().optional(),
      'exam-working': z.number().int().positive().optional(),
      'exam-technical': z.number().int().nonnegative().optional(),
      'exam-mode': z.string(),
      'exam-venue': z.string().optional(),
      'exam-notes': z.string().optional(),
      'exam-status': z.enum(['draft', 'final']),
      'exam-source': z.string().optional(),
    })
    .strict(),
});

const weeks = defineCollection({
  loader: loader('weeks'),
  schema: z
    .object({
      ...common,
      unit: id,
      number: z.number().int().positive(),
      topic: z.string(),
      summary: z.string(),
      concepts: z.array(id).default([]),
      pretest: z.array(id).default([]),
      /** Thin week: sources are incomplete (e.g. a flowchart only). Questions stop where the sources stop; the
       *  ≥ 20-per-concept target becomes a reported shortfall, and the week page says so. */
      thin: z.boolean().default(false),
      'thin-reason': z.string().optional(),
      /** One or two plain sentences on what this week was built from (e.g. "Built from the slides and tutorial tasks;
       *  no lecture transcript was available."), shown on the week page. */
      'source-note': z.string().optional(),
    })
    .strict(),
});

const concepts = defineCollection({
  loader: loader('concepts'),
  schema: z
    .object({
      ...common,
      unit: id,
      week: id,
      title: z.string(),
      visual: z.enum(['explainer', 'simulation', 'diagram', 'timeline', 'palace']),
      'visual-brief': z.string(),
      related: z.array(id).default([]),
      // Knowledge-map edges: prerequisites, and concepts commonly confused with this one.
      'depends-on': z.array(id).default([]),
      'contrasts-with': z.array(id).default([]),
      cases: z.array(id).default([]),
      authorities: z.array(id).default([]),
    })
    .strict(),
});

const cases = defineCollection({
  loader: loader('cases'),
  schema: z
    .object({
      ...common,
      name: z.string(),
      /** Week id that created this shared card; only that week's spec may rewrite it. */
      origin: z.string().optional(),
      citation: z.string(),
      aglc: z.string(),
      units: z.array(id).default([]),
      facts: z.string(),
      issue: z.string(),
      held: z.string(),
      ratio: z.string(),
      significance: z.string(),
      // "Why it matters here": what this case is used for in this unit's answers.
      'why-here': z.string().optional(),
    })
    .strict(),
});

const authorities = defineCollection({
  loader: loader('authorities'),
  schema: z
    .object({
      ...common,
      title: z.string(),
      origin: z.string().optional(),
      kind: z.enum(['statute', 'treaty', 'principle', 'article', 'other']),
      units: z.array(id).default([]),
      text: z.string(),
      gloss: z.string(),
      cases: z.array(id).default([]),
    })
    .strict(),
});

// ---- Questions: discriminated union on `type` ----
const qBase = {
  ...common,
  concept: id,
  week: id.optional(),
  difficulty: z.number().int().min(1).max(4).default(2),
  'variant-of': id.optional(),
  /** Membership of a special set: the week's pretest, its quick-fire true/false burst, or the unit-wide revision set
   *  (e.g. the tutor's end-of-semester revision quiz, kept in the unit's pq spec and linked to each week's concept). */
  set: z.enum(['pretest', 'quickfire', 'revision']).optional(),
  tags: z.array(z.string()).default([]),
  /** Cases the question turns on (palette `case:` filter, case-card backlinks). */
  cases: z.array(id).default([]),
  /** For discriminating questions: the concept(s) this one is commonly confused with. */
  'contrasts-with': z.array(id).default([]),
};

const option = z
  .object({ text: z.string(), correct: z.boolean().default(false), why: z.string().min(1) })
  .strict();

const rubricRow = z
  .object({
    id: z.string(),
    criterion: z.string(),
    marks: z.number().positive(),
    'top-band': z.string(),
    'margin-note': z.string(),
    authorities: z.array(id).default([]),
  })
  .strict();

const mcq = z
  .object({
    ...qBase,
    type: z.literal('mcq'),
    stem: z.string(),
    options: z
      .array(option)
      .min(2)
      .refine((o) => o.filter((x) => x.correct).length === 1, 'exactly one option must be correct'),
  })
  .strict();

const short = z
  .object({
    ...qBase,
    type: z.literal('short'),
    prompt: z.string(),
    model: z.string(),
    rubric: z.array(rubricRow).min(1),
  })
  .strict();

const long = z
  .object({
    ...qBase,
    type: z.literal('long'),
    tier: z.enum(['worked', 'faded', 'full']),
    template: z.enum(['ilac', 'essay']),
    prompt: z.string(),
    timer: z.number().int().positive().default(40),
    rubric: z.array(rubricRow).min(1),
    model: z.string(),
    given: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
    steps: z.array(z.string()).default([]),
  })
  .strict();

const truefalse = z
  .object({
    ...qBase,
    type: z.literal('truefalse'),
    statement: z.string(),
    answer: z.boolean(),
    why: z.string().min(1),
  })
  .strict();

const match = z
  .object({
    ...qBase,
    type: z.literal('match'),
    prompt: z.string(),
    pairs: z.array(z.object({ left: z.string(), right: z.string() }).strict()).min(2),
  })
  .strict();

const questions = defineCollection({
  loader: loader('questions'),
  schema: z.discriminatedUnion('type', [mcq, short, long, truefalse, match]),
});

// ---- Cards: discriminated union on `type` ----
const cBase = { ...common, concept: id, week: id.optional(), source: z.string().optional() };

const cards = defineCollection({
  loader: loader('cards'),
  schema: z.discriminatedUnion('type', [
    z.object({ ...cBase, type: z.literal('basic'), front: z.string(), back: z.string() }).strict(),
    z
      .object({ ...cBase, type: z.literal('cloze'), text: z.string().regex(/\{\{c\d+::/, 'cloze needs {{c1::…}}') })
      .strict(),
    z
      .object({
        ...cBase,
        type: z.literal('occlusion'),
        image: z.string(),
        masks: z
          .array(z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number(), label: z.string() }).strict())
          .min(1),
      })
      .strict(),
    z
      .object({ ...cBase, type: z.literal('apply'), scenario: z.string(), answer: z.string() })
      .strict(),
  ]),
});

const audio = defineCollection({
  loader: loader('audio'),
  schema: z
    .object({
      ...common,
      unit: id,
      week: id,
      title: z.string(),
      minutes: z.number().positive().optional(),
    })
    .strict(),
});

// ---- Study aids (200-features pass, Oct 2026): one file per concept, generated from content-src/aids/<unit>-wNN.yaml
// by scripts/emit-aids.mjs. Every field is optional apart from `plain`: a source that does not support a field
// leaves it empty (never invented; partly supported → verify: true).
const s = z.string().min(1);
const refs = { cases: z.array(id).default([]), authorities: z.array(id).default([]) };

const aids = defineCollection({
  loader: loader('aids'),
  schema: z
    .object({
      ...common,
      concept: id,
      unit: id,
      week: id,
      /** The simplest true statement of the idea (progressive explanation, level 1). */
      plain: s,
      /** A concrete instance: facts from a case or the lecture's own example (abstraction ladder, bottom rung). */
      concrete: s.optional(),
      /** The formal rule or principle as the sources state it (abstraction ladder, top rung). */
      formal: s.optional(),
      /** A mapped analogy: which part corresponds to which, and where it stops being accurate. */
      analogy: z
        .object({
          text: s,
          maps: z.array(z.object({ from: s, to: s }).strict()).min(1),
          limits: z.array(s).min(1),
        })
        .strict()
        .optional(),
      terms: z.array(z.object({ term: s, gloss: s, example: s.optional() }).strict()).default([]),
      misconceptions: z.array(z.object({ claim: s, tempting: s, correction: s }).strict()).default([]),
      /** Socratic ladder: each step a question, a hint if stuck, and the answer it leads to. */
      socratic: z.array(z.object({ ask: s, hint: s, answer: s }).strict()).default([]),
      /** Requirements of a rule or test, in the order an answer takes them (visual checklist, element boards). */
      elements: z.array(z.object({ name: s, test: s, ...refs }).strict()).default([]),
      /** Change one material fact; what happens to the analysis. */
      'what-if': z.array(z.object({ change: s, effect: s }).strict()).default([]),
      /** Boundary cases and counterexamples that test the edge of the idea. */
      boundary: z.array(z.object({ text: s, why: s }).strict()).default([]),
      /** An unfamiliar scenario where the same idea applies. */
      transfer: z.array(z.object({ scenario: s, answer: s }).strict()).default([]),
      /** Essay units: a position, its evidence, its strongest objection, and the reply if the sources give one. */
      objections: z.array(z.object({ position: s, evidence: s, objection: s, reply: s.optional() }).strict()).default([]),
      /** Storyboard: the idea told as a sequence of events (each frame a caption and the detail behind it). */
      storyboard: z.array(z.object({ caption: s, detail: s }).strict()).default([]),
      /** Where this came from: raw file names with slide/page where known. */
      sources: z.array(s).default([]),
    })
    .strict(),
});

// Decision flows: a doctrine as a walkable tree (ask → branches; step → next; end → outcome).
const flowNode = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(['ask', 'step', 'end']),
    text: s,
    /** Explanation shown when the node is opened in place. */
    note: s.optional(),
    concept: id.optional(),
    ...refs,
    branches: z.array(z.object({ label: s, to: z.string() }).strict()).default([]),
    next: z.string().optional(),
    /** For end nodes: whether the claim / requirement is made out. */
    tone: z.enum(['met', 'not-met', 'qualified']).optional(),
    /** Marks a node that is an exception or qualification to the general rule. */
    exception: z.boolean().default(false),
  })
  .strict();

const flows = defineCollection({
  loader: loader('flows'),
  schema: z
    .object({
      ...common,
      unit: id,
      week: id,
      title: s,
      summary: s,
      start: z.string(),
      concepts: z.array(id).default([]),
      nodes: z.array(flowNode).min(2),
      sources: z.array(s).default([]),
    })
    .strict(),
});

// Problem-question fact annotations: every fact is a verbatim excerpt of the question's prompt.
const facts = defineCollection({
  loader: loader('facts'),
  schema: z
    .object({
      ...common,
      question: id,
      unit: id,
      parties: z.array(z.object({ name: s, role: s }).strict()).default([]),
      issues: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: s, concept: id.optional() }).strict()).min(1),
      facts: z
        .array(
          z
            .object({
              text: s,
              weight: z.enum(['essential', 'background']),
              kind: z.enum(['party', 'conduct', 'mental', 'harm', 'relationship', 'timing', 'statement', 'context']),
              issues: z.array(z.string()).default([]),
              why: s.optional(),
            })
            .strict(),
        )
        .min(3),
    })
    .strict(),
});

// ---- Dossiers (exam build, Oct 2026): the full record of one case or one legal provision, generated from
// content-src/dossiers/{cases,provisions}/<ref>.yaml by scripts/emit-dossiers.mjs. One file per case/provision, id
// `case--<ref>` or `prov--<ref>`, where <ref> is the id in the cases/authorities collection. Brief:
// docs/plans/2026-10-dossier-brief.md. Every examinable item carries two independent explanations (plain + formal),
// so `plain`, `key-facts` (cases) and `elements` (provisions) are required.
const examUse = z
  .object({
    /** When an answer reaches for this authority (the trigger in a fact pattern). */
    when: s,
    /** One model sentence, cited exactly as the unit's referencing rules require. */
    sentence: s,
    pitfalls: z.array(s).default([]),
  })
  .strict();
const dossierBase = {
  ...common,
  ref: id,
  units: z.array(id).min(1),
  /** Weeks whose materials teach it (the build adds the weeks of every concept that cites it). */
  weeks: z.array(id).default([]),
  /** Topic slugs from content-src/dossiers/vocab.yaml (per unit). */
  topics: z.array(id).default([]),
  /** Examinable lists it appears on (vocab.yaml `lists`), e.g. laws2400-examinable. */
  lists: z.array(id).default([]),
  /** ≤ 30 words: what it decided or says, as the collapsed row shows it. */
  'one-liner': s,
  /** Plain-language explanation a 12-year-old could follow (the first of the two explanations). */
  plain: s,
  analogy: s.optional(),
  'exam-use': examUse.optional(),
  'what-if': z.array(z.object({ change: s, effect: s }).strict()).default([]),
  /** Everything a student could be caught out by: qualifications, exceptions, later limits. */
  limits: z.array(s).default([]),
  sources: z.array(s).min(1),
  'verify-notes': s.optional(),
};
const dossiers = defineCollection({
  loader: loader('dossiers'),
  schema: z.discriminatedUnion('kind', [
    z
      .object({
        ...dossierBase,
        kind: z.literal('case'),
        court: z.string().regex(/^[A-Za-z]+$/),
        year: z.number().int().min(1600).max(2100),
        judges: s.optional(),
        /** Every material fact, one sentence each, in the order they happened. Nothing left out. */
        'key-facts': z.array(s).min(1),
        parties: z.array(z.object({ name: s, role: s }).strict()).default([]),
        /** 3–7 beats for the Case Theatre: what happened, what was argued, what the court did. */
        timeline: z.array(z.object({ label: s, text: s }).strict()).default([]),
        issues: z.array(s).min(1),
        /** The court's reasoning, step by step (the formal explanation). */
        reasoning: z.array(s).min(1),
        /** Who won, by what majority, and what orders. */
        outcome: s,
        ratio: s,
        obiter: s.optional(),
        /** Dissents or separate judgments worth knowing. */
        dissent: s.optional(),
        contrasts: z.array(z.object({ case: id, point: s }).strict()).default([]),
        statutes: z.array(id).default([]),
        quotes: z.array(z.object({ who: s, text: s, source: s }).strict()).default([]),
      })
      .strict(),
    z
      .object({
        ...dossierBase,
        kind: z.literal('provision'),
        instrument: s,
        /** The abbreviation the referencing rules allow after the first full citation (CLA, UN Charter, VCLT). */
        short: s,
        /** Where it sits: Part, Division (statutes) or Part/Chapter (treaties). */
        part: s.optional(),
        /** Section / article label exactly as cited after "s" or "art": 5B, 2(4), 38(1). */
        section: s,
        heading: s,
        /** Verbatim text. Checked against the raw materials when a raw source is listed. */
        text: s,
        /** The requirements in the order an answer applies them (Statute Lab toggles). */
        elements: z
          .array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), label: s, test: s, plain: s, cases: z.array(id).default([]) }).strict())
          .min(1),
        /** How the elements combine: all must be met, any one is enough, or a written rule. */
        logic: z.enum(['all', 'any', 'custom']).default('all'),
        'logic-note': s.optional(),
        outcome: z.object({ met: s, failed: s }).strict(),
        /** Considerations weighed rather than ticked (e.g. s 5B(2) CLA). */
        factors: z.array(z.object({ label: s, plain: s }).strict()).default([]),
        exceptions: z.array(s).default([]),
        cases: z.array(id).default([]),
        related: z.array(id).default([]),
        examples: z.array(z.object({ facts: s, analysis: s }).strict()).default([]),
      })
      .strict(),
  ]),
});

export const collections = { units, weeks, concepts, cases, authorities, questions, cards, audio, aids, flows, facts, dossiers };
