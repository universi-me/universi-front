FROM node:18-alpine

ENV NODE_ENV production

ARG REACT_BUILD_FILES=./

COPY ${REACT_BUILD_FILES} /

ENTRYPOINT ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8088"]