// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack' // notistack

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58a6ff',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      {/* Configuration globale de notistack */}
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000} // 3 secondes avant de disparaître
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }} // Position top-left
      >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
)
