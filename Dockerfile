FROM  node:20-alpine

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

CMD [ "npm", "run","dev" ]

EXPOSE 5713



#while buildind you should create a .dockerignore file to ignore node_modules


