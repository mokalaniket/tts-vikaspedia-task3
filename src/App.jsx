import {
  Container,
  Typography,
  TextField,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

import { CONTENT, LANGUAGES } from "./data/sampleText";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";

import Controls from "./components/Controls";
import LanguageSelector from "./components/LanguageSelector";
import FallbackAlert from "./components/FallbackAlert";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State
  const [language, setLanguage] = useState("en-IN");
  const [rate, setRate] = useState(1);
  const [content, setContent] = useState(CONTENT);

  const currentText = content[language] || "";

  // Speech hook
  const {
    isPlaying,
    isPaused,
    highlightIndex,
    voiceAvailable,
    play,
    pause,
    resume,
    stop,
    updateVoiceForLanguage,
  } = useSpeechSynthesis();

  // Refs for auto-scroll
  const containerRef = useRef(null);
  const highlightRef = useRef(null);

  // Update voice when language changes
  useEffect(() => {
    stop();
    updateVoiceForLanguage(language);
  }, [language, stop, updateVoiceForLanguage]);

  // Auto-scroll to highlighted word
  useEffect(() => {
    if (highlightRef.current && containerRef.current && isPlaying) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightIndex, isPlaying]);

  // Handle text change
  const handleTextChange = (newText) => {
    setContent((prev) => ({ ...prev, [language]: newText }));
  };

  // Handle play
  const handlePlay = () => {
    play(currentText, language, rate);
  };

  // Get language label
  const getLanguageLabel = (code) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang ? lang.label : code;
  };

  // Render highlighted text word by word
  const renderHighlightedText = () => {
    if (!currentText) return null;

    const result = [];
    const regex = /(\S+)/g;
    let lastIndex = 0;
    let match;
    let wordIndex = 0;

    while ((match = regex.exec(currentText)) !== null) {
      // Add whitespace
      if (match.index > lastIndex) {
        result.push(
          <span key={`s-${wordIndex}`}>
            {currentText.substring(lastIndex, match.index)}
          </span>
        );
      }

      const isHighlighted = isPlaying && wordIndex === highlightIndex;

      result.push(
        <span
          key={`w-${wordIndex}`}
          ref={isHighlighted ? highlightRef : null}
          style={{
            backgroundColor: isHighlighted ? "#FFEB3B" : "transparent",
            padding: isHighlighted ? "2px 6px" : "0",
            borderRadius: "4px",
            fontWeight: isHighlighted ? "600" : "400",
            boxShadow: isHighlighted ? "0 2px 8px rgba(255,235,59,0.6)" : "none",
            transition: "all 0.1s ease",
          }}
        >
          {match[0]}
        </span>
      );

      lastIndex = match.index + match[0].length;
      wordIndex++;
    }

    if (lastIndex < currentText.length) {
      result.push(<span key="end">{currentText.substring(lastIndex)}</span>);
    }

    return result;
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        
        {/* Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, textAlign: { xs: "center", sm: "left" } }}
        >
          Task-3 TTS Vikaspedia
        </Typography>

        {/* Alert if no voice available */}
        <FallbackAlert show={!voiceAvailable} language={getLanguageLabel(language)} />

        {/* Text Display Area */}
        <Box sx={{ mb: 3 }}>
          {isPlaying || isPaused ? (
            // Highlighted text during playback
            <Box
              ref={containerRef}
              sx={{
                minHeight: 100,
                maxHeight: 250,
                overflowY: "auto",
                p: 2,
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: 1,
                backgroundColor: "#fafafa",
                fontSize: { xs: "16px", sm: "18px" },
                lineHeight: 2,
                fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
                whiteSpace: "pre-wrap",
              }}
            >
              {renderHighlightedText()}
            </Box>
          ) : (
            <TextField
              multiline
              fullWidth
              value={currentText}
              onChange={(e) => handleTextChange(e.target.value)}
              variant="outlined"
              minRows={3}
              maxRows={8}
              placeholder="Enter text here..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
                  fontSize: { xs: "16px", sm: "18px" },
                  lineHeight: 2,
                },
              }}
            />
          )}
        </Box>

        {/* Controls */}
        <Controls
          onPlay={handlePlay}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          isPlaying={isPlaying}
          isPaused={isPaused}
          isMobile={isMobile}
        />

        {/* Language & Rate Selector */}
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          rate={rate}
          setRate={setRate}
          isMobile={isMobile}
        />
        
      </Paper>
    </Container>
  );
}

export default App;