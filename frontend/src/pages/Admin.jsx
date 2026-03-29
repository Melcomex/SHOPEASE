import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' })
  const [image, setImage] = useState(null)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.is_admin) { navigate('/'); return }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:8000/api/products/')
    setProducts(res.data)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => formData.append(key, val))
    if (image) formData.append('image', image)
    try {
      await axios.post('http://localhost:8000/api/products/', formData)
      setMessage('Product added! ✅')
      setForm({ name: '', description: '', price: '', category: '', stock: '' })
      setImage(null)
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Failed to add product!')
    }
  }

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:8000/api/products/${id}`)
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ Admin Panel</h1>
        {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</div>}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>
          <div className="grid grid-cols-2 gap-4">
            {['name', 'category'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            {['price', 'stock'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  type="number"
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Products ({products.length})</h2>
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-gray-500 text-sm">${product.price} • {product.stock} in stock</p>
                </div>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700 transition font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}