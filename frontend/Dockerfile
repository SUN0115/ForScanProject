# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# 只打包不跑 vue-tsc type-check
RUN npm run build-only

# ---- runtime stage ----
FROM nginx:alpine
# 官方 nginx image 會對 /etc/nginx/templates/*.template 做環境變數替換
ENV BACKEND_URL=http://backend:3000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
