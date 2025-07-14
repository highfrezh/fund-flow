import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList
} from 'recharts';

export default function BudgetVsSpendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBudgetVsSpend();
  }, []);

  const fetchBudgetVsSpend = async () => {
    try {
      const res = await api.get('dashboard/chart/budget-vs-spend/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load budget vs spend data');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 my-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Budget vs Actual Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#ccc" name="Budget">
            <LabelList dataKey="budget" position="right" />
          </Bar>
          <Bar dataKey="spent" fill="#3182ce" name="Spent">
            <LabelList dataKey="spent" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
