FROM node:8-jessie

ENV PROJECT_ID yourProjectId

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY app.js /app
RUN npm install

EXPOSE 3000
CMD [ "node", "app.js" ]
