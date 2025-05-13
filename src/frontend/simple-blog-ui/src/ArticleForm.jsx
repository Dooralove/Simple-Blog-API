// --- Imports ---
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    TextField,
    Button,
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
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// --- Component Definition ---
const ArticleForm = ({ existingArticle, onFormSubmit, onCancel }) => {
    // --- Hooks ---
    const theme = useTheme();

    // --- State ---
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [allAvailableSystemTags, setAllAvailableSystemTags] = useState([]);
    const [tagsSystemLoading, setTagsSystemLoading] = useState(true);
    const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
    const [tagToAddInDialog, setTagToAddInDialog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
    const [openSaveConfirmDialog, setOpenSaveConfirmDialog] = useState(false);
    const [initialTitle, setInitialTitle] = useState("");
    const [initialContent, setInitialContent] = useState("");
    const [initialTags, setInitialTags] = useState([]);

    // --- Data Fetching (All System Tags) ---
    const fetchAllSystemTags = useCallback(async () => {
        setTagsSystemLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/tags/all");
            setAllAvailableSystemTags(response.data || []);
        } catch (err) {
            console.error("Error fetching all system tags:", err);
            setAllAvailableSystemTags([]);
        } finally {
            setTagsSystemLoading(false);
        }
    }, []);

    // --- Effects ---
    useEffect(() => {
        fetchAllSystemTags();
    }, [fetchAllSystemTags]);

    useEffect(() => {
        const currentTitle = existingArticle?.title || "";
        const currentContent = existingArticle?.content || "";
        const currentTagsFromProp = existingArticle?.tags || [];

        setTitle(currentTitle);
        setContent(currentContent);

        const mappedCurrentTags = currentTagsFromProp.map(ct => {
            const foundSystemTag = allAvailableSystemTags.find(st => st.id === ct.id && st.name === ct.name);
            return foundSystemTag || ct;
        });

        setSelectedTags(mappedCurrentTags);
        setInitialTitle(currentTitle);
        setInitialContent(currentContent);
        setInitialTags(mappedCurrentTags);

        setError(null);
    }, [existingArticle, allAvailableSystemTags]);


    // --- Save Operation Logic ---
    const performSave = async () => {
        setIsLoading(true);
        setError(null);
        const articleData = {
            title,
            content,
            tags: selectedTags
        };

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
            const apiError = err.response?.data?.message || err.response?.data || err.message || "Неизвестная ошибка";
            setError(`Не удалось ${existingArticle?.id ? "сохранить" : "создать"} статью: ${apiError}`);
        } finally {
            setIsLoading(false);
            setOpenSaveConfirmDialog(false);
        }
    };

    // --- Form Submission Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !content.trim()) {
            setError("Заголовок и контент не могут быть пустыми.");
            return;
        }

        if (existingArticle?.id) {
            setOpenSaveConfirmDialog(true);
        } else {
            await performSave();
        }
    };

    // --- Tag Management Handlers ---
    const handleTagChipDelete = (tagToDelete) => {
        setSelectedTags((prevTags) => prevTags.filter((tag) => tag.id !== tagToDelete.id));
    };

    const handleOpenAddTagDialog = () => {
        setTagToAddInDialog(null);
        setOpenAddTagDialog(true);
    };

    const handleCloseAddTagDialog = () => {
        setOpenAddTagDialog(false);
    };

    const handleConfirmAddTagFromDialog = () => {
        if (tagToAddInDialog && !selectedTags.find(st => st.id === tagToAddInDialog.id)) {
            setSelectedTags(prevTags => [...prevTags, tagToAddInDialog]);
        }
        handleCloseAddTagDialog();
    };


    // --- Cancel Confirmation Handlers ---
    const handleOpenCancelConfirm = () => {
        const currentTagIds = selectedTags.map(t => t.id).sort().join(',');
        const initialTagIds = initialTags.map(t => t.id).sort().join(',');

        if (existingArticle && (title !== initialTitle || content !== initialContent || currentTagIds !== initialTagIds)) {
            setOpenCancelConfirm(true);
        } else if (!existingArticle && (title || content || selectedTags.length > 0)) {
            setOpenCancelConfirm(true);
        }
        else {
            onCancel();
        }
    };

    const handleCloseCancelConfirm = () => setOpenCancelConfirm(false);
    const handleConfirmCancel = () => {
        handleCloseCancelConfirm();
        onCancel();
    };

    // --- Save Confirmation Dialog Handlers ---
    const handleCloseSaveConfirmDialog = () => {
        if (!isLoading) {
            setOpenSaveConfirmDialog(false);
        }
    };

    const handleConfirmSave = async () => {
        await performSave();
    };


    // --- Derived Data for Dialog ---
    const availableTagsForDialog = allAvailableSystemTags.filter(
        sysTag => !selectedTags.find(selTag => selTag.id === sysTag.id)
    );

    // --- Render ---
    return (
        <Box>
            {/* --- Form Header --- */}
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "medium", mb: 3 }}>
                {existingArticle?.id ? "Редактировать статью" : "Создать новую статью"}
            </Typography>

            {/* --- Error Alert --- */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {/* --- Main Form --- */}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} direction="column" wrap="wrap">
                    {/* --- Title Field --- */}
                    <Grid item xs={12}>
                        <TextField
                            label="Заголовок" variant="outlined" fullWidth value={title}
                            onChange={(e) => setTitle(e.target.value)} required disabled={isLoading}
                            placeholder="Введите заголовок статьи" autoFocus
                        />
                    </Grid>
                    {/* --- Content Field --- */}
                    <Grid item xs={12}>
                        <TextField
                            label="Контент" variant="outlined" fullWidth multiline rows={6} value={content}
                            onChange={(e) => setContent(e.target.value)} required disabled={isLoading}
                            placeholder="Введите основной текст статьи"
                        />
                    </Grid>
                    {/* --- Tags Section --- */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: theme.palette.text.secondary }}>
                                Теги статьи:
                            </Typography>
                            <Tooltip title="Добавить тег" arrow>
                                <span>
                                <IconButton onClick={handleOpenAddTagDialog} size="small" color="primary" disabled={tagsSystemLoading || isLoading}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                        {tagsSystemLoading && <CircularProgress size={20} sx={{ml:1}}/>}
                        {!tagsSystemLoading && selectedTags.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                Теги не добавлены.
                            </Typography>
                        )}
                        {!tagsSystemLoading && selectedTags.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
                                {selectedTags.map((tag) => (
                                    <Chip
                                        key={tag.id}
                                        label={tag.name}
                                        onDelete={() => handleTagChipDelete(tag)}
                                        deleteIcon={<DeleteIcon />}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        disabled={isLoading}
                                    />
                                ))}
                            </Box>
                        )}
                    </Grid>
                    {/* --- Action Buttons --- */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "flex-start", gap: 1.5 }}>
                            {onCancel && (
                                <Button variant="outlined" color="secondary" onClick={handleOpenCancelConfirm} disabled={isLoading} startIcon={<CancelIcon />}>
                                    Отмена
                                </Button>
                            )}
                            <Button type="submit" variant="contained" color="primary" disabled={isLoading || !title.trim() || !content.trim()}
                                    startIcon={isLoading && !openSaveConfirmDialog ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}>
                                {isLoading && !openSaveConfirmDialog ? "Сохранение..." : (existingArticle?.id ? "Сохранить изменения" : "Создать статью")}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            {/* --- Add Tag Dialog --- */}
            <Dialog open={openAddTagDialog} onClose={handleCloseAddTagDialog} fullWidth maxWidth="xs">
                <DialogTitle>Добавить тег к статье</DialogTitle>
                <DialogContent sx={{ pt: "10px !important", minHeight: '150px' }}>
                    {tagsSystemLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : availableTagsForDialog.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                            Все доступные теги уже добавлены или нет доступных тегов в системе.
                        </Typography>
                    ) : (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {availableTagsForDialog.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    clickable
                                    onClick={() => setTagToAddInDialog(tag)}
                                    color="primary"
                                    variant={tagToAddInDialog?.id === tag.id ? "filled" : "outlined"}
                                />
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddTagDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleConfirmAddTagFromDialog} variant="contained" color="primary" disabled={!tagToAddInDialog || tagsSystemLoading}>
                        Добавить выбранный
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- Cancel Confirmation Dialog --- */}
            <Dialog open={openCancelConfirm} onClose={handleCloseCancelConfirm} aria-labelledby="cancel-confirm-dialog-title">
                <DialogTitle id="cancel-confirm-dialog-title" sx={{ fontSize: "1rem" }}>
                    Отменить несохраненные изменения?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mt: 1, fontSize: "0.875rem" }}>
                        Все несохраненные изменения будут потеряны.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "flex-start", gap: 1.5 }}>
                    <Button onClick={handleConfirmCancel} variant="outlined" color="error" sx={{ textTransform: "none", fontSize: "0.875rem" }}>
                        Отказаться от изменений
                    </Button>
                    <Button onClick={handleCloseCancelConfirm} variant="contained" color="primary" autoFocus sx={{ textTransform: "none", fontSize: "0.875rem" }}>
                        Продолжить редактирование
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- Save Confirmation Dialog --- */}
            <Dialog open={openSaveConfirmDialog} onClose={handleCloseSaveConfirmDialog} aria-labelledby="save-confirm-dialog-title">
                <DialogTitle id="save-confirm-dialog-title">
                    Подтвердить сохранение
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Вы уверены, что хотите сохранить внесенные изменения?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSaveConfirmDialog} color="secondary" disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmSave} variant="contained" color="primary" autoFocus disabled={isLoading}>
                        {isLoading ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ArticleForm;