# Stage 1: Development
FROM node:18 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 1222

CMD ["npm", "run", "start:dev"]

# Stage 2: Production
FROM node:18 AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production --legacy-peer-deps

COPY . .

EXPOSE 1222

CMD ["npm", "start"]