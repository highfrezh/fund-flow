// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('profile/');
      setProfile(res.data);
      console.log(res.data)
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePicture = e => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('full_name', profile.full_name);
      formData.append('currency', profile.currency);
      formData.append('monthly_income', profile.monthly_income || '');
      formData.append('timezone', profile.timezone);
      if (picture) formData.append('profile_picture', picture);

      await api.put('profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email (read-only)</label>
          <input
            value={profile.email}
            readOnly
            className="w-full p-2 bg-gray-100 border rounded text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Currency</label>
          <select
            name="currency"
            value={profile.currency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="₦">₦ - NGN</option>
            <option value="$">$ - USD</option>
            <option value="€">€ - EUR</option>
            <option value="£">£ - GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Monthly Income</label>
          <input
            type="number"
            name="monthly_income"
            value={profile.monthly_income || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Timezone</label>
          <input
            name="timezone"
            value={profile.timezone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input type="file" onChange={handlePicture} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
