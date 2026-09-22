import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [randomImage, setRandomImage] = useState(null);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const queries = ['adventure', 'fantasy', 'scifi', 'hero', 'magic'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        const res = await api.get(`/media/search?query=${randomQuery}&type=movie`);
        const images = res.data.filter(m => m.poster).map(m => m.poster);
        
        if (images.length > 0) {
          const randomIdx = Math.floor(Math.random() * images.length);
          setRandomImage(images[randomIdx]);
        }
      } catch (err) {
        console.error("Failed to fetch background image", err);
      }
    };
    fetchRandomImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background Image */}
      {randomImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${randomImage})` }}
        ></div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 md:px-12 py-6 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 tracking-tighter cursor-pointer drop-shadow-lg">NETSOCIAL</h1>
          <Link to="/login" className="text-white font-bold text-lg hover:underline">Sign In</Link>
        </header>

        {/* Main Content - Centered Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[450px] p-8 md:p-16 bg-black/75 rounded-lg shadow-2xl backdrop-blur-sm">
            <h2 className="mb-8 text-3xl font-bold text-white">Sign Up</h2>
            
            {error && (
              <div className="mb-6 p-3 bg-[#e87c03] rounded text-white text-sm font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition-colors"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-5 py-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-5 py-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-5 py-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 mt-8 font-bold text-white bg-red-600 rounded hover:bg-red-700 transition duration-200 text-lg"
              >
                Sign Up
              </button>
            </form>
            
            <div className="mt-12 text-gray-400 text-base">
              <p>
                Already have an account? <Link to="/login" className="text-white hover:underline ml-1 font-medium">Sign in now</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
