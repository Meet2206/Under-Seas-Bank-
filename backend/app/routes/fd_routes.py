from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.fd_schema import FDCreateRequest
from app.services.fd_service import create_fd, get_user_fds, close_fd
from app.middleware.auth_middleware import get_current_user


router = APIRouter(prefix="/fd")


@router.post("/create")
def create_fixed_deposit(
    data: FDCreateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return create_fd(data, current_user.id, db)


@router.get("/my")
def my_fds(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_user_fds(current_user.id, db)


@router.post("/close/{fd_id}")
def close_fixed_deposit(
    fd_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return close_fd(fd_id, current_user.id, db)
