const paths = {
  outward: 'M5 15 16 4M6 4h10v10',
  menu: 'M3 6h14M3 13h14',
  down: 'm5 8 5 5 5-5',
  plus: 'M4 10h12M10 4v12',
  forward: 'M3 10h13m-5-5 5 5-5 5',
  spark: 'M10 1v18M1 10h18M3.6 3.6l12.8 12.8M3.6 16.4 16.4 3.6',
  home: 'M3 9.5 10 3l7 6.5V17h-5v-5H8v5H3Z',
  layers: 'm3 7 7-4 7 4-7 4Zm0 4 7 4 7-4M3 15l7 4 7-4',
  play: 'M6 4.5v11l9-5.5Z',
  data: 'M3 5c0-2 14-2 14 0s-14 2-14 0Zm0 0v5c0 2 14 2 14 0V5m0 5v5c0 2-14 2-14 0v-5',
  code: 'm7 5-4 5 4 5m6-10 4 5-4 5m-2-12L9 17',
  mail: 'M2.5 5h15v10h-15Zm0 0 7.5 6L17.5 5',
  academic: 'm2 7 8-4 8 4-8 4Zm3 2v4c2 2 8 2 10 0V9',
  settings: 'M10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-4v2m0 11v2m7.5-7.5h-2m-11 0h-2m12.8-5.3-1.4 1.4m-7.8 7.8-1.4 1.4m10.6 0-1.4-1.4M6.1 6.1 4.7 4.7'
};

export function icon(name) {
  return `<svg class="ui-icon" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[name]}"/></svg>`;
}
