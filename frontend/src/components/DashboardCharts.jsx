import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#aa5fb1', '#e74c3c', '#1abc9c'];

export default function DashboardCharts() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      const [catRes, monthRes] = await Promise.all([
        api.get('dashboard/chart/category/'),
        api.get('dashboard/chart/monthly/')
      ]);
      setCategoryData(catRes.data);
      setMonthlyData(monthRes.data);
    } catch (err) {
      console.error('Chart data fetch error', err);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Pie Chart: Category Spending */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold text-center mb-4">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Monthly Expense */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold text-center mb-4">Monthly Expenses</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
