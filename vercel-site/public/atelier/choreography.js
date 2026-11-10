// Short camera moves join the six home chapters without pinning the page.
export function mountChoreography(reduced) {
  if (reduced) return () => {};
  const stages = [...document.querySelectorAll('.hero, #work, #studio, #skills, .process, .bio-chapter, .closing')];
  if (!stages.length) return () => {};
  const mobile = matchMedia('(max-width: 800px)');
  let pending = 0;
  function update() {
    pending = 0;
    const viewport = innerHeight || 1;
    const distance = mobile.matches ? 12 : 25;
    for (const stage of stages) {
      const rect = stage.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewport + 100) continue;
      const travel = (rect.top + rect.height * .5 - viewport * .5) / (viewport * .5 + rect.height * .5);
      const progress = Math.max(-1, Math.min(1, travel));
      stage.style.setProperty('--camera-y', `${(-progress * distance).toFixed(2)}px`);
      stage.style.setProperty('--camera-y-reverse', `${(progress * distance * .6).toFixed(2)}px`);
      stage.style.setProperty('--camera-scale', (1 + (1 - Math.abs(progress)) * (mobile.matches ? .014 : .028)).toFixed(3));
    }
  }
  const schedule = () => { if (!pending) pending = requestAnimationFrame(update); };
  update();
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  return () => {
    removeEventListener('scroll', schedule);
    removeEventListener('resize', schedule);
    if (pending) cancelAnimationFrame(pending);
    stages.forEach(stage => {
      stage.style.removeProperty('--camera-y');
      stage.style.removeProperty('--camera-y-reverse');
      stage.style.removeProperty('--camera-scale');
    });
  };
}
