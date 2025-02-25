# Stage 1: Development
FROM node:18 AS development

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта
COPY . .

# Устанавливаем утилиту migrate
RUN wget https://github.com/golang-migrate/migrate/releases/download/v4.18.2/migrate.linux-amd64.tar.gz -O migrate.tar.gz \
    && tar -xvzf migrate.tar.gz -C /usr/local/bin \
    && chmod +x /usr/local/bin/migrate \
    && rm migrate.tar.gz

# Открываем порт
EXPOSE 1222

# Запуск приложения
CMD ["npm", "run", "start:dev:nodemon"]


# Stage 2: Production
FROM node:18 AS production

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта
COPY . .

# Устанавливаем утилиту migrate
RUN wget https://github.com/golang-migrate/migrate/releases/download/v4.18.2/migrate.linux-amd64.tar.gz -O migrate.tar.gz \
    && tar -xvzf migrate.tar.gz -C /usr/local/bin \
    && chmod +x /usr/local/bin/migrate \
    && rm migrate.tar.gz

# Открываем порт
EXPOSE 1222

# Запуск приложения
CMD ["npm", "run", "start:dev:nodemon"]