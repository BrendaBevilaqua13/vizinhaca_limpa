from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import HTMLResponse, FileResponse
from pathlib import Path

from .users.router import router as users_router
from .reports.router import router as reports_router

app = FastAPI(title="Denúncia de Lixo - API")

app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(reports_router, prefix="/reports", tags=["reports"])

@app.get("/api/health")
def read_health():
    return {"status": "ok"}

# ============================
# SERVIR FRONTEND
# ============================

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent.parent / "frontend" / "web"

# 1️⃣ Monta a pasta PUBLIC corretamente
app.mount(
    "/public",
    StaticFiles(directory=str(FRONTEND_DIR / "public")),
    name="public"
)

# 2️⃣ Monta a pasta SRC (JS/CSS)
app.mount(
    "/src",
    StaticFiles(directory=str(FRONTEND_DIR / "src")),
    name="src"
)

# 3️⃣ Rota principal → redireciona para o index da pasta public
@app.get("/", response_class=HTMLResponse)
async def root():
    return FileResponse(FRONTEND_DIR / "public" / "index.html")
