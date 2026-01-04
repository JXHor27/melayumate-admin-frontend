import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext';
//import { createTheme, ThemeProvider } from '@mui/material/styles';

// --- ONE-TIME RECORDER SETUP ---
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

// Ask the MediaRecorder polyfill about the WAV encoder
async function setupRecorder() {
  await connect();
  await register(await connect());
}

// Create default theme
// const theme = createTheme();
setupRecorder().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
  )
}).catch((error) => {
  console.error('Failed to set up media recorder:', error);
});