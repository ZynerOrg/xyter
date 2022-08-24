FROM node:18

LABEL maintainer="xyter@zyner.org"

WORKDIR /build

COPY package* .
RUN npm install

COPY . .

RUN npx -y tsc

WORKDIR /app

RUN cp -r /build/build/* .
RUN cp -r /build/node_modules .

CMD [ "node", "." ]
