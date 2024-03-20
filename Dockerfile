FROM node:latest

WORKDIR /opt/app

ENV VITE_UNIVERSIME_API /api

# Set version in environment variables
ARG VITE_BUILD_HASH
ENV VITE_BUILD_HASH=${VITE_BUILD_HASH}

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 8088

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/bin/bash", "./entrypoint.sh", "npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8088"]