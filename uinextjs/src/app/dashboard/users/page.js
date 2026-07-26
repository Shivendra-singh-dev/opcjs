'use client'

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ds from '../page.module.css';

export default function DashboardUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.error || 'Failed to load users.');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/users');
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError(data.error || 'Failed to load users.');
        }
      } catch (err) {
        if (mounted) setError('Unable to connect to server.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(data.error || 'Delete failed.');
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = users.filter(u =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.mobile && u.mobile.toLowerCase().includes(q)) ||
        (u.role && u.role.toLowerCase().includes(q)) ||
        (u.status && u.status.toLowerCase().includes(q))
      );
    }

    const { key, direction } = sortConfig;
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, searchQuery, sortConfig]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em' }}>
            👤 Registered Users
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(15, 23, 42, 0.6)', fontWeight: 600 }}>
            Manage all users who signed up through the platform.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => router.push('/dashboard/users/create')}
            style={{
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
            }}
          >
            ✨ Create User
          </button>
          <button
            onClick={fetchUsers}
            style={{
              border: '1px solid rgba(15, 23, 42, 0.08)',
              cursor: 'pointer',
              fontWeight: 800,
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.7)',
              color: '#1e293b',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ⟳ Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className={ds.datatableSearchWrap} style={{ flex: 1, minWidth: '250px' }}>
          <span className={ds.datatableSearchIcon}>🔍</span>
          <input
            type="text"
            className={ds.datatableSearchInput}
            placeholder="Search by name, email, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={ds.datatableSearchClear} onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
        {!loading && (
          <span className={ds.filterBtn}>
            {filteredUsers.length} / {users.length} Users
          </span>
        )}
      </div>

      {loading ? (
        <div className={ds.datatableEmpty}>Loading users...</div>
      ) : error ? (
        <div className={ds.datatableError}>{error}</div>
      ) : users.length === 0 ? (
        <div className={ds.datatableEmpty}>No users found yet. Users will appear here after they sign up.</div>
      ) : filteredUsers.length === 0 ? (
        <div className={ds.datatableEmpty}>No users match your search.</div>
      ) : (
        <div className={ds.datatableTableWrap}>
          <table className={ds.datatableTable}>
            <thead>
              <tr>
                <th className={ds.datatableTh} onClick={() => handleSort('id')}>
                  ID <span className={ds.sortIndicator}>{getSortIndicator('id')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('name')}>
                  Name <span className={ds.sortIndicator}>{getSortIndicator('name')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('email')}>
                  Email <span className={ds.sortIndicator}>{getSortIndicator('email')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('mobile')}>
                  Mobile <span className={ds.sortIndicator}>{getSortIndicator('mobile')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('role')}>
                  Role <span className={ds.sortIndicator}>{getSortIndicator('role')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('status')}>
                  Status <span className={ds.sortIndicator}>{getSortIndicator('status')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('created_at')}>
                  Joined <span className={ds.sortIndicator}>{getSortIndicator('created_at')}</span>
                </th>
                <th className={ds.datatableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={ds.datatableTr}>
                  <td className={ds.datatableTd} style={{ fontWeight: 800, color: 'rgba(15, 23, 42, 0.4)' }}>{user.id}</td>
                  <td className={ds.datatableTd}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                        border: '1px solid rgba(99, 102, 241, 0.15)', color: '#6366f1',
                      }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span style={{ fontWeight: 700 }}>{user.name}</span>
                    </div>
                  </td>
                  <td className={ds.datatableTd}>
                    <span className={ds.datatableEmail}>{user.email}</span>
                  </td>
                  <td className={ds.datatableTd}>{user.mobile}</td>
                  <td className={ds.datatableTd}>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 10,
                      fontWeight: 800, fontSize: 10, textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      background: user.role === 'admin'
                        ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.08)',
                      color: user.role === 'admin' ? '#d97706' : '#6366f1',
                      border: user.role === 'admin'
                        ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(99, 102, 241, 0.12)',
                    }}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className={ds.datatableTd}>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 10,
                      fontWeight: 800, fontSize: 10, textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      background: user.status === 'active'
                        ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.08)',
                      color: user.status === 'active' ? '#15803d' : '#dc2626',
                      border: user.status === 'active'
                        ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)',
                    }}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className={ds.datatableTd}>
                    <span className={ds.datatableDate}>
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className={ds.datatableTd}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className={ds.datatableDeleteBtn}
                    >
                      ✕ Delete
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
