import { Select, MenuItem, Typography, Box, Slider, FormControl, InputLabel } from "@mui/material";
import { LANGUAGES } from "../data/sampleText";

const LanguageSelector = ({
  language,
  setLanguage,
  rate,
  setRate,
  isMobile,
}) => {
  return (
    <Box>
      {/* Language Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={language}
          label="Language"
          onChange={(e) => setLanguage(e.target.value)}
          size={isMobile ? "medium" : "small"}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label} ({lang.nativeLabel})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Speech Rate */}
      <Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1,
            fontWeight: 500,
            color: "text.secondary" 
          }}
        >
          Speech Rate: {rate.toFixed(1)}x
        </Typography>

        <Slider
          value={rate}
          min={0.5}
          max={2}
          step={0.1}
          onChange={(e, val) => setRate(val)}
          size={isMobile ? "medium" : "small"}
          marks={[
            { value: 0.5, label: "0.5x" },
            { value: 1, label: "1x" },
            { value: 1.5, label: "1.5x" },
            { value: 2, label: "2x" },
          ]}
        />
      </Box>
    </Box>
  );
};

export default LanguageSelector;