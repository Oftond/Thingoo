from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.media import router as media_router
from api.users import router as users_router
from api.auth import router as auth_router
from api.items import router as items_router
from api.rental_requests import router as rental_requests_router
from api.payments import router as payments_router
from api.feedback import router as feedback_router
from api.notifications import router as notifications_router

app = FastAPI(title="Thingoo — Аренда вещей", version="1.0")

app.include_router(media_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(items_router)
app.include_router(rental_requests_router)
app.include_router(payments_router)
app.include_router(feedback_router)
app.include_router(notifications_router)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Thingoo Media Service"}