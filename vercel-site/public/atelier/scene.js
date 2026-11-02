// A twisted ribbon in perspective, rendered as individually lit grains.
export function mountScene(canvas, reduced) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const points = [];
  for (let i = 0; i < 250; i++) {
    const a = i / 250 * Math.PI * 2;
    for (let j = 0; j < 28; j++) {
      const b = j / 28 * Math.PI * 2 + a * 3;
      const r = 1.25 + .34 * Math.cos(b) + .22 * Math.sin(a * 3);
      points.push([r * Math.cos(a), r * Math.sin(a), .38 * Math.sin(b) + .42 * Math.cos(a * 3), Math.sin(b)]);
    }
  }
  let px = 0,
    py = 0,
    frame = 0,
    visible = true;
  function draw(time) {
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    const dpr = Math.min(2, devicePixelRatio);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const t = reduced ? .7 : time / 14000;
    const angle = .65 + .21 * Math.sin(t) + py,
      c = Math.cos(angle),
      s = Math.sin(angle);
    const spin = t * .52 + px,
      cs = Math.cos(spin),
      sn = Math.sin(spin);
    const size = Math.min(width * .268, height * .29);
    for (const [x, y, z, light] of points) {
      const u = x * cs - y * sn,
        v = x * sn + y * cs,
        depth = v * s + z * c,
        perspective = 4.9 / (4.9 - depth);
      const horizontal = u * perspective,
        vertical = (v * c - z * s) * perspective;
      ctx.globalAlpha = Math.min(.95, Math.max(.15, .42 + .26 * depth + .2 * light));
      ctx.fillStyle = light > .34 ? '#ffbd73' : light < -.12 ? '#8ba5b5' : '#f7ecda';
      ctx.fillRect(width * .5 + (horizontal * .94 + vertical * .33) * size, height * .5 + (vertical * .94 - horizontal * .33) * size, 1.3 * perspective, 1.3 * perspective);
    }
    ctx.globalAlpha = 1;
    frame = !reduced && visible ? requestAnimationFrame(draw) : 0;
  }
  const pointer = e => {
    px = (e.clientX / innerWidth - .5) * .22;
    py = (e.clientY / innerHeight - .5) * .12;
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame) draw(performance.now());
  });
  const resize = new ResizeObserver(() => {
    if (!frame) draw(performance.now());
  });
  observer.observe(canvas);
  resize.observe(canvas);
  window.addEventListener('pointermove', pointer);
  draw(0);
  return () => {
    observer.disconnect();
    resize.disconnect();
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', pointer);
  };
}
