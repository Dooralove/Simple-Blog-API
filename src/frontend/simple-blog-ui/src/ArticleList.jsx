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
    Chip, // Используем Chip для отображения тегов
    List,
    ListItem,
    ListItemText,
    // Autocomplete, // Autocomplete больше не нужен
    Tooltip,
    useTheme,
} from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from "@mui/icons-material/Comment";
import LabelIcon from "@mui/icons-material/Label"; // Иконка для добавления тега
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import TagIcon from '@mui/icons-material/Tag'; // Иконка для показа/скрытия тегов

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
    const [selectedTag, setSelectedTag] = useState(null); // Хранит ВЫБРАННЫЙ тег для добавления
    const [allTags, setAllTags] = useState([]); // Хранит ВСЕ теги из базы

    // Состояния для раскрытия комментариев и тегов
    const [openCommentsMap, setOpenCommentsMap] = useState({});
    const [openTagsMap, setOpenTagsMap] = useState({});

    // Карты для хранения загруженных данных (key: articleId, value: undefined/[]/[...])
    const [commentsMap, setCommentsMap] = useState({});
    const [tagsMap, setTagsMap] = useState({}); // Хранит теги, уже добавленные к статье

    // --- Функции переключения раскрытия ---
    const handleToggleComments = async (articleId) => {
        const willBeOpen = !openCommentsMap[articleId];
        setOpenCommentsMap(prev => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && !commentsMap.hasOwnProperty(articleId)) {
            await fetchComments(articleId);
        }
    };

    const handleToggleTags = async (articleId) => {
        const willBeOpen = !openTagsMap[articleId];
        setOpenTagsMap(prev => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && !tagsMap.hasOwnProperty(articleId)) {
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
            setError(`Не удалось загрузить статьи: ${err.message || 'Проверьте бэкенд'}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchComments = useCallback(async (articleId) => {
        setCommentsMap((prev) => ({ ...prev, [articleId]: undefined })); // Показать лоадер
        try {
            const response = await axios.get(`http://localhost:8080/comments/by-article/${articleId}`);
            setCommentsMap((prev) => ({ ...prev, [articleId]: response.data || [] }));
        } catch (error) {
            console.error(`Ошибка при получении комментариев для статьи ${articleId}:`, error);
            setCommentsMap((prev) => ({ ...prev, [articleId]: [] })); // Записать пустой массив при ошибке
        }
    }, []);

    const fetchTags = useCallback(async (articleId) => {
        setTagsMap((prev) => ({ ...prev, [articleId]: undefined })); // Показать лоадер
        try {
            const response = await axios.get(`http://localhost:8080/articles/${articleId}/tags`);
            setTagsMap((prev) => ({ ...prev, [articleId]: response.data || [] }));
        } catch (error) {
            console.error(`Ошибка при получении тегов для статьи ${articleId}:`, error);
            setTagsMap((prev) => ({ ...prev, [articleId]: [] })); // Записать пустой массив при ошибке
        }
    }, []);

    // Загружаем ВСЕ теги один раз при монтировании и обновлении флага
    const fetchAllTags = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/tags/all");
            setAllTags(response.data || []);
        } catch (error) {
            console.error("Ошибка при получении всех тегов:", error);
            // Можно установить глобальную ошибку или показать Alert
        }
    }, []);

    // Основной useEffect для загрузки
    useEffect(() => {
        fetchArticles();
        fetchAllTags(); // Загружаем список всех тегов
    }, [refreshFlag, fetchArticles, fetchAllTags]); // Зависимости

    // --- Действия со статьями ---
    const handleAction = async (actionUrl, method = 'post', successMessage, errorMessage) => {
        try {
            await axios({ method, url: actionUrl });
            console.log(successMessage);
            fetchArticles(); // Перезагружаем список для обновления счетчиков
        } catch (error) {
            console.error(errorMessage, error);
            setError(`${errorMessage}: ${error.response?.data?.message || error.message || 'Ошибка сети'}`);
            setTimeout(() => setError(null), 5000); // Скрываем ошибку через 5 сек
        }
    };

    const handleLike = (id) => handleAction(`http://localhost:8080/articles/${id}/like`, 'post', 'Лайк добавлен', 'Ошибка добавления лайка');
    const handleDislike = (id) => handleAction(`http://localhost:8080/articles/${id}/dislike`, 'post', 'Дизлайк добавлен', 'Ошибка добавления дизлайка');

    const handleDeleteArticle = async (id) => {
        // TODO: Заменить window.confirm на MUI Dialog
        if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
            setError(null);
            try {
                await axios.delete(`http://localhost:8080/articles/${id}`);
                console.log(`Статья ${id} удалена`);
                onDelete(); // Вызываем колбэк для App.js (он переключит refreshFlag)
            } catch (error) {
                console.error(`Ошибка при удалении статьи ${id}:`, error);
                setError(`Не удалось удалить статью: ${error.response?.data?.message || error.message || 'Ошибка сети'}`);
            }
        }
    };

    // --- Диалоги ---
    // Комментарии
    const handleOpenCommentDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setCommentText("");
        setOpenCommentDialog(true);
    };
    const handleCloseCommentDialog = () => setOpenCommentDialog(false);
    const handleSubmitComment = async () => {
        if (!commentText.trim() || !currentArticleId) return;
        try {
            await axios.post("http://localhost:8080/comments/create", {
                article: { id: currentArticleId },
                content: commentText,
            });
            handleCloseCommentDialog();
            await fetchComments(currentArticleId); // Обновляем комменты для статьи
            if (!openCommentsMap[currentArticleId]) {
                setOpenCommentsMap(prev => ({ ...prev, [currentArticleId]: true })); // Открываем секцию
            }
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
            alert(`Не удалось добавить комментарий: ${error.response?.data?.message || error.message}`);
        }
    };

    // Теги
    const handleOpenTagDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setSelectedTag(null); // Сбрасываем выбранный тег при открытии
        setOpenTagDialog(true);
        // Загружаем теги статьи, если их нет (нужно для фильтрации)
        if (!tagsMap.hasOwnProperty(articleId)) {
            fetchTags(articleId);
        }
    };
    const handleCloseTagDialog = () => setOpenTagDialog(false);
    const handleSubmitTag = async () => {
        if (!selectedTag || !currentArticleId) return; // Проверка, что тег выбран
        try {
            await axios.put(`http://localhost:8080/articles/${currentArticleId}/tags/${selectedTag.id}`);
            handleCloseTagDialog();
            await fetchTags(currentArticleId); // Обновляем теги статьи
            if (!openTagsMap[currentArticleId]) {
                setOpenTagsMap(prev => ({ ...prev, [currentArticleId]: true })); // Открываем секцию
            }
        } catch (error) {
            console.error("Ошибка при добавлении тега:", error);
            alert(`Не удалось добавить тег: ${error.response?.data?.message || error.message}`);
        }
    };

    // --- Рендеринг ---
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                <CircularProgress color="primary" size={50} />
            </Box>
        );
    }

    if (error && articles.length === 0) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    return (
        <>
            {/* Показ временной ошибки */}
            {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Сетка для карточек */}
            <Grid container spacing={3}>
                {/* Сообщение, если статей нет */}
                {articles.length === 0 && !isLoading && (
                    <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" align="center" sx={{mt: 4}}>
                            Статей пока нет. Добавьте первую!
                        </Typography>
                    </Grid>
                )}

                {/* Рендеринг каждой статьи */}
                {articles.map((article) => {
                    // Состояния и данные для текущей статьи
                    const isCommentsOpen = !!openCommentsMap[article.id];
                    const isTagsOpen = !!openTagsMap[article.id];
                    const comments = commentsMap[article.id];
                    const tags = tagsMap[article.id]; // Теги, уже добавленные к этой статье

                    return (
                        <Grid item xs={12} md={6} lg={4} key={article.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {/* Заголовок карточки */}
                                <CardHeader
                                    title={
                                        <Typography variant="h6" sx={{ color: theme.palette.primary.dark, fontWeight: 500 }}>
                                            {article.title}
                                        </Typography>
                                    }
                                    subheader={`ID: ${article.id} | 👍 ${article.likes || 0} | 👎 ${article.dislikes || 0}`}
                                    action={ // Кнопки редактирования и удаления
                                        <>
                                            <Tooltip title="Редактировать" arrow>
                                                <IconButton onClick={() => onEdit(article)} size="small" color="secondary">
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить" arrow>
                                                <IconButton onClick={() => handleDeleteArticle(article.id)} size="small" sx={{ color: theme.palette.error.main }}>
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                />
                                {/* Контент карточки */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}
                                    </Typography>
                                </CardContent>
                                {/* Действия карточки */}
                                <CardActions disableSpacing sx={{ justifyContent: 'space-between', mt: 'auto' }}>
                                    {/* Левая группа: лайки/дизлайки, добавить коммент/тег */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title="Нравится" arrow>
                                            <IconButton onClick={() => handleLike(article.id)} size="small" sx={{ color: theme.palette.success.main }}>
                                                <ThumbUpAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Не нравится" arrow>
                                            <IconButton onClick={() => handleDislike(article.id)} size="small" sx={{ color: theme.palette.error.light }}>
                                                <ThumbDownAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Добавить комментарий" arrow>
                                            <IconButton onClick={() => handleOpenCommentDialog(article.id)} size="small" color="primary">
                                                <AddCommentIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Добавить тег" arrow>
                                            <IconButton onClick={() => handleOpenTagDialog(article.id)} size="small" color="primary">
                                                <LabelIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    {/* Правая группа: показать/скрыть комменты/теги */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title={isCommentsOpen ? "Скрыть комментарии" : "Показать комментарии"} arrow>
                                            <IconButton onClick={() => handleToggleComments(article.id)} size="small" sx={{ color: isCommentsOpen ? theme.palette.primary.main : theme.palette.text.secondary }}>
                                                <CommentIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={isTagsOpen ? "Скрыть теги" : "Показать теги"} arrow>
                                            <IconButton onClick={() => handleToggleTags(article.id)} size="small" sx={{ color: isTagsOpen ? theme.palette.primary.main : theme.palette.text.secondary }}>
                                                <TagIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardActions>

                                {/* Секция комментариев */}
                                <Collapse in={isCommentsOpen} timeout="auto" unmountOnExit>
                                    <CardContent sx={{ pt: 1, pb: 1.5, bgcolor: theme.palette.grey[50], borderTop: `1px dashed ${theme.palette.divider}` }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium' }}>Комментарии:</Typography>
                                        {comments === undefined && ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={20} color="secondary"/></Box> )}
                                        {comments && comments.length > 0 && (
                                            <List dense disablePadding sx={{pl: 1}}>
                                                {comments.map((comment) => (
                                                    <ListItem key={comment.id} disableGutters sx={{pt: 0, pb: 0.5}}>
                                                        <ListItemText primary={ <Typography variant="body2" sx={{ color: 'text.primary' }}>{comment.content}</Typography> }/>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                        {comments && comments.length === 0 && ( <Typography variant="caption" color="text.secondary" sx={{pl: 1}}>Нет комментариев.</Typography> )}
                                    </CardContent>
                                </Collapse>

                                {/* Секция тегов */}
                                <Collapse in={isTagsOpen} timeout="auto" unmountOnExit>
                                    <CardContent sx={{ pt: 1, pb: 1.5, bgcolor: theme.palette.grey[50], borderTop: `1px dashed ${theme.palette.divider}` }}>
                                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'medium' }}>Теги:</Typography>
                                        {tags === undefined && ( <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={20} color="secondary"/></Box> )}
                                        {tags && tags.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 1 }}>
                                                {tags.map((tag) => ( <Chip key={tag.id} label={tag.name} size="small" variant="outlined" color="primary"/> ))}
                                            </Box>
                                        )}
                                        {tags && tags.length === 0 && ( <Typography variant="caption" color="text.secondary" sx={{pl: 1}}>Нет тегов.</Typography> )}
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {/* Диалог для добавления комментария */}
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog} fullWidth maxWidth="sm">
                <DialogTitle>Добавить комментарий</DialogTitle>
                <DialogContent sx={{ pt: '20px !important' }}>
                    <TextField autoFocus margin="dense" id="comment-text" label="Текст комментария" type="text" fullWidth multiline rows={4} variant="outlined" value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleSubmitComment} variant="contained" color="primary" disabled={!commentText.trim()}>Добавить</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог для добавления тега (с Chip вместо Autocomplete) */}
            <Dialog open={openTagDialog} onClose={handleCloseTagDialog} fullWidth maxWidth="sm">
                <DialogTitle>Выбрать тег для добавления</DialogTitle>
                <DialogContent sx={{ pt: '20px !important' }}>
                    {/* Контейнер для тегов-кнопок */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(() => {
                            // ID тегов, уже добавленных к текущей статье
                            const currentArticleTags = tagsMap[currentArticleId];
                            // Показываем лоадер, если теги статьи еще не загружены
                            if (currentArticleTags === undefined && currentArticleId) {
                                return (
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <CircularProgress size={25} />
                                    </Box>
                                );
                            }

                            const currentArticleTagIds = (currentArticleTags || []).map(t => t.id);

                            // Фильтруем общий список тегов
                            const availableTags = allTags.filter(tag => !currentArticleTagIds.includes(tag.id));

                            // Сообщение, если нет доступных тегов
                            if (availableTags.length === 0) {
                                return (
                                    <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', mt: 2, mb: 1 }}>
                                        {allTags.length === 0 ? "Список тегов пуст." : "Все доступные теги уже добавлены."}
                                    </Typography>
                                );
                            }

                            // Рендерим кликабельные Chip
                            return availableTags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    clickable
                                    onClick={() => setSelectedTag(tag)} // Устанавливаем выбранный
                                    color="primary"
                                    variant={selectedTag?.id === tag.id ? "filled" : "outlined"} // Выделяем выбранный
                                    sx={{ cursor: 'pointer' }}
                                />
                            ));
                        })()}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTagDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleSubmitTag} variant="contained" color="primary" disabled={!selectedTag}>Добавить выбранный тег</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ArticleList;