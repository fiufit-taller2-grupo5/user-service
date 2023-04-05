FROM node:18-alpine

WORKDIR /app

COPY postgres/prisma .

CMD ["npx", "prisma", "db", "push"]
