import { DIRECTIONS } from '../core/constants.js';

/**
 * @typedef {object} PlayerDefinition
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {string} glow
 * @property {Record<string, string>} controls
 */

/**
 * Light-cycle rider: position, heading, trail polyline, life state.
 */
export class Player {
  /**
   * @param {PlayerDefinition} definition
   * @param {{ x: number; y: number; direction: import('../core/constants.js').Direction }} spawn
   */
  constructor(definition, spawn) {
    this.id = definition.id;
    this.label = definition.label;
    this.color = definition.color;
    this.glow = definition.glow;
    this.controls = definition.controls;

    this.reset(spawn);
  }

  /** @param {{ x: number; y: number; direction: import('../core/constants.js').Direction }} spawn */
  reset(spawn) {
    this.x = spawn.x;
    this.y = spawn.y;
    this.direction = spawn.direction;
    /** @type {import('../core/constants.js').Direction | null} */
    this.nextDirection = null;
    this.alive = true;
    /** @type {{ x: number; y: number }[]} */
    this.trail = [{ x: this.x, y: this.y }];
    this.cellsMoved = 0;
  }

  /** @param {import('../core/constants.js').Direction} direction */
  queueTurn(direction) {
    this.nextDirection = direction;
  }

  /** @returns {{ x: number; y: number }} */
  getVector() {
    return DIRECTIONS[this.direction];
  }

  /** @returns {{ x: number; y: number }} */
  getNextHeadPosition() {
    const vector = this.getVector();
    return { x: this.x + vector.x, y: this.y + vector.y };
  }
}
