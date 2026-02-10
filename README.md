Task-3: TTS Vikaspedia - Text to Speech with Synchronized Highlighting

A React-based application that demonstrates synchronized Text-to-Speech (TTS) with real-time text highlighting for multiple Indian languages using the Web Speech API's onboundary events/OS installed languages.

1. Project Overview

A frontend-only React application that reads text aloud and highlights the currently spoken word in real-time. This solution enhances content comprehension for users with low literacy or visual impairments, particularly useful for rural knowledge dissemination through Vikaspedia.

2. Key Features

Real-time Word Highlighting: Words are highlighted as they are spoken using onboundary events/OS Languages
Multi-language Support: English, Hindi, (Marathi, Tamil, Telugu, and Gujarati)Limited support
Playback Controls: Play, Pause, Resume, and Stop functionality
Speech Rate Control: Adjustable speed from 0.5x to 2.0x
Editable Text: Users can modify the text content
Responsive Design: Works on desktop and mobile devices
Voice Priority: Uses OS-installed local voices for best highlighting accuracy

3. Supported Languages

Language     Code    Status  Requirement
English      en-IN   ✅ Ready   Usually pre-installed
Hindi        hi-IN   ✅ Ready   OS voice installation required
Marathi      mr-IN   ✅ Ready   OS voice installation required
Tamil        ta-IN   ✅ Ready   OS voice installation required
Telugu       te-IN   ✅ Ready   OS voice installation required
Gujarati     gu-IN   ✅ Ready   OS voice installation required

4. Technology Stack

React 18 - Modern hooks-based approach
Material-UI (MUI) - UI components and theming
Web Speech API - Browser-native TTS with onboundary events
JavaScript ES6+ - Modern JavaScript features

5. Browser Compatibility

Browser  Desktop    Mobile     Notes
Chrome   ✅ Full    ✅ Full    Best support
Edge     ✅ Full    ✅ Full    Excellent support
Firefox  ✅ Full    ✅ Full    Good support
Safari   ✅ Full    ⚠️ Limited Voice availability varies
Opera    ✅ Full    ✅ Full    Similar to Chrome

6. Prerequisites

Node.js 16+ and npm
Modern web browser with Web Speech API support
OS-installed language voices for regional languages

7. Setup Instructions

Step 1: Clone the Repository

git clone https://github.com/mokalaniket/tts-vikaspedia-task3.git
cd tts-vikaspedia-task3

Step 2: Install Dependencies

npm install

Step 3: Start Development Server

npm start

The application opens at http://localhost:3000

Step 4: Build for Production

npm run build

8. Installing Language Voices

For regional languages to work with synchronized highlighting, OS-level voice installation is required.

Windows 10/11:
Open Settings → Time & Language → Language
Click Add a language
Search and select your language (e.g., Hindi)
Check Text-to-speech option during installation
Click Install and wait for completion
Restart your browser

Mac:
Open System Preferences → Accessibility → Spoken Content
Click System Voice dropdown
Select Manage Voices
Find and download the required language voice
Restart your browser

9. How to Use

Select Language: Choose from the dropdown menu
Adjust Speech Rate: Use the slider (0.5x - 2.0x)
Edit Text: Modify content in the text area (when stopped)
Play: Start reading with synchronized highlighting
Pause: Temporarily stop reading
Resume: Continue from where you paused
Stop: Stop reading and reset highlighting

10. Project Structure

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

11. Technical Implementation

How It Works

User selects a language from dropdown
App loads available voices and selects matching OS voice
User clicks Play button
SpeechSynthesisUtterance is created with selected voice and rate
onboundary events fire as each word is spoken
App calculates which word is being spoken using character position
Highlighted word updates in real-time
User can Pause, Resume, or Stop at any time
On speech end, highlighting resets

Voice Selection Priority

1. Local/OS-installed voice (localService = true)
   ↓
2. Microsoft voice (usually local on Windows)
   ↓
3. Any available voice for the language
   ↓
4. Show error alert if no voice found

12. Known Limitations

Voice Requirements
Regional languages require OS-level voice installation
onboundary events only work reliably with local/OS voices
Browser-only voices (Google) may not provide boundary events

Browser-Specific
Safari: Limited voice availability for regional languages
Mobile: Voice availability depends on device and OS
Firefox: Fewer regional language voices available

Technical Constraints
No external TTS APIs used (frontend-only)
Voice quality varies across browsers and devices
First-time voice downloads may require internet

Android OS/Ios
Only English speaking will be there no highlighting is there because of security constraints or os issues on both devices.

13. Troubleshooting

Voice Not Available
Install the language voice in your OS (see Section 8)
Restart browser after installation
Try a different browser

Highlighting Not Working
Ensure OS voice is installed (not just browser voice)
Check browser console for errors
Refresh the page and try again

Mobile Issues
Use Chrome for best compatibility
Check device TTS settings
Ensure language pack is installed on device
If possible then highlighting will be there

14. Author

Aniket Mokal

15. License

MIT License - This project is part of an evaluation task for Vikaspedia.
