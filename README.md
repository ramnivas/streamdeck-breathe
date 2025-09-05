# Breathe - StreamDeck Breathing Reminder Plugin

A StreamDeck plugin that helps you maintain healthy breathing habits by providing gentle reminders and guided breathing sessions.

## Features

- **Automatic Reminders**: Visual and audio reminders at customizable intervals
- **Guided Breathing Sessions**: Animated circles guide your breathing rhythm with timer display
- **Customizable Patterns**: Configure breathing techniques like 4-7-8 or box breathing

## Installation

1. Download the latest release from the [releases page](https://github.com/ramnivas/streamdeck-breathe/releases)
2. Double-click the `.streamDeckPlugin` file to install
3. The plugin will appear in your StreamDeck software under "Breathe"

## How to Use

### Basic Setup

1. Drag the "Breathe" action onto any key on your StreamDeck
2. Configure your preferred settings in the property inspector:
   - **Reminder Interval**: How often to remind you (5-300 minutes)
   - **Breathing Duration**: Length of guided sessions (1-10 minutes)
   - **Sound**: Enable/disable audio notifications
   - **Breathing Pattern**: Customize inhale, hold, exhale timings

### During Use

- **Reminder Mode**: The button will blink blue when it's time for a breathing break (and play a chime if notification sound is enabled)
- **Press the Button**: Start a guided breathing session
- **Breathing Session**: Follow the animated circles that expand (inhale) and contract (exhale)
- **Timer**: See countdown timer during your session

## Breathing Patterns

The plugin supports various breathing techniques:

- **Default (4-2-4-2)**: Inhale 4s, Hold 2s, Exhale 4s, Hold 2s
- **4-7-8 Technique**: Inhale 4s, Hold 7s, Exhale 8s, Hold 0s (great for relaxation)
- **Box Breathing (4-4-4-4)**: Equal timing for all phases (used by Navy SEALs)
- **Custom**: Set your own timings for each phase

## Settings

### Reminder Settings

- **Every X Minutes**: Set reminder interval (default: 60 minutes)
- **Sound**: Toggle audio notifications on/off

### Breathing Settings

- **Breathe For**: Session duration in minutes (default: 1 minute)
- **Inhale Duration**: Time to breathe in (2-8 seconds)
- **Hold After Inhale**: Pause after inhaling (0-8 seconds)
- **Exhale Duration**: Time to breathe out (2-8 seconds)
- **Hold After Exhale**: Pause after exhaling (0-8 seconds)

## Health Benefits

Regular breathing exercises can help with:

- Stress reduction and anxiety management
- Improved focus and concentration
- Better sleep quality
- Lower blood pressure
- Enhanced emotional regulation
- Increased mindfulness and presence

## Troubleshooting

### Plugin Not Working

- Ensure StreamDeck software is up to date
- Restart StreamDeck software if the plugin doesn't appear
- Check that Node.js 20+ is installed (required for audio features)

### No Sound

- Check that your system volume is not muted
- Verify sound setting is enabled in the plugin configuration
- Ensure your audio output device is working

## Development

This plugin is open source! See `CLAUDE.md`for development setup and architecture details.

### Building from Source

```bash
npm install
npm run build
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Report issues on [GitHub Issues](https://github.com/ramnivas/streamdeck-breathe/issues)
- For StreamDeck support, visit [Elgato Support](https://help.elgato.com/)

---

_Take a deep breath and enjoy mindful moments throughout your day! 🧘‍♀️_
