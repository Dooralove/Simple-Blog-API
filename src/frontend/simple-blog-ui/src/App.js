import React, { useState } from 'react';
import { Container, Typography, Button, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import AddIcon from '@mui/icons-material/Add';
import { blue, pink, grey } from '@mui/material/colors'; // Импортируем grey

// --- Создание кастомной темы ---
let theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
            light: blue[500],
            dark: blue[800],
        },
        secondary: {
            main: pink[500], // Пример вторичного цвета
            light: pink[300],
            dark: pink[700],
        },
        background: {
            // Цвет фона для "бумажных" элементов (Карточки, Контейнер)
            paper: '#ffffff',
            // Цвет фона для всей страницы (body) - создаем контраст
            default: grey[100], // Очень светло-серый
        },
        // Можно добавить другие настройки, например, типографику
    },
    typography: {
        h4: {
            fontWeight: 600, // Делаем заголовки чуть жирнее
        },
        h5: {
            fontWeight: 600,
        },
        // ... другие настройки типографики
    },
    shape: {
        borderRadius: 8, // Устанавливаем базовое скругление углов (в px * множитель темы, обычно 1 = 8px)
    },
    components: {
        // --- Глобальные стили для body через CssBaseline ---
        MuiCssBaseline: {
            styleOverrides: `
            body {
              background-color: ${grey[100]}; // Устанавливаем фон для body
              // --- Альтернативный вариант: Градиент ---
              // background: linear-gradient(135deg, ${blue[50]} 0%, ${grey[50]} 100%);
              // background-attachment: fixed;
            }
          `,
        },
        // --- Кастомизация Карточек ---
        MuiCard: {
            styleOverrides: {
                root: {
                    // Увеличим тень и скругление для лучшего выделения
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: 12, // Делаем углы карт более скругленными
                    border: `1px solid ${grey[200]}`, // Добавляем тонкую границу
                    // Убедимся что карточки имеют стандартный фон, если не переопределен
                    backgroundColor: '#ffffff', // Явно задаем белый фон для карт
                    // Добавим бордер, перенесенный из ArticleList, для консистентности
                    borderLeft: `5px solid ${blue[700]}` // Используем основной цвет темы
                }
            }
        },
        // --- Кастомизация Кнопок (если нужно) ---
        MuiButton: {
            styleOverrides: {
                root: {
                    // textTransform: 'none', // Убрать КАПС в кнопках
                }
            }
        },
        // --- Кастомизация Paper (для формы, если нужно) ---
        MuiPaper: {
            styleOverrides: {
                root: {
                    // Можно добавить общие стили, например, тень по умолчанию
                    // boxShadow: theme.shadows[2], // Пример
                }
            }
        },
        // Можно добавить другие компоненты...
    }
});

// Делаем шрифты адаптивными
theme = responsiveFontSizes(theme);

// --- Основной компонент приложения ---
function App() {
    const [editingArticle, setEditingArticle] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    // --- Обработчики ---
    const handleEdit = (article) => {
        setEditingArticle(article);
        setShowForm(true);
    };

    const handleDelete = () => {
        setRefreshFlag(!refreshFlag); // Просто триггер для обновления списка
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        setEditingArticle(null);
        setRefreshFlag(!refreshFlag); // Обновляем список после добавления/редактирования
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingArticle(null);
    };

    const handleAddNew = () => {
        setEditingArticle(null); // Убедимся, что форма открывается для создания новой статьи
        setShowForm(true);
    };

    // --- Рендер компонента ---
    return (
        // Оборачиваем всё в ThemeProvider с нашей кастомной темой
        <ThemeProvider theme={theme}>
            {/* CssBaseline применяет базовые стили и наши переопределения (напр., фон body) */}
            <CssBaseline />

            {/* --- Основной контейнер контента --- */}
            <Container
                maxWidth="lg" // Ограничиваем максимальную ширину контента
                sx={{
                    mt: { xs: 2, md: 4 }, // Внешний отступ сверху (адаптивный)
                    mb: { xs: 2, md: 4 }, // Внешний отступ снизу (адаптивный)
                    // --- Стили для выделения контейнера на фоне страницы ---
                    bgcolor: 'background.paper',   // Белый фон для области контента
                    borderRadius: theme.shape.borderRadius, // Скругление углов из темы (8px)
                    boxShadow: theme.shadows[3],   // Тень для эффекта глубины (индекс 3 из стандартных теней)
                    p: { xs: 2, sm: 3, md: 4 },    // Внутренние отступы (адаптивные)
                }}
            >
                {/* --- Заголовок и кнопка "Добавить" --- */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4, // Увеличим немного отступ снизу
                        pb: 2, // Добавим нижний отступ под чертой
                        borderBottom: `1px solid ${theme.palette.divider}` // Разделитель под заголовком
                    }}
                >
                    <Typography variant="h4" component="h1" color="primary.dark">
                        Статьи и Обсуждения
                    </Typography>
                    {/* Показываем кнопку только если форма не открыта */}
                    {!showForm && (
                        <Button
                            variant="contained"
                            color="primary" // Используем основной цвет темы
                            startIcon={<AddIcon />}
                            onClick={handleAddNew}
                        >
                            Добавить статью
                        </Button>
                    )}
                </Box>

                {/* --- Условный рендеринг: Форма или Список --- */}
                {showForm && (
                    <ArticleForm
                        existingArticle={editingArticle}
                        onFormSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        // Можно передать доп. стили через sx, если нужно
                        // sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
                    />
                )}

                {!showForm && (
                    <ArticleList
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        refreshFlag={refreshFlag} // Передаем флаг для инициирования обновления
                    />
                )}
            </Container>
        </ThemeProvider>
    );
}

export default App;