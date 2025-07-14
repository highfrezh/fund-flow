import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardCharts from '../components/DashboardCharts';
import BudgetVsSpendChart from '../components/BudgetVsSpendChart';

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [insights, setInsights] = useState([]);


  const fetchSummary = async () => {
    try {
      const res = await api.get('dashboard/summary/');
      setSummary(res.data);
      console.log(res.data)
    } catch {
      toast.error('Failed to load dashboard data');
    }
  };

  
const fetchInsights = async () => {
  try {
    const res = await api.get('dashboard/insights/');
    setInsights(res.data.insights);
  } catch {
    toast.error('Failed to load AI insights');
  }
};

  useEffect(() => {
    fetchSummary();
    fetchInsights();
  }, []);


  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm text-green-800">Income</p>
          <h2 className="text-xl font-bold text-green-800">₦{summary.income.toFixed(2)}</h2>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm text-red-800">Expense</p>
          <h2 className="text-xl font-bold text-red-800">₦{summary.expense.toFixed(2)}</h2>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm text-blue-800">Balance</p>
          <h2 className="text-xl font-bold text-blue-800">₦{summary.balance.toFixed(2)}</h2>
        </div>
      </div>

      {/* Placeholder for chart + insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">📊 Chart </h3>
          <DashboardCharts/>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">💡 Smart Insights</h3>
          {insights.length === 0 ? (
          <p className="text-gray-500 text-sm">No insights available at the moment.</p>
        ) : (
          <ul className="space-y-3">
            {insights.map((insight, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-sm text-gray-800 px-3 py-2 rounded-md bg-gray-50 border-l-4
                  ${insight.includes('⚠️') ? 'border-red-500' : 'border-blue-400'}`}
              >
                {insight.includes('⚠️') ? (
                  <AlertCircle className="w-4 h-4 text-red-500 mt-1" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                )}
                <span>{insight.replace('⚠️', '')}</span>
              </li>
            ))}
          </ul>
        )}
        </div>

      </div>
        <BudgetVsSpendChart />
    </div>
  );
}
