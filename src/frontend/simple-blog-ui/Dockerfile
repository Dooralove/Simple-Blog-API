# frontend/Dockerfile.frontend

# Используем официальный образ Node.js LTS (Long Term Support)
FROM node:18-alpine AS development

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (если есть) для установки зависимостей
# Это делается отдельно, чтобы Docker мог кэшировать этот слой, если зависимости не менялись
COPY package*.json ./

# Устанавливаем зависимости проекта
# Если используешь yarn, замени на `RUN yarn install --frozen-lockfile`
RUN npm install

# Копируем все остальные файлы проекта (исходный код) в рабочую директорию
COPY . .

# React dev server по умолчанию работает на порту 3000
EXPOSE 3000

# Команда для запуска development server при старте контейнера
# CHOKIDAR_USEPOLLING=true часто нужен для корректной работы hot-reloading в Docker
CMD ["sh", "-c", "CHOKIDAR_USEPOLLING=true npm start"]