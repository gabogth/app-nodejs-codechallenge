FROM node:21-alpine

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run test
RUN npm run test:e2e
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]