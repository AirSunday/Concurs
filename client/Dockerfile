# base image
FROM node:lts-alpine as build-stage

# set working directory
WORKDIR /client

# copy dependencies
COPY package*.json ./

# install dependencies
RUN npm install

# copy source files
COPY . .

# build for production with minification
RUN npm run build


EXPOSE 8080

# start command
CMD ["npm", "run", "serve"]
