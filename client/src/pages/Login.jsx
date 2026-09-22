import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

// Film poster listesi - Yüksek kaliteli posterler (UX1000 formatı)
const MOVIE_POSTERS = [
  'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Pulp Fiction
  'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg', // Inception
  'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', // Matrix
  'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', // Interstellar
  'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg', // Dark Knight
  'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Fight Club
  'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', // Forrest Gump
  'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Godfather
  'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg', // Shawshank
  'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // LOTR
  'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Star Wars
  'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg', // Joker
  'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UX1000_.jpg', // Avatar
  'https://m.media-amazon.com/images/M/MV5BNjdjNGQ4NDEtNTEwYS00MTgxLTliYzQtYzE2ZDRiZjFhZmNlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', // Scarface
  'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Goodfellas
];

// Rastgele bir poster seç
const getRandomPoster = () => {
  const randomIndex = Math.floor(Math.random() * MOVIE_POSTERS.length);
  return MOVIE_POSTERS[randomIndex];
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Her sayfa yüklendiğinde rastgele bir film posteri
  const [backgroundImage] = useState(getRandomPoster);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isForgotPassword) {
      try {
        await api.post('/auth/forgot-password', { email });
        setSuccess('Password reset link sent to your email!');
        setTimeout(() => setIsForgotPassword(false), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send reset link');
      }
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Random Movie Background Image - High Quality */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 md:px-12 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 tracking-tighter cursor-pointer drop-shadow-lg">NETSOCIAL</h1>
        </header>

        {/* Main Content - Centered Form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[450px] p-8 md:p-16 bg-black/75 rounded-lg shadow-2xl backdrop-blur-sm">
            <h2 className="mb-8 text-3xl font-bold text-white">
              {isForgotPassword ? 'Reset Password' : 'Sign In'}
            </h2>
            
            {error && (
              <div className="mb-6 p-3 bg-[#e87c03] rounded text-white text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-3 bg-green-600 rounded text-white text-sm font-medium">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-5 py-4 bg-[#333] rounded text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email or phone number"
                />
              </div>
              
              {!isForgotPassword && (
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
              )}

              <button 
                type="submit" 
                className="w-full py-3 mt-8 font-bold text-white bg-red-600 rounded hover:bg-red-700 transition duration-200 text-lg"
              >
                {isForgotPassword ? 'Send Reset Link' : 'Sign In'}
              </button>

              <div className="flex justify-between items-center mt-4 text-[#b3b3b3] text-sm">
                {!isForgotPassword && (
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="mr-1 w-4 h-4 bg-[#333] border-0 rounded focus:ring-0" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(!isForgotPassword);
                    setError('');
                    setSuccess('');
                  }}
                  className="hover:underline ml-auto"
                >
                  {isForgotPassword ? 'Back to Sign In' : 'Need help?'}
                </button>
              </div>
            </form>
            
            <div className="mt-12 text-gray-400 text-base">
              <p>
                New to NetSocial? <Link to="/register" className="text-white hover:underline ml-1 font-medium">Sign up now</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
