import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const res = await axios.get(`http://localhost:8000/api/cart/${user.id}`)
    setItems(res.data)
    setLoading(false)
  }

  const removeItem = async (itemId) => {
    await axios.delete(`http://localhost:8000/api/cart/remove/${itemId}`)
    fetchCart()
    refreshCart(user.id)
  }

  const placeOrder = async () => {
    setOrdering(true)
    try {
      const res = await axios.post('http://localhost:8000/api/orders/', { user_id: user.id })
      setMessage(`Order placed! Total: $${res.data.total.toFixed(2)} ✅`)
      setItems([])
      refreshCart(user.id)
    } catch {
      setMessage('Failed to place order!')
    }
    setOrdering(false)
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">Loading cart...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Cart</h1>
        {message && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 font-medium">{message}</div>
        )}
        {items.length === 0 && !message ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-xl">Your cart is empty!</p>
            <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                    {item.product.image_url ? (
                      <img src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:8000${product.image_url}`} alt={item.product.name} className="h-full object-contain" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    <p className="text-blue-600 font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Items ({items.length})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                disabled={ordering}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {ordering ? 'Placing Order...' : 'Place Order ✅'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}