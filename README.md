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

### Sleep Timer
- Auto-stop after 30, 60, or 90 minutes
- Real-time countdown display
- Automatically pauses during network errors

### Connection Management
- Automatic reconnection on network interruption
- Retry with exponential backoff (5s, 10s, 15s, 20s)
- Online/offline detection
- Playback resumes from interruption point

### PWA
- Installable on Android and desktop
- Works offline (interface)
- Lockscreen and notification controls
- Bluetooth headphones compatible
- Custom home screen icon

### Theme
- Light and dark mode
- Preference saved automatically

## Installation

### On Android smartphone
1. Open [https://marcomauro.github.io/bside-player/](https://marcomauro.github.io/bside-player/) with Chrome
2. Tap menu ⋮ → "Add to Home screen"
3. The app will appear on your home screen with the B-SIDE icon

### On desktop
1. Open the site with Chrome
2. Click the install icon in the address bar
3. Confirm installation

## Project Files

```
├── index.html      # Main application
├── manifest.json   # PWA manifest
├── sw.js           # Service Worker
├── icon-192.png    # Icon 192x192
├── icon-512.png    # Icon 512x512
└── README.md       # Documentation
```

## Technologies

- HTML5 / CSS3 / JavaScript
- Media Session API (lockscreen controls)
- Service Worker (cache and installation)
- Web App Manifest (PWA)

## Author

Developed by Marco Mauro

## License

This project is released under the MIT License.

---

🎧 Enjoy listening!
