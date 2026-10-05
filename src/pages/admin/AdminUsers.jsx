import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Search, Filter, ShieldBan, ShieldCheck, MoreVertical, User, Building2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (userId, role, currentActiveState) => {
    const action = currentActiveState ? 'suspend' : 'restore';
    if (!window.confirm(`Are you sure you want to ${action} this ${role}?`)) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/suspend`, { 
        role, 
        isActive: !currentActiveState 
      });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !currentActiveState } : u));
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error(error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage Creators and Companies on the platform.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-fuchsia-500"
          >
            <option value="All">All Roles</option>
            <option value="Creator">Creators</option>
            <option value="Company">Companies</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6">Role & Category</th>
                <th className="py-4 px-6">Approval Status</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'Company' ? 'bg-blue-100 text-blue-600' : 'bg-fuchsia-100 text-fuchsia-600'}`}>
                          {user.role === 'Company' ? <Building2 size={20} /> : <User size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium">{user.contact}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium">{user.category}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.status === 'approved' ? 'bg-green-100 text-green-700' :
                          user.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {user.status || 'Pending'}
                        </span>
                        {!user.isActive && (
                           <span className="inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                             Suspended
                           </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleToggleSuspend(user._id, user.role, user.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive 
                            ? 'text-red-600 hover:bg-red-50 hover:border-red-200' 
                            : 'text-green-600 hover:bg-green-50 hover:border-green-200'
                        }`}
                        title={user.isActive ? "Suspend User" : "Restore User"}
                      >
                        {user.isActive ? <ShieldBan size={20} /> : <ShieldCheck size={20} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
