// src/layouts/DashboardLayout.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, List, Target, User, LogOut, Home } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    {to: '/', icon: <Home />, label: 'Home'},
    { to: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { to: '/transaction-list', icon: <List />, label: 'Transactions' },
    { to: '/budget-goals', icon: <Target />, label: 'Budgets' },
    { to: '/profile', icon: <User />, label: 'Profile' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-xl font-bold text-blue-600">FundFlow</div>
        <nav className="flex flex-col gap-2 px-4">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-50 ${
                location.pathname === link.to ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded mt-4"
          >
            <LogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-blue-600 p-2 bg-white shadow rounded"
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setIsMobileOpen(false)}>
          <aside
            className="w-64 h-full bg-white shadow-md p-6 absolute top-0 left-0"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-xl font-bold text-blue-600 mb-6">FundFlow</div>
            <nav className="flex flex-col gap-2">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 ${
                    location.pathname === link.to ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-100 rounded mt-4"
              >
                <LogOut /> Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
