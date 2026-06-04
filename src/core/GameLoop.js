/**
 * Fixed timestep loop with interpolation alpha for smooth rendering.
 */
export class GameLoop {
  /**
   * @param {{ tickRate: number; onUpdate: (dt: number) => void; onRender: (alpha: number) => void }} options
   */
  constructor({ tickRate, onUpdate, onRender }) {
    this.tickInterval = 1 / tickRate;
    this.onUpdate = onUpdate;
    this.onRender = onRender;

    this.accumulator = 0;
    this.lastTimestamp = 0;
    this.running = false;
    this.rafId = 0;

    this.boundFrame = this.frame.bind(this);
  }

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.lastTimestamp = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.boundFrame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  /** @param {number} timestamp */
  frame(timestamp) {
    if (!this.running) {
      return;
    }

    const elapsed = Math.min(0.25, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;
    this.accumulator += elapsed;

    while (this.accumulator >= this.tickInterval) {
      this.onUpdate(this.tickInterval);
      this.accumulator -= this.tickInterval;
    }

    const alpha = this.accumulator / this.tickInterval;
    this.onRender(alpha);
    this.rafId = requestAnimationFrame(this.boundFrame);
  }
}
