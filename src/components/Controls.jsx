import { Button, Stack, Box } from "@mui/material";

const Controls = ({ onPlay, onPause, onResume, onStop, isPlaying, isPaused, isMobile }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={isMobile ? 1 : 2} 
        sx={{ 
          justifyContent: { xs: 'center', sm: 'flex-start' },
          gap: isMobile ? 1 : 2
        }}
      >
        <Button
          variant="contained"
          onClick={onPlay}
          disabled={isPlaying}
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: '100px' },
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: '0.9rem', sm: '0.875rem' },
            fontWeight: 500,
          }}
        >
          Play
        </Button>
        
        <Button
          variant="outlined"
          onClick={isPlaying && !isPaused ? onPause : onResume}
          disabled={!isPlaying && !isPaused}
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: '100px' },
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: '0.9rem', sm: '0.875rem' },
            fontWeight: 500,
          }}
        >
          {isPlaying && !isPaused ? "Pause" : "Resume"}
        </Button>
        
        <Button
          variant="outlined"
          onClick={onStop}
          disabled={!isPlaying && !isPaused}
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: '100px' },
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: '0.9rem', sm: '0.875rem' },
            fontWeight: 500,
          }}
        >
          Stop
        </Button>
      </Stack>
    </Box>
  );
};

export default Controls;
