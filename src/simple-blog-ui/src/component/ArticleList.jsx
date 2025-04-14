import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Collapse, Box, Typography, Grid, Paper, Stack, IconButton,
    Card, CardContent, CardActions, Chip, Divider, List, ListItem, ListItemText,
    Autocomplete
} from "@mui/material";
import {
    ThumbUpAlt, ThumbUpOffAlt, ThumbDownAlt, ThumbDownOffAlt,
    ChatBubbleOutline, AddComment, LocalOffer, Edit, Delete,
    Comment, Visibility, VisibilityOff
} from '@mui/icons-material';

const ArticleList = ({ onEdit, onDelete, refreshFlag, setRefreshFlag }) => {
    const [articles, setArticles] = useState([]);
    const [tags, setTags] = useState([]); // Список всех тегов
    const [selectedTag, setSelectedTag] = useState(null); // Выбранный тег
    const [tagError, setTagError] = useState(""); // Ошибка для тега
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Диалог добавления комментария
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [currentArticleIdForComment, setCurrentArticleIdForComment] = useState(null);
    const [commentText, setCommentText] = useState("");

    // Диалог добавления тега
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [currentArticleIdForTag, setCurrentArticleIdForTag] = useState(null);

    // Отображение комментариев/тегов
    const [expandedComments, setExpandedComments] = useState({});
    const [expandedTags, setExpandedTags] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const [tagsMap, setTagsMap] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    const [loadingTags, setLoadingTags] = useState({});

    useEffect(() => {
        fetchData();
    }, [refreshFlag]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [articlesResponse, tagsResponse] = await Promise.all([
                axios.get("http://localhost:8080/articles/all"),
                axios.get("http://localhost:8080/tags/all")
            ]);
            setArticles(articlesResponse.data);
            setTags(tagsResponse.data);
            await fetchAllTagsForArticles(articlesResponse.data);
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            setError("Не удалось загрузить данные.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTagsForArticles = async (articlesData) => {
        const requests = articlesData.map(article =>
            axios.get(`http://localhost:8080/articles/${article.id}/tags`)
                .then(res => ({ articleId: article.id, tags: res.data }))
                .catch(err => {
                    console.error(`Ошибка при получении тегов для статьи ${article.id}:`, err);
                    return { articleId: article.id, tags: [] };
                })
        );
        try {
            const results = await Promise.all(requests);
            const newTagsMap = results.reduce((acc, { articleId, tags }) => {
                acc[articleId] = tags;
                return acc;
            }, {});
            setTagsMap(newTagsMap);
        } catch (error) {
            console.error("Ошибка при пакетной загрузке тегов:", error);
        }
    };

    const fetchComments = async (articleId) => {
        setLoadingComments(prev => ({ ...prev, [articleId]: true }));
        try {
            const response = await axios.get(`http://localhost:8080/comments/by-article/${articleId}`);
            setCommentsMap((prev) => ({ ...prev, [articleId]: response.data }));
        } catch (error) {
            console.error(`Ошибка при получении комментариев для статьи ${articleId}:`, error);
            setCommentsMap((prev) => ({ ...prev, [articleId]: [] }));
        } finally {
            setLoadingComments(prev => ({ ...prev, [articleId]: false }));
        }
    };

    const handleToggleComments = (articleId) => {
        const isOpening = !expandedComments[articleId];
        setExpandedComments(prev => ({ ...prev, [articleId]: isOpening }));
        if (isOpening && !commentsMap[articleId]) {
            fetchComments(articleId);
        }
    };

    const handleToggleTags = (articleId) => {
        setExpandedTags(prev => ({ ...prev, [articleId]: !prev[articleId] }));
    };

    // --- Лайки/дизлайки ---
    const handleLike = async (id) => {
        try {
            const response = await axios.post(`http://localhost:8080/articles/${id}/like`);
            const updatedArticle = response.data;
            // Локально обновляем только измененную статью
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === id ? { ...article, likes: updatedArticle.likes } : article
                )
            );
        } catch (error) {
            console.error("Ошибка при установке лайка:", error);
        }
    };

    const handleDislike = async (id) => {
        try {
            const response = await axios.post(`http://localhost:8080/articles/${id}/dislike`);
            const updatedArticle = response.data;
            // Локально обновляем только измененную статью
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === id ? { ...article, dislikes: updatedArticle.dislikes } : article
                )
            );
        } catch (error) {
            console.error("Ошибка при установке дизлайка:", error);
        }
    };

    // --- Диалог комментариев ---
    const handleOpenCommentDialog = (articleId) => {
        setCurrentArticleIdForComment(articleId);
        setCommentText("");
        setOpenCommentDialog(true);
    };
    const handleCloseCommentDialog = () => setOpenCommentDialog(false);
    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;
        try {
            await axios.post("http://localhost:8080/comments/create", {
                article: { id: currentArticleIdForComment },
                content: commentText
            });
            handleCloseCommentDialog();
            if (expandedComments[currentArticleIdForComment]) {
                fetchComments(currentArticleIdForComment);
            }
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
        }
    };

    // --- Диалог тегов ---
    const handleOpenTagDialog = (articleId) => {
        setCurrentArticleIdForTag(articleId);
        setSelectedTag(null);
        setTagError("");
        setOpenTagDialog(true);
    };
    const handleCloseTagDialog = () => setOpenTagDialog(false);
    const handleSubmitTag = async () => {
        if (!selectedTag) {
            setTagError("Пожалуйста, выберите тег.");
            return;
        }
        try {
            await axios.put(`http://localhost:8080/articles/${currentArticleIdForTag}/tags/${selectedTag.id}`);
            handleCloseTagDialog();
            // Обновляем теги для статьи
            const response = await axios.get(`http://localhost:8080/articles/${currentArticleIdForTag}/tags`);
            setTagsMap(prev => ({ ...prev, [currentArticleIdForTag]: response.data }));
        } catch (error) {
            console.error("Ошибка при добавлении тега:", error);
            setTagError(error.response?.data?.message || "Ошибка при привязке тега.");
        }
    };

    // --- Отображение ---
    if (loading) return <Typography sx={{ mt: 2 }}>Загрузка статей...</Typography>;
    if (error) return <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>;
    if (articles.length === 0) return <Typography sx={{ mt: 2 }}>Статей пока нет.</Typography>;

    return (
        <>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                {articles.map((article) => (
                    <Grid item xs={12} md={6} lg={4} key={article.id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6" component="div" noWrap title={article.title}>
                                        {article.title}
                                    </Typography>
                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton size="small" onClick={() => onEdit(article)} title="Редактировать">
                                            <Edit fontSize="inherit" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => onDelete(article.id)} title="Удалить">
                                            <Delete fontSize="inherit" color="error" />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    minHeight: '60px'
                                }}>
                                    {article.content}
                                </Typography>
                                {tagsMap[article.id] && tagsMap[article.id].length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                        {tagsMap[article.id].map(tag => (
                                            <Chip key={tag.id} label={tag.name} size="small" />
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <IconButton size="small" onClick={() => handleLike(article.id)} title="Нравится">
                                        <ThumbUpAlt fontSize="inherit" color="success"/>
                                    </IconButton>
                                    <Typography variant="body2">{article.likes ?? 0}</Typography>
                                    <IconButton size="small" onClick={() => handleDislike(article.id)} title="Не нравится">
                                        <ThumbDownAlt fontSize="inherit" color="error"/>
                                    </IconButton>
                                    <Typography variant="body2">{article.dislikes ?? 0}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <IconButton size="small" onClick={() => handleOpenCommentDialog(article.id)} title="Добавить комментарий">
                                        <AddComment fontSize="inherit" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleOpenTagDialog(article.id)} title="Добавить тег">
                                        <LocalOffer fontSize="inherit" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleToggleComments(article.id)} title={expandedComments[article.id] ? "Скрыть комментарии" : "Показать комментарии"}>
                                        {expandedComments[article.id] ? <VisibilityOff fontSize="inherit"/> : <Comment fontSize="inherit"/>}
                                    </IconButton>
                                </Stack>
                            </CardActions>
                            <Collapse in={expandedComments[article.id]} timeout="auto" unmountOnExit>
                                <Divider />
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Комментарии</Typography>
                                    {loadingComments[article.id] && <Typography variant="body2">Загрузка...</Typography>}
                                    {!loadingComments[article.id] && commentsMap[article.id] && commentsMap[article.id].length > 0 ? (
                                        <List dense disablePadding>
                                            {commentsMap[article.id].map((comment) => (
                                                <ListItem key={comment.id} disableGutters>
                                                    <ListItemText primary={comment.content} sx={{wordBreak: 'break-word'}} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : !loadingComments[article.id] ? (
                                        <Typography variant="body2" color="text.secondary">Нет комментариев.</Typography>
                                    ) : null}
                                </Box>
                            </Collapse>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Диалог для добавления комментария */}
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog} fullWidth maxWidth="xs">
                <DialogTitle>Добавить комментарий</DialogTitle>
                <DialogContent>
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentDialog}>Отмена</Button>
                    <Button onClick={handleSubmitComment} variant="contained">Добавить</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог для добавления тега */}
            <Dialog open={openTagDialog} onClose={handleCloseTagDialog} fullWidth maxWidth="xs">
                <DialogTitle>Добавить тег к статье</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={tags}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => setSelectedTag(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Выберите тег"
                                variant="outlined"
                                error={!!tagError}
                                helperText={tagError || "Выберите тег из списка."}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTagDialog}>Отмена</Button>
                    <Button onClick={handleSubmitTag} variant="contained">Добавить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ArticleList;