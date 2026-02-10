# TTS Vikaspedia — Text-to-Speech with Synchronized Highlighting

A React frontend that demonstrates synchronized Text-to-Speech (TTS) with real-time word highlighting for multiple Indian languages using the Web Speech API's `onboundary` events and OS-installed voices.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Supported Languages](#supported-languages)
- [Technology Stack](#technology-stack)
- [Browser Compatibility](#browser-compatibility)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Installing Language Voices](#installing-language-voices)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [Technical Implementation](#technical-implementation)
- [Voice Selection Priority](#voice-selection-priority)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- [Author](#author)
- [License](#license)

## Project Overview

A frontend-only React application that reads text aloud and highlights the currently spoken word in real-time. It aims to improve comprehension for users with low literacy or visual impairments, useful for rural knowledge dissemination (Vikaspedia).

## Key Features

- Real-time word highlighting using `onboundary` events
- Multi-language support (English, Hindi, Marathi, Tamil, Telugu, Gujarati — limited support)
- Playback controls: Play, Pause, Resume, Stop
- Adjustable speech rate (0.5× — 2.0×)
- Editable text area
- Responsive UI (desktop & mobile)
- Prefers OS-installed/local voices for accurate boundary events

## Supported Languages

| Language | Code  | Status | Requirement |
|---|---:|:---:|---|
| English  | `en-IN` | ✅ Ready | Usually pre-installed |
| Hindi    | `hi-IN` | ✅ Ready | OS voice installation required |
| Marathi  | `mr-IN` | ✅ Ready | OS voice installation required |
| Tamil    | `ta-IN` | ✅ Ready | OS voice installation required |
| Telugu   | `te-IN` | ✅ Ready | OS voice installation required |
| Gujarati | `gu-IN` | ✅ Ready | OS voice installation required |

## Technology Stack

- React 18 (hooks)
- Material-UI (MUI)
- Web Speech API (`SpeechSynthesis`, `SpeechSynthesisUtterance`)
- JavaScript (ES6+)

## Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---|:---:|:---:|---|
| Chrome  | ✅ Full  | ✅ Full  | Best support |
| Edge    | ✅ Full  | ✅ Full  | Excellent support |
| Firefox | ✅ Full  | ✅ Full  | Good support |
| Safari  | ✅ Full  | ⚠️ Limited | Voice availability varies |
| Opera   | ✅ Full  | ✅ Full  | Similar to Chrome |

## Prerequisites

- Node.js 16+ and npm
- Modern browser with Web Speech API support
- OS-installed voices for regional languages (for reliable `onboundary` events)

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/mokalaniket/tts-vikaspedia-task3.git
cd tts-vikaspedia-task3
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open at: http://localhost:3000

4. Build for production:

```bash
npm run build
```

## Installing Language Voices

To get synchronized highlighting for regional languages, install the OS-level voice for the language.

Windows 10/11:

1. Open Settings → Time & Language → Language
2. Click **Add a language**
3. Search and select the language (e.g., Hindi)
4. Enable **Text-to-speech** during installation
5. Install and restart your browser

macOS:

1. Open System Preferences → Accessibility → Spoken Content
2. Click **System Voice** → **Manage Voices**
3. Download the required language voice
4. Restart your browser

## How to Use

- **Select language** from the dropdown
- **Adjust speech rate** with the slider (0.5× — 2.0×)
- **Edit text** in the text area (available when stopped)
- **Play** to start reading with synchronized highlighting
- **Pause / Resume / Stop** as needed

## Project Structure

```text
src/
├── components/
│   ├── Controls.jsx          # Play/Pause/Resume/Stop buttons
│   ├── FallbackAlert.jsx     # Alert when voice not available
│   └── LanguageSelector.jsx  # Language dropdown & rate slider
├── data/
│   └── sampleText.js         # Sample text for each language
├── hooks/
│   └── useSpeechSynthesis.js # TTS logic with onboundary events
├── App.jsx                   # Main application component
└── index.js                  # Application entry point
```

## Technical Implementation

### How it works

1. User selects a language from the dropdown
2. App loads available voices and prefers matching OS-installed voices
3. User clicks **Play**
4. A `SpeechSynthesisUtterance` is created with the selected voice and rate
5. `onboundary` events fire as words are spoken
6. The app determines the current word by character positions and updates highlighting in real time
7. User can Pause, Resume, or Stop; on end, highlighting resets

## Voice Selection Priority

1. Local / OS-installed voice (`localService = true`)
2. Microsoft voice (on Windows)
3. Any available voice for the language
4. Show an alert if no suitable voice is found

## Known Limitations

- Regional languages require OS-level voice installation for reliable `onboundary` events
- Browser-only voices (e.g., Google voices) may not provide boundary events
- Safari and some mobile browsers have limited regional language support
- No external TTS APIs are used (frontend-only). Voice quality varies by OS/browser

Note about Android / iOS: highlighting may not work on some mobile devices due to OS/browser constraints.

## Troubleshooting

- **Voice not available**: Install the OS language voice (see "Installing Language Voices") and restart the browser
- **Highlighting not working**: Ensure a local OS voice is installed, check console for errors, refresh the page
- **Mobile issues**: Use Chrome where possible and confirm device TTS/language packs

## Author

Aniket Mokal

## License

MIT License — this project is part of an evaluation task for Vikaspedia.
