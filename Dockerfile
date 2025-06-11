FROM node:20-alpine as builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .

# RUN npm install -g pnpm
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]]
