// Interactive demos for /styleguide: Tabs, Popover, Modal, Toast, TimerArc, Stamp, rings, quiz feedback.
import { useEffect, useState } from 'react';
import { Button, Kbd } from './Button';
import { Modal } from './Modal';
import { Popover } from './Popover';
import { ProgressRing } from './ProgressRing';
import { Stamp } from './Stamp';
import { Tabs } from './Tabs';
import { TimerArc } from './TimerArc';
import { toast } from './Toaster';

export default function ComponentsDemo() {
  const [modal, setModal] = useState(false);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [stampKey, setStampKey] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [running]);

  const options = ['Reasonable foreseeability', 'A contract between the parties', 'Intention to harm'];

  return (
    <div className="demo-stack">
      <section>
        <h3>Tabs</h3>
        <Tabs
          label="Card density"
          tabs={[
            { label: 'Brief', content: <p>Donoghue v Stevenson — neighbour principle.</p> },
            { label: 'Standard', content: <p>Facts, issue, held and ratio in four lines.</p> },
            { label: 'Full', content: <p>The complete case card with significance and applying cases.</p> },
            { label: 'Disabled', content: null, disabled: true },
          ]}
        />
      </section>

      <section>
        <h3>Popover</h3>
        <p>
          The neighbour principle comes from{' '}
          <Popover trigger={<i>Donoghue v Stevenson</i>} triggerClassName="chip chip--case" label="Case summary">
            <p><strong>[1932] AC 562</strong></p>
            <p>A manufacturer owes a duty of care to the ultimate consumer.</p>
          </Popover>
          .
        </p>
      </section>

      <section>
        <h3>Modal and toast</h3>
        <div className="demo-row">
          <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
          <Button variant="ghost" onClick={() => toast({ message: 'Saved. 12 cards due tomorrow.', action: { label: 'Undo', event: 'ss:noop' } })}>Show toast</Button>
        </div>
        <Modal
          open={modal}
          onClose={() => setModal(false)}
          title="End this block?"
          actions={<><Button variant="ghost" onClick={() => setModal(false)}>Keep going</Button><Button variant="primary" onClick={() => setModal(false)}>End block</Button></>}
        >
          <p>You have 4 minutes left. Your progress so far is saved either way.</p>
        </Modal>
      </section>

      <section>
        <h3>Timer arc</h3>
        <div className="demo-row">
          <TimerArc total={25 * 60} remaining={left} />
          <TimerArc total={25 * 60} remaining={25 * 60 * 0.4} size={64} />
          <Button variant="secondary" size="sm" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</Button>
          <Button variant="ghost" size="sm" onClick={() => { setRunning(false); setLeft(25 * 60); }}>Reset</Button>
        </div>
      </section>

      <section>
        <h3>Progress rings</h3>
        <div className="demo-row">
          <ProgressRing value={0} showValue />
          <ProgressRing value={0.35} showValue />
          <ProgressRing value={1} showValue />
          <span className="demo-sep" />
          {[0, 1, 2, 3, 4].map((s) => <ProgressRing key={s} stage={s} partial={s < 4 ? 0.34 : 0} size={40} />)}
        </div>
        <p className="demo-caption">Criterion ring: pretested → learned (3 correct) → relearning (3 spaced sessions) → secured.</p>
      </section>

      <section>
        <h3>Stamp</h3>
        <div className="demo-row">
          <Stamp key={stampKey} big="50" label="cards secured" animate={stampKey > 0} />
          <Button variant="ghost" size="sm" onClick={() => setStampKey((k) => k + 1)}>Replay</Button>
        </div>
      </section>

      <section>
        <h3>Answer feedback</h3>
        <div className="demo-options">
          {options.map((o, i) => (
            <button
              key={o}
              type="button"
              className="option"
              disabled={picked !== null}
              data-state={picked === null ? undefined : i === 0 ? 'correct' : i === picked ? 'incorrect' : undefined}
              onClick={() => setPicked(i)}
            >
              {o}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setPicked(null)}>Reset</Button>
      </section>

      <section>
        <h3>Keyboard</h3>
        <p><Kbd>⌘</Kbd> <Kbd>K</Kbd> opens the palette · <Kbd>?</Kbd> shows shortcuts · <Kbd>Esc</Kbd> closes.</p>
      </section>
    </div>
  );
}
