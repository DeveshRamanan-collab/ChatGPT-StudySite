# Provision-details verification audit

Checked 20 October 2026. Scope: only `src/data/rebuild/provision-details.json` and this audit. No source-repository write or deployment was performed.

## Result and meaning of the status

- **45/45 original examinable legislation entries are present**, in original order, with unique list IDs and references; `sourceLine` matches each original law-list line exactly.
- **45/45 contain complete operative text within the listed scope**: 42 Civil Liability Act entries, one 1946 Act entry and two 1965 Act entries. There are no remaining summary-only placeholders.
- **45/45 have two distinct explanations**: a plain-language account and an expressly labelled illustrative hypothetical. Conditions, exceptions, limitations, exam use and pitfalls remain separate from the statute.
- **42 CLA entries were checked against the supplied official course PDF**, current from 30 July 2026 and accessed 7 September 2026 at 09:31. Forty-one entries list an entire section. The s 3B entry lists only (1)(a), (b), (f)–(g) and (2)(a), with the necessary chapeaux and all internal carve-backs. It does not reproduce or tag the unlisted paragraphs as examinable.
- **Three Law Reform entries were completed from indexed official NSW statute PDFs**, with the version checks described below. `primary-verified` describes the primary-source text check. It must not be presented as a guarantee of direct retrieval of the latest whole Act or of any later amendment.
- **One limited currency qualification remains**: the current whole 1946 Act returned HTTP 403. The supplied full s 5 wording comes from the official 2017 compilation; continuity into the 28 March 2026 version is an explicit amendment-history inference, not a successful current full-text download. There is no remaining missing-text gap.

## Corrections made

1. Repaired s 3B(1)(b), which had been incorrectly cut at `section 18(1)`. The original extraction used an unanchored search for `(c)`, which matched the internal reference `18(1)(c)` instead of the start of paragraph (c). Line-anchored paragraph selection now retains the complete ending `18(1)(c)),` and the full specified exception. A regression assertion checks that ending before the following selected paragraph (f).
2. Removed the wrapped heading continuation `powers` from the beginning of s 43A. It belongs to the section heading, not the operative text.
3. Retained the explanatory notes for s 3B(1)(f), s 54 and 1946 s 5 as `sourceNotes`, separate from operative `text`. The UI should label these **Explanatory note (not part of Act)**. The Act text remains distinct from teaching explanations and hypotheticals.
4. Expanded the s 5M explanation to spell out both incapable-person warning routes, the recipient qualifications, the definitions, and the balance-of-probabilities requirement for the safety-law exception.
5. Tightened ss 50 and 54 to refer to the person whose death, injury or damage is at issue, rather than assuming that person is always the claimant. Retained the s 50 counterfactual, minimum reduction, rebuttal and non-self-induced exception; retained all five s 54 subsections and its separately identified note.
6. Enumerated the complete s 30 family categories; confined the s 34 personal-injury exclusion to its actual paragraph; replaced the inaccurate summary word “disappearance” with cessation of existence; restored “erection” to the road-work summary in s 45. The full operative texts were already present for those sections.
7. Replaced the three Law Reform placeholders with complete primary-source wording. This includes 1946 s 5(1)–(5), including (3A), all indemnity, judgment, costs, definition, Crown and temporal qualifications; all five 1965 s 8 definitions, including both limbs of “wrong”; and all three s 9 subsections, including the contractual-defence saving and contractual/statutory liability maximum.

## Source and currency evidence

### Civil Liability Act 2002

Source: `raw/laws2400-torts/unit-wide/act-2002-022.pdf`, 98 printed pages, version from 30 July 2026. The text extraction used for independent comparison was `/workspace/scratch/04f44a06c1c9/cla-course.txt`.

The audit independently located the body after the long title, separated section headings from contents entries, extracted complete section boundaries, removed repeated page furniture, and checked every non-s 3B entry against those boundaries. Before the fixes, all 41 full-section entries matched that extraction; the independent semantic pass additionally detected the s 43A wrapped heading. The final comparison accounts expressly for the removed heading and separately held s 54 note. A second PDF engine (PyMuPDF, independent of the layout extraction) then checked all 237 operative paragraph blocks and both CLA notes against the actual supplied PDF: zero mismatches. Paragraph-scoped s 3B was re-extracted using line-anchored paragraph starts so inline cross-references cannot terminate a paragraph.

This verifies the supplied course version. It does not silently substitute later law for that version.

### Law Reform (Miscellaneous Provisions) Act 1965, ss 8–9

Primary wording retrieved through the official indexed PDF content:

