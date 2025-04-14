import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Collapse,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Grid,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemText,
    Autocomplete,
    Tooltip,
    Avatar,
    useTheme,
} from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from "@mui/icons-material/Comment";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import TagIcon from '@mui/icons-material/Tag';

const ArticleList = ({ onEdit, onDelete, refreshFlag }) => {
    const theme = useTheme();
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояния для диалогов
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [allTags, setAllTags] = useState([]);

    // Состояния для раскрытия комментариев и тегов
    const [openCommentsMap, setOpenCommentsMap] = useState({});
    const [openTagsMap, setOpenTagsMap] = useState({});

    // Карты для хранения загруженных комментариев и тегов
    const [commentsMap, setCommentsMap] = useState({});
    const [tagsMap, setTagsMap] = useState({});

    // --- Функции переключения раскрытия ---
    const handleToggleComments = async (articleId) => {
        const willBeOpen = !openCommentsMap[articleId];
        setOpenCommentsMap(prev => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && !commentsMap[articleId]) {
            await fetchComments(articleId);
        }
    };

    const handleToggleTags = async (articleId) => {
        const willBeOpen = !openTagsMap[articleId];
        setOpenTagsMap(prev => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && !tagsMap[articleId]) {
            await fetchTags(articleId);
        }
    };

    // --- Получение данных ---
    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/articles/all");
            const sortedArticles = response.data.sort((a, b) => b.id - a.id);
            setArticles(sortedArticles);
        } catch (err) {
            console.error("Ошибка при получении статей:", err);
            setError(`Не удалось загрузить статьи: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchComments = useCallback(async (articleId) => {
        if (commentsMap[articleId]) return;
        try {
            const response = await axios.get(
                `http://localhost:8080/comments/by-article/${articleId}`
            );
            setCommentsMap((prev) => ({ ...prev, [articleId]: response.data || [] }));
        } catch (error) {
            console.error(`Ошибка при получении комментариев для статьи ${articleId}:`, error);
            setCommentsMap((prev) => ({ ...prev, [articleId]: [] }));
        }
    }, [commentsMap]);

    const fetchTags = useCallback(async (articleId) => {
        if (tagsMap[articleId]) return;
        try {
            const response = await axios.get(
                `http://localhost:8080/articles/${articleId}/tags`
            );
            setTagsMap((prev) => ({ ...prev, [articleId]: response.data || [] }));
        } catch (error) {
            console.error(`Ошибка при получении тегов для статьи ${articleId}:`, error);
            setTagsMap((prev) => ({ ...prev, [articleId]: [] }));
        }
    }, [tagsMap]);

    const fetchAllTags = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/tags/all");
            setAllTags(response.data || []);
        } catch (error) {
            console.error("Ошибка при получении всех тегов:", error);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
        fetchAllTags();
    }, [refreshFlag, fetchArticles, fetchAllTags]);

    // --- Действия со статьями ---
    const handleAction = async (actionUrl, method = 'post', successMessage, errorMessage) => {
        setError(null);
        try {
            await axios({ method, url: actionUrl });
            console.log(successMessage);
            fetchArticles();
        } catch (error) {
            console.error(errorMessage, error);
            setError(`${errorMessage}: ${error.message}`);
        }
    };

    const handleLike = (id) => handleAction(`http://localhost:8080/articles/${id}/like`, 'post', 'Лайк добавлен', 'Ошибка добавления лайка');
    const handleDislike = (id) => handleAction(`http://localhost:8080/articles/${id}/dislike`, 'post', 'Дизлайк добавлен', 'Ошибка добавления дизлайка');

    const handleDeleteArticle = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
            try {
                await axios.delete(`http://localhost:8080/articles/${id}`);
                console.log(`Статья ${id} удалена`);
                fetchArticles();
            } catch (error) {
                console.error(`Ошибка при удалении статьи ${id}:`, error);
                setError(`Не удалось удалить статью: ${error.message}`);
            }
        }
    };

    // --- Диалоги ---
    const handleOpenCommentDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setCommentText("");
        setOpenCommentDialog(true);
    };
    const handleCloseCommentDialog = () => setOpenCommentDialog(false);

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !currentArticleId) return;
        setError(null);
        try {
            await axios.post("http://localhost:8080/comments/create", {
                article: { id: currentArticleId },
                content: commentText,
            });
            handleCloseCommentDialog();
            setCommentsMap(prev => ({...prev, [currentArticleId]: undefined }));
            await fetchComments(currentArticleId);
            if (!openCommentsMap[currentArticleId]) {
                setOpenCommentsMap(prev => ({ ...prev, [currentArticleId]: true }));
            }
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
            setError(`Не удалось добавить комментарий: ${error.message}`);
        }
    };

    const handleOpenTagDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setSelectedTag(null);
        setOpenTagDialog(true);
    };
    const handleCloseTagDialog = () => setOpenTagDialog(false);

    const handleSubmitTag = async () => {
        if (!selectedTag || !currentArticleId) return;
        setError(null);
        try {
            await axios.put(
                `http://localhost:8080/articles/${currentArticleId}/tags/${selectedTag.id}`
            );
            handleCloseTagDialog();
            setTagsMap(prev => ({...prev, [currentArticleId]: undefined }));
            await fetchTags(currentArticleId);
            if (!openTagsMap[currentArticleId]) {
                setOpenTagsMap(prev => ({ ...prev, [currentArticleId]: true }));
            }
        } catch (error) {
            console.error("Ошибка при добавлении тега:", error);
            setError(`Не удалось добавить тег: ${error.message}`);
        }
    };

    // --- Рендеринг ---
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error && articles.length === 0) {
        return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    return (
        <>
            {error && articles.length > 0 && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {articles.map((article) => {
                    const isCommentsOpen = !!openCommentsMap[article.id];
                    const isTagsOpen = !!openTagsMap[article.id];
                    const comments = commentsMap[article.id];
                    const tags = tagsMap[article.id];

                    return (
                        <Grid item xs={12} md={6} lg={4} key={article.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderLeft: `5px solid ${theme.palette.primary.main}`,
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Typography variant="h6" sx={{ fontWeight: 'medium', color: theme.palette.primary.dark }}>
                                            {article.title}
                                        </Typography>
                                    }
                                    subheader={`ID: ${article.id}`}
                                    action={
                                        <>
                                            <Tooltip title="Редактировать">
                                                <IconButton onClick={() => onEdit(article)} size="small" color="secondary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton onClick={() => handleDeleteArticle(article.id)} size="small" sx={{ color: theme.palette.error.main }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                    sx={{ pb: 0, bgcolor: theme.palette.grey[100] }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {article.content.length > 150
                                            ? `${article.content.substring(0, 150)}...`
                                            : article.content}
                                    </Typography>
                                </CardContent>
                                <Divider />
                                <CardActions disableSpacing sx={{ pt: 1, pb: 1, justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="Нравится">
                                            <IconButton onClick={() => handleLike(article.id)} size="small" sx={{ color: theme.palette.primary.main }}>
                                                <ThumbUpAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Typography variant="body2" sx={{ mr: 1.5, color: theme.palette.primary.main }}>{article.likes || 0}</Typography>

                                        <Tooltip title="Не нравится">
                                            <IconButton onClick={() => handleDislike(article.id)} size="small" sx={{ color: theme.palette.secondary.main }}>
                                                <ThumbDownAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Typography variant="body2" sx={{ mr: 1.5, color: theme.palette.secondary.main }}>{article.dislikes || 0}</Typography>

                                        <Tooltip title="Добавить комментарий">
                                            <IconButton onClick={() => handleOpenCommentDialog(article.id)} size="small">
                                                <AddCommentIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Добавить тег">
                                            <IconButton onClick={() => handleOpenTagDialog(article.id)} size="small">
                                                <LabelIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title={isCommentsOpen ? "Скрыть комментарии" : "Показать комментарии"}>
                                            <IconButton
                                                onClick={() => handleToggleComments(article.id)}
                                                size="small"
                                                color={isCommentsOpen ? "primary" : "default"}
                                            >
                                                <CommentIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={isTagsOpen ? "Скрыть теги" : "Показать теги"}>
                                            <IconButton
                                                onClick={() => handleToggleTags(article.id)}
                                                size="small"
                                                color={isTagsOpen ? "primary" : "default"}
                                            >
                                                <TagIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardActions>

                                {/* Блок комментариев */}
                                <Collapse in={isCommentsOpen} timeout="auto" unmountOnExit>
                                    <CardContent sx={{
                                        pt: 1,
                                        pb: 1,
                                        bgcolor: theme.palette.grey[50]
                                    }}>
                                        <Typography variant="subtitle2" gutterBottom color="primary.dark">Комментарии:</Typography>
                                        {comments === undefined ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1}}>
                                                <CircularProgress size={20} color="primary"/>
                                            </Box>
                                        ) : comments.length > 0 ? (
                                            <List dense disablePadding>
                                                {comments.map((comment) => (
                                                    <ListItem key={comment.id} disableGutters sx={{ alignItems: 'flex-start'}}>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">{comment.content}</Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">Нет комментариев.</Typography>
                                        )}
                                    </CardContent>
                                </Collapse>

                                {/* Блок тегов */}
                                <Collapse in={isTagsOpen} timeout="auto" unmountOnExit>
                                    <CardContent sx={{
                                        pt: 1,
                                        pb: 1,
                                        bgcolor: theme.palette.grey[50]
                                    }}>
                                        <Typography variant="subtitle2" gutterBottom color="primary.dark">Теги:</Typography>
                                        {tags === undefined ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1}}>
                                                <CircularProgress size={20} color="primary"/>
                                            </Box>
                                        ) : tags.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {tags.map((tag) => (
                                                    <Chip
                                                        key={tag.id}
                                                        label={tag.name}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">Нет тегов.</Typography>
                                        )}
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {/* Диалог для добавления комментария */}
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>Добавить комментарий</DialogTitle>
                <DialogContent sx={{ pt: '20px !important' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Текст комментария"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseCommentDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleSubmitComment} variant="contained" color="primary">Добавить</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог для добавления тега */}
            <Dialog open={openTagDialog} onClose={handleCloseTagDialog} fullWidth maxWidth="xs">
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>Добавить тег к статье</DialogTitle>
                <DialogContent sx={{ pt: '20px !important' }}>
                    <Autocomplete
                        options={allTags}
                        getOptionLabel={(option) => option.name || ""}
                        value={selectedTag}
                        onChange={(event, newValue) => {
                            setSelectedTag(newValue);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Выберите существующий тег"
                                variant="outlined"
                                margin="normal"
                                required
                            />
                        )}
                        noOptionsText="Теги не найдены"
                        sx={{mt: 1}}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseTagDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleSubmitTag} variant="contained" color="primary" disabled={!selectedTag}>Добавить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ArticleList;