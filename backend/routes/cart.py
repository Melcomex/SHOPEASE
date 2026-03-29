from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import CartItem, Product
from pydantic import BaseModel

router = APIRouter()

class CartAdd(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1

@router.get("/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    result = []
    for item in items:
        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "product": {
                "name": item.product.name,
                "price": item.product.price,
                "image_url": item.product.image_url
            }
        })
    return result

@router.post("/add")
def add_to_cart(data: CartAdd, db: Session = Depends(get_db)):
    existing = db.query(CartItem).filter(
        CartItem.user_id == data.user_id,
        CartItem.product_id == data.product_id
    ).first()
    if existing:
        existing.quantity += data.quantity
        db.commit()
        return {"message": "Cart updated!"}
    new_item = CartItem(
        user_id=data.user_id,
        product_id=data.product_id,
        quantity=data.quantity
    )
    db.add(new_item)
    db.commit()
    return {"message": "Added to cart!"}

@router.delete("/remove/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found!")
    db.delete(item)
    db.commit()
    return {"message": "Removed from cart!"}

@router.delete("/clear/{user_id}")
def clear_cart(user_id: int, db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()
    return {"message": "Cart cleared!"}