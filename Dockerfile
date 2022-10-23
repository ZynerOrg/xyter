FROM node:19 AS builder

WORKDIR /usr

COPY tsconfig.json ./

COPY src ./src

COPY package*.json ./

COPY prisma ./prisma/

RUN ls -a

RUN npm install

RUN npm run build

## this is stage two , where the app actually runs

FROM node:19

WORKDIR /usr


COPY --from=builder /usr/package*.json ./

COPY --from=builder /usr/dist ./dist

RUN npm install --omit=dev

CMD ["node","dist/index.js"]