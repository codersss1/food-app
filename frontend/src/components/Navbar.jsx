import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const itemCount = getItemCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Campus Eats
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-text hover:text-primary transition">
            Home
          </Link>
          <Link to="/orders" className="text-text hover:text-primary transition">
            Orders
          </Link>
          <Link to="/cart" className="relative text-text hover:text-primary transition">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="text-text hover:text-primary transition">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-text text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <Link to="/" className="block text-text hover:text-primary transition">
              Home
            </Link>
            <Link to="/orders" className="block text-text hover:text-primary transition">
              Orders
            </Link>
            <Link to="/cart" className="block text-text hover:text-primary transition">
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <Link to="/profile" className="block text-text hover:text-primary transition">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
