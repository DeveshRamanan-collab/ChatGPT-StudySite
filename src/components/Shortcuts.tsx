// "?" cheat-sheet: every keyboard shortcut in one quiet sheet. Opens on ? (outside text fields), from the
// palette (> Keyboard shortcuts) or the footer link. Native <dialog> (focus trap, Esc) via the shared Modal.
import { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';

const GROUPS: { title: string; rows: [string[], string][] }[] = [
  { title: 'Everywhere', rows: [[['⌘/Ctrl', 'K'], 'Command palette'], [['>'], 'Commands (in the palette)'], [['?'], 'This cheat-sheet'], [['M'], 'Menu: every unit, week and tool'], [[']'], 'Show or hide the contents rail'], [['Esc'], 'Close a palette, popover or sheet'], [['Tab'], 'Move between controls']] },
  { title: 'Palette filters', rows: [[['case:'], 'Cases only'], [['week:3'], 'Items from week 3'], [['wrong:'], 'Questions you last got wrong'], [['unit:laws2000'], 'One unit']] },
  { title: 'Questions', rows: [[['S', 'U', 'G'], 'Sure / unsure / guess'], [['1', '–', '4'], 'Choose an option'], [['Enter'], 'Next question'], [['⌘/Ctrl', 'Enter'], 'Submit a written answer'], [['T', 'F'], 'True / false in quick-fire']] },
  { title: 'Explainers and timelines', rows: [[['←', '→'], 'Step back / forward'], [['Home', 'End'], 'First / last event']] },
  { title: 'Decision flows', rows: [[['1', '–', '9'], 'Choose a branch'], [['⌫'], 'Step back']] },
  { title: 'Working the facts', rows: [[['1', '–', '9'], 'Tag an issue'], [['E', 'B'], 'Essential / background'], [['Enter'], 'Next fact']] },
];

export default function Shortcuts() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open]')) return;
      e.preventDefault();
      setOpen(true);
    };
    const onOpen = () => setOpen(true);
    addEventListener('keydown', onKey);
    document.addEventListener('studysite:shortcuts', onOpen);
    return () => { removeEventListener('keydown', onKey); document.removeEventListener('studysite:shortcuts', onOpen); };
  }, []);
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Keyboard shortcuts" actions={<button className="btn btn--secondary btn--sm" type="button" onClick={() => setOpen(false)}>Close</button>}>
      <div className="shortcuts">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h3 className="label">{g.title}</h3>
            <dl>
              {g.rows.map(([keys, what]) => (
                <div key={what}><dt>{keys.map((k, i) => (k === '–' ? <span key={i}>–</span> : <kbd key={i} className="kbd">{k}</kbd>))}</dt><dd>{what}</dd></div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Modal>
  );
}
