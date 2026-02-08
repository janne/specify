const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
let scale = 0;
let centerX = 0;
let centerY = 0;

function spawnStar() {
  return {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random(),
    speed: Math.random() * 0.004 + 0.002,
    size: Math.random() * 0.9 + 0.2,
    shade: Math.random() * 0.5 + 0.5,
  };
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  scale = Math.min(canvas.width, canvas.height) * 0.55;
  centerX = canvas.width * 0.45;
  centerY = canvas.height * 0.4;
  stars = Array.from({ length: Math.floor((canvas.width * canvas.height) / 7000) }, spawnStar);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const driftX = 0.18;
  const driftY = 0.12;

  stars.forEach((star, index) => {
    star.z -= star.speed;
    if (star.z <= 0) {
      stars[index] = spawnStar();
      return;
    }

    const depth = 1 - star.z;
    const px = (star.x / star.z) * scale + centerX + driftX * depth * scale;
    const py = (star.y / star.z) * scale + centerY + driftY * depth * scale;
    if (px < -50 || px > canvas.width + 50 || py < -50 || py > canvas.height + 50) {
      stars[index] = spawnStar();
      return;
    }

    const radius = star.size * depth * 2.2 + 0.2;
    const alpha = Math.min(0.95, star.shade * depth + 0.15);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);

resize();
requestAnimationFrame(draw);
