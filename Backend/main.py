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
    "http://localhost:3000/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Thingoo Media Service"}




# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from database import engine, Base
# from api import auth, users, items, rental_requests, payments, feedback

# # Создание таблиц (только для dev!)
# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Thingoo API")

# # CORS (для фронтенда)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth.router)
# app.include_router(users.router)
# app.include_router(items.router)
# app.include_router(rental_requests.router)
# app.include_router(payments.router)
# app.include_router(feedback.router)