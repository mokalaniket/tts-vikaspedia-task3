import { Button, Stack, Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

const Controls = ({ onPlay, onPause, onResume, onStop, isPlaying, isPaused, isMobile }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 2}
        sx={{
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {/* Play Button - shown when not playing */}
        {!isPlaying && !isPaused && (
          <Button
            variant="contained"
            color="primary"
            onClick={onPlay}
            startIcon={<PlayArrowIcon />}
            fullWidth={isMobile}
            sx={{ minWidth: 120 }}
          >
            Play
          </Button>
        )}

        {/* Pause Button - shown when playing and not paused */}
        {isPlaying && !isPaused && (
          <Button
            variant="contained"
            color="warning"
            onClick={onPause}
            startIcon={<PauseIcon />}
            fullWidth={isMobile}
            sx={{ minWidth: 120 }}
          >
            Pause
          </Button>
        )}

        {/* Resume Button - shown when paused */}
        {isPaused && (
          <Button
            variant="contained"
            color="success"
            onClick={onResume}
            startIcon={<PlayArrowIcon />}
            fullWidth={isMobile}
            sx={{ minWidth: 120 }}
          >
            Resume
          </Button>
        )}

        {/* Stop Button - shown when playing or paused */}
        {(isPlaying || isPaused) && (
          <Button
            variant="outlined"
            color="error"
            onClick={onStop}
            startIcon={<StopIcon />}
            fullWidth={isMobile}
            sx={{ minWidth: 120 }}
          >
            Stop
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Controls;