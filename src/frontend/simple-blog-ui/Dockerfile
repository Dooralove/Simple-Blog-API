FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "CHOKIDAR_USEPOLLING=true npm start"]