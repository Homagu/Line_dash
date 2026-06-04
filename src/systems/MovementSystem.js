import { OPPOSITE_DIRECTION } from '../core/constants.js';
import { gameConfig } from '../config/gameConfig.js';

/**
 * Applies queued turns and advances riders one grid cell per tick.
 */
export class MovementSystem {
  /**
   * @param {import('../entities/Player.js').Player[]} players
   */
  tick(players) {
    for (const player of players) {
      if (!player.alive) {
        continue;
      }

      this.applyQueuedTurn(player);

      const head = player.getNextHeadPosition();
      player.x = head.x;
      player.y = head.y;
      player.trail.push({ x: player.x, y: player.y });
      player.cellsMoved += 1;
    }
  }

  /** @param {import('../entities/Player.js').Player} player */
  applyQueuedTurn(player) {
    if (!player.nextDirection) {
      return;
    }

    const next = player.nextDirection;
    player.nextDirection = null;

    if (
      !gameConfig.rules.allow180Turn &&
      OPPOSITE_DIRECTION[player.direction] === next
    ) {
      return;
    }

    player.direction = next;
  }
}
