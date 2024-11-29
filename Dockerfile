### STAGE 1: Build ###

# pull official base image
FROM node:latest AS building

# set working directory
WORKDIR /opt/app

# copy app
COPY . .

# install app dependencies
RUN npm ci --legacy-peer-deps

# setting environment variables to set version
ENV VITE_UNIVERSIME_API=/api
ARG VITE_BUILD_HASH
ENV VITE_BUILD_HASH=${VITE_BUILD_HASH}

#  Build app
RUN npm run build:docker

FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

COPY --from=building /opt/app/dist /usr/share/nginx/html/universime
COPY --from=building /opt/app/scripts/docker/run.sh /
COPY --from=building /opt/app/scripts/docker/nginx/conf.d/*.conf /etc/nginx/conf.d/
COPY --from=building /opt/app/scripts/docker/nginx/nginx.conf /etc/nginx/

EXPOSE 8088

RUN ["chmod", "+x", "/run.sh"]
CMD ["/run.sh"]