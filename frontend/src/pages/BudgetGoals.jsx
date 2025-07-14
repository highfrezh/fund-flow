// src/pages/BudgetPage.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function BudgetGoals() {
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ category: '', monthly_limit: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchGoals();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories/');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await api.get('budget-goals/');
      setGoals(res.data);
    } catch {
      toast.error('Failed to load budget goals');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);

  try {
    if (editingId) {
      // Update existing budget
      await api.put(`budget-goals/${editingId}/`, form);
      toast.success('Budget goal updated');
    } else {
      // Create new budget
      await api.post('budget-goals/', form);
      toast.success('Budget goal added');
    }

    // Reset form
    setForm({ category: '', monthly_limit: '' });
    setEditingId(null);
    fetchGoals();

  } catch {
    toast.error('Failed to save budget');
  } finally {
    setLoading(false);
  }
};

const handleEdit = goal => {
  setForm({
    category: goal.category,
    monthly_limit: goal.monthly_limit
  });
  setEditingId(goal.id);
};


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Monthly Budget Goals</h2>

      {/* Budget Form */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Monthly Limit (₦)</label>
          <input
            type="number"
            name="monthly_limit"
            value={form.monthly_limit}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading
              ? 'Saving...'
              : editingId
              ? 'Update Budget'
              : 'Add Budget'}
          </button>

        </div>
      </form>

      {/* Budget Goals List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Budgets</h3>
        <ul className="space-y-2">
          {goals.length === 0 && <p className="text-gray-500">No budgets set yet.</p>}
         {goals.map(goal => (
            <li key={goal.id} className="p-3 bg-gray-100 rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium">{goal.category_name}</p>
                <p className="text-blue-600 font-bold">₦{goal.monthly_limit}</p>
              </div>
              <button
                onClick={() => handleEdit(goal)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}
