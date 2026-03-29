import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🛒</span>
        <span className="text-xl font-bold text-blue-400">ShopEase</span>
        <span className="text-gray-400 text-sm">Electronics</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-400 transition text-sm">Home</Link>
        {user?.is_admin && (
          <Link to="/admin" className="hover:text-yellow-400 transition text-sm">⚙️ Admin</Link>
        )}
        {user ? (
          <>
            <Link to="/cart" className="relative hover:text-blue-400 transition text-sm">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <span className="text-gray-400 text-sm">Hi, {user.username}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition text-sm">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}