// src/App.jsx
import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";

import ArticleList from "./components/ArticleList";
import ArticleForm from "./components/ArticleForm";

function App() {
    const [editingArticle, setEditingArticle] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const handleFormSubmit = () => {
        setEditingArticle(null);
        setRefreshFlag(prev => !prev);
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
    };

    const handleDelete = async (articleId) => {
        try {
            await axios.delete(`http://localhost:8080/articles/${articleId}`);
            setRefreshFlag(prev => !prev);
        } catch (error) {
            console.error("Ошибка при удалении статьи:", error);
        }
    };

    const handleCancel = () => {
        setEditingArticle(null);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Блог API
            </Typography>

            <Button
                variant="contained"
                onClick={() => setEditingArticle({})}
                sx={{ mb: 2 }}
            >
                Создать новую статью
            </Button>

            {editingArticle !== null && (
                <ArticleForm
                    existingArticle={editingArticle?.id ? editingArticle : null}
                    onFormSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            )}

            <ArticleList
                refreshFlag={refreshFlag}
                setRefreshFlag={setRefreshFlag}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </Container>
    );
}

export default App;
