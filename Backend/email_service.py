# email_service.py
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
    """Базовая функция отправки email"""
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
    print(f"✅ Email sent to {to}")

# ==================== ШАБЛОНЫ ПИСЕМ ====================

async def send_welcome_email(to: List[EmailStr], full_name: str):
    """Приветственное письмо после регистрации"""
    subject = "Добро пожаловать в Thingoo! 🎉"
    body = f"""
    <h1 style="color: #0a3d2c;">Привет, {full_name}!</h1>
    
    <p>Вы успешно зарегистрировались на сайте <strong>Thingoo</strong> — сервисе аренды вещей.</p>
    
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #0a3d2c;">Что вы можете делать:</h3>
        <ul>
            <li>✅ Арендовать любые вещи из каталога</li>
            <li>✅ Сдавать свои вещи и зарабатывать</li>
            <li>✅ Общаться с другими пользователями</li>
            <li>✅ Оставлять отзывы и получать рейтинг</li>
        </ul>
    </div>
    
    <p>Перейдите в <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/catalog" style="color: #0a3d2c;">каталог</a>, чтобы начать!</p>
    """
    
    await send_email(to, subject, body)

async def send_password_reset_email(to: List[EmailStr], reset_link: str):
    subject = "Восстановление пароля Thingoo 🔐"
    body = f"""
    <h2>Восстановление пароля</h2>
    <p>Перейдите по ссылке для сброса пароля:</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="{reset_link}" 
           style="background-color: #0a3d2c; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
            Сбросить пароль
        </a>
    </div>
    <p>Ссылка действительна 1 час.</p>
    """
    await send_email(to, subject, body)

async def send_password_changed_email(to: List[EmailStr], user_name: str):
    """Уведомление об успешной смене пароля"""
    subject = "Пароль изменен 🔐"
    body = f"""
    <h2 style="color: #0a3d2c;">Пароль успешно изменен</h2>
    
    <p>Здравствуйте, {user_name}!</p>
    
    <div style="background-color: #f0f8f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p>Ваш пароль был успешно изменен.</p>
        <p>Если вы не меняли пароль, немедленно свяжитесь с службой поддержки.</p>
    </div>
    
    <p>Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
    """
    
    await send_email(to, subject, body)

async def send_payment_created_email(to: List[EmailStr], amount: float, item_title: str):
    """Уведомление о создании платежа"""
    subject = "Платёж создан - ожидайте подтверждения"
    body = f"""
    <h2 style="color: #0a3d2c;">Платёж успешно создан! 💰</h2>
    
    <div style="background-color: #f0f8f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>Детали платежа:</h3>
        <p><strong>Товар:</strong> {item_title}</p>
        <p><strong>Сумма:</strong> <span style="font-size: 24px; color: #0a3d2c;">{amount} ₽</span></p>
        <p><strong>Статус:</strong> Ожидает подтверждения владельца</p>
    </div>
    
    <p>Владелец получил уведомление и скоро подтвердит бронирование.</p>
    <p>Следить за статусом можно в разделе <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/my-listings">"Мои аренды"</a>.</p>
    """
    
    await send_email(to, subject, body)

async def send_payment_confirmed_email(to: List[EmailStr], amount: float, item_title: str, owner_name: str):
    """Уведомление о подтверждении платежа владельцем"""
    subject = "Аренда подтверждена! ✅"
    body = f"""
    <h2 style="color: #0a3d2c;">Аренда подтверждена! 🎉</h2>
    
    <div style="background-color: #f0f8f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3>Детали бронирования:</h3>
        <p><strong>Товар:</strong> {item_title}</p>
        <p><strong>Владелец:</strong> {owner_name}</p>
        <p><strong>Сумма:</strong> <span style="font-size: 24px; color: #0a3d2c;">{amount} ₽</span></p>
    </div>
    
    <p>Владелец подтвердил вашу аренду! Свяжитесь с ним для уточнения деталей встречи.</p>
    <p><a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/messages" style="color: #0a3d2c;">Перейти к сообщениям</a></p>
    """
    
    await send_email(to, subject, body)

async def send_new_rental_notification_to_owner(to: List[EmailStr], renter_name: str, item_title: str):
    """Уведомление владельцу о новом запросе аренды"""
    subject = "Новый запрос на аренду! 📦"
    body = f"""
    <h2 style="color: #0a3d2c;">Новый запрос на аренду!</h2>
    
    <div style="background-color: #f0f8f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p><strong>Арендатор:</strong> {renter_name}</p>
        <p><strong>Товар:</strong> {item_title}</p>
    </div>
    
    <p>Перейдите в раздел <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/my-listings">"Мои объявления"</a>, 
       чтобы подтвердить или отклонить запрос.</p>
    """
    
    await send_email(to, subject, body)

async def send_new_message_notification(to: List[EmailStr], sender_name: str, message_preview: str):
    """Уведомление о новом сообщении"""
    subject = "Новое сообщение в Thingoo ✉️"
    body = f"""
    <h2 style="color: #0a3d2c;">Новое сообщение</h2>
    
    <p><strong>Отправитель:</strong> {sender_name}</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0a3d2c; margin: 20px 0;">
        <p><em>"{message_preview}..."</em></p>
    </div>
    
    <p><a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/messages" style="color: #0a3d2c;">Перейти к диалогу</a></p>
    """
    
    await send_email(to, subject, body)

async def send_review_notification(to: List[EmailStr], reviewer_name: str, rating: int):
    """Уведомление о новом отзыве"""
    subject = "Вам оставили отзыв ⭐"
    stars = "⭐" * rating
    body = f"""
    <h2 style="color: #0a3d2c;">Новый отзыв!</h2>
    
    <p>Пользователь <strong>{reviewer_name}</strong> оставил вам отзыв.</p>
    
    <div style="font-size: 24px; margin: 20px 0;">
        {stars}
    </div>
    
    <p><a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/profile" style="color: #0a3d2c;">Посмотреть все отзывы</a></p>
    """
    
    await send_email(to, subject, body)