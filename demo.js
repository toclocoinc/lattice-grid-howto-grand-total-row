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
