# 1. Escolha a imagem base do Node.js (versão estável e leve)
FROM node:20-alpine

# 2. Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia apenas os arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./

# 4. Instala as dependências do projeto
RUN npm install

# 5. Copia o restante dos arquivos do seu projeto Next.js
COPY . .

# 6. Cria o build de produção do Next.js
RUN npm run build

# 7. Informa a porta que o contêiner vai expor
EXPOSE 3000

# 8. Comando para iniciar o servidor Next.js em produção
CMD ["npm", "start"]