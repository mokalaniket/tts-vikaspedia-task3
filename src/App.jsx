import { 
  Container, 
  Typography, 
  TextField, 
  Box, 
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

import { textByLanguage } from "./data/sampleText";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";

import TextHighlighter from "./components/TextHighlighter";
import Controls from "./components/Controls";
import LanguageSelector from "./components/LanguageSelector";
import FallbackAlert from "./components/FallbackAlert";

const HighlightedTextInput = ({ text, currentWordIndex, onChange, ...props }) => {
  const textareaRef = useRef(null);
  
  // Split text into words for highlighting
  const getWords = (text) => {
    if (!text) return [];
    return text.split(/\s+/).filter(word => word.length > 0);
  };
  
  const words = getWords(text);
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '150px', sm: '120px' },
        fontSize: { xs: '14px', sm: '16px' },
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.6,
        padding: 2,
        boxSizing: 'border-box',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
    >
      {/* Highlighted text layer */}
      <Box
        sx={{
          fontSize: { xs: '14px', sm: '16px' },
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'normal',
          color: 'text.primary',
          zIndex: 1,
          minHeight: '100%',
          position: 'relative',
        }}
      >
        {words.map((word, index) => (
          <span key={index}>
            <span
              style={{
                backgroundColor: index === currentWordIndex ? '#ffeb3b' : 'transparent',
                borderBottom: index === currentWordIndex ? '3px solid #ff9800' : 'none',
                borderRadius: '4px',
                padding: index === currentWordIndex ? '2px 4px' : '0',
                margin: index === currentWordIndex ? '0 2px' : '0',
                fontWeight: index === currentWordIndex ? '600' : '400',
                color: index === currentWordIndex ? '#000' : 'inherit',
                transition: 'all 0.3s ease',
                boxShadow: index === currentWordIndex ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {word}
            </span>
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </Box>
      
      {/* Hidden textarea for input */}
      <TextField
        inputRef={textareaRef}
        multiline
        fullWidth
        value={text}
        onChange={onChange}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: { xs: '14px', sm: '16px' },
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'normal',
            color: 'transparent',
            caretColor: 'primary.main',
            padding: 0,
            margin: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            '&::selection': {
              backgroundColor: 'rgba(25, 118, 210, 0.2)',
            },
          }
        }}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          backgroundColor: 'transparent',
          border: 'none',
          '& .MuiInputBase-root': {
            backgroundColor: 'transparent',
          },
          '& .MuiInputBase-input': {
            backgroundColor: 'transparent',
          },
        }}
        overflow="auto !important"
        resize="none"
        {...props}
      />
    </Box>
  );
};

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [language, setLanguage] = useState("en-IN");
  const [rate, setRate] = useState(1);
  const [dynamicText, setDynamicText] = useState(textByLanguage["en-IN"]);

  useEffect(() => {
    setDynamicText(textByLanguage[language]);
  }, [language]);

  const {
    speak,
    pause,
    resume,
    stop,
    currentWordIndex,
    isPlaying,
    isPaused,
    voiceUnavailable,
  } = useSpeechSynthesis(dynamicText);

  useEffect(() => {
    stop();
  }, [dynamicText]);

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: { xs: 2, sm: 4 }, 
        mb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 2,
          backgroundColor: 'background.default'
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h1"
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Task-3 TTS Vikaspedia
        </Typography>

        <FallbackAlert show={voiceUnavailable} />

        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 2, 
            fontWeight: 500,
            color: 'text.secondary'
          }}
        >
          Content
        </Typography>

        <Box sx={{ mb: 3 }}>
          <HighlightedTextInput
            text={dynamicText}
            currentWordIndex={currentWordIndex}
            onChange={(e) => setDynamicText(e.target.value)}
          />
        </Box>

        <Controls
          onPlay={() => speak(language, rate)}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          isPlaying={isPlaying}
          isPaused={isPaused}
          isMobile={isMobile}
        />

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
