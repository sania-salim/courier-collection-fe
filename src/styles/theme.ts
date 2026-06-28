import { colors } from './themeConstants';
import { PaletteMode, ThemeOptions } from '@mui/material';

export const getMuiTheme = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                  primary: {
                      main: colors.primary,
                      light: colors.primaryLight,
                      dark: colors.primaryDark,
                  },
                  secondary: {
                      main: colors.accent,
                  },
                  background: {
                      default: colors.surface,
                      paper: colors.themeWhite,
                  },
                  text: {
                      primary: colors.themeBlack,
                      secondary: '#64748b',
                  },
              }
            : {
                  primary: {
                      main: colors.primary,
                      light: colors.primaryLightDarkMode,
                  },
                  secondary: {
                      main: colors.accent,
                  },
                  background: {
                      default: colors.themeDarkGrey,
                      paper: '#1e293b',
                  },
                  text: {
                      primary: colors.themeWhite,
                      secondary: colors.themeLightGrey,
                  },
              }),
    },
    typography: {
        fontFamily: ['DM Sans', 'sans-serif'].join(),
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.75rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: 'var(--cardShadow)',
                },
            },
        },
    },
});
