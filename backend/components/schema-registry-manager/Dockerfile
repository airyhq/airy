FROM node:18

WORKDIR /app

COPY ./src/package*.json ./
COPY ./src/tsconfig*.json ./

RUN npm install
RUN npm install typescript -g 

COPY ./src/app.ts ./
COPY ./src/types.ts ./
COPY ./src/providers/karapace.ts ./providers/

RUN tsc

EXPOSE 3000

CMD [ "node", "app.js" ]
