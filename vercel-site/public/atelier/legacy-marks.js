const symbol = /[↗☰]/u;
function applyMark(node) {
  const element = node.parentElement;
  if (!element || !symbol.test(node.data) || element.hasAttribute('data-ks-marks') ||
      element.closest('script,style,textarea,pre,code,[contenteditable="true"]')) return;
  const family = getComputedStyle(element).fontFamily;
  element.style.setProperty('--ks-original-type', family.replace(/["']?KS Marks["']?\s*,\s*/g, ''));
  element.setAttribute('data-ks-marks', '');
}
function scan(root) {
  if (root.nodeType === Node.TEXT_NODE) return applyMark(root);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) applyMark(walker.currentNode);
}
scan(document.body);
new MutationObserver(records => {
  for (const record of records) {
    if (record.type === 'characterData') applyMark(record.target);
    else record.addedNodes.forEach(scan);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });
