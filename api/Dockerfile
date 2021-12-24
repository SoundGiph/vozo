FROM node:12.22.0

WORKDIR /usr/vozo-api/


COPY nest-cli.json ./
COPY nodemon.json ./
COPY package.json ./


RUN yarn add @nestjs/cli
RUN yarn

COPY .env ./
COPY src ./src
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY yarn-error.log ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]