---
source-hash: 4363fab6326c5536
generator-version: aids-1
generated-at: "2026-10-16T22:37:52.764Z"
locked: false
unit: laws2000
week: laws2000-w07
title: Is this conduct attributable to the state?
summary: Tests the ARSIWA attribution routes in the order an answer takes them — organ, de facto organ, empowered entity, lent organ, instructions or effective control, insurgency, adoption — and shows that ultra vires acts still count.
start: a1
concepts:
  - laws2000-w07-attribution-to-the-state
  - laws2000-w07-effective-control-and-private-conduct
sources:
  - Week 07 - Lecture Slides - State Responsibility (slides 10–21)
  - Week 07 - Lecture Recording (Live) - State Responsibility - Full Transcript (19:00–44:00)
nodes:
  - id: a1
    kind: ask
    text: Is the actor an organ of the state under its internal law — of any branch, at any level?
    note: Legislative, executive, judicial or other; central or territorial — e.g. an Australian state's police, or a municipality.
    authorities:
      - arsiwa-art-4
    branches:
      - label: "Yes"
        to: a6
      - label: "No"
        to: a2
  - id: a2
    kind: ask
    text: Does the actor act in "complete dependence" on the state, merely its instrument?
    note: A de facto organ — an exceptional finding (Genocide case, paras 392–393). Funding or training alone does not make a group one.
    cases:
      - application-of-the-genocide-convention-bosnia-and-herzegovina-v-serbia-and-montenegro
    branches:
      - label: "Yes"
        to: a6
      - label: "No"
        to: a3
  - id: a3
    kind: ask
    text: Is the actor empowered by the state's law to exercise elements of governmental authority?
    note: E.g. privatised prisons, border management, military or police functions delegated to private entities.
    authorities:
      - arsiwa-art-5
    branches:
      - label: "Yes"
        to: a6
      - label: "No"
        to: a4
  - id: a4
    kind: ask
    text: Is it an organ lent by another state, exercising this state's governmental authority?
    note: E.g. a health service section sent to fight a disease outbreak, or another state's police placed under this state's control.
    authorities:
      - arsiwa-art-6
    branches:
      - label: "Yes"
        to: e-attributable
      - label: "No"
        to: a5
  - id: a5
    kind: ask
    text: Did the state give specific instructions for, or have effective control of, the operation in which the conduct occurred?
    note: Financing, training, equipping and choosing targets are not enough (Nicaragua, para 115); overall control was rejected (Genocide case).
    concept: laws2000-w07-effective-control-and-private-conduct
    cases:
      - nicaragua-v-united-states-of-america
      - application-of-the-genocide-convention-bosnia-and-herzegovina-v-serbia-and-montenegro
    authorities:
      - arsiwa-art-8
    branches:
      - label: "Yes"
        to: e-attributable
      - label: "No"
        to: a7
  - id: a6
    kind: ask
    text: Was it acting in that official or governmental capacity when it acted?
    authorities:
      - arsiwa-art-7
    branches:
      - label: Yes, within its authority
        to: e-attributable
      - label: Yes, but exceeding its authority or against instructions
        to: e-ultra-vires
      - label: No — it acted privately
        to: a5
  - id: a7
    kind: ask
    text: Was the conduct by an insurrectional movement that became the new government or established a new state?
    note: A state that acted in good faith is otherwise not accountable for insurgents.
    authorities:
      - arsiwa-art-10
    branches:
      - label: "Yes"
        to: e-attributable
      - label: "No"
        to: a8
  - id: a8
    kind: ask
    text: Has the state since acknowledged and adopted the conduct as its own?
    note: Iran's decree endorsing the students and its support for keeping the hostages (Tehran).
    cases:
      - united-states-diplomatic-and-consular-staff-in-tehran-united-states-of-america-v-iran
    authorities:
      - arsiwa-art-11
    branches:
      - label: "Yes"
        to: e-adopted
      - label: "No"
        to: e-not-attributable
  - id: e-attributable
    kind: end
    tone: met
    text: "Attributable: the conduct is an act of the state. Move on to grounds precluding wrongfulness."
  - id: e-ultra-vires
    kind: end
    tone: met
    exception: true
    text: "Still attributable: ultra vires conduct in that capacity counts (art 7; Velásquez Rodríguez)."
    cases:
      - velasquez-rodriguez-v-honduras
    authorities:
      - arsiwa-art-7
  - id: e-adopted
    kind: end
    tone: met
    text: Attributable by adoption — if and to the extent the state acknowledges and adopts the conduct (art 11).
  - id: e-not-attributable
    kind: end
    tone: not-met
    text: "Not attributable: the state answers only for its own conduct. Ask whether it breached a duty of its own by omission (Tehran; Corfu Channel)."
    cases:
      - corfu-channel-case-united-kingdom-v-albania
verify: false
---
