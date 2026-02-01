import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechSynthesis(text) {
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const highlightingTimerRef = useRef(null);

  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Load voices and handle voice changes
  useEffect(() => {
    const loadVoices = () => {
      try {
        const voices = synth.getVoices();
        console.log('Voices loaded:', voices.length);
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        setVoicesLoaded(true);
      } catch (error) {
        console.error('Error loading voices:', error);
        setVoicesLoaded(true); // Set to true anyway to avoid infinite loop
      }
    };

    // Initial load
    loadVoices();

    // Listen for voice changes (some browsers load voices asynchronously)
    try {
      if (synth.addEventListener) {
        synth.addEventListener('voiceschanged', loadVoices);
      }
    } catch (error) {
      console.error('Error adding voiceschanged listener:', error);
    }

    return () => {
      try {
        if (synth.removeEventListener) {
          synth.removeEventListener('voiceschanged', loadVoices);
        }
      } catch (error) {
        console.error('Error removing voiceschanged listener:', error);
      }
    };
  }, []);

  const speak = useCallback((lang, rate) => {
    if (!("speechSynthesis" in window)) {
      setVoiceUnavailable(true);
      return;
    }

    console.log('Attempting to speak with language:', lang);
    console.log('Voices loaded:', voicesLoaded);

    // Wait for voices to be loaded, but with timeout to prevent infinite wait
    if (!voicesLoaded) {
      console.log('Voices not loaded yet, waiting...');
      setTimeout(() => speak(lang, rate), 500);
      return;
    }

    // Additional safety check - if voices are still not loaded after timeout, proceed anyway
    const voices = synth.getVoices();
    if (voices.length === 0) {
      console.log('No voices available, but proceeding anyway...');
      setVoiceUnavailable(true);
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    setIsPaused(false);
    
    // Clear any existing timeouts
    if (highlightingTimerRef.current) {
      clearTimeout(highlightingTimerRef.current);
    }

    // Wait a moment for cancellation to complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      console.log('Available voices at speak time:', voices.map(v => `${v.name} (${v.lang})`));
      
      // Try exact match first
      let matchedVoice = voices.find(v => v.lang === lang);
      
      // If no exact match, try fallback logic for English
      if (!matchedVoice && lang === 'en-IN') {
        console.log('No en-IN voice found, trying fallback options...');
        
        // Try other English variants
        const englishVariants = ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en'];
        for (const variant of englishVariants) {
          matchedVoice = voices.find(v => v.lang === variant);
          if (matchedVoice) {
            console.log(`Found fallback voice: ${matchedVoice.name} (${matchedVoice.lang})`);
            break;
          }
        }
        
        // If still no match, try any English voice
        if (!matchedVoice) {
          matchedVoice = voices.find(v => v.lang.startsWith('en-'));
          if (matchedVoice) {
            console.log(`Found any English voice: ${matchedVoice.name} (${matchedVoice.lang})`);
          }
        }
      }
      
      // For regional languages, try broader language matching
      if (!matchedVoice && (lang === 'hi-IN' || lang === 'gu-IN' || lang === 'mr-IN' || lang === 'ta-IN' || lang === 'te-IN')) {
        const langPrefix = lang.split('-')[0]; // Get 'hi', 'gu', etc.
        matchedVoice = voices.find(v => v.lang.startsWith(langPrefix));
        if (matchedVoice) {
          console.log(`Found regional language voice: ${matchedVoice.name} (${matchedVoice.lang})`);
        }
      }

      if (!matchedVoice) {
        console.error(`No voice found for language: ${lang}`);
        console.log('Available languages:', [...new Set(voices.map(v => v.lang))]);
        setVoiceUnavailable(true);
        return;
      }

      console.log(`Using voice: ${matchedVoice.name} (${matchedVoice.lang})`);
      utterance.voice = matchedVoice;
      setVoiceUnavailable(false);

      // Pre-calculate word boundaries for precise highlighting
      const words = text.split(/\s+/).filter(word => word.length > 0);
      const wordBoundaries = [];
      let charPosition = 0;
      
      words.forEach((word, index) => {
        wordBoundaries.push({
          index,
          start: charPosition,
          end: charPosition + word.length,
          word
        });
        charPosition += word.length + 1; // +1 for space
      });

      let lastHighlightedIndex = -1;
      let boundaryEventCount = 0;

      utterance.onboundary = (event) => {
        boundaryEventCount++;
        
        console.log('=== BOUNDARY EVENT ===');
        console.log('Language:', lang);
        console.log('Event Type:', event.name);
        console.log('Char Index:', event.charIndex);
        console.log('Char Length:', event.charLength);
        console.log('Event Count:', boundaryEventCount);
        console.log('===================');
        
        // Process ALL boundary events for ALL languages
        if (event.charIndex !== undefined) {
          // Find the word that contains this character index
          let foundIndex = -1;
          
          for (let i = 0; i < wordBoundaries.length; i++) {
            const boundary = wordBoundaries[i];
            
            // Check if current char is within this word
            if (event.charIndex >= boundary.start && event.charIndex < boundary.end) {
              foundIndex = i;
              console.log(`✅ Found word: ${i} "${words[i]}" contains char ${event.charIndex}`);
              break;
            }
            
            // Check if this is the start of a word
            if (event.charIndex === boundary.start) {
              foundIndex = i;
              console.log(`✅ Found word start: ${i} "${words[i]}" at position ${event.charIndex}`);
              break;
            }
          }
          
          // If no exact match, use proximity matching
          if (foundIndex === -1) {
            let minDistance = Infinity;
            let closestIndex = -1;
            
            for (let i = 0; i < wordBoundaries.length; i++) {
              const boundary = wordBoundaries[i];
              const distance = Math.abs(event.charIndex - boundary.start);
              
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
              }
            }
            
            foundIndex = closestIndex;
            console.log(`🎯 Proximity match: word ${foundIndex} "${words[foundIndex]}" (distance: ${minDistance})`);
          }
          
          // Only update if we found a different word
          if (foundIndex !== -1 && foundIndex !== lastHighlightedIndex) {
            console.log(`🎯 HIGHLIGHTING: word ${foundIndex} "${words[foundIndex]}"`);
            lastHighlightedIndex = foundIndex;
            setCurrentWordIndex(foundIndex);
          } else {
            console.log(`⏭️  Skipping: same word or no match`);
          }
        } else {
          console.log(`❌ No charIndex in boundary event`);
        }
      };

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        console.log('Speech started for language:', lang);
        console.log('🎯 Using boundary events for all languages');
      };

      utterance.onend = () => {
        setCurrentWordIndex(-1);
        setIsPlaying(false);
        setIsPaused(false);
        console.log('Speech ended. Total boundary events:', boundaryEventCount);
        
        if (highlightingTimerRef.current) {
          clearTimeout(highlightingTimerRef.current);
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        console.error('Error type:', event.error);
        console.error('Error message:', event.error);
        
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(-1);
        
        // Don't automatically restart on interrupted errors
        // Let the user manually restart if needed
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
    }, 100); // Wait 100ms for cancellation to complete
  }, [text, voicesLoaded]);

  const pause = useCallback(() => {
    synth.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    synth.resume();
    setIsPaused(false);
  }, []);
  
  const stop = useCallback(() => {
    synth.cancel();
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    setIsPaused(false);
    if (highlightingTimerRef.current) {
      clearTimeout(highlightingTimerRef.current);
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    currentWordIndex,
    isPlaying,
    isPaused,
    voiceUnavailable,
  };
}
