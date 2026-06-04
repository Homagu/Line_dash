import { gameConfig } from '../config/gameConfig.js';
import { IsometricProjection } from './IsometricProjection.js';
import { NeonStyles } from './NeonStyles.js';

/**
 * Draws arena, trails, and player heads in isometric neon style.
 */
export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    this.projection = new IsometricProjection();
    this.styles = new NeonStyles(this.ctx);

    const { internalWidth, internalHeight } = gameConfig.render;
    this.canvas.width = internalWidth;
    this.canvas.height = internalHeight;
  }

  resizeToDisplay() {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = rect.width / this.canvas.width;
    const scaleY = rect.height / this.canvas.height;
    this.displayScale = Math.min(scaleX, scaleY) || 1;
  }

  /**
   * @param {import('../world/Arena.js').Arena} arena
   * @param {import('../entities/Player.js').Player[]} players
   */
  draw(arena, players) {
    const { background, gridLine, trailWidth, headRadius } = gameConfig.render;
    const ctx = this.ctx;

    ctx.save();
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawArenaFloor(arena, gridLine);
    this.drawTrails(players, trailWidth);
    this.drawHeads(players, headRadius);
    ctx.restore();
  }

  /** @param {import('../world/Arena.js').Arena} arena @param {string} gridLineColor */
  drawArenaFloor(arena, gridLineColor) {
    const ctx = this.ctx;
    this.styles.clearGlow();
    ctx.lineWidth = 1;
    ctx.strokeStyle = gridLineColor;

    for (let y = 0; y < arena.height; y += 1) {
      for (let x = 0; x < arena.width; x += 1) {
        this.strokeCellDiamond(x, y);
      }
    }

    const bounds = this.projection.getArenaBounds(arena);
    ctx.strokeStyle = 'rgba(120, 140, 220, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      bounds.minX,
      bounds.minY,
      bounds.maxX - bounds.minX,
      bounds.maxY - bounds.minY,
    );
  }

  /** @param {number} gridX @param {number} gridY */
  strokeCellDiamond(gridX, gridY) {
    const center = this.projection.gridToScreen(gridX, gridY);
    const halfW = this.projection.tileWidth / 2;
    const halfH = this.projection.tileHeight / 2;
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(center.x, center.y - halfH);
    ctx.lineTo(center.x + halfW, center.y);
    ctx.lineTo(center.x, center.y + halfH);
    ctx.lineTo(center.x - halfW, center.y);
    ctx.closePath();
    ctx.stroke();
  }

  /** @param {import('../entities/Player.js').Player[]} players @param {number} lineWidth */
  drawTrails(players, lineWidth) {
    const ctx = this.ctx;

    for (const player of players) {
      if (player.trail.length < 2) {
        continue;
      }

      this.styles.applyGlow(player.color, player.glow);
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();

      const first = this.projection.gridToScreen(player.trail[0].x, player.trail[0].y);
      ctx.moveTo(first.x, first.y);

      for (let index = 1; index < player.trail.length; index += 1) {
        const point = this.projection.gridToScreen(
          player.trail[index].x,
          player.trail[index].y,
        );
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
      this.styles.clearGlow();
    }
  }

  /** @param {import('../entities/Player.js').Player[]} players @param {number} radius */
  drawHeads(players, radius) {
    const ctx = this.ctx;

    for (const player of players) {
      if (!player.alive) {
        continue;
      }

      const head = this.projection.gridToScreen(player.x, player.y);
      this.styles.applyGlow(player.color, player.glow);

      ctx.beginPath();
      ctx.arc(head.x, head.y, radius, 0, Math.PI * 2);
      ctx.fill();

      this.styles.applySoftFill('#ffffff');
      ctx.beginPath();
      ctx.arc(head.x, head.y, radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      this.styles.clearGlow();
    }
  }
}
