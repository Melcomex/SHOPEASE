from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Order, CartItem
from pydantic import BaseModel

router = APIRouter()

class OrderCreate(BaseModel):
    user_id: int

@router.post("/")
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == data.user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty!")
    total = sum(item.product.price * item.quantity for item in cart_items)
    order = Order(user_id=data.user_id, total_amount=total, status="confirmed")
    db.add(order)
    db.query(CartItem).filter(CartItem.user_id == data.user_id).delete()
    db.commit()
    return {"message": "Order placed successfully!", "total": total, "order_id": order.id}

@router.get("/{user_id}")
def get_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.id == user_id).all()
    return orders