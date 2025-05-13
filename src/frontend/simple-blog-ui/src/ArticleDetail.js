import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box, Button, Typography, CircularProgress, Alert, useTheme, IconButton,
    Tooltip, TextField,
    Chip, List, ListItem, ListItemText, Divider,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleForm from './ArticleForm';

const ArticleDetail = ({ onArticleDeleted }) => {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const fetchArticleData = useCallback(async () => {
        setError(null);
        try {
            const [articleResponse, commentsResponse, articleTagsResponse] = await Promise.all([
                axios.get(`http://localhost:8080/articles/${articleId}`),
                axios.get(`http://localhost:8080/comments/by-article/${articleId}`),
                axios.get(`http://localhost:8080/articles/${articleId}/tags`)
            ]).catch(err => {
                console.error("Error fetching article data (Promise.all):", err);
                throw new Error(err.response?.data?.message || err.message || "Неизвестная ошибка сети");
            });

            setArticle(articleResponse?.data ?? null);
            setComments((commentsResponse?.data ?? []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
            setTags(articleTagsResponse?.data ?? []);

        } catch (err) {
            console.error("Error setting article data:", err);
            const apiError = err.message || "Не удалось загрузить данные статьи.";
            setError(apiError);
        } finally {
            setIsLoading(false);
        }
    }, [articleId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoading(true);
        fetchArticleData();
    }, [articleId, fetchArticleData]);

    const handleAction = async (actionUrl, method = "post", successCallback) => {
        try {
            await axios({ method, url: actionUrl });
            if (successCallback) successCallback();
            setError(null);
        } catch (error) {
            console.error(`Error performing action ${actionUrl}:`, error);
            const apiError = error.response?.data?.message || error.message || "Ошибка сети";
            setError(`Не удалось выполнить действие: ${apiError}`);
        }
    };
    const handleLike = () => handleAction( `http://localhost:8080/articles/${articleId}/like`, "post", () => setArticle(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null) );
    const handleDislike = () => handleAction( `http://localhost:8080/articles/${articleId}/dislike`, "post", () => setArticle(prev => prev ? { ...prev, dislikes: (prev.dislikes || 0) + 1 } : null) );
    const handleDeleteArticle = async () => { if (window.confirm("Вы уверены, что хотите удалить эту статью? Это действие необратимо.")) { await handleAction( `http://localhost:8080/articles/${articleId}`, "delete", () => { if (onArticleDeleted) onArticleDeleted(articleId); navigate("/"); }); } };

    const handleCancelComment = () => setCommentText("");

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;
        setError(null);
        setIsSubmittingComment(true);
        try {
            await axios.post("http://localhost:8080/comments/create", { article: { id: parseInt(articleId, 10) }, content: commentText });
            setCommentText("");
            const commentsResponse = await axios.get(`http://localhost:8080/comments/by-article/${articleId}`);
            setComments((commentsResponse?.data ?? []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
        } catch (error) {
            console.error("Error adding comment:", error);
            setError(`Не удалось добавить комментарий: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleEditClick = () => { setIsEditing(true); window.scrollTo(0, 0); };

    const handleFormSubmitSuccess = () => {
        setIsEditing(false);
        setIsLoading(true);
        fetchArticleData();
        window.scrollTo(0, 0);
    };
    const handleFormCancelEdit = () => {
        setIsEditing(false);
        window.scrollTo(0, 0);
    };

    if (isLoading && !article && !isEditing) {
        return ( <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}> <CircularProgress color="primary" size={50} /> </Box> );
    }

    if (!article && !error && !isLoading && !isEditing) {
        return <Alert severity="warning" sx={{ mt: 2 }}>Статья не найдена или произошла ошибка при загрузке.</Alert>;
    }

    const currentArticleTags = tags;

    return (
        <>
            <Box>
                {error && ( <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}> {error} </Alert> )}

                {isEditing ? (
                    <ArticleForm
                        existingArticle={article}
                        onFormSubmit={handleFormSubmitSuccess}
                        onCancel={handleFormCancelEdit}
                    />
                ) : article ? (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}`, gap: { xs: 2, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }}}>
                            <Typography variant="h5" component="h1" gutterBottom={false} sx={{ mr: { sm: 2 }, flexGrow: 1, wordBreak: 'break-word', lineHeight: 1.3 }}>
                                {article.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'center'} }}>
                                <Tooltip title={`Нравится (${article.likes ?? 0})`} arrow>
                                    <Button onClick={handleLike} size="small" sx={{ color: theme.palette.success.main, minWidth: 'auto', padding: '4px 8px' }} startIcon={<ThumbUpAltIcon sx={{ fontSize: '1.1rem' }} />}> {article.likes ?? 0} </Button>
                                </Tooltip>
                                <Tooltip title={`Не нравится (${article.dislikes ?? 0})`} arrow>
                                    <Button onClick={handleDislike} size="small" sx={{ color: theme.palette.error.main, minWidth: 'auto', padding: '4px 8px' }} startIcon={<ThumbDownAltIcon sx={{ fontSize: '1.1rem' }} />}> {article.dislikes ?? 0} </Button>
                                </Tooltip>
                                <Tooltip title="Редактировать статью" arrow><IconButton onClick={handleEditClick} size="small" color="secondary"><EditIcon fontSize="small" /></IconButton></Tooltip>
                                <Tooltip title="Удалить статью" arrow><IconButton onClick={handleDeleteArticle} size="small" sx={{ color: theme.palette.error.dark }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                            </Box>
                        </Box>

                        <Typography variant="body1" sx={{ mt: 3, mb: 4, whiteSpace: 'pre-wrap', color: theme.palette.text.primary, lineHeight: 1.7 }}>
                            {article.content}
                        </Typography>

                        <Box sx={{ mt: 3, mb: 4, borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>Теги:</Typography>
                            </Box>
                            {(currentArticleTags && currentArticleTags.length > 0) ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {currentArticleTags.map((tag) => (
                                        <Chip
                                            key={tag.id}
                                            label={tag.name}
                                            size="medium"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            ) : ( <Typography variant="body2" color="text.secondary">Теги не назначены.</Typography> )}
                        </Box>

                        <Box sx={{ mt: 4, borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>
                                    Комментарии ({comments?.length ?? 0})
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    bgcolor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[1],
                                    p: 2,
                                }}
                            >
                                {/* Этот Box содержит поле ввода и строку с кол-вом символов/кнопками */}
                                {/* Его нижний отступ (mb) остался прежним */}
                                <Box sx={{ mb: (comments && comments.length > 0) ? 2 : 0 }}>
                                    <TextField
                                        id="inline-comment-input"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        label="Оставить комментарий"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Напишите что-нибудь..."
                                        inputProps={{ maxLength: 500 }}
                                        disabled={isSubmittingComment}
                                    />
                                    {/* ИЗМЕНЕНИЕ ЗДЕСЬ: mt: 2 заменено обратно на mt: 0.5 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {`${commentText.length}/500`}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {commentText.trim() && (
                                                <Button onClick={handleCancelComment} color="secondary" size="small" disabled={isSubmittingComment}>
                                                    Очистить
                                                </Button>
                                            )}
                                            <Button
                                                onClick={handleSubmitComment}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                disabled={!commentText.trim() || isSubmittingComment}
                                                startIcon={isSubmittingComment ? <CircularProgress size={16} color="inherit" /> : null}
                                            >
                                                {isSubmittingComment ? "Отправка..." : "Отправить"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>

                                {(comments && comments.length > 0) ? (
                                    <List sx={{ p: 0 }}>
                                        {comments.map((comment, index) => (
                                            <React.Fragment key={comment?.id ?? `comment-${index}`}>
                                                <ListItem
                                                    alignItems="flex-start"
                                                    sx={{
                                                        py: 1.5,
                                                        px: 0,
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                                                                {comment?.content ?? 'Комментарий не загружен'}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < comments.length - 1 && (
                                                    <Divider component="li" sx={{ borderColor: theme.palette.divider }} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            // Этот отступ (pt) контролирует отступ перед "Комментариев пока нет",
                                            // если поле ввода пустое, но не влияет на отступ после строки с кнопками,
                                            // если комментарии есть. Отступ после строки с кнопками
                                            // контролируется mb родительского Box выше.
                                            pt: (commentText.trim() || isSubmittingComment) ? 1.5 : 0,
                                            textAlign: 'center',
                                        }}
                                    >
                                        Комментариев пока нет. Оставьте первый!
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    !error && !isLoading && !isEditing && <Alert severity="info" sx={{ mt: 2 }}>Статья не доступна.</Alert>
                )}
            </Box>
        </>
    );
};

export default ArticleDetail;