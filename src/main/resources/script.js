const apiUrl = 'http://localhost:8080';

async function createArticle() {
    try {
        const response = await fetch(`${apiUrl}/articles/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Новая статья',
                content: 'Это содержимое новой статьи.',
                comments: [],
                tags: []
            })
        });
        const data = await response.json();
        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Ошибка при создании статьи:', error);
    }
}

async function getArticleById() {
    const articleId = document.getElementById('articleId').value;
    try {
        const response = await fetch(`${apiUrl}/articles/${articleId}`);
        const data = await response.json();
        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Ошибка при получении статьи:', error);
    }
}
