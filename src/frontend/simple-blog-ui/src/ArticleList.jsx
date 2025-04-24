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
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CommentIcon from "@mui/icons-material/Comment";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import TagIcon from "@mui/icons-material/Tag";

const ArticleList = ({ onEdit, onDelete, refreshFlag }) => {
    const theme = useTheme();
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
        if (willBeOpen && !commentsMap.hasOwnProperty(articleId)) {
            await fetchComments(articleId);
        }
    };

    const handleToggleTags = async (articleId) => {
        const willBeOpen = !openTagsMap[articleId];
        setOpenTagsMap((prev) => ({ ...prev, [articleId]: willBeOpen }));
        if (willBeOpen && !tagsMap.hasOwnProperty(articleId)) {
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
        errorMessage
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
    // Comments Dialog
    const handleOpenCommentDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setCommentText(""); // Clear previous text
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

    // Tags Dialog
    const handleOpenTagDialog = (articleId) => {
        setCurrentArticleId(articleId);
        setSelectedTag(null); // Reset selection
        setOpenTagDialog(true);
        if (!tagsMap.hasOwnProperty(articleId)) {
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

    return (
        <>
            {/* Display non-critical errors above the list */}
            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Message if list is empty */}
                {articles.length === 0 && !isLoading && (
                    <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            No articles yet. Add the first one!
                        </Typography>
                    </Grid>
                )}

                {/* Map through articles and render a Card for each */}
                {articles.map((article) => {
                    // Determine if comments/tags sections are open for this article
                    const isCommentsOpen = !!openCommentsMap[article.id];
                    const isTagsOpen = !!openTagsMap[article.id];
                    // Get cached comments/tags for this article
                    const comments = commentsMap[article.id];
                    const tags = tagsMap[article.id];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            {/* Fade in animation */}
                            <Fade in timeout={600}>
                                {/* Card styling is primarily handled by theme overrides in App.js */}
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* CardHeader uses theme overrides */}
                                    <CardHeader
                                        title={<Typography variant="h6" component="h3">{article.title}</Typography>}
                                        subheader={
                                            <>
                                                <Typography variant="caption" color="text.secondary">ID: {article.id} • </Typography>
                                                {/* Use theme colors for success/error */}
                                                <Typography component="span" variant="caption" sx={{ color: theme.palette.success.main }}>
                                                    👍 {article.likes || 0}
                                                </Typography>
                                                <Typography component="span" variant="caption" sx={{ ml: 1, color: theme.palette.error.main }}>
                                                    👎 {article.dislikes || 0}
                                                </Typography>
                                            </>
                                        }
                                        action={
                                            <>
                                                <Tooltip title="Edit" arrow>
                                                    {/* Use theme secondary color */}
                                                    <IconButton onClick={() => onEdit(article)} size="small" color="secondary">
                                                        <EditIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" arrow>
                                                    {/* Use theme error color */}
                                                    <IconButton onClick={() => handleDeleteArticle(article.id)} size="small" sx={{ color: theme.palette.error.main }}>
                                                        <DeleteIcon fontSize="inherit" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        }
                                    />
                                    {/* CardContent uses theme overrides */}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {article.content.length > 150 ? `${article.content.substring(0, 150)}...` : article.content}
                                        </Typography>
                                    </CardContent>
                                    {/* CardActions uses theme overrides (including top border) */}
                                    <CardActions disableSpacing sx={{ justifyContent: 'space-between', flexWrap: 'wrap', p: 1 }}>
                                        {/* Left Actions (Like, Dislike, Add Comment/Tag) */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                            <Tooltip title="Like" arrow>
                                                <IconButton onClick={() => handleLike(article.id)} size="small" sx={{ color: theme.palette.success.main }}>
                                                    <ThumbUpAltIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Dislike" arrow>
                                                <IconButton onClick={() => handleDislike(article.id)} size="small" sx={{ color: theme.palette.error.main }}>
                                                    <ThumbDownAltIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Add Comment" arrow>
                                                {/* Use theme primary color */}
                                                <IconButton onClick={() => handleOpenCommentDialog(article.id)} size="small" color="primary">
                                                    <AddCommentIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Add Tag" arrow>
                                                {/* Use theme primary color */}
                                                <IconButton onClick={() => handleOpenTagDialog(article.id)} size="small" color="primary">
                                                    <LabelIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        {/* Right Actions (Toggle Comments/Tags) */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Tooltip title={isCommentsOpen ? "Hide Comments" : "Show Comments"} arrow>
                                                {/* Color changes based on open state */}
                                                <IconButton onClick={() => handleToggleComments(article.id)} size="small" sx={{ color: isCommentsOpen ? theme.palette.primary.main : theme.palette.text.secondary }}>
                                                    <CommentIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={isTagsOpen ? "Hide Tags" : "Show Tags"} arrow>
                                                {/* Color changes based on open state */}
                                                <IconButton onClick={() => handleToggleTags(article.id)} size="small" sx={{ color: isTagsOpen ? theme.palette.primary.main : theme.palette.text.secondary }}>
                                                    <TagIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </CardActions>

                                    {/* --- Comments Section (Collapsible) --- */}
                                    <Collapse in={isCommentsOpen} timeout="auto" unmountOnExit>
                                        {/* CardContent here RELIES ON THEME OVERRIDE for background color */}
                                        {/* NO bgcolor property set directly in sx */}
                                        <CardContent sx={{
                                            pt: 1.5, // Use padding from theme override or set custom
                                            pb: 1.5,
                                            transition: 'background-color 0.3s ease-in-out', // Optional: smooth bg transition
                                            // className='MuiCollapse-root' // MUI adds classes automatically
                                        }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: "medium", mb: 1 }}>
                                                Comments:
                                            </Typography>
                                            {/* Loading indicator */}
                                            {comments === undefined && (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                                                    <CircularProgress size={20} color="secondary" />
                                                </Box>
                                            )}
                                            {/* List of comments */}
                                            {comments && comments.length > 0 && (
                                                <List dense disablePadding sx={{ pl: 1 }}>
                                                    {comments.map((comment) => (
                                                        <ListItem key={comment.id} disableGutters divider sx={{ pt: 0.5, pb: 0.5, borderColor: theme.palette.divider }}>
                                                            <ListItemText
                                                                primary={<Typography variant="body2" color="text.primary">{comment.content}</Typography>}
                                                                // You could add secondary text e.g., for timestamp
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                            {/* Message if no comments */}
                                            {comments && comments.length === 0 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>No comments yet.</Typography>
                                            )}
                                        </CardContent>
                                    </Collapse>

                                    {/* --- Tags Section (Collapsible) --- */}
                                    <Collapse in={isTagsOpen} timeout="auto" unmountOnExit>
                                        {/* CardContent here RELIES ON THEME OVERRIDE for background color */}
                                        {/* NO bgcolor property set directly in sx */}
                                        <CardContent sx={{
                                            pt: 1.5,
                                            pb: 1.5,
                                            transition: 'background-color 0.3s ease-in-out',
                                        }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: "medium", mb: 1 }}>
                                                Tags:
                                            </Typography>
                                            {/* Loading indicator */}
                                            {tags === undefined && (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                                                    <CircularProgress size={20} color="secondary" />
                                                </Box>
                                            )}
                                            {/* List of tags as Chips */}
                                            {tags && tags.length > 0 && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 1 }}>
                                                    {tags.map((tag) => (
                                                        // Chip appearance is controlled by theme overrides
                                                        <Chip key={tag.id} label={tag.name} size="small" variant="outlined" color="primary" />
                                                    ))}
                                                </Box>
                                            )}
                                            {/* Message if no tags */}
                                            {tags && tags.length === 0 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>No tags assigned.</Typography>
                                            )}
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            </Fade>
                        </Grid>
                    );
                })}
            </Grid>

            {/* --- Dialogs --- */}
            {/* Dialogs use MuiDialogTitle, MuiDialogContent, MuiDialogActions which are styled via theme overrides */}
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add Comment</DialogTitle>
                {/* Ensure padding top is applied correctly */}
                <DialogContent sx={{ pt: "20px !important" }}>
                    {/* TextField uses theme overrides */}
                    <TextField autoFocus margin="dense" id="comment-text" label="Comment Text" type="text" fullWidth multiline rows={4} variant="outlined" value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmitComment} variant="contained" color="primary" disabled={!commentText.trim()}>Add</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTagDialog} onClose={handleCloseTagDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add Tag to Article</DialogTitle>
                <DialogContent sx={{ pt: "20px !important" }}>
                    {/* Container for available tags */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {(() => {
                            const currentArticleTags = tagsMap[currentArticleId];
                            if (currentArticleTags === undefined && currentArticleId) {
                                return <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={25} /></Box>;
                            }
                            const currentArticleTagIds = (currentArticleTags || []).map(t => t.id);
                            const availableTags = allTags.filter(tag => !currentArticleTagIds.includes(tag.id));

                            if (availableTags.length === 0) {
                                return <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center', mt: 2, mb: 1 }}>
                                    {allTags.length === 0 ? "Tag list is empty." : "All available tags already added."}
                                </Typography>;
                            }
                            return availableTags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    clickable
                                    onClick={() => setSelectedTag(tag)}
                                    // Chip appearance depends on theme + selection state
                                    color="primary"
                                    variant={selectedTag?.id === tag.id ? "filled" : "outlined"}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ));
                        })()}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTagDialog} color="secondary">Cancel</Button>
                    {/* Disable button if no tag is selected */}
                    <Button onClick={handleSubmitTag} variant="contained" color="primary" disabled={!selectedTag}>Add Selected Tag</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ArticleList;