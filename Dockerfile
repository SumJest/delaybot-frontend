# Сборка фронта
FROM node:20-alpine as build-stage
WORKDIR /app
COPY vue-app/ .
RUN npm install && npm run build

# Продакшн слой
FROM nginx:stable-alpine as production-stage
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

# Копируем собранные файлы
COPY --from=build-stage /app/dist /usr/share/nginx/html