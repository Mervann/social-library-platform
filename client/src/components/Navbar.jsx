import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Home, Search, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-black/90 sticky top-0 z-50 border-b border-gray-800 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-red-600 tracking-tighter">NETSOCIAL</Link>
          
          <div className="flex space-x-6">
            <Link to="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <Home className="w-5 h-5 mr-1" /> Feed
            </Link>
            <Link to="/search" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5 mr-1" /> Discover
            </Link>
            <Link to={`/profile/${user.id}`} className="flex items-center text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5 mr-1" /> Profile
            </Link>
            <button onClick={logout} className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5 mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
