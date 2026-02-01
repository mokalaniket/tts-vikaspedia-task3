import { Alert, Box } from "@mui/material";

const FallbackAlert = ({ show }) => {
  if (!show) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity="warning"
        sx={{
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: { xs: '0.9rem', sm: '0.875rem' },
            fontWeight: 500,
          },
        }}
      >
        Voice not available for the selected language. Please try a different language or check your browser settings.
      </Alert>
    </Box>
  );
};

export default FallbackAlert;
