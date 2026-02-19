"""FastAPI-приложение: подключение роутеров."""
from fastapi import FastAPI

from api.rental_requests import router as rental_requests_router
from api.payments import router as payments_router
from api.notifications import router as notifications_router

app = FastAPI(title="Rent Service API")

app.include_router(rental_requests_router)
app.include_router(payments_router)
app.include_router(notifications_router)

