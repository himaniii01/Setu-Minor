FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
RUN npx prisma generate
EXPOSE 5000
CMD ["node", "dist/app.js"]
