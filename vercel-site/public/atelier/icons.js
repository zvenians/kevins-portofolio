const paths = {
  outward: 'M5 15 16 4M6 4h10v10',
  menu: 'M3 6h14M3 13h14',
  down: 'm5 8 5 5 5-5',
  plus: 'M4 10h12M10 4v12',
  forward: 'M3 10h13m-5-5 5 5-5 5',
  spark: 'M10 1v18M1 10h18M3.6 3.6l12.8 12.8M3.6 16.4 16.4 3.6'
};

export function icon(name) {
  return `<svg class="ui-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[name]}"/></svg>`;
}
