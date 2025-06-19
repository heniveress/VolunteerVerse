import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const themeOptions = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
  },
  palette: {
    primary: {
      light: '#FCF4EB',
      main: '#ec6744',
      dark: '#d15b3d',
      contrastText: '#FCF4EB',
    },
    secondary: {
      main: '#1C2732',
      light: '#69A56B',
      dark: '#FEFCFB',
      contrastText: '#1C2732',
    },
    common: {
      white: '#fff',
      black: '#000',
    },
    info: {
      main: '#0288d1',
    },
    background: {
      paper: '#faf6f2',
    },
  },
  typography: {
    button: {
      textTransform: 'capitalize',
    },
    h2: {
      fontFamily: ' "Karla", "sans-serif" ',
    },
    fontFamily: ' "Montserrat", "sans-serif" ',
  },
});

const theme = responsiveFontSizes(themeOptions);

export default theme;
