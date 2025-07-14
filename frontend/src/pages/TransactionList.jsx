import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react'; // ✅ using lucide-react icon

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: '',
    month: '',
    });


  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('transactions/');
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to load transactions');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
        await api.delete(`transactions/${id}/`);
        toast.success('Transaction deleted');
        fetchTransactions(); // refresh
    } catch {
        toast.error('Failed to delete transaction');
    }
    };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <button
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
            <div className="flex flex-wrap gap-4 mb-4">
                {/* Type Filter */}
                <select
                    value={filters.type}
                    onChange={e => setFilters({ ...filters, type: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                {/* Month Filter */}
                <input
                    type="month"
                    value={filters.month}
                    onChange={e => setFilters({ ...filters, month: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Note</th>
                <th className="px-4 py-2">Actions</th>

              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(tx => {
                    if (filters.type && tx.type !== filters.type) return false;
                    if (filters.month && !tx.date.startsWith(filters.month)) return false;
                    return true;
                })             
                .map(tx => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2 capitalize text-sm">
                        <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {tx.type}
                        </span>
                    </td>
                    <td className="px-4 py-2">{tx.category_name || '—'}</td>
                    <td className="px-4 py-2 font-semibold">₦{parseFloat(tx.amount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm">{tx.note || '—'}</td>
                    <td className="px-4 py-2 flex gap-2">
                        <button
                            onClick={() => navigate(`/transactions/${tx.id}`)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(tx.id)}
                            className="text-red-600 hover:underline text-sm"
                        >
                            Delete
                        </button>
                    </td>


                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
