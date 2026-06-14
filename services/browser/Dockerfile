FROM mcr.microsoft.com/playwright:v1.44.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
