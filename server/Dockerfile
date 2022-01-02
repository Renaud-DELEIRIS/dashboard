FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV SECRET_KEY=RXCT34ZE5GFDSFD756

EXPOSE 8081

CMD [ "node", "index.js" ]