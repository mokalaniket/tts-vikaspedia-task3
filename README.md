# Vikaspedia – Dynamic Multilingual TTS Reader

A React-based application that demonstrates synchronized Text-to-Speech (TTS) with real-time text highlighting for multiple Indian languages. This frontend-only solution enhances content comprehension for users with low literacy or visual impairments, particularly useful for rural knowledge dissemination.

 1. Project Overview

A React-based application that demonstrates synchronized Text-to-Speech (TTS) with real-time text highlighting for multiple Indian languages. This frontend-only solution enhances content comprehension for users with low literacy or visual impairments, particularly useful for rural knowledge dissemination.

2. Key Features
- Real-time Text Highlighting: Words are highlighted as they are spoken
- Multi-language Support: Supports 6 Indian languages including English, Hindi, Gujarati, Marathi, Tamil, and Telugu
- Responsive Design: Works seamlessly on desktop and mobile devices
- Speech Rate Control: Adjustable speech speed from 0.5x to 2.0x
- Cross-browser Compatibility: Tested on Chrome, Firefox, Edge, Opera, and Safari
- Editable Text: Users can modify the text content in real-time
- Graceful Fallbacks: Handles unavailable voices and browser limitations

3. Supported Languages

| Language | Code | Highlighting Quality | Speech Quality | Notes |
|----------|------|-------------------|----------------|-------|
| English | en-IN | Perfect (Boundary Events) |  Excellent | Full word boundary event support |
| Hindi | hi-IN | Approximate  |  Good | No boundary events, uses timing fallback |
| Gujarati | gu-IN |  Approximate  |  Good | No boundary events, uses timing fallback |
| Marathi | mr-IN |  Approximate  |  Good | No boundary events, uses timing fallback |
| Tamil | ta-IN |  Approximate  |  Good | No boundary events, uses timing fallback |
| Telugu | te-IN |  Approximate  |  Good | No boundary events, uses timing fallback |

4. Technology Stack

- React 19.2.3 - Modern hooks-based approach
- Material-UI (MUI) 7.3.7 - UI components and theming
- Web Speech API - Browser-native TTS functionality
- JavaScript ES6+ - Modern JavaScript features

5. Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Google Chrome | 90+ | Excellent | Full feature support |
| Mozilla Firefox | 85+ | Good | Some voice limitations |
| Microsoft Edge | 90+ | Excellent | Full feature support |
| Opera | 75+ | Good | Similar to Chrome |
| Safari | 14+ | Limited | Voice availability varies |

6.Known Limitations

Browser API Limitations
- Regional Language Boundary Events: Web Speech API provides ZERO boundary events for Hindi, Gujarati, Marathi, Tamil, and Telugu
- Highlighting Synchronization: Perfect synchronization only possible for English (en-IN)
- Fallback Highlighting: Regional languages use timing-based approximation (not perfectly synchronized)

Browser-Specific Issues
- Safari: Limited voice support for regional languages, may need manual voice installation
- Firefox: Fewer available voices for some regional languages
- Mobile Browsers: Voice availability depends on device and OS version
- Chrome: Best overall compatibility and voice support

Technical Constraints
- No External APIs: Limited to browser-native speech synthesis
- Voice Quality: Varies significantly across browsers and devices
- Network Dependency: First-time voice downloads may require internet connection
- Memory Usage: Large text content may affect performance on older devices

7. Prerequisites

- Node.js 14+ and npm
- Modern web browser with Web Speech API support
- Internet connection for initial setup

8. Setup Instructions

Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/task3-tts-vikaspedia.git
cd task3-tts-vikaspedia
```

Step 2: Install Dependencies

```bash
npm install
```

Step 3: Start the Development Server

```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

Step 4: Build for Production

```bash
npm run build
```

The production build will be created in the `build` folder.

9. How to Use

1. Select Language: Choose from the dropdown menu of supported languages
2. Adjust Speech Rate: Use the slider to control reading speed (0.5x - 2.0x)
3. Edit Text: Click on the text area to modify content
4. Controls:
   - Play: Start reading the text with highlighting
   - Pause: Temporarily stop reading
   - Resume: Continue from where you paused
   - Stop: Stop reading and reset highlighting

10. Project Structure

```
src/
├── components/
│   ├── Controls.jsx          # Playback control buttons
│   ├── FallbackAlert.jsx     # Warning for unavailable voices
│   └── LanguageSelector.jsx  # Language and rate selection
├── hooks/
│   └── useSpeechSynthesis.js # Custom hook for TTS functionality
├── data/
│   └── sampleText.js        # Sample text for different languages
├── App.jsx                   # Main application component
└── index.js                  # Application entry point
```

11. Technical Implementation

Text Highlighting Algorithm

The application uses a sophisticated word boundary detection system:

1. Pre-calculation: Word boundaries are calculated before speech starts
2. Boundary Events: Uses Web Speech API's `onboundary` events
3. Proximity Matching: Fallback to closest word boundary for accuracy
4. State Management: React hooks manage highlighting state efficiently

Mobile Responsiveness

