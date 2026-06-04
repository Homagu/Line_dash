import { gameConfig } from '../config/gameConfig.js';

/**
 * Canvas stroke/fill helpers for consistent neon look.
 */
export class NeonStyles {
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx) {
    this.ctx = ctx;
    this.shadowBlur = gameConfig.render.shadowBlur;
  }

  /** @param {string} color @param {string} glow */
  applyGlow(color, glow) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.shadowColor = glow;
    this.ctx.shadowBlur = this.shadowBlur;
  }

  clearGlow() {
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
  }

  /** @param {string} color */
  applySoftFill(color) {
    this.ctx.fillStyle = color;
    this.clearGlow();
  }
}
