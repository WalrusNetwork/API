FROM node:13-alpine
WORKDIR /app
ENV PORT=8080
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]