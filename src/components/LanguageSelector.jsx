import { Select, MenuItem, Typography, Box, Slider, FormControl, InputLabel } from "@mui/material";

const languages = [
  { label: "English", value: "en-IN" },
  { label: "Hindi", value: "hi-IN" },
  { label: "Gujarati", value: "gu-IN" },
  { label: "Marathi", value: "mr-IN" },
  { label: "Tamil", value: "ta-IN" },
  { label: "Telugu", value: "te-IN" },
];

const LanguageSelector = ({ language, setLanguage, rate, setRate, isMobile }) => {
  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1, 
            fontWeight: 500,
            color: 'text.secondary'
          }}
        >
          Language
        </Typography>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          size={isMobile ? "medium" : "small"}
          sx={{
            fontSize: { xs: '0.9rem', sm: '0.875rem' },
            '& .MuiSelect-select': {
              py: { xs: 1.5, sm: 1 },
            }
          }}
        >
          {languages.map(l => (
            <MenuItem 
              key={l.value} 
              value={l.value}
              sx={{ fontSize: { xs: '0.9rem', sm: '0.875rem' } }}
            >
              {l.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography 
          variant="subtitle2" 
          gutterBottom
          sx={{ 
            fontWeight: 500,
            color: 'text.secondary',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Speech Rate</span>
          <span 
            sx={{ 
              fontSize: { xs: '0.85rem', sm: '0.8rem' },
              color: 'primary.main',
              fontWeight: 600
            }}
          >
            {rate.toFixed(1)}x
          </span>
        </Typography>

        <Slider
          value={rate}
          min={0.5}
          max={2}
          step={0.1}
          valueLabelDisplay="off"
          onChange={(e, val) => setRate(val)}
          size={isMobile ? "medium" : "small"}
          sx={{
            '& .MuiSlider-thumb': {
              width: { xs: 20, sm: 16 },
              height: { xs: 20, sm: 16 },
            },
            '& .MuiSlider-track': {
              height: { xs: 6, sm: 4 },
            },
            '& .MuiSlider-rail': {
              height: { xs: 6, sm: 4 },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LanguageSelector;
