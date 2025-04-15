import React, { useState } from 'react';
// Убедись, что все необходимые компоненты импортированы
import { Container, Typography, Button, Box, CssBaseline, Paper } from '@mui/material';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import AddIcon from '@mui/icons-material/Add';
// Импортируем нужные цвета
import { blue, pink, grey, red } from '@mui/material/colors';

// --- Определение темы MUI ---
let theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
            light: blue[500],
            dark: blue[800],
            contrastText: '#ffffff',
        },
        secondary: {
            main: pink[500],
            light: pink[300],
            dark: pink[700],
            contrastText: '#ffffff',
        },
        background: {
            paper: '#ffffff',
            default: grey[100],
        },
        text: {
            primary: grey[900],
            secondary: grey[700],
        },
        error: {
            main: red[600],
            light: red[400],
        },
        info: {
            main: blue[500],
        },
        success: {
            main: '#388e3c',
        },
        divider: grey[300],
        action: {
            hover: grey[100],
            selected: blue[50],
            disabledBackground: grey[200],
            disabled: grey[500],
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            color: blue[800],
        },
        h5: {
            fontWeight: 600,
            color: blue[800],
        },
        h6: {
            fontWeight: 500,
            color: blue[900],
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
        subtitle1: {
            color: grey[600],
            fontSize: '0.85rem',
        }
    },
    shape: {
        borderRadius: 8,
    },
    // --- Переопределение стилей компонентов ---
    components: {
        MuiCssBaseline: {
            styleOverrides: ({ palette }) => (`
            body {
              /* --- Базовый цвет фона (ОБЯЗАТЕЛЬНО оставляем) --- */
              background-color: ${palette.background.default};

              /* --- ВАРИАНТЫ ФОНОВЫХ ПАТТЕРНОВ --- */
              /* Сейчас активен градиент с синим оттенком! */
              /* Если хочешь другой фон, закомментируй строку ниже */
              /* и раскомментируй нужный вариант */

              /* 1. Шум (закомментирован) */
              /* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); */

              /* 2. Полосы (закомментирован) */
              /* background-image: linear-gradient(45deg, ${palette.divider} 25%, transparent 25%, transparent 75%, ${palette.divider} 75%, ${palette.divider}); */
              /* background-size: 12px 12px; */

              /* 3. Точки (закомментирован) */
              /* background-image: radial-gradient(${palette.grey[300]} 1px, transparent 1px); */
              /* background-size: 10px 10px; */

              /* 4. Мягкий градиент (АКТИВЕН СЕЙЧАС) */
              /* background-image: linear-gradient(to bottom, ${palette.grey[50]}, ${palette.background.default}); */
              /* Градиент с оттенком основного цвета */
              background-image: linear-gradient(to bottom, ${palette.primary.main + '1A'}, ${palette.background.default} 50%); /* Легкий синий сверху, занимает 50% высоты */


              /* 5. Комбинация (закомментирован) */
              /* background-image:
                radial-gradient(${palette.grey[300]} 1px, transparent 1px),
                linear-gradient(to bottom, ${palette.primary.main + '1A'}, ${palette.background.default});
              background-size: 10px 10px, auto; */


              /* --- Общие стили для body --- */
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              min-height: 100vh;
            }
          `),
        },
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: 'none', // Важно! Убираем наследование фона body
                }),
            }
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.06)',
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    backgroundImage: 'none', // Важно! Убираем наследование фона body
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-out',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.07), 0 5px 15px rgba(0,0,0,0.08)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                })
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: '16px 16px 8px 16px',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
                title: {
                    fontSize: '1.15rem',
                    lineHeight: 1.3,
                },
                subheader: {
                    marginTop: '4px',
                },
                action: {
                    marginTop: 0,
                    marginRight: 0,
                    alignSelf: 'center',
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    flexGrow: 1,
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: '8px 16px',
                    marginTop: 'auto',
                })
            }
        },
        MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    padding: '8px 16px',
                }),
                containedPrimary: ({ theme }) => ({
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        boxShadow: 'none',
                    }
                }),
                containedSecondary: ({ theme }) => ({
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                        boxShadow: 'none',
                    }
                }),
                outlinedSecondary: ({ theme }) => ({
                    borderColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark,
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.main + '1A',
                        borderColor: theme.palette.secondary.main,
                    }
                })
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                })
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }) => ({
                    backgroundColor: theme.palette.grey[700],
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                }),
                arrow: ({ theme }) => ({
                    color: theme.palette.grey[700],
                })
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    height: '28px',
                    borderRadius: '6px',
                },
                outlinedPrimary: ({ theme }) => ({
                    color: theme.palette.primary.dark,
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.main + '1A',
                    '&:hover, &:focus': {
                        backgroundColor: theme.palette.primary.main + '33',
                    },
                }),
                clickable: ({ theme }) => ({
                    cursor: 'pointer',
                })
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.light,
                        },
                        '&.MuiInputBase-multiline': {
                            padding: '12px',
                        }
                    },
                    '& label.Mui-focused': {
                        color: theme.palette.primary.main,
                    },
                    '& .MuiFormHelperText-root': {
                        marginLeft: 2,
                    }
                })
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: '12px 24px',
                })
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: '16px 24px',
                    backgroundColor: theme.palette.grey[50],
                    borderTop: `1px solid ${theme.palette.divider}`
                })
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingTop: 4,
                    paddingBottom: 4,
                    alignItems: 'flex-start',
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    marginTop: 0,
                    marginBottom: 0,
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid`,
                }),
                standardWarning: ({ theme }) => ({
                    backgroundColor: theme.palette.warning.light + '4D',
                    borderColor: theme.palette.warning.light,
                    color: theme.palette.warning.dark,
                    '& .MuiAlert-icon': {
                        color: theme.palette.warning.main,
                    },
                }),
                standardError: ({ theme }) => ({
                    backgroundColor: theme.palette.error.light + '4D',
                    borderColor: theme.palette.error.light,
                    color: theme.palette.error.dark,
                    '& .MuiAlert-icon': {
                        color: theme.palette.error.main,
                    },
                }),
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    boxShadow: theme.shadows[4],
                }),
                option: ({ theme }) => ({
                    '&[aria-selected="true"]': {
                        backgroundColor: theme.palette.action.selected,
                        fontWeight: 'bold',
                    },
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                })
            }
        },
    }
});

theme = responsiveFontSizes(theme);

// --- Основной компонент приложения ---
function App() {
    const [editingArticle, setEditingArticle] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Применяет стили, включая фон body */}
            <Container
                maxWidth="lg"
                sx={{
                    mt: { xs: 2, md: 4 },
                    mb: { xs: 4, md: 6 },
                }}
            >
                {/* Шапка */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        mb: 3,
                        pb: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        gap: { xs: 2, sm: 1 }
                    }}
                >
                    <Typography variant="h4" component="h1">
                        Статьи и Обсуждения
                    </Typography>
                    {!showForm && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddNew}
                        >
                            Добавить статью
                        </Button>
                    )}
                </Box>

                {/* Основной контент */}
                <Paper elevation={2} sx={{
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