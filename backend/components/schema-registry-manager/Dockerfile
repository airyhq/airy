FROM node:18

WORKDIR /app

COPY ./src/package*.json ./

COPY ./src/tsconfig*.json ./

RUN npm install

RUN npm install -g typescript

RUN npm install -g ts-node

COPY ./src/app.ts ./

EXPOSE 3000

CMD [ "ts-node", "app.ts" ]
