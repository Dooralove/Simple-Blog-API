// --- Imports ---
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Chip,
    Tooltip,
    useTheme, // theme все еще может быть нужен для других частей или если вы захотите вернуть borderRadius
    Fade,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    // Paper, // Paper больше не используется для обертки фильтра
} from "@mui/material";
import { Link } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import ClearIcon from '@mui/icons-material/Clear';
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";


// --- Helper function to truncate text to 50 words ---
const truncateWords = (text, limit) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= limit) {
        return text;
    }
    return words.slice(0, limit).join(" ") + "...";
};

// --- Component Definition ---
const ArticleList = ({ refreshFlag }) => {
    // --- Hooks ---
    const theme = useTheme(); // theme может быть полезен для других стилей или если решите вернуть часть стилей Paper

    // --- State ---
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [tagsLoading, setTagsLoading] = useState(true);

    // --- Data Fetching Functions ---
    const fetchAllAvailableTags = useCallback(async () => {
        setTagsLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/tags/all");
            setAllTags(response.data || []);
        } catch (err) {
            console.error("Error fetching all tags:", err);
        } finally {
            setTagsLoading(false);
        }
    }, []);

    const fetchArticles = useCallback(async (tagName = "") => {
        setIsLoading(true);
        setError(null);
        try {
            let response;
            if (tagName) {
                response = await axios.get(`http://localhost:8080/articles/by-tag?tagName=${encodeURIComponent(tagName)}`);
            } else {
                response = await axios.get("http://localhost:8080/articles/all");
            }
            const sortedArticles = (response.data || []).sort((a, b) => b.id - a.id);
            setArticles(sortedArticles);
        } catch (err) {
            console.error("Error fetching articles:", err);
            setError(
                `Не удалось загрузить статьи${tagName ? ` по тегу "${tagName}"` : ""}: ${err.response?.data?.message || err.message || "Проверьте соединение"}`
            );
            setArticles([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- Effects ---
    useEffect(() => {
        fetchAllAvailableTags();
    }, [fetchAllAvailableTags]);

    useEffect(() => {
        fetchArticles(selectedTag);
    }, [refreshFlag, selectedTag, fetchArticles]);

    // --- Event Handlers ---
    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const handleClearFilter = () => {
        setSelectedTag("");
    };

    // --- Author Information ---
    const authorInfo = {
        name: "Арцименя Александр 350504",
        bio: "веб-сервис для публикации статей",
        socials: {
            github: "https://github.com/Dooralove",
            linkedin: "https://www.linkedin.com/in/alexander-artsimenia-473903228/",
            twitter: "https://twitter.com",
        },
    };

    // --- Render ---
    return (
        <>
            {/* --- Tag Filter (без Paper, но с Box для сохранения структуры) --- */}
            <Box
                sx={{
                    p: 2, // Сохраняем внутренние отступы, которые были у Paper
                    mb: 3, // Сохраняем нижний отступ, который был у Paper
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    // borderRadius: theme.shape.borderRadius, // Можно убрать, если не нужна рамка, или оставить для консистентности
                }}
            >
                <FormControl fullWidth variant="outlined" size="small" disabled={tagsLoading}>
                    <InputLabel id="tag-filter-select-label">Фильтр по тегу</InputLabel>
                    <Select
                        labelId="tag-filter-select-label"
                        id="tag-filter-select"
                        value={selectedTag}
                        onChange={handleTagChange}
                        label="Фильтр по тегу"
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                }
                            }
                        }}
                    >
                        <MenuItem
                            value=""
                            sx={{
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    color: theme.palette.text.primary,
                                },
                            }}
                        >
                            <em>Все теги</em>
                        </MenuItem>
                        {allTags.map((tag) => (
                            <MenuItem
                                key={tag.id}
                                value={tag.name}
                                sx={{
                                    transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.light + '33' : theme.palette.primary.dark + '55',
                                        color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
                                        fontWeight: 500,
                                    },
                                }}
                            >
                                {tag.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedTag && (
                    <Tooltip title="Сбросить фильтр" arrow>
                        <IconButton onClick={handleClearFilter} size="small">
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* --- Loading/Status Display --- */}
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "30vh" }}>
                    <CircularProgress color="primary" size={50} />
                </Box>
            ) : (
                <>
                    {/* --- Error Alert --- */}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* --- No Articles Message --- */}
                    {!error && articles.length === 0 && (
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            {selectedTag
                                ? `Статей с тегом "${selectedTag}" не найдено.`
                                : "Статей пока нет. Добавьте первую!"}
                        </Typography>
                    )}

                    {/* --- Articles Grid --- */}
                    {!error && articles.length > 0 && (
                        <Grid container spacing={3}>
                            {articles.map((article) => {
                                const articleTags = article.tags || [];
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                                        <Fade in timeout={600}>
                                            <Card
                                                component={Link}
                                                to={`/articles/${article.id}`}
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <CardHeader
                                                    title={<Typography variant="h6" component="h3" sx={{ fontSize: '1.15rem', lineHeight: 1.3 }}>{article.title}</Typography>}
                                                    subheader={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                                                                <ThumbUpAltIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                                                <Typography component="span" variant="caption" sx={{ fontWeight: 'medium' }}>
                                                                    {article.likes || 0}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
                                                                <ThumbDownAltIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                                                <Typography component="span" variant="caption" sx={{ fontWeight: 'medium' }}>
                                                                    {article.dislikes || 0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {truncateWords(article.content, 50)}
                                                    </Typography>
                                                </CardContent>
                                                {articleTags.length > 0 && (
                                                    <CardActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                                        {articleTags.map((tag) => (
                                                            <Chip
                                                                key={tag.id}
                                                                label={tag.name}
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                sx={{ pointerEvents: 'none' }}
                                                            />
                                                        ))}
                                                    </CardActions>
                                                )}
                                            </Card>
                                        </Fade>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </>
            )}

            {/* --- Author Info Footer --- */}
            {!isLoading && !error && articles.length > 0 && (
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
                                <IconButton component="a" href={authorInfo.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" color="inherit"> <GitHubIcon /> </IconButton>
                            </Tooltip>
                        )}
                        {authorInfo.socials.linkedin && (
                            <Tooltip title="LinkedIn" arrow>
                                <IconButton component="a" href={authorInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" color="inherit"> <LinkedInIcon /> </IconButton>
                            </Tooltip>
                        )}
                        {authorInfo.socials.twitter && (
                            <Tooltip title="Twitter" arrow>
                                <IconButton component="a" href={authorInfo.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter profile" color="inherit"> <TwitterIcon /> </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default ArticleList;