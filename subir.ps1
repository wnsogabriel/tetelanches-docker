# ==========================================================
# subir.ps1 - Sobe o TeteLanches inteiro no Docker
# Uso (na raiz do projeto):
#   powershell -ExecutionPolicy Bypass -File .\subir.ps1
# Requisito: Docker Desktop aberto com "Engine running"
# ==========================================================

# Garante que o script roda a partir da pasta onde ele esta,
# nao importa de onde foi chamado
Set-Location $PSScriptRoot

# ----------------------------------------------------------
# 1. REDE
# Cria a rede que liga os 3 containers. Dentro dela, cada
# container encontra o outro pelo nome (ex: o back acha o
# banco chamando "pdbbackn"). So cria se ainda nao existir.
# ----------------------------------------------------------
docker network inspect backn_rede_001 *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Criando a rede backn_rede_001..."
    docker network create backn_rede_001
}

# ----------------------------------------------------------
# 2. BANCO (PostgreSQL)
# Se o container do banco ja existe, so liga ele de novo,
# preservando os lanches cadastrados. Se nao existe, cria.
#   -d            roda em segundo plano
#   --name        nome usado pelo back para achar o banco
#   --network     entra na rede criada acima
#   -e            variaveis de ambiente: senha e nome do banco
#   -p 5432:5432  porta do PC : porta do container (acesso via DBeaver)
# ----------------------------------------------------------
docker container inspect pdbbackn *> $null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Banco ja existe, ligando..."
    docker start pdbbackn
} else {
    Write-Host "Criando o banco..."
    docker run -d --name pdbbackn --network backn_rede_001 `
        -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=loja `
        -p 5432:5432 postgres
}

# Espera o Postgres aceitar conexoes antes de subir o back.
# O container "liga" antes do banco estar pronto; se o Spring
# tentar conectar cedo demais, ele morre na inicializacao.
Write-Host "Aguardando o banco ficar pronto..."
do {
    Start-Sleep -Seconds 1
    docker exec pdbbackn pg_isready -U postgres *> $null
} until ($LASTEXITCODE -eq 0)

# ----------------------------------------------------------
# 3. REMOVE versoes antigas do back e do front
# Precisam ser recriados para usar a imagem mais recente.
# Se nao existirem, o comando so avisa e o script segue.
# ----------------------------------------------------------
docker rm -f serv-back-n1 serv-front-n1 *> $null

# ----------------------------------------------------------
# 4. BACK (Spring Boot)
# build: gera a imagem a partir do Dockerfile da pasta do back
#        (o Maven compila o projeto DENTRO do Docker)
# run:   cria o container na rede, com o nome que o front usa
# ----------------------------------------------------------
Write-Host "Buildando o back..."
docker build -t app_back_n1 .\Aula20260819-1
if ($LASTEXITCODE -ne 0) { Write-Host "ERRO no build do back." -ForegroundColor Red; exit 1 }

docker run -d --network backn_rede_001 --name serv-back-n1 -p 8080:8080 app_back_n1

# ----------------------------------------------------------
# 5. FRONT (Next.js)
# build: instala as dependencias (npm install) e gera a versao
#        de producao (npm run build) DENTRO do Docker
# run:   cria o container na rede, exposto na porta 3000
# ----------------------------------------------------------
Write-Host "Buildando o front..."
docker build -t app_front_n1 .\exemplo-react-next
if ($LASTEXITCODE -ne 0) { Write-Host "ERRO no build do front." -ForegroundColor Red; exit 1 }

docker run -d --network backn_rede_001 --name serv-front-n1 -p 3000:3000 app_front_n1

# ----------------------------------------------------------
# PRONTO
# ----------------------------------------------------------
Write-Host ""
Write-Host "TeteLanches no ar:" -ForegroundColor Green
Write-Host "  Site:    http://localhost:3000"
Write-Host "  API:     http://localhost:8080/api/lanches"
Write-Host "  Swagger: http://localhost:8080/swagger-ui/index.html"
Write-Host ""
Write-Host "Para desligar sem perder dados:"
Write-Host "  docker stop serv-front-n1 serv-back-n1 pdbbackn"
