FROM node:18-alpine

WORKDIR /opt/app

ENV NODE_ENV production

ENV VITE_UNIVERSIME_API /api

COPY . /opt/app

RUN npm ci

RUN npm run build

ENTRYPOINT ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8088"]