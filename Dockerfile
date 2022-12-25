# Dependencies
FROM node:19-alpine3.17 AS dependencies
MAINTAINER "Vermium Sifell <vermium@zyner.org>"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Build
FROM node:19-alpine3.17 AS build
MAINTAINER "Vermium Sifell <vermium@zyner.org>"

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Deploy
FROM node:19-alpine3.17 as deploy
MAINTAINER "Vermium Sifell <vermium@zyner.org>"

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

CMD [ "npm", "run", "start:migrate:prod" ]
