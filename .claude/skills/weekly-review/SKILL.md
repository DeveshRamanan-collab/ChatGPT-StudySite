---
name: weekly-review
description: Weekly loop: read the latest progress export, find weak and overconfident concepts, generate targeted question variants and cards, suggest one explainer improvement.
disable-model-invocation: true
---
Read the newest file in exports/ (Dexie JSON export from the dashboard). Report: the 5 concepts with the worst accuracy, the 3 most overconfident wrong answers (sure + wrong), the weeks with the fewest attempts, and a one-line calibration summary (confidence vs accuracy). Then, for each of the 5 weak concepts, generate 10 new MCQ variants targeting the specific misconceptions visible in my wrong answers, plus 3 cards each; suggest one explainer to improve and why. Run npm run validate && npm run gate; commit "content: weekly review <date>".
