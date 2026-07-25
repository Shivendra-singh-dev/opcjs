'use client'

import React, { useState, useEffect } from 'react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div style={{ padding: '20px' }}><p>Loading contacts...</p></div>;
  if (error) return <div style={{ padding: '20px' }}><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Contact Submissions</h1>
      <p>View all messages submitted via the contact form.</p>

      {contacts.length === 0 ? (
        <p>No contacts found yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1f2937', color: '#fff' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}>{contact.id}</td>
                <td style={tdStyle}>{contact.name}</td>
                <td style={tdStyle}>{contact.email}</td>
                <td style={tdStyle}>{contact.mobile}</td>
                <td style={tdStyle}>{contact.message}</td>
                <td style={tdStyle}>{new Date(contact.created_at).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', textAlign: 'left', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' };
