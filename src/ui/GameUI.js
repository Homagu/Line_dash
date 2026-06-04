/**
 * DOM overlay for menus, countdown, scores, and match state.
 */
export class GameUI {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    this.root = root;
    this.titleEl = /** @type {HTMLElement} */ (root.querySelector('[data-ui="title"]'));
    this.subtitleEl = /** @type {HTMLElement} */ (root.querySelector('[data-ui="subtitle"]'));
    this.scoreEl = /** @type {HTMLElement} */ (root.querySelector('[data-ui="score"]'));
    this.statusEl = /** @type {HTMLElement} */ (root.querySelector('[data-ui="status"]'));
    this.hintEl = /** @type {HTMLElement} */ (root.querySelector('[data-ui="hint"]'));
  }

  /**
   * @param {import('../core/constants.js').GamePhase} phase
   * @param {object} state
   */
  update(phase, state) {
    const { players, scores, winsToVictory, countdownValue, roundMessage, matchWinner } =
      state;

    const scoreLine = players
      .map((player) => `${player.label}: ${scores[player.id]}`)
      .join('  ·  ');

    this.scoreEl.textContent = scoreLine;

    switch (phase) {
      case 'menu':
        this.titleEl.textContent = 'LINE DASH';
        this.subtitleEl.textContent = 'Neon light-cycle duel';
        this.statusEl.textContent = 'Press Space or Enter to start';
        this.hintEl.textContent = 'P1: WASD  ·  P2: Arrows  ·  First to ' + winsToVictory + ' wins';
        break;

      case 'countdown':
        this.titleEl.textContent = String(countdownValue);
        this.subtitleEl.textContent = 'Get ready';
        this.statusEl.textContent = '';
        this.hintEl.textContent = 'P1: WASD  ·  P2: Arrows';
        break;

      case 'playing':
        this.titleEl.textContent = '';
        this.subtitleEl.textContent = '';
        this.statusEl.textContent = 'Survive — make them crash';
        this.hintEl.textContent = 'P1: WASD  ·  P2: Arrows';
        break;

      case 'roundEnd':
        this.titleEl.textContent = roundMessage;
        this.subtitleEl.textContent = 'Next round…';
        this.statusEl.textContent = '';
        this.hintEl.textContent = '';
        break;

      case 'matchEnd':
        this.titleEl.textContent = matchWinner
          ? `${matchWinner.label} wins the match`
          : 'Match over';
        this.subtitleEl.textContent = '';
        this.statusEl.textContent = 'Press Space or Enter to play again';
        this.hintEl.textContent = '';
        break;

      default:
        break;
    }
  }
}
