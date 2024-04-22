import { createTheme } from '@mui/material';

import { combinedFontFamily } from './util';

import { COLOR } from '@/constant';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 1024,
      lg: 1440,
      xl: 1920,
    },
  },
});

theme.components = {
  ...theme.components,
  MuiCssBaseline: {
    styleOverrides: {
      ':root': {
        fontFamily: combinedFontFamily,
        fontSize: '1rem',
        fontWeight: '400',
        fontSynthesis: 'none',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        WebkitTextSizeAdjust: '100%',
      },
      html: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      },
      body: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        color: COLOR.white,
        backgroundColor: COLOR.black,
        [theme.breakpoints.down('lg')]: {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: '100% !important',
        padding: '0 !important',
        '& > .MuiFormHelperText-root': {
          position: 'absolute',
          bottom: '-1.25rem',
          fontSize: '0.75rem',
          color: COLOR.success,
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: `.0625rem solid ${COLOR.inputBorder} !important`,
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 'normal',
        '& > fieldset': {
          border: 'none !important',
        },
        '&.Mui-focused fieldset': {
          border: `.0625rem solid ${COLOR.black} !important`,
        },
        '& > input': {
          height: '2.5rem',
          padding: '0.62rem 1.31rem',
          boxSizing: 'border-box',
          backgroundColor: COLOR.white,
        },
        '& > .MuiSelect-select': {
          height: '2.5rem !important',
          padding: '0.62rem 1.31rem',
          boxSizing: 'border-box',
          backgroundColor: COLOR.white,
        },
        '&.Mui-error': {
          borderColor: `${COLOR.error} !important`,
        },
        [theme.breakpoints.down('lg')]: {
          fontSize: '0.75rem',
          '& > input': {
            padding: '0.9rem 0.9rem',
          },
          '& > .MuiSelect-select': {
            padding: '0.9rem 0.9rem !important',
          },
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        backgroundColor: COLOR.white,
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: COLOR.white,
        '&.Mui-focused': {
          color: COLOR.white,
        },
      },
    },
  },
  MuiModal: {
    styleOverrides: {
      root: {
        fontFamily: `${combinedFontFamily} !important`,
        form: {
          width: '100%',
        },
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        width: '100%',
        height: '100%',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: '0 0 1.25rem 1.25rem',
      },
    },
  },
};

theme.typography = {
  ...theme.typography,
  fontFamily: combinedFontFamily,
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: '3rem',
    fontWeight: '700',
    lineHeight: 'normal',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: '700',
    lineHeight: 'normal',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: '400',
    lineHeight: 'normal',
  },
  h4: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: 'normal',
  },
  h5: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: 'normal',
  },
  h6: {
    fontSize: '.75rem',
    fontWeight: '400',
    lineHeight: 'normal',
  },
};
