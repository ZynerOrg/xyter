FROM node:19

WORKDIR /usr

COPY package.json ./

COPY tsconfig.json ./

COPY src ./src
COPY prisma ./prisma

RUN ls -a

RUN npm install

RUN npm run build

## this is stage two , where the app actually runs

FROM node:19

WORKDIR /usr

COPY package.json ./

COPY prisma ./

RUN npm install --omit=dev

COPY --from=0 /usr/dist .

RUN npx prisma migrate deploy

CMD ["node","index.js"]