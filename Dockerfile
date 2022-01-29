FROM node:16-alpine as base

# Create app directory
WORKDIR /usr/src/app

ARG POSTGRES_HOST
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

COPY package.json ./
COPY yarn.lock ./
RUN yarn 
COPY . .
RUN yarn build
RUN echo '{"dev":{"driver":"pg","host":"'"$POSTGRES_HOST"'","database":"'"$POSTGRES_DB"'","user":"'"$POSTGRES_USER"'","password":"'"$POSTGRES_PASSWORD"'"}}' > database.json


FROM base as test
CMD ["yarn", "test"]

FROM  base as dev

EXPOSE 4000
CMD [ "yarn", "start" ]

