function setupQuickMenu() {
  if (data.admin) return;
  EditionMotion.introduce(document.querySelector('.journey-hero-art, .studio-sculpture, .guided-gallery'));
  if (document.querySelector('.quick-nav')) return;

  const nav = document.createElement('nav');
  nav.className = 'quick-nav';
  nav.setAttribute('aria-label','Quick links');
  nav.innerHTML = '<button class="quick-trigger" type="button" aria-label="Quick links" aria-expanded="false" aria-controls="quick-destinations"><span aria-hidden="true">+</span></button><div id="quick-destinations" inert></div>';
  const trigger = nav.querySelector('button');
  const list = nav.querySelector('#quick-destinations');
  for (const [label, href] of [['Work',homeHref('field')],['Demo Studio',studioUrl()],['CV / PDF',homeHref('resume')],['Contact',homeHref('connect')]]) {
    const link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    list.append(link);
  }
  function toggle(open) {
    nav.classList.toggle('is-open',open);
    trigger.setAttribute('aria-expanded',String(open));
    list.toggleAttribute('inert',!open);
  }
  trigger.onclick = () => toggle(!nav.classList.contains('is-open'));
  list.onclick = () => { trigger.focus(); toggle(false); };
  nav.addEventListener('keydown',event=>{
    if(event.key==='Escape'){toggle(false);trigger.focus();}
  });
  nav.addEventListener('focusout',event=>{if(!nav.contains(event.relatedTarget)) toggle(false);});
  document.addEventListener('pointerdown',event=>{if(!nav.contains(event.target)) toggle(false);});
  nav.insertAdjacentHTML('afterbegin', `<svg class="liquid-trail" aria-hidden="true" focusable="false" viewBox="0 0 280 235">
    <defs><filter id="quick-merge" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"/>
    </filter></defs>
    <g filter="url(#quick-merge)" fill="#302839"><circle cx="253" cy="208" r="23"/>
      <circle cx="253" cy="208" r="19"/><circle cx="253" cy="208" r="19"/>
      <circle cx="253" cy="208" r="19"/><circle cx="253" cy="208" r="19"/>
    </g></svg>`);
  document.body.append(nav);
}