- [Official PDF, page 5](https://legislation.nsw.gov.au/view/whole/pdf/inforce/2025-11-26/act-1965-032): version from 6 December 2002, accessed 26 November 2025 at 23:46; s 8 opening and definitions through “damage”.
- [Official PDF, page 6](https://legislation.nsw.gov.au/view/whole/pdf/inforce/2025-11-30/act-1965-032): same version, accessed 12 December 2025 at 17:22; remaining “wrong” definition and complete s 9(1)–(3).
- [Official version metadata](https://legislation.nsw.gov.au/view/html/2002-12-06/act-1965-032): current version remains from 6 December 2002, accessed 3 October 2026 at 17:00.

Direct whole-Act HTML, XML and PDF requests returned HTTP 403. Indexed official primary content supplied the complete provisions, rather than a third-party or AI summary. The 2000 passed-both-Houses amendment was consulted as corroboration, not used as a substitute for the later compilation.

### Law Reform (Miscellaneous Provisions) Act 1946, s 5

- [Official PDF, page 5](https://legislation.nsw.gov.au/view/whole/pdf/inforce/2025-10-01/act-1946-033): version from 1 June 2017, accessed 2 October 2025 at 01:09; s 5(1), (2), (3)(a) and opening of (3)(b).
- [Official PDF, page 6](https://legislation.nsw.gov.au/view/whole/pdf/inforce/2025-10-04/act-1946-033): same version, accessed 4 October 2025 at 19:10; remainder of (3), its note, (3A), (4) and (5).
- [Official current metadata](https://legislation.nsw.gov.au/view/whole/html/inforce/2026-03-28/act-1946-033): current version from 28 March 2026, accessed 25 September 2026 at 17:00.
- [Official amendment history](https://legislation.nsw.gov.au/view/xml/2002-11-01/act-1946-033/lh): the only version after 1 June 2017 is 28 March 2026, incorporating 2025 No 61; Schedule 2.59 commenced on that date.
- [Official passed-both-Houses text, page 34](https://legislation.nsw.gov.au/view/pdf/bill/3b7e327b-acc3-4c38-8e2a-f7292308733c): Schedule 2.59 replaces “Magistrate” in s 2(2) with “Judge of the Local Court”. It does not change s 5.

Inference: s 5 continues unchanged into the 28 March 2026 version. This is recorded in `sourceVersion`, `currencyVerification`, `verificationNote` and the limitations array. A malformed older “whole/whole” HTML route was rejected as a current source because it retained the pre-2010 spouse definition and unrepealed s 6. The actual 2017 PDF wording, including the de facto partner definition, was used instead.

## Validation

Passed checks:

- Exactly 45 entries and 45 law-list lines, in identical order, with 45 unique IDs and 45 unique references.
- Every entry has complete text, source/version/scope metadata, nonempty and distinct plain/concrete explanations, and structured conditions/limitations.
- No `Page … of …` furniture, `Current version for …` furniture, or summary-only placeholder occurs in operative text.
- s 3B selected top-level alphabetic paragraph sequence is exactly `(a), (b), (f), (g), (a)` across its two subsection chapeaux; every carve-back and the repaired inline cross-reference remains.
- Independent PyMuPDF comparison: 237/237 operative paragraph blocks and 2/2 CLA explanatory notes matched the actual source PDF; all 41 entire-section boundary comparisons passed after the two explicit heading/note adjustments.
- The full s 5M(1)–(12), 1946 s 5(1), (2), (3), (3A), (4), (5), all 1965 s 8 definitions and s 9(1)–(3) are present.
- All 45 texts have SHA-256 fingerprints for future regression comparisons. These fingerprints detect changes; they do not by themselves establish legal accuracy.

Total operative text: **40,308 characters**. Three entries retain separately identified explanatory notes. Source page ranges below may include the page containing the next section heading; they locate the relevant supplied extract.

## Entry coverage and fingerprints

| List ID | Provision | Text scope | Source pages | Text SHA-256 prefix |
| --- | --- | --- | --- | --- |
| 01 | CLA 2002 s 3B | Listed paragraphs only | 11–13 | `95c1044e25d88158` |
| 02 | CLA 2002 s 3C | Entire section | 13 | `ebc6240a02c899b0` |
| 03 | CLA 2002 s 5 | Entire section | 14 | `8d2e4ed91a8df8ce` |
| 04 | CLA 2002 s 5A | Entire section | 14 | `157546ef36c7ced0` |
| 05 | CLA 2002 s 5B | Entire section | 14–15 | `21bee65e889a65a7` |
| 06 | CLA 2002 s 5C | Entire section | 15 | `c6febfc6629189ca` |
| 07 | CLA 2002 s 5D | Entire section | 15–16 | `97ffef590d74b6e1` |
| 08 | CLA 2002 s 5E | Entire section | 16 | `c1243faa9a38d895` |
| 09 | CLA 2002 s 5F | Entire section | 16 | `2eebb71d2272eb60` |
| 10 | CLA 2002 s 5G | Entire section | 16 | `a1e0b37842abc964` |
| 11 | CLA 2002 s 5H | Entire section | 16–17 | `31d25fb0e34d761d` |
| 12 | CLA 2002 s 5I | Entire section | 17 | `43b42798028724fd` |
| 13 | CLA 2002 s 5K | Entire section | 17 | `91a10b0ac2d2d160` |
| 14 | CLA 2002 s 5L | Entire section | 17–18 | `9e7058d4cf5bb3f7` |
| 15 | CLA 2002 s 5M | Entire section | 18–19 | `57c55aea01fe63cb` |
| 16 | CLA 2002 s 5O | Entire section | 20 | `db60901372787bd5` |
| 17 | CLA 2002 s 5P | Entire section | 20 | `2527c9893953aa50` |
| 18 | CLA 2002 s 5Q | Entire section | 20 | `180550da444fc690` |
| 19 | CLA 2002 s 5R | Entire section | 20–21 | `5d8fb506aa0b5afd` |
| 20 | CLA 2002 s 5S | Entire section | 21 | `4799bdc9066db543` |
| 21 | CLA 2002 s 6G | Entire section | 24 | `b63cfdda34665b45` |
| 22 | CLA 2002 s 6H | Entire section | 24–25 | `897de3cf70b6e8dc` |
| 23 | CLA 2002 s 27 | Entire section | 62–63 | `2a4ab6ad53c73212` |
| 24 | CLA 2002 s 29 | Entire section | 63 | `aa4f9892e92a4c25` |
| 25 | CLA 2002 s 30 | Entire section | 63–64 | `efa8787b113de090` |
| 26 | CLA 2002 s 31 | Entire section | 64 | `cb0f81c6dd15ef80` |
| 27 | CLA 2002 s 32 | Entire section | 64–65 | `e1ec5e189e78b470` |
| 28 | CLA 2002 s 34 | Entire section | 65–66 | `27931c49b1f585d8` |
| 29 | CLA 2002 s 35 | Entire section | 66–67 | `9ccdf63b6febead0` |
| 30 | CLA 2002 s 41 | Entire section | 68–69 | `c6e175eb5541f3a2` |
| 31 | CLA 2002 s 42 | Entire section | 69 | `66eb82fb823d374b` |
| 32 | CLA 2002 s 43 | Entire section | 69–70 | `75448d58cc46fbe1` |
| 33 | CLA 2002 s 43A | Entire section | 70 | `526a1b6ab96eb6a6` |
| 34 | CLA 2002 s 44 | Entire section | 70 | `762e82a8cfac551c` |
| 35 | CLA 2002 s 45 | Entire section | 70–71 | `62bb10f9ba8de51e` |
| 36 | CLA 2002 s 46 | Entire section | 71 | `c2ccf6c329ad252a` |
| 37 | CLA 2002 s 50 | Entire section | 72 | `56819d4f8d8e80d5` |
| 38 | CLA 2002 s 54 | Entire section | 74 | `00484dabfd21a18d` |
| 39 | CLA 2002 s 55 | Entire section | 78 | `3eb0535cf482fdaf` |
| 40 | CLA 2002 s 56 | Entire section | 78 | `450555bd0cbb9dd6` |
| 41 | CLA 2002 s 57 | Entire section | 78–79 | `b1ade65572a25334` |
| 42 | CLA 2002 s 58 | Entire section | 79 | `0efd379b74c6bc08` |
| 43 | LRMP 1946 s 5 | Entire section | 5–6 | `e478b693b79f218f` |
| 44 | LRMP 1965 s 8 | Entire section | 5–6 | `9c2ca592a9120648` |
| 45 | LRMP 1965 s 9 | Entire section | 6 | `4d82de3f17b96c57` |

Source PDF SHA-256: `a2b917bcb7a02a2e2be8582427f4fd668887a2ad50bddbfb0d748242133c301b`.

Original examinable law-list text SHA-256: `0184cdbfb3b05ffa0d6fec551b3333d0c26f819f3a877e022e4b78b3dd6d2f5b`.

The JSON stores the full hash for each operative text. The audit is bounded to the 45 legislation entries supplied in this course law list; it makes no claim about completeness of legislation outside that list or unseen teaching material.
