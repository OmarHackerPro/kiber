from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.api.routes import news
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CyberNews — Security News & Threat Intelligence Platform",
    version="0.1.0",
)

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

app.include_router(news.router, prefix="/api")


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/category", response_class=HTMLResponse)
async def category(request: Request):
    return templates.TemplateResponse("category.html", {"request": request})
