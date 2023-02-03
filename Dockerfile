FROM node:19.6.0-alpine3.17

RUN addgroup app && add user -S -G app app
USER app

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV NODE_ENV=production

EXPOSE 4000

ENTRYPOINT ["npm", "start"]

