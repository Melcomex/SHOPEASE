import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition border border-gray-100 overflow-hidden group">
      <div className="bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:8000${product.image_url}`}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="text-6xl">📦</div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="font-bold text-gray-800 mt-2 text-sm">{product.name}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <span className="text-xs text-gray-400">{product.stock} in stock</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
          >
            View
          </Link>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}