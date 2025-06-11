FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .

# RUN npm install -g pnpm
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
