// src/components/ArticleForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Grid, Typography } from "@mui/material";

const ArticleForm = ({ existingArticle, onFormSubmit, onCancel }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (existingArticle) {
            setTitle(existingArticle.title);
            setContent(existingArticle.content);
        }
    }, [existingArticle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const articleData = { title, content };
        try {
            if (existingArticle && existingArticle.id) {
                // Редактирование статьи
                await axios.put(
                    `http://localhost:8080/articles/${existingArticle.id}`,
                    articleData
                );
            } else {
                // Создание новой статьи
                await axios.post("http://localhost:8080/articles/create", articleData);
            }
            onFormSubmit(); // Обновить список или закрыть форму после отправки
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
        }
    };

    return (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
                {existingArticle && existingArticle.id ? "Редактировать статью" : "Новая статья"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Заголовок"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Контент"
                            fullWidth
                            multiline
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="primary" type="submit">
                            {existingArticle && existingArticle.id ? "Сохранить" : "Создать"}
                        </Button>
                        {onCancel && (
                            <Button variant="outlined" color="secondary" onClick={onCancel}>
                                Отмена
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default ArticleForm;
