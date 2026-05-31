# Local Development Setup

This guide walks you through running the portfolio locally — frontend dev server and backend API — with all required environment variables.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| **Node.js** | 20+ | https://nodejs.org |
| **Python** | 3.11+ | https://python.org |
| **Git** | any | https://git-scm.com |

> You also need access to an Azure subscription with Cosmos DB, Azure AI Search, and Azure OpenAI provisioned.  
> See [infrastructure.md](infrastructure.md) to deploy them first.

---

## 1 — Clone & Install

```bash
git clone https://github.com/your-username/react-ts-portfolio.git
cd react-ts-portfolio
```

---

## 2 — Backend Setup

### 2a. Create a virtual environment

```bash
cd backend
python -m venv .venv
```

Activate it:

- **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
- **macOS / Linux:** `source .venv/bin/activate`

### 2b. Install dependencies

```bash
pip install -r requirements.txt
```

### 2c. Create the `.env` file

Create a file at `backend/.env` and fill in your Azure resource values:

```env
# ─────────────────────────────────────────────────────────────────────────────
# Azure Cosmos DB
# ─────────────────────────────────────────────────────────────────────────────
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-primary-key
COSMOS_DATABASE=aicopilotdb
COSMOS_CONTAINER_PROJECTS=projects
COSMOS_CONTAINER_USERS=users

# ─────────────────────────────────────────────────────────────────────────────
# Azure OpenAI
# ─────────────────────────────────────────────────────────────────────────────
AZURE_OPENAI_ENDPOINT=https://your-openai-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_EMBEDDING_DEPLOYMENT=text-embedding-3-small

# ─────────────────────────────────────────────────────────────────────────────
# Azure AI Search
# ─────────────────────────────────────────────────────────────────────────────
AZURE_SEARCH_ENDPOINT=https://your-search-service.search.windows.net
AZURE_SEARCH_ADMIN_KEY=your-search-admin-key
AZURE_SEARCH_INDEX_NAME=portfolio-about-index

# ─────────────────────────────────────────────────────────────────────────────
# Admin Authentication
# Used to protect project CRUD endpoints via the X-Admin-Key header
# ─────────────────────────────────────────────────────────────────────────────
ADMIN_KEY=change-me-to-a-strong-random-secret
ADMIN_ID=admin

# ─────────────────────────────────────────────────────────────────────────────
# CORS — allowed origins for the FastAPI backend
# Comma-separated list of frontend origins
# ─────────────────────────────────────────────────────────────────────────────
FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5174
```

> **Where to find these values:**
> - **Cosmos DB** → Azure Portal → your Cosmos DB account → Keys
> - **Azure OpenAI** → Azure Portal → your OpenAI resource → Keys and Endpoint
> - **Azure AI Search** → Azure Portal → your Search service → Keys

### 2d. Seed the RAG index (first time only)

Before the AI chat works, upload portfolio documents to the search index:

```bash
# From the backend/ directory, with .venv active
python setup_rag_index.py
```

Or fill in the templates under `backend/templates/` and upload them via the `/sources` page in the UI.

### 2e. Start the backend

```bash
# From backend/ with .venv active
uvicorn app.main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

---

## 3 — Frontend Setup

### 3a. Install dependencies

```bash
cd frontend
npm install
```

### 3b. Create the `.env.local` file

Create a file at `frontend/.env.local`:

```env
# ─────────────────────────────────────────────────────────────────────────────
# Backend API base URL
# Must match the running backend address (no trailing slash)
# ─────────────────────────────────────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:8000
```

> In production this is set to your deployed backend App Service URL, e.g.  
> `https://portfolio-prod-api.azurewebsites.net`

### 3c. Start the dev server

```bash
# From frontend/
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 4 — Running Both Together

Open two terminals:

```
Terminal 1 — Backend
─────────────────────────────────
cd backend
.venv\Scripts\Activate.ps1    (Windows)
uvicorn app.main:app --reload --port 8000

Terminal 2 — Frontend
─────────────────────────────────
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 5 — Admin Mode (Projects CRUD)

The Projects board supports an admin mode for creating, editing, and deleting cards.

1. Navigate to the Projects page.
2. Enter the `ADMIN_KEY` value from your backend `.env` file.
3. Click **Enable Admin Mode**.

The key is sent as an `X-Admin-Key` request header.

> **Note:** Google OAuth (`.auth/login/google`) is only available when the app is deployed on Azure App Service. Locally, the user context will be `null` and auth-gated features like visit tracking will fall back gracefully.

---

## 6 — Environment Variable Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `COSMOS_ENDPOINT` | ✅ | Cosmos DB account URI |
| `COSMOS_KEY` | ✅ | Cosmos DB primary key |
| `COSMOS_DATABASE` | ✅ | Database name (default: `aicopilotdb`) |
| `COSMOS_CONTAINER_PROJECTS` | ✅ | Projects container name (default: `projects`) |
| `COSMOS_CONTAINER_USERS` | ✅ | Users container name (default: `users`) |
| `AZURE_OPENAI_ENDPOINT` | ✅ | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_API_KEY` | ✅ | Azure OpenAI API key |
| `AZURE_OPENAI_API_VERSION` | ✅ | API version (e.g. `2024-02-01`) |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | ✅ | Chat model deployment name (e.g. `gpt-4o`) |
| `AZURE_EMBEDDING_DEPLOYMENT` | ✅ | Embedding model deployment name (e.g. `text-embedding-3-small`) |
| `AZURE_SEARCH_ENDPOINT` | ✅ | Azure AI Search service endpoint |
| `AZURE_SEARCH_ADMIN_KEY` | ✅ | Azure AI Search admin key |
| `AZURE_SEARCH_INDEX_NAME` | ✅ | Search index name (default: `portfolio-about-index`) |
| `ADMIN_KEY` | ✅ | Secret key for admin API access |
| `ADMIN_ID` | ❌ | Label for admin actor (default: `admin`) |
| `FRONTEND_ORIGINS` | ❌ | Comma-separated CORS origins (defaults to localhost) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ in production | Backend API base URL (no trailing slash) |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `CORS error` in browser | Confirm `FRONTEND_ORIGINS` in backend `.env` includes `http://localhost:5173` |
| `RuntimeError: Missing COSMOS_ENDPOINT` | Check that `backend/.env` exists and all Cosmos vars are set |
| `Error generating embeddings` | Verify `AZURE_OPENAI_API_KEY`, endpoint, and deployment name |
| `Search index not found` | Run `python setup_rag_index.py` to create and seed the index |
| `VITE_API_BASE_URL is not set in production` | Set the env var in your CI/CD pipeline or App Service app settings before running `npm run build` |
