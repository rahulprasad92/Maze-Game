const mazeElement = document.getElementById("maze");
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");
const bestDisplay = document.getElementById("best");
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const cheerSound = document.getElementById("cheerSound");
const scoreForm = document.getElementById("scoreForm");
const playerNameInput = document.getElementById("playerName");
const scoreList = document.getElementById("scoreList");
const winPop = document.getElementById("winPop");

const width = 10;
const height = 10;
let timer = 0;
let interval;
let gameOver = false;

const mazeMaps = [
  [
    '##########',
    '#        #',
    '# ###### #',
    '# #    # #',
    '# # ## # #',
    '# # ## # #',
    '# #    # #',
    '# ###### #',
    '#        #',
    '##########',
  ],
  [
    '##########',
    '#     #  #',
    '# ### ## #',
    '#   #    #',
    '### #### #',
    '#     #  #',
    '# ### # ##',
    '#   #    #',
    '#  ##### #',
    '##########',
  ],
  [
    '##########',
    '#  #     #',
    '## # ### #',
    '#    #   #',
    '# ###### #',
    '#      # #',
    '## ### # #',
    '#   #   ##',
    '# ###### #',
    '##########',
  ]
];

let mazeMap = [];
let playerPosition = { x: 1, y: 1 };
const goalPosition = { x: 8, y: 8 };

function drawMaze() {
  mazeElement.innerHTML = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (mazeMap[y][x] === '#') {
        cell.classList.add('wall');
      }

      if (x === playerPosition.x && y === playerPosition.y) {
        cell.classList.add('player');
        cell.textContent = '🐱';
      }

      if (x === goalPosition.x && y === goalPosition.y) {
        cell.classList.add('goal');
        cell.textContent = '🏁';
      }

      mazeElement.appendChild(cell);
    }
  }
}

function startTimer() {
  timer = 0;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function handleMove(dx, dy) {
  if (gameOver) return;
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;

  if (mazeMap[newY][newX] === ' ') {
    playerPosition.x = newX;
    playerPosition.y = newY;
    moveSound.play();
    drawMaze();

    if (newX === goalPosition.x && newY === goalPosition.y) {
      clearInterval(interval);
      gameOver = true;
      winSound.play();
      cheerSound.play();
      statusText.textContent = `🎉 You escaped in ${timer} seconds!`;
      winPop.style.display = 'block';

      const best = localStorage.getItem('bestTime');
      if (!best || timer < parseInt(best)) {
        localStorage.setItem('bestTime', timer);
        bestDisplay.textContent = `Best: ${timer}s`;
      }
    }
  }
}

function loadBestTime() {
  const best = localStorage.getItem('bestTime');
  if (best) bestDisplay.textContent = `Best: ${best}s`;
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
}

function restartGame() {
  mazeMap = mazeMaps[Math.floor(Math.random() * mazeMaps.length)];
  playerPosition = { x: 1, y: 1 };
  gameOver = false;
  winPop.style.display = 'none';
  statusText.textContent = 'Use arrow keys or buttons to move 🕹️';
  drawMaze();
  startTimer();
}

scoreForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = playerNameInput.value.trim();
  if (!name || gameOver === false) return;
  const scores = JSON.parse(localStorage.getItem('scoreboard') || '[]');
  scores.push({ name, time: timer });
  scores.sort((a, b) => a.time - b.time);
  localStorage.setItem('scoreboard', JSON.stringify(scores));
  playerNameInput.value = '';
  updateScoreboard();
});

function updateScoreboard() {
  const scores = JSON.parse(localStorage.getItem('scoreboard') || '[]');
  scoreList.innerHTML = '';
  scores.slice(0, 5).forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.name} - ${score.time}s`;
    scoreList.appendChild(li);
  });
}

function resetScoreboard() {
  localStorage.removeItem('scoreboard');
  updateScoreboard();
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': handleMove(0, -1); break;
    case 'ArrowDown': handleMove(0, 1); break;
    case 'ArrowLeft': handleMove(-1, 0); break;
    case 'ArrowRight': handleMove(1, 0); break;
  }
});

restartGame();
loadBestTime();
updateScoreboard();