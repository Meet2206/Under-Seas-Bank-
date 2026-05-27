from app.celery_worker import celery
from app.services.email_service import send_welcome_email, send_otp_email


@celery.task
def send_welcome_email_task(email: str, user_name: str):
    """Celery task: send welcome email (for use with Celery workers)."""
    send_welcome_email(email, user_name)


@celery.task
def send_otp_email_task(email: str, otp: str):
    """Celery task: send OTP email (for use with Celery workers)."""
    send_otp_email(email, otp)