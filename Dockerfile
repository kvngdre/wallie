FROM node:18.12.1-alpine3.17

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV NODE_ENV=production

EXPOSE 4000

ENTRYPOINT ["npm", "start"]

