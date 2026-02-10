import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeechSynthesis() {
  // State
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [voiceAvailable, setVoiceAvailable] = useState(true);

  // Refs
  const utteranceRef = useRef(null);
  const wordBoundariesRef = useRef([]);

  /**
   * Load available voices
   */
  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return [];
    }

    const availableVoices = window.speechSynthesis.getVoices();
    console.log("Total voices loaded:", availableVoices.length);
    setVoices(availableVoices);
    return availableVoices;
  }, []);

  // Load voices on mount
  useEffect(() => {
    loadVoices();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      }
    };
  }, [loadVoices]);

  /**
   * Priority: Local/OS voice > Microsoft > Browser voice
   */
  const findVoiceForLanguage = useCallback((langCode) => {
    if (!voices || voices.length === 0) {
      return null;
    }

    const langPrefix = langCode.split("-")[0];

    // Get matching voices
    const matchingVoices = voices.filter(
      (v) =>
        v.lang === langCode ||
        v.lang.startsWith(langPrefix + "-") ||
        v.lang === langPrefix
    );

    if (matchingVoices.length === 0) {
      console.log(`No voice found for ${langCode}`);
      return null;
    }

    console.log(`Found ${matchingVoices.length} voice(s) for ${langCode}:`);
    matchingVoices.forEach((v) => {
      console.log(`  - ${v.name} | Local: ${v.localService}`);
    });

    // Priority 1: Local/OS voice (best onboundary support)
    const localVoice = matchingVoices.find((v) => v.localService === true);
    if (localVoice) {
      console.log(`✓ Using LOCAL voice: ${localVoice.name}`);
      return localVoice;
    }

    // Priority 2: Microsoft voice
    const microsoftVoice = matchingVoices.find((v) =>
      v.name.toLowerCase().includes("microsoft")
    );
    if (microsoftVoice) {
      console.log(`✓ Using Microsoft voice: ${microsoftVoice.name}`);
      return microsoftVoice;
    }

    // Priority 3: Any available voice
    console.log(`✓ Using voice: ${matchingVoices[0].name}`);
    return matchingVoices[0];
  }, [voices]);

  /**
   * Update voice for language
   */
  const updateVoiceForLanguage = useCallback((langCode) => {
    const voice = findVoiceForLanguage(langCode);
    setSelectedVoice(voice);
    setVoiceAvailable(voice !== null);
    return voice;
  }, [findVoiceForLanguage]);

  /**
   * Parse text into words with positions
   */
  const parseTextIntoWords = useCallback((text) => {
    if (!text) return [];

    const words = [];
    const regex = /\S+/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      words.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length,
        index: words.length,
      });
    }

    return words;
  }, []);

  /**
   * Find word index from character position
   */
  const findWordIndexAtPosition = useCallback((charIndex) => {
    const boundaries = wordBoundariesRef.current;

    if (!boundaries || boundaries.length === 0) return -1;
    if (charIndex < 0) return 0;

    // Find exact match
    for (let i = 0; i < boundaries.length; i++) {
      if (charIndex >= boundaries[i].start && charIndex < boundaries[i].end) {
        return i;
      }
    }

    // Find closest word
    for (let i = 0; i < boundaries.length; i++) {
      if (charIndex < boundaries[i].start) {
        return i;
      }
    }

    return boundaries.length - 1;
  }, []);

  /**
   * Play speech
   */
  const play = useCallback((text, langCode, rate = 1) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.error("Speech synthesis not available");
      return;
    }

    if (!text || text.trim() === "") {
      console.error("No text to speak");
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Parse words
    const words = parseTextIntoWords(text);
    wordBoundariesRef.current = words;

    console.log("Words:", words.length, "| Language:", langCode);

    // Get voice
    let voice = selectedVoice;
    if (!voice || !voice.lang.startsWith(langCode.split("-")[0])) {
      voice = findVoiceForLanguage(langCode);
      setSelectedVoice(voice);
    }

    setVoiceAvailable(voice !== null);

    if (!voice) {
      console.warn(`No voice available for ${langCode}. Please install the language in your OS.`);
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    console.log(`Speaking with: ${voice.name} | Local: ${voice.localService}`);

    // Boundary event - ONLY method for highlighting
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const wordIndex = findWordIndexAtPosition(event.charIndex);
        if (wordIndex >= 0) {
          setHighlightIndex(wordIndex);
        }
      }
    };

    // Start event
    utterance.onstart = () => {
      console.log("Speech started");
      setIsPlaying(true);
      setIsPaused(false);
      setHighlightIndex(0);
    };

    // End event
    utterance.onend = () => {
      console.log("Speech ended");
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightIndex(-1);
    };

    // Error event
    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      console.error("Speech error:", event.error);
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightIndex(-1);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, parseTextIntoWords, findVoiceForLanguage, findWordIndexAtPosition]);

  /**
   * Pause
   */
  const pause = useCallback(() => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      console.log("Speech paused");
    }
  }, [isPlaying, isPaused]);

  /**
   * Resume
   */
  const resume = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      console.log("Speech resumed");
    }
  }, [isPaused]);

  /**
   * Stop
   */
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setHighlightIndex(-1);
    console.log("Speech stopped");
  }, []);

  return {
    voices,
    selectedVoice,
    isPlaying,
    isPaused,
    highlightIndex,
    voiceAvailable,
    play,
    pause,
    resume,
    stop,
    updateVoiceForLanguage,
  };
}