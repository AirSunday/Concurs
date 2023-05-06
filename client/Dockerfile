FROM node:lts-alpine AS build-stage
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.2-alpine

COPY --from=build-stage /client/dist /var/www
COPY dockerConf/nginx.conf /etc/nginx/nginx.conf
COPY dockerConf/whoisa.rsa /etc/nginx
COPY dockerConf/whoisa.crt /etc/nginx
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
