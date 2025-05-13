// --- Imports ---
import React, { useState, useMemo } from 'react';
import { Container, Typography, Button, Box, CssBaseline, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// --- Component Imports ---
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import ArticleDetail from './ArticleDetail';
import PaperWrapper from './PaperWrapper';

// --- Icon Imports ---
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- Color Imports ---
import { blue, pink, grey, red, green, amber, lightBlue, blueGrey } from '@mui/material/colors';

// --- Theme Definition Function ---
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? // --- Light Mode Palette ---
            {
                primary: { main: blue[700], light: blue[500], dark: blue[800], contrastText: '#ffffff' },
                secondary: { main: pink[500], light: pink[300], dark: pink[700], contrastText: '#ffffff' },
                background: { paper: '#ffffff', default: grey[100] },
                text: { primary: grey[900], secondary: grey[700] },
                divider: grey[300],
                success: { main: green[700], light: green[500], dark: green[800] },
                error: { main: red[600], light: red[400], dark: red[800] },
                warning: { main: amber[700], light: amber[500], dark: amber[800] },
                info: { main: lightBlue[600], light: lightBlue[400], dark: lightBlue[800] },
                action: { hover: grey[100], selected: blue[50], disabledBackground: grey[200], disabled: grey[500] }
            }
            : // --- Dark Mode Palette ---
            {
                primary: { main: blue[300], light: blue[200], dark: blue[400], contrastText: grey[900] },
                secondary: { main: pink[300], light: pink[200], dark: pink[400], contrastText: grey[900] },
                background: { paper: blueGrey[800], default: blueGrey[900] },
                text: { primary: grey[100], secondary: grey[400] },
                divider: blueGrey[700],
                success: { main: green[400], light: green[300], dark: green[600], contrastText: 'rgba(0, 0, 0, 0.87)' },
                error: { main: red[400], light: red[300], dark: red[600], contrastText: '#ffffff' },
                warning: { main: amber[400], light: amber[300], dark: amber[600], contrastText: 'rgba(0, 0, 0, 0.87)' },
                info: { main: lightBlue[400], light: lightBlue[300], dark: lightBlue[600], contrastText: 'rgba(0, 0, 0, 0.87)' },
                action: { hover: 'rgba(255, 255, 255, 0.08)', selected: 'rgba(255, 255, 255, 0.16)', disabledBackground: 'rgba(255, 255, 255, 0.12)', disabled: 'rgba(255, 255, 255, 0.3)' }
            }),
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 600, color: mode === 'light' ? blue[800] : blue[200] },
        h5: { fontWeight: 600, color: mode === 'light' ? blue[700] : blue[300] },
        h6: { fontWeight: 500, color: mode === 'light' ? blue[900] : blue[100] },
        button: { textTransform: 'none', fontWeight: 600 },
        subtitle1: { color: mode === 'light' ? grey[600] : grey[400], fontSize: '0.85rem' },
        caption: { color: mode === 'light' ? grey[600] : grey[500] }
    },
    shape: {
        borderRadius: 8,
    },
    // --- MUI Component Style Overrides ---
    components: {
        MuiCssBaseline: {
            styleOverrides: (themeParam) => (`
            body {
              background-color: ${themeParam.palette.background.default};
              background-image: linear-gradient(to bottom, ${themeParam.palette.mode === 'light' ? themeParam.palette.primary.main + '1A' : themeParam.palette.primary.dark + '33'}, ${themeParam.palette.background.default} 50%);
              margin: 0; padding: 0; box-sizing: border-box;
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
                    boxShadow: themeParam.palette.mode === 'dark' ? themeParam.shadows[2] : themeParam.shadows[2],
                    borderRadius: themeParam.shape.borderRadius,
                }),
            }
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    boxShadow: themeParam.palette.mode === 'light'
                        ? '0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.05)'
                        : '0 2px 4px rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.22)',
                    borderRadius: themeParam.shape.borderRadius,
                    border: `1px solid ${themeParam.palette.divider}`,
                    backgroundColor: themeParam.palette.background.paper,
                    backgroundImage: 'none',
                    borderLeft: `4px solid ${themeParam.palette.primary.main}`,
                    transition: 'box-shadow 0.25s ease-in-out, transform 0.25s ease-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: themeParam.palette.mode === 'light'
                            ? '0 2px 4px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.07)'
                            : '0 4px 8px rgba(0,0,0,0.22), 0 6px 15px rgba(0,0,0,0.28)',
                        transform: 'translateY(-1px)',
                    },
                    display: 'flex', flexDirection: 'column', height: '100%',
                })
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({ padding: '16px 16px 8px 16px', borderBottom: `1px solid ${themeParam.palette.divider}`, transition: 'border-color 0.3s ease-in-out' }),
                title: ({ theme: themeParam }) => ({ fontSize: '1.15rem', lineHeight: 1.3, color: themeParam.palette.text.primary, transition: 'color 0.3s ease-in-out' }),
                subheader: ({ theme: themeParam }) => ({ marginTop: '4px', color: themeParam.palette.text.secondary, transition: 'color 0.3s ease-in-out' }),
                action: { marginTop: 0, marginRight: 0, alignSelf: 'center' }
            }
        },
        MuiCardContent: {
            styleOverrides: { root: ({ theme: themeParam }) => ({ padding: '16px', flexGrow: 1, color: themeParam.palette.text.secondary, transition: 'color 0.3s ease-in-out' }) }
        },
        MuiCardActions: {
            styleOverrides: { root: ({ theme: themeParam }) => ({ padding: '8px 16px', marginTop: 'auto', borderTop: `1px solid ${themeParam.palette.divider}`, transition: 'border-color 0.3s ease-in-out' }) }
        },
        MuiButton: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({ borderRadius: themeParam.shape.borderRadius, padding: '8px 16px' }),
                containedPrimary: ({ theme: themeParam }) => ({ color: themeParam.palette.primary.contrastText, '&:hover': { backgroundColor: themeParam.palette.mode === 'light' ? themeParam.palette.primary.dark : themeParam.palette.primary.light, boxShadow: 'none' } }),
                containedSecondary: ({ theme: themeParam }) => ({ color: themeParam.palette.secondary.contrastText, '&:hover': { backgroundColor: themeParam.palette.mode === 'light' ? themeParam.palette.secondary.dark : themeParam.palette.secondary.light, boxShadow: 'none' } }),
                outlinedSecondary: ({ theme: themeParam }) => ({ borderColor: themeParam.palette.mode === 'light' ? themeParam.palette.secondary.light : themeParam.palette.secondary.main, color: themeParam.palette.secondary.main, '&:hover': { backgroundColor: themeParam.palette.action.hover, borderColor: themeParam.palette.mode === 'light' ? themeParam.palette.secondary.main : themeParam.palette.secondary.light } })
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    color: themeParam.palette.text.secondary,
                    transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': { backgroundColor: themeParam.palette.action.hover },
                    '&.MuiIconButton-colorPrimary': { color: themeParam.palette.primary.main },
                    '&.MuiIconButton-colorSecondary': { color: themeParam.palette.secondary.main },
                    '&.theme-toggle-button': {
                        color: themeParam.palette.text.primary,
                        backgroundColor: 'rgba(120, 120, 120, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(120, 120, 120, 0.2)' }
                    }
                }),
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme: themeParam }) => ({ backgroundColor: themeParam.palette.mode === 'light' ? themeParam.palette.grey[700] : blueGrey[600], fontSize: '0.8rem', padding: '4px 8px' }),
                arrow: ({ theme: themeParam }) => ({ color: themeParam.palette.mode === 'light' ? themeParam.palette.grey[700] : blueGrey[600] })
            }
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 500, height: '28px', borderRadius: '6px', transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out' },
                outlinedPrimary: ({ theme: themeParam }) => ({ color: themeParam.palette.primary.main, borderColor: themeParam.palette.primary.main + '80', backgroundColor: themeParam.palette.primary.main + '1A', '&:hover, &:focus': { backgroundColor: themeParam.palette.primary.main + '33' } }),
                filledPrimary: ({ theme: themeParam }) => ({ backgroundColor: themeParam.palette.primary.main, color: themeParam.palette.primary.contrastText, '&:hover': { backgroundColor: themeParam.palette.primary.dark } }),
                filledSecondary: ({ theme: themeParam }) => ({ backgroundColor: themeParam.palette.secondary.main, color: themeParam.palette.secondary.contrastText, '&:hover': { backgroundColor: themeParam.palette.secondary.dark } }),
                clickable: { cursor: 'pointer' }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    '& .MuiOutlinedInput-root': {
                        transition: 'border-color 0.3s ease-in-out',
                        '& fieldset': { borderColor: themeParam.palette.divider, transition: 'border-color 0.3s ease-in-out' },
                        '&.Mui-focused fieldset': { borderColor: themeParam.palette.primary.main, borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: themeParam.palette.mode === 'light' ? themeParam.palette.primary.light : themeParam.palette.primary.main },
                    },
                    '& label': { color: themeParam.palette.text.secondary, transition: 'color 0.3s ease-in-out' },
                    '& label.Mui-focused': { color: themeParam.palette.primary.main },
                    '& .MuiFormHelperText-root': { color: themeParam.palette.text.secondary, marginLeft: 2, transition: 'color 0.3s ease-in-out' },
                    '& .MuiInputBase-input': { color: themeParam.palette.text.primary, transition: 'color 0.3s ease-in-out' }
                })
            }
        },
        MuiDialogTitle: {
            styleOverrides: { root: ({ theme: themeParam }) => ({ backgroundColor: themeParam.palette.background.paper, color: themeParam.palette.text.primary, padding: '16px 24px', borderBottom: `1px solid ${themeParam.palette.divider}`, transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out' }) }
        },
        MuiDialogActions: {
            styleOverrides: { root: ({ theme: themeParam }) => ({ padding: '16px 24px', backgroundColor: themeParam.palette.background.paper, borderTop: `1px solid ${themeParam.palette.divider}`, transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out' }) }
        },
        MuiListItem: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    paddingTop: 6, paddingBottom: 6, alignItems: 'flex-start',
                    transition: 'background-color 0.3s ease-in-out',
                    '&:hover': { backgroundColor: themeParam.palette.action.hover },
                    '&.Mui-selected': {
                        backgroundColor: themeParam.palette.action.selected,
                        '&:hover': { backgroundColor: themeParam.palette.action.hover },
                    },
                })
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                    marginTop: 0, marginBottom: 0,
                    '& .MuiListItemText-primary': { color: themeParam.palette.text.primary, transition: 'color 0.3s ease-in-out', },
                    '& .MuiListItemText-secondary': { color: themeParam.palette.text.secondary, transition: 'color 0.3s ease-in-out', },
                })
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: ({ theme: themeParam, ownerState }) => ({
                    borderRadius: themeParam.shape.borderRadius,
                    border: `1px solid ${themeParam.palette[ownerState.severity || 'info'].main + '4D'}`,
                    color: themeParam.palette.getContrastText(themeParam.palette[ownerState.severity || 'info'].light),
                    backgroundColor: themeParam.palette.mode === 'light'
                        ? themeParam.palette[ownerState.severity || 'info'].light + '4D'
                        : themeParam.palette[ownerState.severity || 'info'].dark + '59',
                    transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, color 0.3s ease-in-out',
                    '& .MuiAlert-icon': {
                        color: themeParam.palette[ownerState.severity || 'info'].main,
                        opacity: themeParam.palette.mode === 'light' ? 0.9 : 1,
                        transition: 'color 0.3s ease-in-out',
                    },
                }),
            }
        },
        MuiList: {
            styleOverrides: {
                root: ({ theme: themeParam }) => ({
                })
            }
        }
    }
});


// --- Main Application Component ---
function App() {
    // --- State ---
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [mode, setMode] = useState('dark');

    // --- React Router Hooks ---
    const location = useLocation();
    const navigate = useNavigate();

    // --- Theme Memoization ---
    const theme = useMemo(() => {
        let createdTheme = createTheme(getDesignTokens(mode));
        createdTheme = responsiveFontSizes(createdTheme);
        return createdTheme;
    }, [mode]);

    // --- Event Handlers ---
    const handleAddFormSubmit = () => {
        setRefreshFlag(prev => !prev);
        navigate('/');
        window.scrollTo(0, 0);
    };

    const handleAddFormCancel = () => {
        navigate('/');
        window.scrollTo(0, 0);
    };

    const handleArticleDeleted = () => {
        setRefreshFlag(prev => !prev);
    };

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // --- UI Logic Variables ---
    const isHomePage = location.pathname === '/';
    const isAddPage = location.pathname === '/new';
    const isArticleDetailPage = location.pathname.startsWith('/articles/');
    const showBackButton = !isHomePage;

    // --- Render ---
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <Container
                maxWidth="lg"
                sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 4, md: 6 } }}
            >
                {/* --- Header --- */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        mb: 3, pb: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        gap: 2,
                        position: 'relative',
                        transition: 'border-color 0.3s ease-in-out',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: { xs: 1, sm: 0 } }}>
                        {showBackButton && (
                            <Tooltip title="Назад" arrow>
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    color="inherit"
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                transition: 'color 0.3s ease-in-out',
                                fontSize: { xs: '1.8rem', sm: '2.125rem' }
                            }}
                        >
                            {isArticleDetailPage ? 'Статья' : isAddPage ? 'Новая статья' : 'Статьи'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        {isHomePage && (
                            <Button
                                component={Link} to="/new" variant="contained"
                                color="primary" startIcon={<AddIcon />}
                                sx={{ boxShadow: 1 }}
                            >
                                Добавить
                            </Button>
                        )}
                        <Tooltip title={mode === 'dark' ? "Светлый режим" : "Темный режим"} arrow>
                            <IconButton
                                onClick={toggleColorMode}
                                color="inherit"
                                className="theme-toggle-button"
                                aria-label="toggle theme"
                            >
                                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* --- Routes --- */}
                <Routes>
                    <Route
                        path="/"
                        element={<PaperWrapper><ArticleList refreshFlag={refreshFlag} /></PaperWrapper>}
                    />
                    <Route
                        path="/articles/:articleId"
                        element={<PaperWrapper><ArticleDetail onArticleDeleted={handleArticleDeleted} /></PaperWrapper>}
                    />
                    <Route
                        path="/new"
                        element={<PaperWrapper><ArticleForm existingArticle={null} onFormSubmit={handleAddFormSubmit} onCancel={handleAddFormCancel} /></PaperWrapper>}
                    />
                    <Route
                        path="*"
                        element={<PaperWrapper><Typography variant="h5" align="center" sx={{p: 4}}>404: Страница не найдена</Typography></PaperWrapper>}
                    />
                </Routes>
            </Container>
        </ThemeProvider>
    );
}

export default App;