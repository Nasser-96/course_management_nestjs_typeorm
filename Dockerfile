FROM node:24.3.0-alpine3.21

WORKDIR /app

COPY package*.json . 
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 9000

CMD [ "npm", "run", "start:dev" ]