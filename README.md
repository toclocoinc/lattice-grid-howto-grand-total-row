# How to add a grand total row to a data grid

Pins a total row beneath twelve orders: Amount declares `total: 'sum'` and Quantity declares
`total: 'avg'`. Set `grandTotalRow: 'bottom'` on the grid and the row appears, drawing on those
same column declarations, no separate calculation to maintain. Type into the filter box above the
grid and the total narrows to match, because a total follows the filtered view by default.

Live demo: https://toclocoinc.github.io/lattice-grid-howto-grand-total-row/

**Read the how-to:** https://www.latticegrid.dev/docs/how-to/grand-total-row/

## The snippet

```js
const grid = LatticeGrid.createGrid(document.getElementById('grid'), {
  rowKey: 'id',
  grandTotalRow: 'bottom',
  columns: [
    { field: 'id', title: 'Order' },
    { field: 'customer', title: 'Customer' },
    { field: 'region', title: 'Region' },
    { field: 'quantity', title: 'Quantity', type: 'number', total: 'avg' },
    { field: 'amount', title: 'Amount', type: 'number', total: 'sum' },
  ],
  rows, // twelve orders
});

document.getElementById('filter').addEventListener('input', (e) => {
  grid.filters.quick(e.target.value);
});
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
