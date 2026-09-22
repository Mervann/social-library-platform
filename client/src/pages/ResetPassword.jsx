import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="p-8 bg-[#181818] rounded border border-red-600">
          <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
          <p>Missing reset token. Please request a new password reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-[#181818] rounded-lg border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Reset Password</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-white text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-600 rounded text-white text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black border border-gray-700 rounded text-white focus:border-red-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 bg-black border border-gray-700 rounded text-white focus:border-red-600 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 mt-4 font-bold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
