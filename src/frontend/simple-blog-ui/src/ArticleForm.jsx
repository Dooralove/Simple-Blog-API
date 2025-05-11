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
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

// --- Component Definition ---
const ArticleForm = ({ existingArticle, onFormSubmit, onCancel }) => {
    const theme = useTheme();

    // --- State and Effects ---
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCancelConfirm, setOpenCancelConfirm] = useState(false);

    const [initialTitle, setInitialTitle] = useState("");
    const [initialContent, setInitialContent] = useState("");

    useEffect(() => {
        const currentTitle = existingArticle?.title || "";
        const currentContent = existingArticle?.content || "";
        setTitle(currentTitle);
        setContent(currentContent);
        setInitialTitle(currentTitle);
        setInitialContent(currentContent);
        setError(null);
        setIsLoading(false);
    }, [existingArticle]);

    // --- Handlers ---
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
                await axios.post(
                    "http://localhost:8080/articles/create",
                    articleData
                );
            }
            onFormSubmit();
        } catch (err) {
            console.error("Ошибка при отправке формы:", err);
            const apiError =
                err.response?.data?.message || err.message || "Неизвестная ошибка";
            setError(
                `Не удалось ${
                    existingArticle?.id ? "сохранить" : "создать"
                } статью: ${apiError}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCancelConfirm = () => {
        if (title !== initialTitle || content !== initialContent) {
            setOpenCancelConfirm(true);
        } else {
            onCancel();
        }
    };

    const handleCloseCancelConfirm = () => {
        setOpenCancelConfirm(false);
    };

    const handleConfirmCancel = () => {
        handleCloseCancelConfirm();
        onCancel();
    };

    // --- Render Logic ---
    return (
        <Paper
            elevation={3}
            sx={{
                padding: { xs: 2, md: 3 },
                marginTop: 2,
                marginBottom: 4,
                borderLeft: `5px solid ${theme.palette.primary.main}`,
                transition: "border-left-color 0.3s ease-in-out",
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: "medium", mb: 3 }}
            >
                {existingArticle?.id ? "Редактировать статью" : "Создать новую статью"}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} direction="column" wrap="wrap">
                    <Grid item xs={12}>
                        <TextField
                            label="Заголовок"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="Введите заголовок статьи"
                            autoFocus
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
                            placeholder="Введите основной текст статьи"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "flex-start",
                                gap: 1.5,
                            }}
                        >
                            {onCancel && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleOpenCancelConfirm}
                                    disabled={isLoading}
                                    startIcon={<CancelIcon />}
                                >
                                    Отмена
                                </Button>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading || !title.trim() || !content.trim()}
                                startIcon={
                                    isLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        <SaveIcon />
                                    )
                                }
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

            {/* --- Cancel Confirmation Dialog --- */}
            <Dialog
                open={openCancelConfirm}
                onClose={handleCloseCancelConfirm}
                aria-labelledby="cancel-confirm-dialog-title"
                aria-describedby="cancel-confirm-dialog-description"
            >
                <DialogTitle
                    id="cancel-confirm-dialog-title"
                    sx={{ fontSize: "1rem" }}
                >
                    Отменить несохраненные изменения?
                </DialogTitle>

                <DialogContent>
                    <Typography
                        variant="body2"
                        id="cancel-confirm-dialog-description"
                        sx={{ mt: 2, fontSize: "0.875rem" }}
                    >
                        Все несохраненные изменения будут потеряны.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "flex-start", gap: 1.5 }}>
                    <Button
                        onClick={handleConfirmCancel}
                        variant="outlined"
                        color="error"
                        sx={{ textTransform: "none", fontSize: "0.875rem" }}
                    >
                        Отказаться от изменений
                    </Button>

                    <Button
                        onClick={handleCloseCancelConfirm}
                        variant="contained"
                        color="primary"
                        autoFocus
                        sx={{ textTransform: "none", fontSize: "0.875rem" }}
                    >
                        Продолжить редактирование
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ArticleForm;