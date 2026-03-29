import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0)

  const refreshCart = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/cart/${userId}`)
      setCartCount(res.data.length)
    } catch {
      setCartCount(0)
    }
  }

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}