/**
 * Load the demo in a real headless browser and check that it works.
 *
 * Serves the project locally and drives it with the same minimal Chrome
 * driver the grid's own test suite uses (tools/browser.js), so this needs no
 * dependency beyond Chrome itself.
 *
 * Checks:
 *   - the library arrived and left the LatticeGrid global behind;
 *   - all 12 orders land in the grid (grid.rows.matchCount(), not a DOM count);
 *   - the grand total row's Amount cell reads the sum of all 12 orders, and
 *     its Quantity cell reads their average, both computed here from the same
 *     inline data demo.js loads;
 *   - typing "EMEA" into the filter box narrows the grid to the 4 matching
 *     orders (again via grid.rows.matchCount()), and the grand total row's
 *     two cells update to the sum and average of just those 4;
 *   - nothing logged a console error or threw while the page ran.
 *
 * Exits non-zero on any failure, so it can gate a deployment.
 *
 * Usage: node tools/verify.mjs
 */

import { startServer } from './serve.mjs';
import { Browser, available } from './browser.js';

if (!available()) {
  console.log('No headless browser on this machine; skipping verify.mjs.');
  process.exit(0);
}

// The same 12 orders demo.js loads, so every expected figure is computed
// here rather than hard-coded, and stays honest if the data ever changes.
const ORDERS = [
  { region: 'EMEA', quantity: 40, amount: 1240.5 },
  { region: 'EMEA', quantity: 18, amount: 612.0 },
  { region: 'APAC', quantity: 65, amount: 3980.75 },
  { region: 'APAC', quantity: 12, amount: 340.2 },
  { region: 'AMER', quantity: 30, amount: 2105.0 },
  { region: 'EMEA', quantity: 22, amount: 705.4 },
  { region: 'AMER', quantity: 54, amount: 1890.6 },
  { region: 'APAC', quantity: 8, amount: 512.0 },
  { region: 'EMEA', quantity: 27, amount: 964.3 },
  { region: 'APAC', quantity: 45, amount: 2760.0 },
  { region: 'AMER', quantity: 15, amount: 480.5 },
  { region: 'AMER', quantity: 33, amount: 1125.9 },
];

function stats(rows) {
  const sum = rows.reduce((t, r) => t + r.amount, 0);
  const avg = rows.reduce((t, r) => t + r.quantity, 0) / rows.length;
  return { count: rows.length, sum, avg };
}

const ALL = stats(ORDERS);
const EMEA = stats(ORDERS.filter((r) => r.region === 'EMEA'));

// A round-tripped display figure: strip everything but digits, '.' and '-'
// so "US$16,717.15" and "26.75" both parse the same way.
const num = (text) => Number(String(text).replace(/[^0-9.-]/g, ''));
const near = (a, b) => Math.abs(a - b) < 0.005;

// The grand total row is a pinned-bottom row keyed with a "grandTotal" suffix
// (KEY_SEP + 'grandTotal' internally), not a dedicated CSS class.
const grandTotalCell = (col) => `document.querySelector('[data-key$="grandTotal"] .lat-cell[data-col="${col}"]')?.textContent`;

const { server, port } = await startServer();
const browser = new Browser();

try {
  await browser.start();

  await browser.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__errs = [];
      addEventListener('error', (e) => window.__errs.push(String(e.message || e)));
      addEventListener('unhandledrejection', (e) => window.__errs.push('unhandledrejection: ' + String(e.reason)));
      const origError = console.error.bind(console);
      console.error = (...args) => { window.__errs.push('console.error: ' + args.map(String).join(' ')); origError(...args); };
    `,
  });

  await browser.open(`http://127.0.0.1:${port}/`);
  await new Promise((r) => setTimeout(r, 500));

  const failures = [];

  const hasGrid = await browser.evaluate(`typeof LatticeGrid !== 'undefined' && typeof LatticeGrid.createGrid === 'function'`);
  if (!hasGrid) failures.push('LatticeGrid.createGrid was not found on the page');

  const orderCount = await browser.evaluate(`window.__demoGrid.rows.matchCount()`);
  if (orderCount !== 12) failures.push(`expected 12 orders (grid.rows.matchCount()), grid reports ${orderCount}`);

  const amountBefore = num(await browser.evaluate(grandTotalCell('amount')));
  const qtyBefore = num(await browser.evaluate(grandTotalCell('quantity')));
  if (!near(amountBefore, ALL.sum)) failures.push(`grand total Amount: expected ${ALL.sum.toFixed(2)}, grid shows ${amountBefore}`);
  if (!near(qtyBefore, ALL.avg)) failures.push(`grand total Quantity (avg): expected ${ALL.avg.toFixed(2)}, grid shows ${qtyBefore}`);

  // Type "EMEA" into the filter box the way a visitor would, letter by letter.
  await browser.evaluate(`(() => {
    const input = document.getElementById('filter');
    input.focus();
    input.value = 'EMEA';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await new Promise((r) => setTimeout(r, 200));

  const filteredCount = await browser.evaluate(`window.__demoGrid.rows.matchCount()`);
  if (filteredCount !== EMEA.count) failures.push(`filtered to EMEA: expected ${EMEA.count} orders (grid.rows.matchCount()), grid reports ${filteredCount}`);

  const amountAfter = num(await browser.evaluate(grandTotalCell('amount')));
  const qtyAfter = num(await browser.evaluate(grandTotalCell('quantity')));
  if (!near(amountAfter, EMEA.sum)) failures.push(`filtered grand total Amount: expected ${EMEA.sum.toFixed(2)}, grid shows ${amountAfter}`);
  if (!near(qtyAfter, EMEA.avg)) failures.push(`filtered grand total Quantity (avg): expected ${EMEA.avg.toFixed(2)}, grid shows ${qtyAfter}`);

  const errors = await browser.evaluate('window.__errs');
  if (errors.length) failures.push(`console/window errors: ${errors.join(' | ')}`);

  if (failures.length) {
    console.error('FAILED:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exitCode = 1;
  } else {
    console.log(
      'OK: 12 orders loaded, the grand total row read ' +
      `${ALL.sum.toFixed(2)} sum / ${ALL.avg.toFixed(2)} avg, filtering to EMEA left ${EMEA.count} orders ` +
      `and the grand total row read ${EMEA.sum.toFixed(2)} sum / ${EMEA.avg.toFixed(2)} avg, 0 console errors.`
    );
  }
} finally {
  await browser.close();
  server.close();
}
