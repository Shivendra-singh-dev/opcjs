'use client'

import React, { useState, useEffect, useMemo } from 'react';
import ds from '../page.module.css';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contacts');
      const data = await res.json();
      if (data.success) {
        setContacts(data.data || []);
      } else {
        setError(data.message || 'Failed to load contacts.');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter(c => c.id !== id));
      } else {
        alert(data.message || 'Delete failed.');
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

  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = contacts.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.mobile && c.mobile.toLowerCase().includes(q)) ||
        (c.message && c.message.toLowerCase().includes(q))
      );
    }

    const { key, direction } = sortConfig;
    return [...filtered].sort((a, b) => {
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
  }, [contacts, searchQuery, sortConfig]);

  if (loading) {
    return <div className={ds.datatableEmpty}>Loading contacts...</div>;
  }

  if (error) {
    return <div className={ds.datatableError}>{error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em' }}>📞 Contact Submissions</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(15, 23, 42, 0.6)', fontWeight: 600 }}>
            View all messages submitted via the contact form.
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className={ds.datatableSearchWrap} style={{ flex: 1, minWidth: '250px' }}>
          <span className={ds.datatableSearchIcon}>🔍</span>
          <input
            type="text"
            className={ds.datatableSearchInput}
            placeholder="Search by name, email, mobile, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={ds.datatableSearchClear} onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>
        <span className={ds.filterBtn}>
          {filteredContacts.length} / {contacts.length} Total
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className={ds.datatableEmpty}>No contacts found yet.</div>
      ) : filteredContacts.length === 0 ? (
        <div className={ds.datatableEmpty}>No contacts match your search.</div>
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
                <th className={ds.datatableTh} onClick={() => handleSort('message')}>
                  Message <span className={ds.sortIndicator}>{getSortIndicator('message')}</span>
                </th>
                <th className={ds.datatableTh} onClick={() => handleSort('created_at')}>
                  Date <span className={ds.sortIndicator}>{getSortIndicator('created_at')}</span>
                </th>
                <th className={ds.datatableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className={ds.datatableTr}>
                  <td className={ds.datatableTd} style={{ fontWeight: 800, color: 'rgba(15, 23, 42, 0.4)' }}>{contact.id}</td>
                  <td className={ds.datatableTd}>{contact.name}</td>
                  <td className={ds.datatableTd}>
                    <span className={ds.datatableEmail}>{contact.email}</span>
                  </td>
                  <td className={ds.datatableTd}>{contact.mobile}</td>
                  <td className={ds.datatableTd}>
                    <span className={ds.datatableMessage} title={contact.message}>
                      {contact.message}
                    </span>
                  </td>
                  <td className={ds.datatableTd}>
                    <span className={ds.datatableDate}>
                      {new Date(contact.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className={ds.datatableTd}>
                    <button onClick={() => handleDelete(contact.id)} className={ds.datatableDeleteBtn}>
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
