/*
SCENE: Innovation at Disney — the path of innovation at the Mouse House, and Iger's bets
LENGTH: 9 events, learner-dragged (Timeline base)
INTENT: Place Iger's CEO-as-CTO bets (2005–2014) at the end of Disney's long line of technology firsts, so the
  reading's lesson — media CEOs must think like CTOs, bet early, and learn from bets that fail — has a history.
SUBJECT: the handle; each event's detail beneath the track, tagged "Disney history" or "Iger's bets".
EVENTS: 1928 Steamboat Willie → 1963 Tiki Room → 1995 Toy Story → 2005 iTunes → 2006 Pixar → 2009 Marvel →
  2012 Lucasfilm → 2013 MagicBands → 2014 interactive division's first profit.
REDUCED MOTION: same controls, no glide.
BUDGET: < 5 KB gz, no WebGL. Dates only where the reading gives them; nine events so year labels do not collide at
  phone width.
Source: concept mgmt2094-w01-innovation-at-disney; Lev-Ram (2015), Empire of Tech ('The Path of Innovation at the
  Mouse House' timeline and text).
*/
import { Timeline } from '../bases/Timeline';

export default function InnovationAtDisney() {
  return (
    <Timeline
      label="Disney's path of innovation and Bob Iger's bets, 1928 to 2014"
      terms={[
        { term: 'CTO', def: 'Chief technology officer: the extra hat the reading says Iger wore as CEO.' },
        { term: 'Imagineering', def: "Created by Walt Disney as the company's innovative arm; home of 'blue sky' experimentation." },
        { term: 'MagicBands', def: 'RFID wristbands for park entry, hotel rooms and payment at Walt Disney World.' },
        { term: 'CTO council', def: 'The CTOs of each Disney business, meeting every few months to share challenges and ideas.' },
      ]}
      events={[
        { when: '1928', tag: 'Disney history', title: 'Steamboat Willie', body: 'Disney pioneers "fully synchronized" sound cartoons. The reading treats technology firsts like this as part of Disney\'s ethos long before Iger.' },
        { when: '1963', tag: 'Disney history', title: 'The Enchanted Tiki Room', body: "Disneyland introduces audio animatronics (electromechanical robots). The reading counts this early use of lifelike robots as part of Disney's long 'blue sky' ethos." },
        { when: '1995', tag: 'Disney history', title: 'Toy Story', body: 'Pixar releases the first feature-length computer-animated film. Disney had partnered with Pixar, but under Eisner the relationship frayed.' },
        { when: '2005', tag: "Iger's bets", title: 'ABC shows on iTunes', body: "Within days of becoming CEO, Iger and Steve Jobs agree to put Lost and Desperate Housewives on iTunes: the first deal of its kind, seemingly at odds with Disney's business model." },
        { when: '2006', tag: "Iger's bets", title: 'Pixar bought for $7.4 billion', body: "The iTunes deal improves the dialogue with Jobs; Disney buys Pixar, and Catmull and Lasseter take over Disney's animation. ABC also offers free, ad-supported episodes online." },
        { when: '2009', tag: "Iger's bets", title: 'Marvel bought for $4.3 billion', body: 'Two of the five biggest movies of 2014 were Marvel films. The brands are encouraged to "beg, borrow, and steal" technologies from each other.' },
        { when: '2012', tag: "Iger's bets", title: 'Lucasfilm bought for $4 billion', body: "With it come Industrial Light & Magic and several hundred technical minds. ILM's president says the true upside is to corporate culture: 'Synergy' actually means something." },
        { when: '2013', tag: "Iger's bets", title: 'MagicBands debut at Disney World', body: 'RFID wristbands for entry, hotel rooms and payment: more than 9 million given out, and guests who use them spend more. A gradual, iterative roll-out: over 28,000 door locks changed.' },
        { when: '2014', tag: "Iger's bets", title: 'The interactive division turns a profit', body: 'After five years in the red and more than $1 billion lost, it earns $116 million. Iger: "We lost a fair amount of money in the process, but we learned from that."' },
      ]}
      check={{
        question: 'What lesson does the reading draw from Iger’s decade at Disney?',
        options: [
          { text: 'Media companies should leave technology to partners like Apple', why: 'The reading says the opposite: Disney builds technology, and its CEO acts as the CTO.' },
          { text: 'Media companies must think like tech companies, and their CEOs like CTOs', correct: true, why: "The reading: not only do today's media companies need to start thinking like technology companies, their CEOs need to think like CTOs." },
          { text: 'One corporate CTO should control every technology decision', why: 'Iger deliberately had no single corporate CTO; each business got its own, to experiment and fail without a watchdog.' },
        ],
      }}
    />
  );
}
