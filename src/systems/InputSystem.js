import { DIRECTION_FROM_KEY } from '../core/constants.js';

/**
 * Keyboard input: map keys to queued turns per player.
 */
export class InputSystem {
  constructor() {
    /** @type {Set<string>} */
    this.pressedKeys = new Set();
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    this.boundOnKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.boundOnKeyDown);
    window.addEventListener('keyup', this.boundOnKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.boundOnKeyDown);
    window.removeEventListener('keyup', this.boundOnKeyUp);
    this.pressedKeys.clear();
  }

  /** @param {KeyboardEvent} event */
  onKeyDown(event) {
    if (event.repeat) {
      return;
    }

    const gameKeys = [
      'Space',
      'Enter',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
    ];
    if (gameKeys.includes(event.code)) {
      event.preventDefault();
    }

    this.pressedKeys.add(event.code);
  }

  /** @param {KeyboardEvent} event */
  onKeyUp(event) {
    this.pressedKeys.delete(event.code);
  }

  /**
   * @param {import('../entities/Player.js').Player[]} players
   * @param {import('../core/constants.js').GamePhase} phase
   */
  applyToPlayers(players, phase) {
    if (phase !== 'playing' && phase !== 'countdown') {
      return;
    }

    for (const player of players) {
      const direction = this.resolveDirectionForPlayer(player);
      if (direction) {
        player.queueTurn(direction);
      }
    }
  }

  /** @param {import('../entities/Player.js').Player} player */
  resolveDirectionForPlayer(player) {
    const { controls } = player;

    for (const [keyName, directionName] of Object.entries(DIRECTION_FROM_KEY)) {
      const code = controls[keyName];
      if (code && this.pressedKeys.has(code)) {
        return directionName;
      }
    }

    return null;
  }

  consumeStartKey() {
    return this.pressedKeys.has('Space') || this.pressedKeys.has('Enter');
  }
}
