# Usar a imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Instalar o cliente PostgreSQL
RUN apt-get update && apt-get install -y postgresql-client

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código da aplicação
COPY . .

# Compilar a aplicação
RUN npm run build

# Expor a porta que a aplicação vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
