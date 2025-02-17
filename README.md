# SimpleBlogAPI

SimpleBlogAPI - это RESTful API на Spring Boot для управления статьями блога. API позволяет получать статьи по тегу, а также предоставляет базовую информацию о статье, включая название, контент, дату, лайки, дизлайки и комментарии.

## 📌 Функциональность

- Получение статьи по тегу через `GET /articles/{tag}`
- Поддержка передачи параметра `Name` через `@RequestParam`
- Использование JSON для представления данных

## 🛠️ Технологии

- **Java 17+**
- **Spring Boot**
- **Spring Web** (REST API)
- **Jackson** (для работы с JSON)

## 📦 Установка и запуск

1. **Склонировать репозиторий:**
   ```sh
   git clone https://github.com/Dooralove/Simple-Blog-API.git
   cd SimpleBlogAPI
   ```
2. **Сборка и запуск:**
   ```sh
   mvn spring-boot:run
   ```

## 🖥️ Использование API

### 📌 Получение статьи по тегу

- **Запрос:**
  ```http
  GET /articles/{tag}
  ```
- **Пример:**
  ```http
  GET /articles/technology?Name=Spring
  ```
- **Ответ (JSON):**
  ```json
  {
    "title": "Spring Framework",
    "date": "2025-02-18",
    "likes": 120,
    "dislikes": 10,
    "content": "Описание фреймворка Spring...",
    "comments": ["Отличная статья!", "Спасибо!"]
  }
  ```

## 📜 Структура проекта

```
SimpleBlogAPI/
│── src/
│   ├── main/
│   │   ├── java/com/example/blog/
│   │   │   ├── model/Article.java
│   │   │   ├── controller/ArticleController.java
│   │   │   ├── service/ArticleService.java
│   ├── resources/
│       ├── application.properties
│── pom.xml
│── README.md
```

## 🚀 Развертывание

Для сборки проекта в `.jar` и его развертывания выполните:

```sh
mvn clean package
java -jar target/SimpleBlogAPI.jar
```

## 🔗 Лицензия

MIT License

