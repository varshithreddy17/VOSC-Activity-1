const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
let board = Array(9).fill(''), currentTurn = 'X', active = true, vsAi = false, soundOn = true;
let scores = { X: 0, O: 0, ties: 0 };
const cells = document.querySelectorAll('.cell');
const turnBadge = document.getElementById('turnBadge'), turnText = document.getElementById('turnText');
const scoreX = document.getElementById('scoreX'), scoreO = document.getElementById('scoreO'), scoreTies = document.getElementById('scoreTies');
const labelO = document.getElementById('labelO'), modal = document.getElementById('modal');
const modalIcon = document.getElementById('modalIcon'), modalTitle = document.getElementById('modalTitle');
const btnSound = document.getElementById('btnSound');

let audioCtx = null;
function playTone(freq, duration = 0.08, type = 'sine') {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function loadState() {
  const saved = localStorage.getItem('ttt_scores');
  if (saved) scores = JSON.parse(saved);
  updateScoreboard();
}

function updateScoreboard() {
  scoreX.textContent = scores.X; scoreO.textContent = scores.O; scoreTies.textContent = scores.ties;
  localStorage.setItem('ttt_scores', JSON.stringify(scores));
}

function handleCellClick(e) {
  const idx = parseInt(e.target.dataset.idx, 10);
  if (board[idx] || !active) return;
  makeMove(idx, currentTurn);
  if (vsAi && active && currentTurn === 'O') setTimeout(aiMove, 250);
}

function makeMove(idx, player) {
  board[idx] = player;
  cells[idx].textContent = player;
  cells[idx].classList.add(player.toLowerCase());
  cells[idx].disabled = true;
  playTone(player === 'X' ? 520 : 380);

  const win = WIN_COMBOS.find(c => c.every(i => board[i] === player));
  if (win) {
    active = false;
    win.forEach(i => cells[i].classList.add('win'));
    scores[player]++; updateScoreboard();
    playTone(660, 0.25, 'triangle');
    setTimeout(() => showModal('🏆', `${vsAi && player === 'O' ? 'AI' : `Player ${player}`} Wins!`), 300);
    return;
  }
  if (!board.includes('')) {
    active = false; scores.ties++; updateScoreboard();
    playTone(300, 0.2, 'sawtooth');
    setTimeout(() => showModal('🤝', "It's a Draw!"), 300);
    return;
  }
  currentTurn = currentTurn === 'X' ? 'O' : 'X';
  turnBadge.className = `turn-badge ${currentTurn.toLowerCase()}-turn`;
  turnText.textContent = vsAi && currentTurn === 'O' ? "AI's Turn" : `Player ${currentTurn}'s Turn`;
}

function aiMove() {
  if (!active) return;
  const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  for (const p of ['O', 'X']) {
    for (const i of empty) {
      board[i] = p;
      const wins = WIN_COMBOS.some(c => c.every(idx => board[idx] === p));
      board[i] = '';
      if (wins) return makeMove(i, 'O');
    }
  }
  const pick = empty.includes(4) ? 4 : empty[Math.floor(Math.random() * empty.length)];
  makeMove(pick, 'O');
}

function showModal(icon, title) {
  modalIcon.textContent = icon; modalTitle.textContent = title;
  modal.classList.add('open');
}

function resetRound() {
  board.fill(''); active = true; currentTurn = 'X';
  modal.classList.remove('open');
  turnBadge.className = 'turn-badge x-turn';
  turnText.textContent = "Player X's Turn";
  cells.forEach(c => { c.textContent = ''; c.className = 'cell'; c.disabled = false; });
}

function setMode(isAi) {
  vsAi = isAi;
  document.getElementById('btnPvp').classList.toggle('active', !isAi);
  document.getElementById('btnAi').classList.toggle('active', isAi);
  labelO.textContent = isAi ? 'AI (O)' : 'PLAYER O';
  resetRound();
}

btnSound.addEventListener('click', () => {
  soundOn = !soundOn; btnSound.textContent = soundOn ? '🔊' : '🔇';
});
document.getElementById('btnRestart').addEventListener('click', resetRound);
document.getElementById('btnModalPlay').addEventListener('click', resetRound);
document.getElementById('btnReset').addEventListener('click', () => {
  scores = { X: 0, O: 0, ties: 0 }; updateScoreboard(); resetRound();
});
document.getElementById('btnPvp').addEventListener('click', () => setMode(false));
document.getElementById('btnAi').addEventListener('click', () => setMode(true));
cells.forEach(c => c.addEventListener('click', handleCellClick));

loadState();
