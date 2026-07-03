const canvas = document.getElementById('dither-canvas');
const ctx = canvas.getContext('2d');

let W, H, dots;
const mouse = { x: -999, y: -999 };
const GRID = 18, BASE_R = 2.2, MAX_R = 7.5, INFLUENCE = 110;

function bayer(x, y) {
  const B = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
  return B[y & 3][x & 3] / 16;
}

function init() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  const cols = Math.ceil(W / GRID) + 2;
  const rows = Math.ceil(H / GRID) + 2;
  dots = [];
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++)
      dots.push({ x: col * GRID, y: row * GRID, threshold: bayer(col, row) });
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  for (const d of dots) {
    const dx = d.x - mouse.x, dy = d.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const wave = Math.max(0, 1 - dist / INFLUENCE) ** 2;
    if (d.threshold >= 0.35 + wave * 0.55) continue;

    const r = 2.2 + (MAX_R - BASE_R) * wave;
    const angle = Math.atan2(dy, dx) + Math.PI;
    const push = wave * 6;
    const lightness = Math.round(wave * 30);

    ctx.fillStyle = `hsl(0,0%,${lightness}%)`;
    ctx.beginPath();
    ctx.arc(d.x + Math.cos(angle) * push, d.y + Math.sin(angle) * push, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: false });
window.addEventListener('resize', init);

init();
(function loop() { draw(); requestAnimationFrame(loop); })();