import './App.css';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import ConversionTable from './ConversionTable';
import { SettingsOverlay } from './setting/Setting';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
});

const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h2>Photon energy converter</h2>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => setSettingsOpen(true)}>
          <SettingsIcon />
        </IconButton>
      </Box>
      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <ConversionTable />
    </ThemeProvider>
  );
};

export default App;
