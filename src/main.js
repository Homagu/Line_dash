import { Game } from './core/Game.js';

const canvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById('game'));
const uiRoot = document.getElementById('ui');

if (!canvas || !uiRoot) {
  throw new Error('Missing #game canvas or #ui overlay element.');
}

const game = new Game(canvas, uiRoot);
game.start();
