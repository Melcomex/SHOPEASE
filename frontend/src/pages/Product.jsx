import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false) })
  }, [id])

  const addToCart = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await axios.post('http://localhost:8000/api/cart/add', {
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      })
      refreshCart(user.id)
      setMessage('Added to cart! ✅')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Failed to add to cart!')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 animate-pulse">Loading product...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-6 block">
          ← Back
        </button>
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl h-72 flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:8000${product.image_url}`} alt={product.name} className="h-full object-contain" />
            ) : (
              <div className="text-8xl">📦</div>
            )}
          </div>
          <div>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-3">{product.name}</h1>
            <p className="text-gray-500 mt-3">{product.description}</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">{product.stock} units in stock</p>
            <button
              onClick={addToCart}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}