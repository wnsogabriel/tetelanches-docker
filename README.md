# Tetê Lanches · Cardápio Digital

Aplicativo de cadastro e consulta do cardápio da lanchonete **Tetê Lanches**, desenvolvido para o trabalho da disciplina **Desenvolvimento Backend 2026.2 · N1** (Universidade Veiga de Almeida).

O sistema é composto por banco de dados, backend e frontend, cada um rodando em seu próprio container Docker, conectados por uma rede interna.

## Arquitetura

```
Navegador ──► Next.js (serv-front-n1:3000) ──► Spring Boot (serv-back-n1:8080) ──► PostgreSQL (pdbbackn:5432)
```

| Container | Imagem | Porta | Tecnologia |
|---|---|---|---|
| `pdbbackn` | `postgres` | 5432 | PostgreSQL, banco `loja` |
| `serv-back-n1` | `app_back_n1` | 8080 | Spring Boot (Java 17), Spring Data JPA, springdoc-openapi |
| `serv-front-n1` | `app_front_n1` | 3000 | Next.js (React + TypeScript), Bootstrap e Tailwind CSS |

Os três containers ficam na rede `backn_rede_001`. Dentro dela, um container encontra o outro pelo nome (o back acessa o banco em `pdbbackn`, o front acessa o back em `serv-back-n1`).

O navegador nunca chama o backend diretamente: as páginas do Next.js chamam as rotas internas `/api/lanches`, que rodam dentro do container do front e repassam a requisição para o Spring Boot.

## Pré-requisitos

- **Docker Desktop** instalado e aberto, com o status **Engine running**.
- Internet na primeira execução (download das imagens base e das dependências Maven e npm). Depois disso tudo fica em cache.
- Portas **3000**, **8080** e **5432** livres.

## Como executar

Na raiz do projeto, pelo PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\subir.ps1
```

O script `subir.ps1`:

1. Cria a rede `backn_rede_001`, se ainda não existir.
2. Liga o container do banco se ele já existir (preservando os dados) ou cria um novo.
3. Aguarda o PostgreSQL aceitar conexões antes de subir o backend.
4. Remove as versões antigas do back e do front, gera as imagens novas (`docker build`) e cria os containers (`docker run`).

Na primeira execução com o banco vazio, o backend cadastra automaticamente os sanduíches do cardápio real da lanchonete (classe `CardapioTete`).

## Endereços

| O quê | URL |
|---|---|
| Aplicativo | http://localhost:3000 |
| API REST | http://localhost:8080/api/lanches |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| Especificação OpenAPI (JSON) | http://localhost:8080/v3/api-docs |

## Endpoints da API

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/api/lanches` | Lista todos os lanches | 200 |
| GET | `/api/lanches/{id}` | Busca um lanche pelo id | 200, 404 |
| POST | `/api/lanches` | Cadastra um lanche | 200, 400 |
| PUT | `/api/lanches/{id}` | Atualiza um lanche | 200, 400, 404 |
| DELETE | `/api/lanches/{id}` | Exclui um lanche | 204, 404 |

Exemplo de corpo para POST e PUT:

```json
{
  "nome": "X-Tudo",
  "descricao": "Pão, carne, queijo, presunto, ovo e bacon",
  "preco": 12.00
}
```

## Comandos úteis

```powershell
# Ver os containers e o status de cada um
docker ps -a

# Desligar tudo sem perder os dados do banco
docker stop serv-front-n1 serv-back-n1 pdbbackn

# Religar sem rebuildar
docker start pdbbackn serv-back-n1 serv-front-n1

# Ver os logs do backend (inclui o SQL gerado pelo Hibernate)
docker logs serv-back-n1
```

> **Atenção:** `docker rm -f pdbbackn` apaga o container do banco e todos os lanches cadastrados.

## Estrutura do projeto

```
tetelanches-docker/
├── subir.ps1                 Script que sobe os três containers
├── Aula20260819-1/           Backend (Spring Boot)
│   ├── Dockerfile            Build em duas etapas: Maven compila, JRE executa
│   └── src/main/java/com/example/demo/
│       ├── Lanche.java           Entidade JPA (tabela lanche)
│       ├── LancheDAO.java        Repositório (JpaRepository)
│       ├── LancheAPI.java        Controlador REST com o CRUD
│       ├── SwaggerConfig.java    Metadados da documentação OpenAPI
│       └── CardapioTete.java     Carga inicial do cardápio
└── exemplo-react-next/       Frontend (Next.js)
    ├── Dockerfile
    └── app/
        ├── page.tsx              Tela do cardápio (cadastro, edição e exclusão)
        ├── layout.tsx            Fontes, título e idioma
        ├── globals.css           Paleta da marca
        └── api/lanches/          Rotas que repassam as requisições ao backend
            ├── route.ts              GET e POST
            └── [id]/route.ts         PUT e DELETE
```