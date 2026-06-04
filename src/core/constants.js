/** @typedef {'north' | 'east' | 'south' | 'west'} Direction */

/** @typedef {'menu' | 'countdown' | 'playing' | 'roundEnd' | 'matchEnd'} GamePhase */

export const DIRECTIONS = Object.freeze({
  north: Object.freeze({ x: 0, y: -1 }),
  east: Object.freeze({ x: 1, y: 0 }),
  south: Object.freeze({ x: 0, y: 1 }),
  west: Object.freeze({ x: -1, y: 0 }),
});

export const OPPOSITE_DIRECTION = Object.freeze({
  north: 'south',
  east: 'west',
  south: 'north',
  west: 'east',
});

export const DIRECTION_FROM_KEY = Object.freeze({
  up: 'north',
  down: 'south',
  left: 'west',
  right: 'east',
});
