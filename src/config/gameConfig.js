/**
 * Central tunables for gameplay, rendering, and input.
 * Import and spread overrides in tests or future modes.
 */
export const gameConfig = Object.freeze({
  arena: Object.freeze({
    width: 24,
    height: 24,
  }),

  timing: Object.freeze({
    ticksPerSecond: 12,
    countdownSeconds: 3,
    roundEndDelayMs: 1500,
  }),

  rules: Object.freeze({
    winsToVictory: 3,
    trailGraceCells: 2,
    allow180Turn: false,
  }),

  players: Object.freeze({
    spawnPositions: Object.freeze([
      { x: 4, y: 4, direction: 'east' },
      { x: 19, y: 19, direction: 'west' },
    ]),
    definitions: Object.freeze([
      Object.freeze({
        id: 'p1',
        label: 'Player 1',
        color: '#00f5ff',
        glow: '#00f5ff',
        controls: Object.freeze({
          up: 'KeyW',
          down: 'KeyS',
          left: 'KeyA',
          right: 'KeyD',
        }),
      }),
      Object.freeze({
        id: 'p2',
        label: 'Player 2',
        color: '#ff2d95',
        glow: '#ff2d95',
        controls: Object.freeze({
          up: 'ArrowUp',
          down: 'ArrowDown',
          left: 'ArrowLeft',
          right: 'ArrowRight',
        }),
      }),
    ]),
  }),

  render: Object.freeze({
    internalWidth: 640,
    internalHeight: 480,
    background: '#06060f',
    gridLine: 'rgba(80, 90, 140, 0.12)',
    tileWidth: 28,
    tileHeight: 14,
    trailWidth: 4,
    headRadius: 5,
    shadowBlur: 14,
  }),
});
