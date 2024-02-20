FROM node:latest

WORKDIR /opt/app

# Set version in environment variables
CMD export BUILD_HASH=${cat /build.hash}

ENV VITE_UNIVERSIME_API /api

COPY . .

#RUN npm ci
#RUN npm run build

EXPOSE 8088

ENTRYPOINT ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8088"]