FROM node:14-alpine AS build-stage
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.2-alpine
COPY --from=build-stage /client/dist /usr/share/nginx/html
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
