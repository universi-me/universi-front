FROM node:18-alpine

WORKDIR /opt/app

ENV NODE_ENV production

COPY . /opt/app

RUN npm install --include=dev --prefer-offline --no-audit --progress=false

ENTRYPOINT ["sh", "-c", "npm run build && npm run preview -- --host 0.0.0.0 --port 8088"]