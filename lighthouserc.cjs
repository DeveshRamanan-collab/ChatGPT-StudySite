// Lighthouse CI: budgets from CLAUDE.md rule 12 (perf ≥ 90, a11y 100). Run after `npm run build`.
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/', '/laws2400/', '/laws2400/week/1/', '/laws2400/concept/w02-battery/', '/laws2400/quiz/', '/mgmt2094/week/4/', '/laws2000/week/11/'],
      numberOfRuns: 3, // median of 3: a single run on a busy laptop can dip (0.82 once on 8 Oct; three repeats 0.96–0.97)
      settings: { chromeFlags: '--no-sandbox --headless=new', preset: 'desktop' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './reports/lighthouse' },
  },
};
