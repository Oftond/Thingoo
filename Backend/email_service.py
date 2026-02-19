from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@thingoo.ru"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_email(to: List[EmailStr], subject: str, body: str):
    full_body = f"""
    {body}
    <br><br>
    <p style="color: #555; font-style: italic;">
        С уважением,<br>
        команда Thingoo
    </p>
    """

    message = MessageSchema(
        subject=subject,
        recipients=to,
        body=full_body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

async def send_payment_email(to: List[EmailStr], amount: float, item_title: str):
    subject = "Оплата аренды успешно создана"
    body = f"""
    <h2>Оплата создана</h2>
    <p>Вы успешно создали платёж на сумму {amount} ₽ за аренду "{item_title}".</p>
    <p>Ожидайте подтверждения от владельца.</p>
    <br><br>
    <p style="color: #555; font-style: italic;">
        С уважением,<br>
        команда Thingoo
    </p>
    """
    message = MessageSchema(
        subject=subject,
        recipients=to,
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)