import { gameConfig } from '../config/gameConfig.js';

/**
 * Axis-aligned playfield bounds. Collision uses integer grid cells.
 */
export class Arena {
  /** @param {{ width?: number; height?: number }} [overrides] */
  constructor(overrides = {}) {
    const { width, height } = gameConfig.arena;
    this.width = overrides.width ?? width;
    this.height = overrides.height ?? height;
  }

  /** @param {number} x @param {number} y */
  contains(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  /** @returns {string} */
  cellKey(x, y) {
    return `${x},${y}`;
  }
}
