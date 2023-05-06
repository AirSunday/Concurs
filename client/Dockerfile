FROM node:14-alpine
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.2-alpine
COPY --from=build-stage /client/dist /var/www
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
