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
    Chip,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    useTheme,
    Fade,
    Divider,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentIcon from "@mui/icons-material/Comment";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import TagIcon from "@mui/icons-material/Tag";
// --- Иконки соцсетей ---
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

// --- Component Definition ---
const ArticleList = ({ onEdit, onDelete, refreshFlag }) => {
    const theme = useTheme();

    // --- State ---
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [openTagDialog, setOpenTagDialog] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [allTags, setAllTags] = useState([]);

    const [openCommentsMap, setOpenCommentsMap] = useState({});
    const [openTagsMap, setOpenTagsMap] = useState({});

    const [commentsMap, setCommentsMap] = useState({});
    const [tagsMap, setTagsMap] = useState({});

    // --- Toggle Expansion Functions ---
    const handleToggleComments = async (articleId) => {
        const willBeOpen = !openCommentsMap[articleId];
        setOpenCommentsMap((prev) => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && commentsMap[articleId] === undefined) {
            await fetchComments(articleId);
        }
    };

    const handleToggleTags = async (articleId) => {
        const willBeOpen = !openTagsMap[articleId];
        setOpenTagsMap((prev) => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && tagsMap[articleId] === undefined) {
            await fetchTags(articleId);
        }
    };

    // --- Data Fetching Functions ---
    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/articles/all");
            const sortedArticles = response.data.sort((a, b) => b.id - a.id);
            setArticles(sortedArticles);
            setOpenCommentsMap({});
            setOpenTagsMap({});
            setCommentsMap({});
            setTagsMap({});
        } catch (err) {
            console.error("Error fetching articles:", err);
            setError(
                `Failed to load articles: ${err.message || "Check backend connection"}`
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchComments = useCallback(async (articleId) => {
        setCommentsMap((prev) => ({ ...prev, [articleId]: undefined }));
        try {
            const response = await axios.get(
                `http://localhost:8080/comments/by-article/${articleId}`
            );
            setCommentsMap((prev) => ({
                ...prev,
                [articleId]: response.data || [],
            }));
        } catch (error) {
            console.error(`Error fetching comments for article ${articleId}:`, error);
            setCommentsMap((prev) => ({ ...prev, [articleId]: [] }));
        }
    }, []);

    const fetchTags = useCallback(async (articleId) => {
        setTagsMap((prev) => ({ ...prev, [articleId]: undefined }));
        try {
            const response = await axios.get(
                `http://localhost:8080/articles/${articleId}/tags`
            );
            setTagsMap((prev) => ({ ...prev, [articleId]: response.data || [] }));
        } catch (error) {
            console.error(`Error fetching tags for article ${articleId}:`, error);
            setTagsMap((prev) => ({ ...prev, [articleId]: [] }));
        }
    }, []);

    const fetchAllTags = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/tags/all");
            setAllTags(response.data || []);
        } catch (error) {
            console.error("Error fetching all tags:", error);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
        fetchAllTags();
    }, [refreshFlag, fetchArticles, fetchAllTags]);

    // --- Action Handlers ---
    const handleAction = async (
        actionUrl,
        method = "post",
        successMessage,
        errorMessage,
        articleId
    ) => {
        try {
            await axios({ method, url: actionUrl });
            console.log(successMessage);
            fetchArticles();
        } catch (error) {
            console.error(errorMessage, error);
            const apiError = error.response?.data?.message || error.message || "Network error";
            setError(`${errorMessage}: ${apiError}`);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleLike = (id) =>
        handleAction(
            `http://localhost:8080/articles/${id}/like`,
            "post",
            `Liked article ${id}`,
            "Error liking article"
        );
    const handleDislike = (id) =>
        handleAction(
            `http://localhost:8080/articles/${id}/dislike`,
            "post",
            `Disliked article ${id}`,
            "Error disliking article"
        );

    const handleDeleteArticle = async (id) => {
        if (window.confirm("Are you sure you want to delete this article?")) {
            setError(null);
            try {
                await axios.delete(`http://localhost:8080/articles/${id}`);
                console.log(`Article ${id} deleted`);
                onDelete();
            } catch (error) {
                console.error(`Error deleting article ${id}:`, error);
                const apiError = error.response?.data?.message || error.message || "Network error";
                setError(`Failed to delete article: ${apiError}`);
            }
        }
    };

    // --- Dialog Handlers ---
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
            await fetchComments(currentArticleId);
            if (!openCommentsMap[currentArticleId]) {
                setOpenCommentsMap((prev) => ({ ...prev, [currentArticleId]: true }));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            const apiError = error.response?.data?.message || error.message || "Network error";
            alert(`Failed to add comment: ${apiError}`);
        }
    };

    const handleOpenTagDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setSelectedTag(null);
        setOpenTagDialog(true);
        if (tagsMap[articleId] === undefined) {
            fetchTags(articleId);
        }
        if (!allTags.length) {
            fetchAllTags();
        }
    };
    const handleCloseTagDialog = () => setOpenTagDialog(false);

    const handleSubmitTag = async () => {
        if (!selectedTag || !currentArticleId) return;
        try {
            await axios.put(
                `http://localhost:8080/articles/${currentArticleId}/tags/${selectedTag.id}`
            );
            handleCloseTagDialog();
            await fetchTags(currentArticleId);
            if (!openTagsMap[currentArticleId]) {
                setOpenTagsMap((prev) => ({ ...prev, [currentArticleId]: true }));
            }
        } catch (error) {
            console.error("Error adding tag:", error);
            const apiError = error.response?.data?.message || error.message || "Network error";
            alert(`Failed to add tag: ${apiError}`);
        }
    };

    // --- Render Logic ---
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
                <CircularProgress color="primary" size={50} />
            </Box>
        );
    }

    if (error && articles.length === 0) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    const authorInfo = {
        name: "DO0RA",
        bio: "веб-сервис для публикации статей",
        socials: {
            github: "https://github.com/your-github-username",
            linkedin: "https://linkedin.com/in/your-linkedin-profile",
            twitter: "https://twitter.com/your-twitter-handle",
        },
    };

    return (
        <>
            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* --- Grid for Articles --- */}
            <Grid container spacing={3}>
                {articles.length === 0 && !isLoading && (
                    <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            Статей пока нет. Добавьте первую!
                        </Typography>
                    </Grid>
                )}

                {articles.map((article) => {
                    const isCommentsOpen = !!openCommentsMap[article.id];
                    const isTagsOpen = !!openTagsMap[article.id];
                    const comments = commentsMap[article.id];
                    const tags = tagsMap[article.id];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Fade in timeout={600}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardHeader
                                        title={<Typography variant="h6" component="h3">{article.title}</Typography>}
                                        subheader={
                                            <>
                                                <Typography component="span" variant="caption" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                                                    👍 {article.likes || 0}
                                                </Typography>
                                                <Typography component="span" variant="caption" sx={{ ml: 1, color: theme.palette.error.main, fontWeight: 'bold' }}>
                                                    👎 {article.dislikes || 0}
                                                </Typography>
                                            </>
                                        }
                                        action={
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
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing sx={{ borderTop: `1px solid ${theme.palette.divider}`, justifyContent: 'space-between', flexWrap: 'wrap', p: 1 }}>
                                        {/* --- Left Actions --- */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                            <Tooltip title="Нравится" arrow>
                                                <IconButton onClick={() => handleLike(article.id)} size="small" sx={{ color: theme.palette.success.main }}>
                                                    <ThumbUpAltIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Не нравится" arrow>
                                                <IconButton onClick={() => handleDislike(article.id)} size="small" sx={{ color: theme.palette.error.main }}>
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
                                        {/* --- Right Actions --- */}
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

                                    {/* --- Comments Section --- */}
                                    <Collapse in={isCommentsOpen} timeout="auto" unmountOnExit>
                                        <CardContent sx={{ pt: 1.5, pb: 1.5, bgcolor: theme.palette.action.hover }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: "medium", mb: 1 }}>
                                                Комментарии:
                                            </Typography>
                                            <Box sx={{ opacity: comments === undefined ? 0.5 : 1 }}>
                                                {comments === undefined && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={20} color="secondary" /></Box>
                                                )}
                                                {comments && comments.length > 0 && (
                                                    <List dense disablePadding sx={{ pl: 1 }}>
                                                        {comments.map((comment) => (
                                                            <ListItem key={comment.id} disableGutters divider sx={{ pt: 0.5, pb: 0.5, borderColor: theme.palette.divider }}>
                                                                <ListItemText
                                                                    primary={<Typography variant="body2" color="text.primary">{comment.content}</Typography>}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                )}
                                                {comments && comments.length === 0 && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>Комментариев пока нет.</Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Collapse>

                                    {/* --- Tags Section --- */}
                                    <Collapse in={isTagsOpen} timeout="auto" unmountOnExit>
                                        <CardContent sx={{ pt: 1.5, pb: 1.5, bgcolor: theme.palette.action.hover }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: "medium", mb: 1 }}>
                                                Теги:
                                            </Typography>
                                            <Box sx={{ opacity: tags === undefined ? 0.5 : 1 }}>
                                                {tags === undefined && (
                                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2, opacity: 0.5 }}><CircularProgress size={25} /></Box>
                                                )}
                                                {tags && tags.length > 0 && (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 1 }}>
                                                        {tags.map((tag) => (
                                                            <Chip key={tag.id} label={tag.name} size="small" variant="outlined" color="primary" />
                                                        ))}
                                                    </Box>
                                                )}
                                                {tags && tags.length === 0 && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>Теги не назначены.</Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            </Fade>
                        </Grid>
                    );
                })}
            </Grid>
            {/* --- КОНЕЦ СЕТКИ СТАТЕЙ --- */}

            {/* --- СЕКЦИЯ АВТОРА --- */}
            {articles.length > 0 && (
                <Box
                    sx={{
                        mt: 6,
                        p: 3,
                        textAlign: 'center',
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6" component="h3" gutterBottom>
                        {authorInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {authorInfo.bio}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                        {authorInfo.socials.github && (
                            <Tooltip title="GitHub" arrow>
                                <IconButton
                                    component="a"
                                    href={authorInfo.socials.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub profile"
                                    color="inherit"
                                >
                                    <GitHubIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {authorInfo.socials.linkedin && (
                            <Tooltip title="LinkedIn" arrow>
                                <IconButton
                                    component="a"
                                    href={authorInfo.socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn profile"
                                    color="inherit"
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {authorInfo.socials.twitter && (
                            <Tooltip title="Twitter" arrow>
                                <IconButton
                                    component="a"
                                    href={authorInfo.socials.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter profile"
                                    color="inherit"
                                >
                                    <TwitterIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            )}
            {/* --- КОНЕЦ СЕКЦИИ АВТОРА --- */}

            {/* --- Dialogs --- */}
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog} fullWidth maxWidth="sm">
                <DialogTitle>Добавить Комментарий</DialogTitle>
                <DialogContent sx={{ pt: "20px !important" }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comment-text"
                        label="Текст комментария"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleSubmitComment} variant="contained" color="primary" disabled={!commentText.trim()}>Добавить</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTagDialog} onClose={handleCloseTagDialog} fullWidth maxWidth="sm">
                <DialogTitle>Добавить Тег к Статье</DialogTitle>
                <DialogContent sx={{ pt: "20px !important" }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {(() => {
                            const currentArticleTags = tagsMap[currentArticleId];
                            if (currentArticleTags === undefined && currentArticleId) {
                                return <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2, opacity: 0.5 }}><CircularProgress size={25} /></Box>;
                            }
                            const currentArticleTagIds = (currentArticleTags || []).map(t => t.id);
                            const availableTags = allTags.filter(tag => !currentArticleTagIds.includes(tag.id));

                            if (availableTags.length === 0) {
                                return <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', mt: 2, mb: 1, opacity: 1 }}>
                                    {allTags.length === 0 ? "Список тегов пуст." : "Все доступные теги уже добавлены."}
                                </Typography>;
                            }
                            return availableTags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    clickable
                                    onClick={() => setSelectedTag(tag)}
                                    color="primary"
                                    variant={selectedTag?.id === tag.id ? "filled" : "outlined"}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ));
                        })()}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTagDialog} color="secondary">Отмена</Button>
                    <Button onClick={handleSubmitTag} variant="contained" color="primary" disabled={!selectedTag}>Добавить тэг</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ArticleList;