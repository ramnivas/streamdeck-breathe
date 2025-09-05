# CLAUDE.md

Technical documentation for developers and Claude Code. For user documentation, see **README.md**.

## Project Overview

StreamDeck plugin "Breathe" for breathing reminders. TypeScript, Elgato SDK v2, Node.js 20+.

## Development Commands

### Build and Development

- `npm run build` - Build the plugin using Rollup
- `npm run watch` - Build in watch mode with auto-restart of StreamDeck plugin

### StreamDeck CLI Commands

The project uses the Elgato CLI for StreamDeck development:

- `streamdeck restart com.ramnivas.breathe` - Restart the plugin (automatically called during watch)

## Architecture and Code Organization

### Project Structure

```
src/
├── plugin.ts                  # Entry point - registers actions
├── actions/
│   └── breathe.ts            # Main action - handles StreamDeck events
├── state/
│   ├── breathState.ts        # Centralized state and timer management
│   └── index.ts
├── animation/
│   ├── breathingAnimator.ts  # Breathing session animations
│   ├── reminderAnimator.ts   # Reminder blink animations
│   └── index.ts
├── audio/
│   └── soundPlayer.ts        # Cross-platform audio playback
└── utils/
    ├── svg-animation-utils.ts # SVG generation functions
    └── time-utils.ts         # Timer utilities

com.ramnivas.breathe.sdPlugin/
├── manifest.json             # Plugin metadata
├── bin/                      # Built JS files
├── imgs/                     # Icon assets
├── ui/                       # Property inspector
├── sounds/                   # Audio files
└── logs/                     # Runtime logs
```

### Key Files and Components

#### `src/plugin.ts`

- Entry point that initializes the StreamDeck connection
- Registers the Breath action
- Sets logging level to TRACE for debugging

#### Key Components

**`src/actions/breathe.ts`**

- Main `Breathe` class extending `SingletonAction`
- Handles StreamDeck lifecycle events
- Maintains current settings, delegates all logic to `BreathState`

**`src/state/breathState.ts`**

- Centralized state management
- Manages all timers (reminder and breathing)
- Coordinates animators and sound player
- Handles start/stop logic for both modes

**`src/animation/breathingAnimator.ts`**

- Manages breathing session animations
- Internal countdown timer
- 15 FPS SVG animation with phase transitions

**`src/animation/reminderAnimator.ts`**

- Handles reminder blinking
- Fast blink (500ms) for 1 minute, then slow (3s)

**`src/utils/svg-animation-utils.ts`**

- Pure functions for SVG generation
- `generateBreathingCircleSVG()` - animated circles
- `generateReminderSVG()` - logo with colored background

#### Plugin Configuration

- **UUID**: `com.ramnivas.breathe`
- **Action UUID**: `com.ramnivas.breathe`
- **Node.js Version**: 20 (required by StreamDeck runtime)
- **SDK Version**: 2

### Build System

- **Bundler**: Rollup with TypeScript compilation
- **Target**: ES2022 modules for Node.js 20
- **Output**: Single bundled file at `com.ramnivas.breathe.sdPlugin/bin/plugin.js`
- **Source Maps**: Enabled during watch mode for debugging
- **Minification**: Enabled for production builds (not in watch mode)

### Development Workflow

1. The plugin source is built from TypeScript using Rollup
2. Built files are placed in the `.sdPlugin` directory structure
3. During watch mode, the plugin automatically restarts when changes are detected
4. VS Code debugging is configured to attach to the running plugin process

### Technical Details

**Animation System**

- 15 FPS SVG-based animations
- 4-phase breathing pattern (inhale, hold, exhale, hold)
- Dynamic circle radius (30-55px) and opacity based on phase
- Countdown timer overlay

**Audio System**

- Cross-platform audio using `speaker` and `wav-decoder` libraries
- Custom gong.wav sound for notifications
- Configurable sound on/off setting

### Settings Type

`BreathSettings` interface extends `JsonObject` with properties for timing configuration.
See README.md for user-facing settings documentation.

### Assets

- **Logo**: SVG imported at build time from `com.ramnivas.breathe.sdPlugin/imgs/logo.svg`
- **Audio**: `gong.wav` in `sounds/` directory
- **Icons**: Generated from SVG using `npm run convert-icon`

### Architecture Notes

- Singleton pattern for action management
- Centralized state management in `BreathState`
- All timers properly cleaned up on stop/restart
- Modular architecture with clear separation of concerns

## Development Setup

### Prerequisites

- **Node.js 20+** (required by StreamDeck runtime)
- **StreamDeck software** installed and running
- **Elgato StreamDeck CLI** (installed via npm)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Install Elgato CLI globally (if not already installed):**

   ```bash
   npm install -g @elgato/cli
   ```

3. **Build the plugin:**

   ```bash
   npm run build
   ```

4. **Link plugin to StreamDeck:**
   ```bash
   streamdeck link com.ramnivas.breathe.sdPlugin
   ```
   
   Note: If renaming from a previous version, you may need to unlink the old plugin first:
   ```bash
   streamdeck unlink com.ramnivas.breath
   ```

### Development Workflow

#### Live Development

```bash
npm run watch
```

This will:

- Build the plugin in watch mode
- Automatically restart the plugin when changes are detected
- Generate source maps for debugging

#### Manual Commands

```bash
# Build once
npm run build

# Restart plugin manually
streamdeck restart com.ramnivas.breathe

# Stop plugin
streamdeck stop com.ramnivas.breathe

# Validate plugin structure
streamdeck validate com.ramnivas.breathe.sdPlugin
```

### Debugging

- Enable debug logs in StreamDeck software: More Actions → Developer → Enable Debug Mode
- Plugin logs appear in: `com.ramnivas.breathe.sdPlugin/logs/`
- VS Code debugging is configured - attach to running plugin process

## Building for Distribution

```bash
streamdeck pack com.ramnivas.breathe.sdPlugin
```

Creates `.streamDeckPlugin` file for distribution. See README.md for installation instructions.

## Troubleshooting Development Issues

### Plugin Not Appearing

- Ensure StreamDeck software is running
- Check that plugin is linked: `streamdeck link com.ramnivas.breathe.sdPlugin`
- Restart StreamDeck software if needed

### Build Issues

- Verify Node.js version (20+)
- Clear `node_modules` and run `npm install` again
- Check TypeScript compilation errors in console

### Runtime Issues

- Check plugin logs in `com.ramnivas.breathe.sdPlugin/logs/`
- Enable debug mode in StreamDeck software
- Verify plugin UUID matches in manifest.json and breathe.ts
