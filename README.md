# B-SIDE Player

A Progressive Web App (PWA) to listen to the **B-SIDE** podcast by Alessio Bertallot on Radio Capital.

![B-SIDE Player](icon-192.png)

## Features

### Audio Player
- Stream episodes by date
- Playback controls: play/pause, -30s, +30s
- Quick navigation between days with ◀ ▶ arrows
- Progress bar with elapsed and remaining time
- Volume control with mute/unmute

### Favorites
- Save favorite episodes
- Quick access from favorites list
- Persistent across sessions

### Sleep Timer
- Auto-stop after 5, 15, 30, 45, or 60 minutes
- Real-time countdown display
- Automatically pauses playback

### Connection Management
- Automatic reconnection on network interruption
- Retry with exponential backoff
- Online/offline detection
- Playback resumes from interruption point
- Position saved every 5 seconds

### PWA
- Installable on Android, iOS, and desktop
- Works offline (interface)
- Lockscreen and notification controls
- Bluetooth headphones compatible
- Custom home screen icon

### Theme
- Light and dark mode
- Preference saved automatically
- System theme color adaptation

## Installation

### On Android smartphone
1. Open [https://marcomauro.github.io/bside-player/](https://marcomauro.github.io/bside-player/) with Chrome
2. Tap menu ⋮ → "Add to Home screen"
3. The app will appear on your home screen with the B-SIDE icon

### On iOS
1. Open the site with Safari
2. Tap Share → "Add to Home Screen"
3. Confirm installation

### On desktop
1. Open the site with Chrome
2. Click the install icon in the address bar
3. Confirm installation

## Project Structure

```
bside-player/
├── index.html          # Main HTML structure
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (caching)
├── icon-192.png        # Icon 192x192
├── icon-512.png        # Icon 512x512
├── css/
│   ├── variables.css   # CSS custom properties (themes)
│   ├── base.css        # Reset and global styles
│   ├── layout.css      # Player layout structure
│   ├── components.css  # UI components (buttons, popups, etc.)
│   └── responsive.css  # Media queries
└── js/
    ├── config.js       # Constants and configuration
    ├── utils.js        # Utility functions
    ├── engine.js       # Global state management
    ├── storage.js      # LocalStorage handling
    ├── network.js      # Network monitoring and recovery
    ├── audio.js        # Audio events and playback
    ├── ui.js           # UI interactions
    ├── theme.js        # Theme management
    ├── favorites.js    # Favorites system
    ├── sleep.js        # Sleep timer
    ├── mediasession.js # Media Session API (lockscreen)
    ├── install.js      # PWA installation
    └── app.js          # App initialization
```

## Technologies

- HTML5 / CSS3 / JavaScript (ES6 Modules)
- Media Session API (lockscreen controls)
- Service Worker (cache and installation)
- Web App Manifest (PWA)
- Connection API (network quality detection)

## Local Development

To test locally, you need a local server (ES6 modules require HTTP):

```bash
# With Python
python3 -m http.server 8000

# With Ruby
ruby -run -ehttpd . -p8000
```

Then open `http://localhost:8000`

## Author

Developed by Marco Mauro

## License

This project is released under the MIT License.

---

🎧 Enjoy listening!
