import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetGoals from './pages/BudgetGoals';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import { ToastContainer } from 'react-toastify';
import DashboardLayout from './components/DashboardLayout';
import TransactionList from './pages/TransactionList';
import About from './pages/About';

function App() {
  return (
    <Router basename="/fund-flow">
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>

        <Route 
        path="/" 
        element={<Index />} 
        />

        <Route 
        path="/login" 
        element={<Login />} 
        />

        <Route 
        path="/register" 
        element={<Register />} 
        />

        <Route 
        path="/dashboard" 
        element={
          <DashboardLayout>
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          </DashboardLayout>} 
        />
        
        <Route 
        path="/transactions" 
        element={
          <DashboardLayout>
            <ProtectedRoute><Transactions /></ProtectedRoute>
          </DashboardLayout>
          } 
        />

        <Route 
        path="/transactions/:id" 
        element={
          <DashboardLayout>
            <ProtectedRoute><Transactions editMode={true} /></ProtectedRoute>
          </DashboardLayout>
          } 
        />

        <Route 
        path="/transaction-list" 
        element={
          <DashboardLayout>
            <ProtectedRoute><TransactionList /></ProtectedRoute>
          </DashboardLayout>
          } 
        />
        
        <Route 
        path="/budget-goals" 
        element={
        <DashboardLayout>
          <ProtectedRoute><BudgetGoals /></ProtectedRoute>
        </DashboardLayout>
        } 
        />
        
        <Route 
        path="/profile" 
        element={
          <DashboardLayout>
            <ProtectedRoute><Profile /></ProtectedRoute>
          </DashboardLayout>
          } 
        />

        <Route path="/about" element={<About />} />
        
      </Routes>
    </Router>
  );
}

export default App;
