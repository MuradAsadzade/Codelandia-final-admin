import { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Users from './pages/Users';
import Header from './components/Header';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Orders from './pages/Orders';
import CartItems from './pages/CartItems';
import Payments from './pages/Payments';
import ProductImages from './pages/ProductImages';
import Reviews from './pages/Reviews';
import Shippings from './pages/Shippings';
import Login from './pages/Login';
import Register from './pages/Register'; // Import the Register component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Function to handle successful registration
  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <BrowserRouter>
          <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />

          {/* Protected routes */}
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
          <Route path="/categories" element={isAuthenticated ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />
          <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/cart-items" element={isAuthenticated ? <CartItems /> : <Navigate to="/login" />} />
          <Route path="/payments" element={isAuthenticated ? <Payments /> : <Navigate to="/login" />} />
          <Route path="/product-images" element={isAuthenticated ? <ProductImages /> : <Navigate to="/login" />} />
          <Route path="/reviews" element={isAuthenticated ? <Reviews /> : <Navigate to="/login" />} />
          <Route path="/shippings" element={isAuthenticated ? <Shippings /> : <Navigate to="/login" />} />

          {/* Redirect to login if not authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/users" /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
