import React, { useState, useMemo } from 'react';
import { Container, Typography, Button, Box, CssBaseline, Paper, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
// Import specific color palettes needed
import { blue, pink, grey, red, green, amber, lightBlue, blueGrey } from '@mui/material/colors';

// --- Theme Definition Function ---
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? // --- Light Mode Palette ---
            {
                primary: {
                    main: blue[700],      // Standard blue
                    light: blue[500],
                    dark: blue[800],
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: pink[500],       // Standard pink
                    light: pink[300],
                    dark: pink[700],
                    contrastText: '#ffffff',
                },
                background: {
                    paper: '#ffffff',      // White paper
                    default: grey[100],     // Very light grey background
                },
                text: {
                    primary: grey[900],     // Dark grey text
                    secondary: grey[700],   // Medium grey text
                },
                divider: grey[300],       // Light divider
                success: {
                    main: green[700],     // Standard green
                    light: green[500],
                    dark: green[800],
                },
                error: {
                    main: red[600],       // Standard red
                    light: red[400],
                    dark: red[800],
                },
                warning: {
                    main: amber[700],     // Standard amber/orange
                    light: amber[500],
                    dark: amber[800],
                },
                info: {
                    main: lightBlue[600], // Standard light blue
                    light: lightBlue[400],
                    dark: lightBlue[800],
                },
                action: {
                    hover: grey[100],
                    selected: blue[50],
                    disabledBackground: grey[200],
                    disabled: grey[500],
                }
            }
            : // --- Dark Mode Palette (Revised Colors) ---
            {
                primary: {
                    main: blue[300],      // Lighter blue for main actions
                    light: blue[200],     // Even lighter for hover/secondary states
                    dark: blue[400],      // Slightly darker for emphasis
                    contrastText: grey[900], // Dark text on light blue buttons
                },
                secondary: {
                    main: pink[300],       // Lighter pink
                    light: pink[200],
                    dark: pink[400],
                    contrastText: grey[900], // Dark text on light pink buttons
                },
                background: {
                    paper: blueGrey[800],   // Dark blue-grey for cards/paper (#37474f)
                    default: blueGrey[900], // Slightly darker blue-grey for body (#263238)
                },
                text: {
                    primary: grey[100],     // Off-white for primary text
                    secondary: grey[400],   // Lighter grey for secondary text
                },
                divider: blueGrey[700],   // Divider matching the blueGrey theme (#455a64)
                success: {
                    main: green[400],     // Lighter green
                    light: green[300],
                    dark: green[600],
                    contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                error: {
                    main: red[400],       // Lighter red
                    light: red[300],
                    dark: red[600],
                    contrastText: '#ffffff',
                },
                warning: {
                    main: amber[400],     // Lighter amber/orange
                    light: amber[300],
                    dark: amber[600],
                    contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                info: {
                    main: lightBlue[400], // Lighter info blue
                    light: lightBlue[300],
                    dark: lightBlue[600],
                    contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                action: {
                    hover: 'rgba(255, 255, 255, 0.08)', // Standard dark hover
                    selected: 'rgba(255, 255, 255, 0.16)',// Standard dark selected
                    disabledBackground: 'rgba(255, 255, 255, 0.12)',
                    disabled: 'rgba(255, 255, 255, 0.3)',
                }
            }),
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        // Keep typography consistent or adjust H tags if needed
        h4: {
            fontWeight: 600,
            color: mode === 'light' ? blue[800] : blue[200], // Lighter blue for dark H4
        },
        h5: {
            fontWeight: 600,
            color: mode === 'light' ? blue[800] : blue[200], // Lighter blue for dark H5
        },
        h6: {
            fontWeight: 500,
            color: mode === 'light' ? blue[900] : blue[100], // Lighter blue for dark H6
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
        subtitle1: {
            color: mode === 'light' ? grey[600] : grey[400],
            fontSize: '0.85rem',
        },
        caption: {
            color: mode === 'light' ? grey[600] : grey[500], // Slightly brighter caption in dark
        }
    },
    shape: {
        borderRadius: 8,
    },
    // --- Component Overrides (Adapting to Dark Mode) ---
    components: {
        MuiCssBaseline: {
            styleOverrides: (themeParam) => (`
            body {
              background-color: ${themeParam.palette.background.default};
              /* Updated Gradient Background */
              background-image: linear-gradient(to bottom, ${themeParam.palette.mode === 'light' ? themeParam.palette.primary.main + '1A' : themeParam.palette.primary.dark + '33'}, ${themeParam.palette.background.default} 50%);
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              min-height: 100vh;
              transition: background-color 0.3s ease-in-out, background-image 0.3s ease-in-out;
            }
          `),
        },
        MuiPaper: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    backgroundColor: themeParam.palette.background.paper,
                    backgroundImage: 'none',
                    transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    // Slightly different shadow elevation for dark mode paper
                    boxShadow: themeParam.palette.mode === 'dark' ? themeParam.shadows[2] : themeParam.shadows[2],
                }),
            }
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    // More prominent shadow for cards in dark mode
                    boxShadow: themeParam.palette.mode === 'light'
                        ? '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.06)'
                        : '0 3px 6px rgba(0,0,0,0.2), 0 5px 12px rgba(0,0,0,0.25)', // Adjusted dark shadow
                    borderRadius: themeParam.shape.borderRadius,
                    border: `1px solid ${themeParam.palette.divider}`,
                    backgroundColor: themeParam.palette.background.paper,
                    backgroundImage: 'none',
                    // Use the new lighter primary color for border in dark mode
                    borderLeft: `4px solid ${themeParam.palette.primary.main}`,
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: themeParam.palette.mode === 'light'
                            ? '0 4px 8px rgba(0,0,0,0.07), 0 5px 15px rgba(0,0,0,0.08)'
                            : '0 6px 12px rgba(0,0,0,0.25), 0 10px 20px rgba(0,0,0,0.3)', // Enhanced dark hover shadow
                        // transform: 'translateY(-3px)' // Keep hover effect
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                })
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    padding: '16px 16px 8px 16px',
                    borderBottom: `1px solid ${themeParam.palette.divider}`,
                    transition: 'border-color 0.3s ease-in-out',
                }),
                // Rely on theme text colors (primary/secondary) which are already adapted
                title: ({ theme: themeParam }) => ({
                    fontSize: '1.15rem',
                    lineHeight: 1.3,
                    color: themeParam.palette.text.primary,
                    transition: 'color 0.3s ease-in-out',
                }),
                subheader: ({ theme: themeParam }) => ({
                    marginTop: '4px',
                    color: themeParam.palette.text.secondary,
                    transition: 'color 0.3s ease-in-out',
                }),
                action: { marginTop: 0, marginRight: 0, alignSelf: 'center' }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                // Make the collapsed section background slightly different from card background
                root: ({ theme: themeParam, ownerState }) => ({
                    padding: '16px',
                    flexGrow: ownerState?.className?.includes('MuiCollapse-root') ? 0 : 1, // Don't grow if in collapse
                    color: themeParam.palette.text.secondary,
                    transition: 'color 0.3s ease-in-out, background-color 0.3s ease-in-out',
                    // Apply specific background only if directly inside a Collapse (like comments/tags section)
                    ...(ownerState?.className?.includes('MuiCollapse-root') && {
                        backgroundColor: themeParam.palette.mode === 'light'
                            ? themeParam.palette.grey[100]
                            : themeParam.palette.background.default, // Use default body bg for contrast
                        paddingTop: '12px',
                        paddingBottom: '12px',
                    }),
                }),
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    padding: '8px 16px',
                    marginTop: 'auto',
                    borderTop: `1px dashed ${themeParam.palette.divider}`,
                    transition: 'border-color 0.3s ease-in-out',
                })
            }
        },
        MuiButton: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    borderRadius: themeParam.shape.borderRadius,
                    padding: '8px 16px',
                }),
                // Adjust hover colors for the new dark palette
                containedPrimary: ({ theme: themeParam }) => ({
                    // Use contrastText color defined in the dark primary palette
                    color: themeParam.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: themeParam.palette.mode === 'light'
                            ? themeParam.palette.primary.dark
                            : themeParam.palette.primary.light, // Use light variant for dark hover
                        boxShadow: 'none',
                    }
                }),
                containedSecondary: ({ theme: themeParam }) => ({
                    color: themeParam.palette.secondary.contrastText,
                    '&:hover': {
                        backgroundColor: themeParam.palette.mode === 'light'
                            ? themeParam.palette.secondary.dark
                            : themeParam.palette.secondary.light, // Use light variant for dark hover
                        boxShadow: 'none',
                    }
                }),
                outlinedSecondary: ({ theme: themeParam }) => ({
                    // Use main color for border and text in dark mode outlined
                    borderColor: themeParam.palette.mode === 'light'
                        ? themeParam.palette.secondary.light
                        : themeParam.palette.secondary.main,
                    color: themeParam.palette.secondary.main,
                    '&:hover': {
                        backgroundColor: themeParam.palette.action.hover,
                        borderColor: themeParam.palette.mode === 'light'
                            ? themeParam.palette.secondary.main
                            : themeParam.palette.secondary.light, // Slightly lighter border on hover
                    }
                })
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    color: themeParam.palette.text.secondary, // Default icon color adapts
                    transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: themeParam.palette.action.hover,
                    },
                    // Ensure explicit colors work with new palette
                    '&.MuiIconButton-colorPrimary': {
                        color: themeParam.palette.primary.main,
                    },
                    '&.MuiIconButton-colorSecondary': {
                        color: themeParam.palette.secondary.main,
                    },
                    // Style for header theme toggle button
                    '&.theme-toggle-button': {
                        color: themeParam.palette.text.primary, // Use primary text color
                        backgroundColor: 'rgba(120, 120, 120, 0.1)', // Subtle background
                        '&:hover': {
                            backgroundColor: 'rgba(120, 120, 120, 0.2)',
                        }
                    }
                }),
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme: themeParam }) => ({
                    backgroundColor: themeParam.palette.mode === 'light' ? themeParam.palette.grey[700] : blueGrey[600], // Use blueGrey for dark tooltip
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                }),
                arrow: ({ theme: themeParam }) => ({
                    color: themeParam.palette.mode === 'light' ? themeParam.palette.grey[700] : blueGrey[600],
                })
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    height: '28px',
                    borderRadius: '6px',
                    transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out',
                },
                // Outlined chips adapt better with the new dark palette
                outlinedPrimary: ({ theme: themeParam }) => ({
                    color: themeParam.palette.primary.main, // Use main color for text
                    borderColor: themeParam.palette.primary.main + '80', // Use main color with alpha for border
                    backgroundColor: themeParam.palette.primary.main + '1A', // Very subtle background tint
                    '&:hover, &:focus': {
                        backgroundColor: themeParam.palette.primary.main + '33', // Slightly more visible on hover
                    },
                }),
                // Filled chips use main colors
                filledPrimary: ({ theme: themeParam }) => ({
                    backgroundColor: themeParam.palette.primary.main,
                    color: themeParam.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: themeParam.palette.primary.dark,
                    }
                }),
                filledSecondary: ({ theme: themeParam }) => ({
                    backgroundColor: themeParam.palette.secondary.main,
                    color: themeParam.palette.secondary.contrastText,
                    '&:hover': {
                        backgroundColor: themeParam.palette.secondary.dark,
                    }
                }),
                clickable: { cursor: 'pointer' }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    '& .MuiOutlinedInput-root': {
                        transition: 'border-color 0.3s ease-in-out',
                        '& fieldset': {
                            borderColor: themeParam.palette.divider,
                            transition: 'border-color 0.3s ease-in-out',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: themeParam.palette.primary.main, // Use new primary color
                            borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                            borderColor: themeParam.palette.mode === 'light'
                                ? themeParam.palette.primary.light
                                : themeParam.palette.primary.main, // Use main on hover in dark
                        },
                    },
                    // Labels and helper text adapt via theme text colors
                    '& label': { color: themeParam.palette.text.secondary, transition: 'color 0.3s ease-in-out' },
                    '& label.Mui-focused': { color: themeParam.palette.primary.main },
                    '& .MuiFormHelperText-root': { color: themeParam.palette.text.secondary, marginLeft: 2, transition: 'color 0.3s ease-in-out' },
                    '& .MuiInputBase-input': { color: themeParam.palette.text.primary, transition: 'color 0.3s ease-in-out' }
                })
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    // Use paper background for title, rely on border for separation
                    backgroundColor: themeParam.palette.background.paper,
                    color: themeParam.palette.text.primary,
                    padding: '16px 24px', // Standard padding
                    borderBottom: `1px solid ${themeParam.palette.divider}`,
                    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                })
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    padding: '16px 24px',
                    backgroundColor: themeParam.palette.background.paper, // Use paper background
                    borderTop: `1px solid ${themeParam.palette.divider}`,
                    transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                })
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    paddingTop: 6, // Slightly more padding
                    paddingBottom: 6,
                    alignItems: 'flex-start',
                    transition: 'background-color 0.3s ease-in-out',
                    '&:hover': { backgroundColor: themeParam.palette.action.hover },
                    '&.Mui-selected': {
                        backgroundColor: themeParam.palette.action.selected,
                        '&:hover': { backgroundColor: themeParam.palette.action.hover },
                    },
                    // Ensure divider inside list item adapts
                    '&.MuiDivider-root': {
                        borderColor: themeParam.palette.divider,
                    }
                })
            }
        },
        MuiListItemText: {
            styleOverrides: {
                // Rely on theme text colors which adapt
                root: ({ theme: themeParam }) => ({
                    marginTop: 0,
                    marginBottom: 0,
                    '& .MuiListItemText-primary': { color: themeParam.palette.text.primary, transition: 'color 0.3s ease-in-out', },
                    '& .MuiListItemText-secondary': { color: themeParam.palette.text.secondary, transition: 'color 0.3s ease-in-out', },
                })
            }
        },
        MuiAlert: {
            styleOverrides: {
                // Use filled variant look for standard alerts in dark mode for better contrast
                root: ({ theme: themeParam, ownerState }) => ({
                    borderRadius: themeParam.shape.borderRadius,
                    border: `1px solid ${themeParam.palette[ownerState.severity || 'info'].main + '4D'}`, // Subtle border
                    color: themeParam.palette.getContrastText(themeParam.palette[ownerState.severity || 'info'].main), // Ensure text contrast
                    backgroundColor: themeParam.palette.mode === 'light'
                        ? themeParam.palette[ownerState.severity || 'info'].light + '33' // Light mode subtle bg
                        : themeParam.palette[ownerState.severity || 'info'].dark + '59', // Dark mode uses darker bg tint
                    transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out',
                    '& .MuiAlert-icon': {
                        color: themeParam.palette[ownerState.severity || 'info'].main, // Icon uses main severity color
                        opacity: themeParam.palette.mode === 'light' ? 0.9 : 1, // Full opacity icon in dark mode
                        transition: 'color 0.3s ease-in-out',
                    },
                }),
                // No need for specific standardWarning, standardError etc. if root handles severity dynamically
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: ({ theme: themeParam }) => ({
                    boxShadow: themeParam.shadows[4],
                    backgroundColor: themeParam.palette.background.paper, // Adapts via theme
                    transition: 'background-color 0.3s ease-in-out',
                }),
                option: ({ theme: themeParam }) => ({
                    color: themeParam.palette.text.primary, // Adapts via theme
                    transition: 'background-color 0.2s ease-in-out, color 0.3s ease-in-out',
                    '&[aria-selected="true"]': { backgroundColor: themeParam.palette.action.selected },
                    '&:hover': { backgroundColor: themeParam.palette.action.hover }
                })
            }
        },
    }
});

