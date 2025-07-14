import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function Transactions({ editMode = false }) {
  const { id } = useParams(); // get transaction id when editing
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    note: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (editMode && id) {
      fetchTransactionToEdit(id);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories/');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchTransactionToEdit = async id => {
    try {
      const res = await api.get(`transactions/${id}/`);
      const data = res.data;
      setForm({
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        note: data.note,
      });
    } catch {
      toast.error('Failed to load transaction');
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
      if (editMode && id) {
        await api.put(`transactions/${id}/`, form);
        toast.success('Transaction updated');
      } else {
        await api.post('transactions/', form);
        toast.success('Transaction added');
      }
      navigate('/transaction-list');
    } catch {
      toast.error('Error saving transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
      {/* ...form remains same... */}
       <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

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
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Note (optional)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}
