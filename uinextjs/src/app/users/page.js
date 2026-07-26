'use client'

import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";

export default function UsersPage() {
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

  // Filtered + sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
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

    // Apply sorting
    const { key, direction } = sortConfig;
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle date fields
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
    <div className={styles.root}>
      {/* Page header */}
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>👤 Users</h1>
            <span className={styles.liveBadge}>● {users.length} Registered</span>
            <span className={styles.aiChip}>⚡ User Management</span>
          </div>
          <p className={styles.subtitle}>
            Manage all registered users. View details, update roles, and manage accounts.
          </p>
        </div>

        <div className={styles.quickActions}>
          <button className={styles.actionBtnSecondary} onClick={fetchUsers}>
            <span className={styles.actionIcon}>⟳</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Users Data Table */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>📋 Registered Users</div>
            <div className={styles.cardSub}>All users who signed up through the platform</div>
          </div>
          <div className={styles.filters}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by name, email, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.searchClear}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            {!loading && (
              <span className={styles.countBadge}>
                {filteredUsers.length} / {users.length} Users
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>
            Loading users...
          </div>
        ) : error ? (
          <div className={styles.error}>
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>
            No users found yet. Users will appear here after they sign up.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.empty}>
            No users match your search.
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} onClick={() => handleSort('name')}>
                    Name <span className={styles.sortIndicator}>{getSortIndicator('name')}</span>
                  </th>
                  <th className={styles.th} onClick={() => handleSort('email')}>
                    Email <span className={styles.sortIndicator}>{getSortIndicator('email')}</span>
                  </th>
                  <th className={styles.th} onClick={() => handleSort('mobile')}>
                    Mobile <span className={styles.sortIndicator}>{getSortIndicator('mobile')}</span>
                  </th>
                  <th className={styles.th} onClick={() => handleSort('role')}>
                    Role <span className={styles.sortIndicator}>{getSortIndicator('role')}</span>
                  </th>
                  <th className={styles.th} onClick={() => handleSort('status')}>
                    Status <span className={styles.sortIndicator}>{getSortIndicator('status')}</span>
                  </th>
                  <th className={styles.th} onClick={() => handleSort('created_at')}>
                    Joined <span className={styles.sortIndicator}>{getSortIndicator('created_at')}</span>
                  </th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className={styles.userName}>{user.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.email}>{user.email}</span>
                    </td>
                    <td className={styles.td}>{user.mobile}</td>
                    <td className={styles.td}>
                      <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.admin : styles.user}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.active : styles.inactive}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.date}>
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className={styles.deleteBtn}
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
      </section>
    </div>
  );
}

