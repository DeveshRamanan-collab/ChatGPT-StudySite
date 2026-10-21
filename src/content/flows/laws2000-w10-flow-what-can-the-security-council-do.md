---
source-hash: 4b7ee09ab3bfeb7e
generator-version: aids-1
generated-at: "2026-10-16T22:38:01.664Z"
locked: false
unit: laws2000
week: laws2000-w10
title: What can the Security Council do about this situation?
summary: Walks a peace-and-security problem from Chapter VI peaceful settlement through the art 39 determination, art 40 provisional measures and art 41 measures to an art 42 authorisation, with Uniting for Peace if the Council is deadlocked.
start: c1
concepts:
  - laws2000-w10-peaceful-settlement-under-chapter-vi
  - laws2000-w10-article-39-determination-and-provisional-measures
  - laws2000-w10-article-39-findings-in-practice
  - laws2000-w10-non-forcible-measures-under-article-41
  - laws2000-w10-authorisation-of-force-under-article-42
  - laws2000-w10-un-peacekeeping-operations
  - laws2000-w10-general-assembly-and-secretary-general
sources:
  - Week 10 - Lecture Slides - Collective Security and International Organisations (slides 11–28, 33–34, 41)
  - Week 10 - Lecture Transcript (Live) - Collective Security (Part A.1) (Chapter VI to art 41)
  - Week 10 - Tutorial Tasks - Collective Security (Q2)
nodes:
  - id: c1
    kind: step
    text: "Start with Chapter VI: the parties must first seek a peaceful solution, and the Council may call upon them, investigate and recommend."
    note: "Art 33(1) means: negotiation, enquiry, mediation, conciliation, arbitration, judicial settlement, regional agencies. Council: arts 33(2), 34, 36(1); legal disputes generally to the ICJ (art 36(3)). No art 39 finding is needed."
    concept: laws2000-w10-peaceful-settlement-under-chapter-vi
    authorities:
      - un-charter-art-33-1
    next: c2
  - id: c2
    kind: ask
    text: Has the Council determined a threat to the peace, breach of the peace or act of aggression (art 39)?
    note: Argue a threat to the peace — the finding the Council actually uses. Practice covers proliferation, terrorism, internal armed conflict, serious human rights or IHL violations, even Ebola (2014).
    concept: laws2000-w10-article-39-findings-in-practice
    authorities:
      - un-charter-art-39
    branches:
      - label: "Yes"
        to: c4
      - label: "No"
        to: c3
  - id: c3
    kind: ask
    text: Is the Council blocked because the permanent members cannot agree?
    note: Each permanent member holds a veto (art 27(3)).
    branches:
      - label: Yes — a veto blocks it
        to: e-ufp
      - label: "No"
        to: e-ch6
  - id: c4
    kind: step
    text: "Consider provisional measures to stop the situation worsening (art 40): a ceasefire, cessation of hostilities, humanitarian access."
    note: Without prejudice to the parties' rights, claims or position; the Council takes account of non-compliance. In practice often demanded alongside sanctions or force.
    concept: laws2000-w10-article-39-determination-and-provisional-measures
    authorities:
      - un-charter-art-40
    next: c5
  - id: c5
    kind: ask
    text: Does the Council consider that measures not involving force would be adequate?
    note: Art 42 opens only if art 41 measures "would be inadequate or have proved to be inadequate" — they need not have been tried first.
    branches:
      - label: "Yes"
        to: c6
      - label: No — they would be or have proved inadequate
        to: c7
  - id: c6
    kind: step
    text: "Decide art 41 measures: comprehensive or targeted sanctions, cutting communications or diplomatic relations, an ad hoc tribunal, or an ICC referral."
    note: "Targeted measures (commodities, asset freezes, travel bans) answer criticism of comprehensive sanctions' impact on populations. ICC referral: Rome Statute art 13(b), e.g. Darfur 2005."
    concept: laws2000-w10-non-forcible-measures-under-article-41
    authorities:
      - un-charter-art-41
      - rome-statute-art-13-b
    next: e-41
  - id: c7
    kind: ask
    text: Who will carry out the military action?
    note: "There is no standing UN army: art 43 was never implemented."
    concept: laws2000-w10-authorisation-of-force-under-article-42
    authorities:
      - un-charter-art-42
    branches:
      - label: A coalition of member states
        to: e-coalition
      - label: A regional organisation
        to: e-regional
      - label: A UN-run peace operation
        to: e-pko
  - id: e-ufp
    kind: end
    tone: qualified
    exception: true
    text: "Uniting for Peace: the General Assembly may consider the matter at once and recommend collective measures — recommendations only, not binding decisions."
    authorities:
      - unga-resolution-377-v
  - id: e-ch6
    kind: end
    tone: not-met
    text: "Chapter VII is closed: the Council can only call upon, investigate and recommend under Chapter VI."
  - id: e-41
    kind: end
    tone: met
    text: "Art 41 measures decided: binding on all members (art 25). If they prove inadequate, the Council may move to art 42."
    authorities:
      - un-charter-art-25
  - id: e-coalition
    kind: end
    tone: met
    text: Authorise member states, expressly, to use "all necessary means" for a stated purpose (e.g. Res 678, Kuwait 1990).
    authorities:
      - unsc-resolution-678
  - id: e-regional
    kind: end
    tone: met
    text: Authorise a regional organisation to enforce the Council's decisions (art 53, Chapter VIII), e.g. NATO in Libya, ECOWAS in Liberia.
  - id: e-pko
    kind: end
    tone: qualified
    text: "A UN peace operation: traditionally consent, impartiality and force only in self-defence; some mandates authorise force to carry them out (DRC, Mali)."
    concept: laws2000-w10-un-peacekeeping-operations
verify: false
---
