# base image
FROM node:14.16.1-alpine3.13

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
