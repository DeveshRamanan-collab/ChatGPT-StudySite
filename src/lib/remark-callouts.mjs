// Turns :::rule / :::case / :::statute / :::definition / :::examtip container directives into <aside class="callout callout--kind">.
import { visit } from 'unist-util-visit';

const KINDS = { rule: 'Rule', case: 'Case', statute: 'Statute', definition: 'Definition', examtip: 'Exam tip' };

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective' || !(node.name in KINDS)) return;
      node.data = {
        hName: 'aside',
        hProperties: { className: ['callout', `callout--${node.name}`], 'data-label': KINDS[node.name] },
      };
    });
  };
}
