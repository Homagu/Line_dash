# LINE DASH

Neon isometric **light-cycle** duel for two players on one keyboard. Phase 1: local 1v1 in the browser (HTML5 Canvas + ES modules).

## Quick start

```bash
npm start
```

Open `http://localhost:3000`. You need a static server because the game uses ES modules.

Alternatively:

```bash
python3 -m http.server 3000
```

## Controls

| Player | Move |
|--------|------|
| Player 1 | W A S D |
| Player 2 | Arrow keys |
| Start / rematch | Space or Enter |

First to **3** round wins takes the match. Crash into a wall, a trail, or your opponent to lose the round.

## Development plan (Phase 1)

### Goals

- Grid-based Tron-style movement with instant 90° turns
- Isometric neon presentation (logic stays on a flat 2D grid)
- Fast fixed-tick gameplay (~12 steps/sec)
- Local 1v1, last rider alive wins the round
- Modular layout so Phase 2 (Android wrapper) and online PvP can plug in later

### Architecture

```
src/
├── config/gameConfig.js    # Tunables (arena, timing, colors, controls)
├── core/
│   ├── constants.js        # Directions, phases, shared enums
│   ├── Game.js             # Phase machine, rounds, match scoring
│   └── GameLoop.js         # Fixed timestep + render
├── entities/Player.js      # Rider state and trail
├── world/Arena.js          # Bounds and cell keys
├── systems/
│   ├── InputSystem.js      # Keyboard → queued turns
│   ├── MovementSystem.js   # Apply turns, advance grid
│   └── CollisionSystem.js  # Trail occupancy + head crashes
├── render/
│   ├── IsometricProjection.js
│   ├── NeonStyles.js
│   └── Renderer.js
├── ui/GameUI.js            # DOM overlay
└── main.js                 # Bootstrap
```

**Data flow per tick (playing):**

1. Read input → queue `nextDirection` on players  
2. Rebuild trail occupancy map (with grace cells near the head)  
3. Move all alive players one cell  
4. Resolve wall / trail / head-on-head collisions  
5. If ≤1 alive → award round, check match win, countdown next round  

Rendering is separate: `Renderer` projects grid coordinates to isometric screen space only for drawing.

### Phase 2+ (not implemented yet)

| Feature | Hook point |
|---------|------------|
| Touch controls | `InputSystem` — add pointer layer, same `queueTurn` API |
| Android (Capacitor) | Ship `index.html` + `src/` in `www/` |
| Online PvP | `Game` — swap local input for networked state sync |
| AI opponent | `InputSystem` or new `BotSystem` |
| Sound | `Game` phase transitions |

### Configuration

Edit `src/config/gameConfig.js` for arena size, tick rate, colors, win target, and spawn positions.

## License

MIT (add a LICENSE file if you publish).
