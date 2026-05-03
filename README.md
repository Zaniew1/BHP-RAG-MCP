# BHP-RAG-MCP

A **Retrieval-Augmented Generation (RAG)** system built with TypeScript, designed to answer questions based on your own documents. The system loads documents, splits them into chunks, generates vector embeddings, stores them in a PostgreSQL database with pgvector, and uses OpenAI to answer user queries enriched with relevant context.

---

## Tech stack

- **Runtime**: Node.js + TypeScript
- **LLM**: OpenAI (`gpt-4o-mini`) via LangChain
- **Embeddings**: OpenAI Embeddings API
- **Database**: PostgreSQL with [pgvector](https://github.com/pgvector/pgvector) extension
- **ORM**: Prisma
- **Server**: Express.js
- **Containerization**: Docker + Docker Compose

---

## Architecture

```
Documents (PDF/text)
       │
       ▼
  DocumentLoader
       │
       ▼
  Chunking + Embedding (OpenAI)
       │
       ▼
  VectorDB (PostgreSQL + pgvector)
       │
       ▼
  RAG Service
  ┌────┴────┐
  │  Query  │──► Embed prompt ──► Search similar chunks ──► Augment prompt ──► LLM ──► Answer
  └─────────┘
```

---

## Prerequisites

- Node.js 18+
- Docker + Docker Compose
- OpenAI API key with access to `gpt-4o-mini` and embeddings

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Zaniew1/BHP-RAG-MCP.git
cd BHP-RAG-MCP
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# System
NODE_ENV =dev
PORT = 3000
APP_VERSION = v1.1.1
APP_ORIGIN = http://localhost

# OpenAI
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=RAG_MCP
POSTGRES_PORT=5433

# Prisma
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}
```

### 4. Start the database

```bash
docker-compose up -d
```

This spins up a PostgreSQL 17 instance with the pgvector extension.

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 6. Start the server

```bash
npm run dev
```

Server runs on `http://localhost:3000`.

---

## API endpoints

See [`endpoints.http`](./endpoints.http) for ready-to-use request examples.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/rag/load` | Load and embed documents into the vector database |
| `POST` | `/rag/query` | Ask a question — returns an AI answer based on stored documents |

---

## Database schema

```prisma
model Document {
  id         Int             @id @default(autoincrement())
  title      String
  content    String
  sourcePath String
  createdAt  DateTime        @default(now())
  chunks     DocumentChunk[]
}

model DocumentChunk {
  id         Int      @id @default(autoincrement())
  documentId Int
  content    String
  chunkIndex Int
  createdAt  DateTime @default(now())
  embedding  Unsupported("vector(1536)")
  document   Document @relation(fields: [documentId], references: [id])
}
```

Similarity search uses the `<=>` (cosine distance) operator provided by pgvector.

---

## Project structure

```
BHP-RAG-MCP/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── services/
│   │   └── rag.service.ts  # Core RAG logic (embed, search, augment, answer)
│   ├── db/
│   │   └── vectorDb.ts     # VectorDB abstraction + PrismaVector implementation
│   └── utils/
│       └── constants.ts    # Environment variables
├── docker-compose.yaml     # PostgreSQL + pgvector container
├── Dockerfile
├── endpoints.http          # API request examples
└── tsconfig.json
```

---

## How it works

**Document ingestion** (`/rag/load`):
1. Load documents from the specified source path
2. Split each document into chunks
3. Generate a 1536-dimension embedding for each chunk using OpenAI
4. Store the document and all its chunks (with embeddings) in PostgreSQL

**Query** (`/rag/query`):
1. Embed the user's question using OpenAI
2. Search the vector database for the 5 most similar chunks using cosine distance
3. Inject the retrieved chunks as context into the prompt
4. Send the augmented prompt to `gpt-4o-mini`
5. Return the answer

---

## Notes

- The `embedding` field uses the `Unsupported("vector(1536)")` Prisma type — it is not returned by standard Prisma queries and must be accessed via `$queryRaw`
- Similarity search uses `$queryRawUnsafe` with positional parameters (`$1`, `$2`) to safely pass values while allowing the `::vector` cast required by pgvector
