FROM node:18-alpine

WORKDIR /opt/app

ENV NODE_ENV production

COPY . /opt/app

RUN npm install --include=dev

CMD ["sh", "-c", "npm run build"]

ENTRYPOINT ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8088"]