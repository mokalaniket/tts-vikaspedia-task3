import { Alert, Box, Typography } from "@mui/material";

const FallbackAlert = ({ show, language }) => {
  if (!show) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error">
        <Typography variant="body2" component="div">
          <strong>No voice available for {language}.</strong>
          <br /><br />
          To use Text-to-Speech for this language, please install the language voice in your operating system:
          <br /><br />
          <strong>Windows 10/11:</strong>
          <br />
          Settings → Time & Language → Language → Add a language → Select "{language}" → Download "Text-to-speech"
          <br /><br />
          <strong>Mac:</strong>
          <br />
          System Preferences → Accessibility → Spoken Content → System Voice → Manage Voices → Download {language} voice
          <br /><br />
          After installation, please refresh this page.
        </Typography>
      </Alert>
    </Box>
  );
};

export default FallbackAlert;