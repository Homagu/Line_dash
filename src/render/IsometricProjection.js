import { gameConfig } from '../config/gameConfig.js';

/**
 * Maps logical grid (x, y) to screen pixels in dimetric/isometric layout.
 */
export class IsometricProjection {
  constructor() {
    const { internalWidth, internalHeight, tileWidth, tileHeight } = gameConfig.render;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.originX = internalWidth / 2;
    this.originY = internalHeight * 0.22;
  }

  /**
   * @param {number} gridX
   * @param {number} gridY
   * @returns {{ x: number; y: number }}
   */
  gridToScreen(gridX, gridY) {
    const halfW = this.tileWidth / 2;
    const halfH = this.tileHeight / 2;

    return {
      x: this.originX + (gridX - gridY) * halfW,
      y: this.originY + (gridX + gridY) * halfH,
    };
  }

  /** @param {import('../world/Arena.js').Arena} arena */
  getArenaBounds(arena) {
    const corners = [
      this.gridToScreen(0, 0),
      this.gridToScreen(arena.width - 1, 0),
      this.gridToScreen(0, arena.height - 1),
      this.gridToScreen(arena.width - 1, arena.height - 1),
    ];

    const xs = corners.map((point) => point.x);
    const ys = corners.map((point) => point.y);

    return {
      minX: Math.min(...xs) - this.tileWidth,
      maxX: Math.max(...xs) + this.tileWidth,
      minY: Math.min(...ys) - this.tileHeight,
      maxY: Math.max(...ys) + this.tileHeight * 2,
    };
  }
}
