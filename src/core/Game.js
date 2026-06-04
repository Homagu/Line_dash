import { gameConfig } from '../config/gameConfig.js';
import { Player } from '../entities/Player.js';
import { Arena } from '../world/Arena.js';
import { MovementSystem } from '../systems/MovementSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { InputSystem } from '../systems/InputSystem.js';
import { Renderer } from '../render/Renderer.js';
import { GameUI } from '../ui/GameUI.js';
import { GameLoop } from './GameLoop.js';

/**
 * Orchestrates phase flow, round rules, and subsystem wiring.
 */
export class Game {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} uiRoot
   */
  constructor(canvas, uiRoot) {
    this.arena = new Arena();
    this.movement = new MovementSystem();
    this.collision = new CollisionSystem();
    this.input = new InputSystem();
    this.renderer = new Renderer(canvas);
    this.ui = new GameUI(uiRoot);

    this.players = gameConfig.players.definitions.map(
      (definition, index) =>
        new Player(definition, gameConfig.players.spawnPositions[index]),
    );

    /** @type {Record<string, number>} */
    this.scores = Object.fromEntries(this.players.map((player) => [player.id, 0]));

    /** @type {import('./constants.js').GamePhase} */
    this.phase = 'menu';
    this.countdownRemaining = gameConfig.timing.countdownSeconds;
    this.roundEndTimer = 0;
    this.roundMessage = '';
    /** @type {import('../entities/Player.js').Player | null} */
    this.matchWinner = null;

    this.loop = new GameLoop({
      tickRate: gameConfig.timing.ticksPerSecond,
      onUpdate: (dt) => this.update(dt),
      onRender: () => this.render(),
    });
  }

  start() {
    this.input.attach();
    this.renderer.resizeToDisplay();
    window.addEventListener('resize', () => this.renderer.resizeToDisplay());
    this.syncUI();
    this.loop.start();
  }

  destroy() {
    this.loop.stop();
    this.input.detach();
  }

  /** @param {number} dt */
  update(dt) {
    this.input.applyToPlayers(this.players, this.phase);

    switch (this.phase) {
      case 'menu':
        if (this.input.consumeStartKey()) {
          this.beginMatch();
        }
        break;

      case 'countdown':
        this.tickCountdown(dt);
        break;

      case 'playing':
        this.tickPlaying();
        break;

      case 'roundEnd':
        this.roundEndTimer -= dt;
        if (this.roundEndTimer <= 0) {
          this.startRound();
        }
        break;

      case 'matchEnd':
        if (this.input.consumeStartKey()) {
          this.beginMatch();
        }
        break;

      default:
        break;
    }

    this.syncUI();
  }

  tickCountdown(dt) {
    this.countdownRemaining -= dt;

    if (this.countdownRemaining <= 0) {
      this.phase = 'playing';
    }
  }

  tickPlaying() {
    this.collision.rebuildTrails(this.arena, this.players);
    this.movement.tick(this.players);
    this.collision.resolve(this.arena, this.players);

    const aliveCount = this.collision.countAlive(this.players);

    if (aliveCount <= 1) {
      this.finishRound();
    }
  }

  beginMatch() {
    this.scores = Object.fromEntries(this.players.map((player) => [player.id, 0]));
    this.matchWinner = null;
    this.startRound();
  }

  startRound() {
    this.players.forEach((player, index) => {
      player.reset(gameConfig.players.spawnPositions[index]);
    });

    this.collision.clear();
    this.countdownRemaining = gameConfig.timing.countdownSeconds;
    this.phase = 'countdown';
    this.roundMessage = '';
  }

  finishRound() {
    const winner = this.players.find((player) => player.alive) ?? null;

    if (winner) {
      this.scores[winner.id] += 1;
      this.roundMessage = `${winner.label} wins the round`;
    } else {
      this.roundMessage = 'Draw — both crashed';
    }

    const winsToVictory = gameConfig.rules.winsToVictory;
    this.matchWinner =
      this.players.find((player) => this.scores[player.id] >= winsToVictory) ?? null;

    if (this.matchWinner) {
      this.phase = 'matchEnd';
    } else {
      this.phase = 'roundEnd';
      this.roundEndTimer = gameConfig.timing.roundEndDelayMs / 1000;
    }
  }

  render() {
    this.renderer.draw(this.arena, this.players);
  }

  syncUI() {
    const countdownValue = Math.ceil(Math.max(0, this.countdownRemaining));

    this.ui.update(this.phase, {
      players: this.players,
      scores: this.scores,
      winsToVictory: gameConfig.rules.winsToVictory,
      countdownValue,
      roundMessage: this.roundMessage,
      matchWinner: this.matchWinner,
    });
  }
}
