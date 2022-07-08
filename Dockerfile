FROM node:16.15-alpine3.15

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN apk add bash
RUN apk add --no-cache git
COPY package.json ./
# RUN yarn cache clean
# RUN yarn --pure-lockfile
# RUN yarn install --frozen-lockfile --no-cache
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]