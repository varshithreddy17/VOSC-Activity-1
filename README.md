# VOSC Activity-1: Modern Tic-Tac-Toe

A modern, interactive Tic-Tac-Toe web game created with vanilla HTML, CSS, and JavaScript. This project was developed as a prerequisite task for VOSC Activity 1.

## Features

- **Dual Game Modes**: Play locally with a friend (2 Players) or challenge the smart computer (vs AI).
- **Live Scoreboard**: Automatically tracks wins for Player X, Player O / AI, and Ties using localStorage.
- **Audio Effects**: Built-in sound tones for moves, wins, and draws using the native Web Audio API, with a sound mute toggle.
- **Visual Feedback**: Dynamic turn indicator badge, glowing win highlights on matching 3-in-a-row lines, and a victory popup modal.
- **Responsive Design**: Lightweight dark-theme interface optimized for both mobile and desktop screens.

## Project Structure

```
VOSC Activity-1/
├── index.html    # Page structure, scoreboard, and game board grid
├── style.css     # Dark theme layout, neon accents, and animations
├── script.js     # Game logic, smart AI opponent, sound tones, and score tracking
└── README.md     # Project documentation
```

## How to Run

1. Clone or download this repository to your local computer.
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

## Rules of the Game

- The game is played on a standard 3x3 grid.
- Player X always plays first, followed by Player O (or the AI).
- The first player to align 3 of their marks horizontally, vertically, or diagonally wins the round.
- If all 9 squares are filled and no player has 3 in a row, the round ends in a draw.
