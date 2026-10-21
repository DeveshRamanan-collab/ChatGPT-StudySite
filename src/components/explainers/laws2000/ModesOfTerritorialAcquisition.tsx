/*
SCENE: Modes of territorial acquisition — five doors in order, the last bricked up in 1945
LENGTH: 5 loci; pinned 300vh on desktop (scroll walks), paced otherwise
BEATS: 5 (cession → accretion → terra nullius → prescription → conquest, now belligerent occupation)
INTENT: Fix the five modes in order and sort them by whether the land was already sovereign, ending at the door
  the UN Charter closed.
SUBJECT: the amber light standing at the current door.
CAMERA: 35mm-equivalent dolly, yaw ≤ 15°, no cuts. LIGHT: one amber point at the locus. SOUND: none.
REDUCED MOTION: the five loci as a numbered list (no WebGL).
BUDGET: own chunk < 6 KB gz, draw calls < 20, 60 fps at 4× throttle.
Source: concept laws2000-w04-modes-of-territorial-acquisition; UNCLOS art 121(1); UN Charter art 2(4).
*/
import { Palace } from '../bases/Palace';

export default function ModesOfTerritorialAcquisition() {
  return (
    <Palace
      label="Five modes of acquiring territory: cession, accretion, terra nullius, prescription, and conquest (closed since 1945)"
      terms={[
        { term: 'Acquisition of territory', def: 'A state gaining sovereign title over land — continental territory or an island.' },
        { term: 'Terra nullius', def: 'Land never under any state’s sovereignty.' },
        { term: 'Belligerent occupation', def: 'The temporary regime triggered by occupation by force — no transfer of sovereignty.' },
      ]}
      loci={[
        { title: '1 · Cession (land already sovereign)', body: 'Transfer from one state to another, often by purchase treaty (Alaska from Russia, 1867). The acquirer gets no more rights than the ceding state had, and must respect third states’ and indigenous rights.' },
        { title: '2 · Accretion (new land)', body: 'New land formed gradually by nature (a 1986 volcanic island in Japan’s territorial sea). An island is “a naturally formed area of land, surrounded by water, which is above water at high tide” (UNCLOS art 121(1)); artificial islands and low-tide elevations cannot ground sovereignty (South China Sea arbitration, 2016).' },
        { title: '3 · Occupation of terra nullius (never sovereign)', body: 'Effective control plus intention to claim title over land never under any state’s sovereignty. Barely applicable now, but central to colonial expansion.' },
        { title: '4 · Prescription (another state’s land)', body: 'Title through peaceful control, acting as sovereign, on implied consent — sustained protest prevents it.' },
        { title: '5 · Conquest — bricked up in 1945', body: 'Prohibited since the UN Charter (art 2(4)). Occupation by force now triggers belligerent occupation: temporary, without transfer of sovereignty (Kuwait 1990, Crimea 2014).' },
      ]}
      check={{
        question: 'State A has peacefully administered a strip of State B’s land for decades, acting as sovereign. B has protested every year. Has A gained title?',
        options: [
          { text: 'Yes — by prescription, after long peaceful control', why: 'Prescription rests on implied consent; sustained protest prevents it.' },
          { text: 'No — B’s sustained protest prevents prescription', correct: true, why: 'Prescription needs peaceful control on implied consent, and B’s protest denies that consent.' },
          { text: 'Yes — by occupation of terra nullius', why: 'The land was B’s, so it was never terra nullius.' },
        ],
      }}
    />
  );
}
