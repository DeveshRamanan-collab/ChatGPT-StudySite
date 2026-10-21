/*
SCENE: History II — positivism to the United Nations
LENGTH: not pinned — a draggable Timeline (learner-paced), 8 events
BEATS: terms → drag from 1856 to 1960 → each node names its instrument and year → one check
INTENT: Show positivism producing treaties and institutions, then two world wars producing the League, the PCIJ, the UN
  and decolonisation.
SUBJECT: the handle; events up to it are inked.
CAMERA: none (HTML track). LIGHT: none. SOUND: none.
REDUCED MOTION: off — the handle jumps instead of gliding (base); same controls.
BUDGET: < 5 KB gz. Paired instruments share a node so the 390px track keeps its year labels apart.
Source: concept laws2000-w01-history-nineteenth-century-to-un; authority card kellogg-briand-pact-1928. Years as the card gives them.
*/
import { Timeline } from '../bases/Timeline';

export default function HistoryNineteenthCenturyToUn() {
  return (
    <Timeline
      label="Timeline of international law from positivism in the nineteenth century to decolonisation in 1960"
      terms={[
        { term: 'Positivism', def: 'The only true source of law is state will, so states choose which obligations bind them.' },
        { term: 'League of Nations', def: 'The 1919 body obliging states to submit dangerous disputes to adjudication or inquiry.' },
        { term: 'Self-determination', def: 'A people’s right to decide its own political status, entrenched by the UN Charter.' },
      ]}
      events={[
        { when: '1856', title: 'Declarations of Paris (1856) and St Petersburg (1868)', tag: 'Positivism', body: 'Paris limits capturing private property at sea; St Petersburg bans explosive bullets. State will, not fairness or divine justice, is the source of obligation.' },
        { when: '1865', title: 'International Telegraph Union (1865), Universal Postal Union (1874)', tag: 'Institutions', body: 'Positivism produces formal institutions for cooperation between states.' },
        { when: '1899', title: 'Hague Conferences (1899, 1907)', tag: 'Institutions', body: 'Regulating war and creating the Permanent Court of Arbitration. Colonialism continues: by 1914, 90 per cent of Africa is under European control.' },
        { when: '1919', title: 'League of Nations', tag: 'After the First World War', body: 'Obliges states to submit disputes likely to cause conflict to adjudication or inquiry — but does not itself prohibit war.' },
        { when: '1920', title: 'Permanent Court of International Justice', tag: 'Courts', body: 'Dissolved in 1946 but still cited today: the direct precursor of the International Court of Justice.' },
        { when: '1928', title: 'Kellogg-Briand Pact', tag: 'Renouncing war', body: 'Goes further than the League: states commit to refrain from war as an instrument of national policy.' },
        { when: '1945', title: 'Nuremberg trials (1945–46) and the UN Charter (1946)', tag: 'After the Second World War', body: 'Nuremberg begins international criminal law. The Charter replaces the League, entrenching sovereign equality, self-determination and a ban on the use of force, and creates the Security Council and General Assembly.' },
        { when: '1960', title: 'Declaration on decolonisation', tag: 'General Assembly', body: 'Affirms self-determination; more than 80 former colonies have since gained independence.' },
      ]}
      check={{
        question: 'Which instrument first committed states to refrain from war as an instrument of national policy?',
        options: [
          { text: 'The Covenant of the League of Nations (1919)', why: 'The League required disputes to go to adjudication or inquiry, but did not itself prohibit war.' },
          { text: 'The Kellogg-Briand Pact (1928)', correct: true, why: 'It went further than the League, committing states to refrain from war as an instrument of national policy.' },
          { text: 'The Hague Conferences (1899, 1907)', why: 'The Hague Conferences regulated war and created the PCA; they did not renounce it.' },
        ],
      }}
    />
  );
}
