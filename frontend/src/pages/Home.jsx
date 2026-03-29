import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio', 'Tablets']

export default function Home() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const { refreshCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = products
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [category, search, products])

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:8000/api/products/')
    setProducts(res.data)
    setFiltered(res.data)
    setLoading(false)
  }

  const addToCart = async (product) => {
    if (!user) {
      setMessage('Please login to add items to cart!')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    try {
      await axios.post('http://localhost:8000/api/cart/add', {
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      })
      refreshCart(user.id)
      setMessage(`${product.name} added to cart! ✅`)
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Failed to add to cart!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-700 text-white py-16 px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopEase Electronics</h1>
        <p className="text-blue-200 text-lg mb-8">Find the best electronics at the best prices</p>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-5 py-3 rounded-xl text-gray-800 focus:outline-none shadow-lg"
        />
      </div>

      {message && (
        <div className={`fixed top-20 right-4 px-6 py-3 rounded-xl shadow-lg z-50 font-medium ${
          message.includes('✅') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-500 animate-pulse">Loading products...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">{filtered.length} products found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}