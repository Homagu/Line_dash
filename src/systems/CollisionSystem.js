import { gameConfig } from '../config/gameConfig.js';

/**
 * Grid occupancy for trails and head collisions.
 */
export class CollisionSystem {
  constructor() {
    /** @type {Map<string, string>} cellKey -> playerId */
    this.occupancy = new Map();
  }

  clear() {
    this.occupancy.clear();
  }

  /**
   * @param {import('../world/Arena.js').Arena} arena
   * @param {import('../entities/Player.js').Player[]} players
   */
  rebuildTrails(arena, players) {
    this.occupancy.clear();

    for (const player of players) {
      const grace = gameConfig.rules.trailGraceCells;
      const trailCells = player.trail.slice(0, Math.max(0, player.trail.length - grace));

      for (const cell of trailCells) {
        if (!arena.contains(cell.x, cell.y)) {
          continue;
        }
        this.occupancy.set(arena.cellKey(cell.x, cell.y), player.id);
      }
    }
  }

  /**
   * @param {import('../world/Arena.js').Arena} arena
   * @param {import('../entities/Player.js').Player[]} players
   */
  resolve(arena, players) {
    const heads = [];

    for (const player of players) {
      if (!player.alive) {
        continue;
      }

      const { x, y } = player;

      if (!arena.contains(x, y)) {
        player.alive = false;
        continue;
      }

      const key = arena.cellKey(x, y);
      const owner = this.occupancy.get(key);

      if (owner !== undefined) {
        player.alive = false;
        continue;
      }

      heads.push({ player, key });
    }

    const headCountByKey = new Map();
    for (const { key } of heads) {
      headCountByKey.set(key, (headCountByKey.get(key) ?? 0) + 1);
    }

    for (const { player, key } of heads) {
      if (headCountByKey.get(key) > 1) {
        player.alive = false;
      }
    }
  }

  /** @param {import('../entities/Player.js').Player[]} players */
  countAlive(players) {
    return players.filter((player) => player.alive).length;
  }
}