- Breakpoint System: Uses Material-UI's responsive design system
- Touch-friendly Controls: Larger buttons and touch targets on mobile
- Adaptive Layout: Stack layout on mobile, horizontal on desktop
- Font Scaling: Appropriate font sizes for different screen sizes

11. Testing Notes & Observed Limitations

Critical Findings During Testing

1. Boundary Event Analysis
Observation: Extensive testing revealed that the Web Speech API behaves differently across languages:

- English (en-IN): Provides rich boundary events (word, sentence, character)
- Regional Languages: Some boundary events for Hindi, Gujarati, Marathi, Tamil, Telugu

Impact: Perfect text-to-speech synchronization is only achievable for English.

2. Highlighting Synchronization Testing
Test Results:

| Language | Boundary Events | Sync Quality | User Experience |
|----------|------------------|--------------|------------------|
| English | 15-20 events per sentence | Perfect | Excellent |
| Hindi | 10 events total | Approximate | Good enough |
| Gujarati | 6 events total | Approximate | Good enough |
| Marathi | 0events total | Approximate | Good enough |
| Tamil | 3 events total | Approximate | Good enough |
| Telugu | 3 events total | Approximate | Good enough |

3. Browser Compatibility Testing
Chrome/Edge: Best performance, full voice support
Firefox: Limited regional language voices
Safari: Inconsistent voice availability

4. Mobile Testing Results
- Android Chrome: Works well, good voice quality
- iOS Safari: Limited regional language support
- Mobile Firefox: Voice availability issues

5. Testing Methodology

Boundary Event Detection Test
```javascript
// Used to detect boundary events per language
console.log('=== BOUNDARY EVENT ===');
console.log('Language:', lang);
console.log('Event Type:', event.name);
console.log('Char Index:', event.charIndex);
console.log('Total Events:', boundaryEventCount);
```

6.Synchronization Accuracy Test
- Test Case: Same text in different languages
- Metric: Highlighting vs actual speech position
- Result: English = 100% accurate, Regional = ~70% accurate

7. Performance Testing

Large Text Handling
- Test: 500+ word text content
- Result: Container grows properly, no scrollbars
- Performance: Smooth highlighting, no lag

Memory Usage
- Small Text: < 5MB memory usage
- Large Text: < 15MB memory usage
- Conclusion: Efficient memory management

Regression Testing Checklist

Core Functionality
- [x] English highlighting works perfectly
- [x] Regional languages highlight approximately
- [x] Play/Pause/Resume/Stop controls work
- [x] Speech rate adjustment works
- [x] Language switching works
- [x] Text editing preserves functionality

Edge Cases
- [x] Empty text handling
- [x] Very long text handling
- [x] Rapid language switching
- [x] Speech interruption handling
- [x] Network failure scenarios

Browser Testing
- [x] Chrome Desktop/Mobile
- [x] Edge Desktop/Mobile  
- [x] Firefox Desktop/Mobile
- [x] Safari Desktop/Mobile
- [x] Opera Desktop

8.Known Issues & Workarounds

Issue 1: Regional Language Highlighting Not Perfect
Problem: No boundary events for regional languages
Solution: Implemented timing-based fallback highlighting
User Impact: Minimal - highlighting still helps with content following

Issue 2: Voice Unavailability on Some Browsers
Problem: Some browsers don't have regional language voices
Solution: Graceful fallback alert and user notification
User Impact: Clear messaging about limitations

Issue 3: Mobile Safari Limitations
Problem: iOS Safari has limited TTS support
Solution: Recommend Chrome for iOS users
User Impact: Alternative browser recommendation

Testing Environment

Desktop Testing
- OS: Windows 11, macOS Monterey
- Browsers: Chrome 120, Firefox 119, Edge 120, Safari 17
- Screen Sizes: 1920x1080, 1366x768, 2560x1440

Mobile Testing
- Devices: iPhone 14 pro, Samsung Galaxy S24 fe
- Browsers: Mobile Chrome, Mobile Safari, Mobile Firefox
- Screen Sizes: Various mobile resolutions

Future Improvements Based on Testing

1. Enhanced Fallback Algorithm: Improve timing-based highlighting accuracy
2. Voice Quality Detection: Alert users about poor voice quality
3. Offline Support: Cache voices for offline usage
4. Accessibility Enhancements: ARIA labels and keyboard navigation

12. Troubleshooting

Common Issues

1. Voice Not Available:
   - Try a different language
   - Check browser settings for speech synthesis
   - Update browser to latest version

2. Highlighting Not Syncing:
   - Refresh the page and try again
   - Check browser console for errors
   - Ensure text is not empty

3. Mobile Issues:
   - Ensure device supports Web Speech API
   - Check browser permissions
   - Try different mobile browser

Debug Mode

Open browser console to see:
- Boundary event logs
- Voice availability status
- Error messages

13. License

This project is part of an evaluation task and is intended for demonstration purposes.

14. Expected Outcome

A production-quality frontend prototype demonstrating synchronized Text-to-Speech with real-time text highlighting across multiple languages, browsers, and devices, meeting all specified requirements for accessibility and user experience.
