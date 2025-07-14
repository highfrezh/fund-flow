// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center md:text-left text-gray-600 mt-auto shadow-inner">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-blue-600">FundFlow</span>. All rights reserved.
        </p>

        {/* <div className="flex gap-4 mt-3 md:mt-0 text-sm">
          <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/transactions" className="hover:text-blue-600">Transactions</Link>
          <Link to="/budget-goals" className="hover:text-blue-600">Budgets</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile</Link>
        </div> */}
      </div>
    </footer>
  );
}
