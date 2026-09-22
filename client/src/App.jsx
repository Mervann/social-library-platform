import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Feed from './pages/Feed';
import Search from './pages/Search';
import Profile from './pages/Profile';
import ContentDetail from './pages/ContentDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#141414] text-white">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Feed />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <Search />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/content/:type/:id"
                element={
                  <PrivateRoute>
                    <ContentDetail />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