// --- Основной компонент приложения ---
function App() {
    const [editingArticle, setEditingArticle] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);
    // Default to dark mode
    const [mode, setMode] = useState('dark');

    // Create theme based on mode
    const theme = useMemo(() => {
        let createdTheme = createTheme(getDesignTokens(mode));
        createdTheme = responsiveFontSizes(createdTheme);
        return createdTheme;
    }, [mode]);


    const handleEdit = (article) => {
        setEditingArticle(article);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = () => {
        setRefreshFlag(prev => !prev);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setEditingArticle(null);
        setRefreshFlag(prev => !prev);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingArticle(null);
    };

    const handleAddNew = () => {
        setEditingArticle(null);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Toggle dark/light mode
    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };


    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline applies background, text color, etc. based on theme */}
            <CssBaseline enableColorScheme />
            <Container
                maxWidth="lg"
                sx={{
                    mt: { xs: 2, md: 4 },
                    mb: { xs: 4, md: 6 },
                }}
            >
                {/* --- Header Section --- */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mb: 3,
                        pb: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        gap: { xs: 2, sm: 1 },
                        position: 'relative',
                        transition: 'border-color 0.3s ease-in-out',
                    }}
                >
                    {/* Title adapts color via theme */}
                    <Typography variant="h4" component="h1" sx={{ transition: 'color 0.3s ease-in-out' }}>
                        Статьи и Обсуждения
                    </Typography>

                    {/* Right Aligned Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}> {/* Increased gap */}
                        {!showForm && (
                            <Button
                                variant="contained"
                                color="primary" // Uses primary color from theme
                                startIcon={<AddIcon />}
                                onClick={handleAddNew}
                                sx={{ boxShadow: 1 }}
                            >
                                Добавить статью
                            </Button>
                        )}
                        {/* Theme Toggle Button */}
                        <Tooltip title={mode === 'dark' ? "Светлый режим" : "Темный режим"} arrow>
                            <IconButton
                                onClick={toggleColorMode}
                                color="inherit"
                                className="theme-toggle-button" // Added class for specific styling via overrides
                                aria-label="toggle theme"
                            >
                                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* --- Main Content Area --- */}
                <Paper sx={{ // Use Paper overrides for bg, shadow etc.
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: theme.shape.borderRadius,
                }}>
                    {showForm && (
                        <ArticleForm
                            existingArticle={editingArticle}
                            onFormSubmit={handleFormSubmit}
                            onCancel={handleCancelForm}
                        />
                    )}
                    {!showForm && (
                        <ArticleList
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            refreshFlag={refreshFlag}
                        />
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default App;