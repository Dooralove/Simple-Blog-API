import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Paper,
    Grid,
    Typography,
    Box,
    CircularProgress,
    Alert,
    useTheme, // Импортируем useTheme
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const ArticleForm = ({ existingArticle, onFormSubmit, onCancel }) => {
    const theme = useTheme(); // Получаем тему
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTitle(existingArticle?.title || "");
        setContent(existingArticle?.content || "");
        setError(null);
        setIsLoading(false);
    }, [existingArticle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!title.trim() || !content.trim()) {
            setError("Заголовок и контент не могут быть пустыми.");
            setIsLoading(false);
            return;
        }

        const articleData = { title, content };

        try {
            if (existingArticle?.id) {
                await axios.put(
                    `http://localhost:8080/articles/${existingArticle.id}`,
                    articleData
                );
            } else {
                await axios.post("http://localhost:8080/articles/create", articleData);
            }
            onFormSubmit();
        } catch (err) {
            console.error("Ошибка при отправке формы:", err);
            setError(
                `Не удалось ${
                    existingArticle?.id ? "сохранить" : "создать"
                } статью. ${err.message}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: { xs: 2, md: 3 },
                marginTop: 2,
                marginBottom: 4,
                borderLeft: `5px solid ${theme.palette.primary.main}`, // Добавим цветную полоску слева
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: "medium",
                    mb: 3,
                    color: theme.palette.primary.dark, // Используем цвет темы для заголовка
                }}
            >
                {existingArticle?.id ? "Редактировать статью" : "Создать новую статью"}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Заголовок"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isLoading}
                            // Добавим цвет фокуса
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Контент"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            disabled={isLoading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                            {onCancel && (
                                <Button
                                    variant="outlined"
                                    color="secondary" // Использует secondary цвет темы
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    startIcon={<CancelIcon />}
                                >
                                    Отмена
                                </Button>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary" // Использует primary цвет темы
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
                            >
                                {isLoading
                                    ? "Сохранение..."
                                    : existingArticle?.id
                                        ? "Сохранить изменения"
                                        : "Создать статью"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default ArticleForm;