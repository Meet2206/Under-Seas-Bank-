from celery import Celery
from app.config import get_settings

settings = get_settings()

# Single Celery application using Redis as broker and result backend
celery = Celery(
    "banking_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    result_expires=86400,
    broker_connection_retry_on_startup=True,
)

# Automatically discover tasks in app.tasks
celery.autodiscover_tasks(["app.tasks"])