# How to add a grand total row to a data grid

Pins a total row beneath twelve orders: Amount declares `total: 'sum'` and Quantity declares
`total: 'avg'`. Set `grandTotalRow: 'bottom'` on the grid and the row appears, drawing on those
same column declarations, no separate calculation to maintain. Type into the filter box above the
grid and the total narrows to match, because a total follows the filtered view by default.

Live demo: https://toclocoinc.github.io/lattice-grid-howto-grand-total-row/

**Read the how-to:** https://www.latticegrid.dev/docs/how-to/grand-total-row/

## The full source

Two files: `index.html` loads the grid and declares the mount point, `demo.js` configures and creates it. Copy both as they are below and it runs.

### index.html

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>How to add a grand total row to a data grid</title>
    <meta
      name="description"
      content="Pin a grand total row beneath a dozen orders: one column sums the amount, another averages the quantity. Type in the filter box above the grid and the total follows the filtered rows, not the whole table. Built with Lattice Grid loaded by script tag, no install and no build."
    />
    <link rel="icon" href="data:," />
    <!--
      The grid's stylesheet, from jsDelivr. The address names the exact
      release, 1.68.2, and carries the hash of the file it expects, so the
      page can never quietly pick up a different build than the one it was
      checked against.
    -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@toclocoinc/lattice-grid@1.68.2/lattice-grid.min.css"
      integrity="sha384-mcpd7S8C5nz58bZDAXdYH6rzezEhfN7B4u2SlW426dSe20GnkxTu4TygyOILnCth"
      crossorigin="anonymous"
    />
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; background: #f4f6f9; color: #131a24; }
      header { padding: 1.5rem 1.5rem 0.5rem; max-width: 960px; margin: 0 auto; }
      header p { color: #4a5568; }
      header a { color: #2d6bff; }
      main { max-width: 960px; margin: 0 auto; padding: 0 1.5rem 2.5rem; }
      #toolbar { margin: 0 0 0.75rem; }
      #toolbar label { font-size: 0.9rem; color: #4a5568; margin-right: 0.5rem; }
      #filter { font: inherit; padding: 0.4rem 0.6rem; border: 1px solid #ccd3dc; border-radius: 4px; width: 220px; }
      #grid { height: 420px; }
      #stat { font-size: 0.9rem; color: #4a5568; margin: 0.75rem 0 0; }
    </style>
  </head>
  <body>
    <header>
      <h1>How to add a grand total row to a data grid</h1>
      <p>
        Twelve orders below carry a Quantity and an Amount column, and a grand total row pinned
        beneath them averages the one and sums the other. Type a region or customer into the
        filter box: the grid narrows to matching orders and the total updates to describe only
        what is now in view. Read the
        <a href="https://www.latticegrid.dev/docs/how-to/grand-total-row/">full how-to</a>
        on latticegrid.dev.
      </p>
    </header>
    <main>
      <div id="toolbar">
        <label for="filter">Filter orders</label>
        <input id="filter" type="text" placeholder="e.g. EMEA, or a customer name" />
      </div>
      <div id="grid"></div>
      <p id="stat"></p>
    </main>

    <!--
      The library, as a classic script tag. No npm install, no bundler, no
      type="module": the file runs as it arrives and leaves the LatticeGrid
      global behind.
    -->
    <script
      src="https://cdn.jsdelivr.net/npm/@toclocoinc/lattice-grid@1.68.2/lattice-grid.min.js"
      integrity="sha384-vCzLyFYn0T0lz/vkdH4x0JpJZkOazZgI2LiGui7lm5uerdZd0Z46G9hr3Aq1FFPS"
      crossorigin="anonymous"
    ></script>
    <script src="./demo.js"></script>
  </body>
</html>
```

### demo.js

```js
/**
 * Pin a grand total row beneath the grid, and give it something to show.
 *
 * `grandTotalRow: 'bottom'` docks a synthesised total row above the status
 * bar. It draws its figures from the same `total` each column already
 * declares: `total: 'sum'` on Amount, `total: 'avg'` on Quantity. Typing
 * into the filter box calls `grid.filters.quick(text)`; totals default to
 * `totalFilteredOnly: true`, so the grand total narrows to match.
 */

// Tied to toclocoinc.github.io only; has no effect anywhere else and needs
// no key at all to run this page from a local copy.
LatticeGrid.setLicence(
  'LG1.eyJ2IjoxLCJwIjoibGF0dGljZS1ncmlkIiwidCI6IlRPQ0xPQ08gSW5jIC0gcHVibGljIGRlbW9zIiwiZSI6IjIwMzAtMDEtMDEiLCJkIjpbInRvY2xvY29pbmMuZ2l0aHViLmlvIl19.9De42ua3aCGpiMB6EVRP7Tv-upUlDI-0T07rlSPzvCrsqg8t4YJi7SRnStEpAg48uzmcG7il1fR_TfwkUE7iCA'
);

const ORDERS = [
  { id: 'ORD-01', customer: 'Kestrel Foods', region: 'EMEA', quantity: 40, amount: 1240.5 },
  { id: 'ORD-02', customer: 'Harrow Textiles', region: 'EMEA', quantity: 18, amount: 612.0 },
  { id: 'ORD-03', customer: 'Meridian Steel', region: 'APAC', quantity: 65, amount: 3980.75 },
  { id: 'ORD-04', customer: 'Coral Bay Retail', region: 'APAC', quantity: 12, amount: 340.2 },
  { id: 'ORD-05', customer: 'Northgate Motors', region: 'AMER', quantity: 30, amount: 2105.0 },
  { id: 'ORD-06', customer: 'Kestrel Foods', region: 'EMEA', quantity: 22, amount: 705.4 },
  { id: 'ORD-07', customer: 'Pinevale Timber', region: 'AMER', quantity: 54, amount: 1890.6 },
  { id: 'ORD-08', customer: 'Meridian Steel', region: 'APAC', quantity: 8, amount: 512.0 },
  { id: 'ORD-09', customer: 'Alder & Finch', region: 'EMEA', quantity: 27, amount: 964.3 },
  { id: 'ORD-10', customer: 'Coral Bay Retail', region: 'APAC', quantity: 45, amount: 2760.0 },
  { id: 'ORD-11', customer: 'Northgate Motors', region: 'AMER', quantity: 15, amount: 480.5 },
  { id: 'ORD-12', customer: 'Pinevale Timber', region: 'AMER', quantity: 33, amount: 1125.9 },
];

const grid = LatticeGrid.createGrid(document.getElementById('grid'), {
  rowKey: 'id',
  grandTotalRow: 'bottom',
  columns: [
    { field: 'id', title: 'Order', layout: { width: 90 } },
    { field: 'customer', title: 'Customer', layout: { flex: 1, min: 160 } },
    { field: 'region', title: 'Region', layout: { width: 90 } },
    {
      field: 'quantity', title: 'Quantity', type: 'number', total: 'avg',
      format: { decimals: 2 }, layout: { width: 110 },
    },
    {
      field: 'amount', title: 'Amount', type: 'number', total: 'sum',
      format: { style: 'currency', currency: 'USD', decimals: 2 },
      layout: { width: 130 },
    },
  ],
  rows: ORDERS,
});
window.__demoGrid = grid; // read by tools/verify.mjs

document.getElementById('filter').addEventListener('input', (e) => {
  grid.filters.quick(e.target.value);
});

document.getElementById('stat').textContent =
  `${ORDERS.length} orders; the grand total row sums Amount and averages Quantity, and follows the filter box above`;
```

`grandTotalRow: 'bottom'` pins the row above the status bar so it stays in view while the rows
scroll; `true` instead places it inline as the last row. Each totalled column keeps its own
reduction: `sum`, `avg`, `count`, `min`, `max` and more are all available, mixed freely across
columns. Because a total defaults to `totalFilteredOnly: true`, the grand total in this demo
already describes only the rows the filter box currently matches; set that to `false` when a total
should keep describing the whole dataset regardless of what is filtered out.

## Running it yourself

Open `index.html` in a browser, or serve the folder with any static file server. The grid loads
from jsDelivr by script tag, so there is no install and no build step. It runs keyless on
`localhost`; the licence key in `demo.js` is bound to `toclocoinc.github.io` and has no effect
anywhere else.

## Licence

MIT, see [LICENSE](./LICENSE). Lattice Grid itself is licensed separately per domain:
https://www.latticegrid.dev/pricing/
