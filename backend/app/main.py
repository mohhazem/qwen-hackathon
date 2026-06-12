"""Agent Society backend - hello-world boilerplate.

Run with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Agent Society API", version="0.1.0")

# Allow the Nuxt dev server to call us.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {"message": "Hello World from the Agent Society backend!"}


@app.get("/api/hello")
def hello() -> dict:
    return {"message": "Hello World from the Agent Society backend!"}


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
