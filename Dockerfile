FROM node:17-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .

# RUN npm install -g pnpm
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

EXPOSE 3000
cmd ["npm", "start"]]
