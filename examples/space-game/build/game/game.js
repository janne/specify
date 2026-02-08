const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const asteroidsEl = document.getElementById('asteroids');
const overlayTitle = overlay.querySelector('h2');
const overlayBody = overlay.querySelector('p');

const DEFAULT_TITLE = 'Ready to launch?';
const DEFAULT_BODY = 'Break the big stones into smaller bits. Clear every fragment to win.';

const state = {
  running: false,
  keys: new Set(),
  bullets: [],
  asteroids: [],
  score: 0,
  lastShot: 0,
  ship: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    radius: 14,
    dirX: 0,
    dirY: -1,
  },
};

const STAR_COUNT = 120;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.6 + 0.2,
  a: Math.random() * 0.6 + 0.2,
}));

function resetGame() {
  state.ship.x = canvas.width / 2;
  state.ship.y = canvas.height / 2;
  state.ship.vx = 0;
  state.ship.vy = 0;
  state.ship.dirX = 0;
  state.ship.dirY = -1;
  state.bullets = [];
  state.asteroids = createAsteroids(6, 3);
  state.score = 0;
  state.lastShot = 0;
  updateHud();
}

function createAsteroids(count, size) {
  const asteroids = [];
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.7 + 0.4;
    asteroids.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      radius: size === 3 ? 42 : size === 2 ? 26 : 14,
    });
  }
  return asteroids;
}

function updateHud() {
  scoreEl.textContent = state.score.toString();
  asteroidsEl.textContent = state.asteroids.length.toString();
}

function wrap(entity) {
  if (entity.x < -50) entity.x = canvas.width + 50;
  if (entity.x > canvas.width + 50) entity.x = -50;
  if (entity.y < -50) entity.y = canvas.height + 50;
  if (entity.y > canvas.height + 50) entity.y = -50;
}

function shoot() {
  const now = performance.now();
  if (now - state.lastShot < 240) return;
  state.lastShot = now;
  const speed = 6.5;
  const dirX = state.ship.dirX;
  const dirY = state.ship.dirY;
  state.bullets.push({
    x: state.ship.x + dirX * 16,
    y: state.ship.y + dirY * 16,
    vx: dirX * speed,
    vy: dirY * speed,
    life: 0,
  });
}

function handleInput() {
  const accel = 0.18;
  if (state.keys.has('w')) state.ship.vy -= accel;
  if (state.keys.has('s')) state.ship.vy += accel;
  if (state.keys.has('a')) state.ship.vx -= accel;
  if (state.keys.has('d')) state.ship.vx += accel;

  if (state.keys.has(' ')) shoot();

  const speed = Math.hypot(state.ship.vx, state.ship.vy);
  if (speed > 3.4) {
    state.ship.vx = (state.ship.vx / speed) * 3.4;
    state.ship.vy = (state.ship.vy / speed) * 3.4;
  }

  state.ship.vx *= 0.98;
  state.ship.vy *= 0.98;
  state.ship.x += state.ship.vx;
  state.ship.y += state.ship.vy;

  if (Math.hypot(state.ship.vx, state.ship.vy) > 0.2) {
    const mag = Math.hypot(state.ship.vx, state.ship.vy);
    state.ship.dirX = state.ship.vx / mag;
    state.ship.dirY = state.ship.vy / mag;
  }
  wrap(state.ship);
}

function updateBullets() {
  state.bullets.forEach((bullet) => {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life += 1;
    wrap(bullet);
  });
  state.bullets = state.bullets.filter((bullet) => bullet.life < 90);
}

function updateAsteroids() {
  state.asteroids.forEach((rock) => {
    rock.x += rock.vx;
    rock.y += rock.vy;
    wrap(rock);
  });
}

function checkCollisions() {
  for (let i = state.asteroids.length - 1; i >= 0; i -= 1) {
    const rock = state.asteroids[i];
    const dx = rock.x - state.ship.x;
    const dy = rock.y - state.ship.y;
    if (Math.hypot(dx, dy) < rock.radius + state.ship.radius) {
      endRun('Ship hit. Try again.');
      return;
    }
  }

  for (let i = state.asteroids.length - 1; i >= 0; i -= 1) {
    const rock = state.asteroids[i];
    for (let j = state.bullets.length - 1; j >= 0; j -= 1) {
      const bullet = state.bullets[j];
      const dx = rock.x - bullet.x;
      const dy = rock.y - bullet.y;
      if (Math.hypot(dx, dy) < rock.radius) {
        state.bullets.splice(j, 1);
        state.asteroids.splice(i, 1);
        state.score += rock.size * 75;
        if (rock.size > 1) {
          const fragments = createAsteroids(2, rock.size - 1).map((fragment) => ({
            ...fragment,
            x: rock.x,
            y: rock.y,
          }));
          state.asteroids.push(...fragments);
        }
        updateHud();
        return;
      }
    }
  }

  if (state.asteroids.length === 0) {
    endRun('Field cleared. You win.');
  }
}

function drawStars() {
  ctx.fillStyle = '#05070f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    ctx.globalAlpha = star.a;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawShip() {
  const { x, y, dirX, dirY } = state.ship;
  const angle = Math.atan2(dirY, dirX) + Math.PI / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(12, 14);
  ctx.lineTo(0, 8);
  ctx.lineTo(-12, 14);
  ctx.closePath();
  ctx.fillStyle = '#f2c94c';
  ctx.fill();
  ctx.strokeStyle = '#fef6e4';
  ctx.stroke();
  ctx.restore();
}

function drawBullets() {
  ctx.fillStyle = '#56ccf2';
  state.bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawAsteroids() {
  state.asteroids.forEach((rock) => {
    ctx.beginPath();
    ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 246, 228, 0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(242, 201, 76, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  ctx.lineWidth = 1;
}

function frame() {
  if (!state.running) return;
  handleInput();
  updateBullets();
  updateAsteroids();
  checkCollisions();
  drawStars();
  drawAsteroids();
  drawBullets();
  drawShip();
  requestAnimationFrame(frame);
}

function startRun() {
  overlay.classList.add('hidden');
  overlayTitle.textContent = DEFAULT_TITLE;
  overlayBody.textContent = DEFAULT_BODY;
  resetGame();
  state.running = true;
  requestAnimationFrame(frame);
}

function endRun(message) {
  state.running = false;
  overlayTitle.textContent = message;
  overlayBody.textContent = 'Press Begin Run to try again.';
  overlay.classList.remove('hidden');
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd', ' '].includes(key)) {
    event.preventDefault();
  }
  state.keys.add(key);
});

window.addEventListener('keyup', (event) => {
  state.keys.delete(event.key.toLowerCase());
});

startBtn.addEventListener('click', startRun);
