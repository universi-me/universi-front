FROM node:18-alpine

WORKDIR /opt/app

ENV NODE_ENV production

COPY . /opt/app

RUN npm install --include=dev

ENTRYPOINT ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8088"]