FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma db push --skip-generate
RUN npx ts-node prisma/seed.ts

FROM node:20
WORKDIR /app
ENV PORT=5000
ENV DATABASE_URL="file:./dev.db"
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 5000
CMD ["node", "dist/app.js"]

