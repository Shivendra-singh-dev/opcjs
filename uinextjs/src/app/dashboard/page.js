'use client'

import { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";

const kpis = [
  { 
    label: "Active Users", 
    value: "12,482", 
    delta: "+8.4%", 
    tone: "up",
    icon: "👤",
    trend: [65, 75, 70, 85, 80, 90, 88]
  },
  { 
    label: "AI Revenue", 
    value: "$48,290", 
    delta: "+12.1%", 
    tone: "up",
    icon: "🤖",
    trend: [45, 55, 60, 70, 65, 80, 85]
  },
  { 
    label: "Conversion Rate", 
    value: "4.62%", 
    delta: "-0.3%", 
    tone: "down",
    icon: "📊",
    trend: [70, 68, 65, 62, 60, 58, 55]
  },
  { 
    label: "AI Predictions", 
    value: "1,284", 
    delta: "+23.7%", 
    tone: "up",
    icon: "🧠",
    trend: [50, 55, 70, 65, 80, 85, 92]
  },
];

const chartSeries = [18, 22, 16, 28, 24, 30, 27];
const aiPredictions = [75, 82, 68, 90, 85, 78, 92];

export default function DashboardPage() {
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

  // Filtered + sorted contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = contacts.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.mobile && c.mobile.toLowerCase().includes(q)) ||
        (c.message && c.message.toLowerCase().includes(q))
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
  }, [contacts, searchQuery, sortConfig]);

  return (
    <div className={styles.root}>
      {/* Page header */}
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>AI Dashboard</h1>
            <span className={styles.liveBadge}>● Live</span>
            <span className={styles.aiChip}>🤖 AI Powered</span>
          </div>
          <p className={styles.subtitle}>
            Real-time insights powered by AI. Smart analytics at your fingertips.
          </p>
        </div>

        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>✨</span>
            AI Analyze
          </button>
          <button className={styles.actionBtnSecondary} onClick={fetchContacts}>
            <span className={styles.actionIcon}>⟳</span>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <section className={styles.kpis}>
        {kpis.map((k) => (
          <div key={k.label} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <div className={styles.kpiLabelWrap}>
                <span className={styles.kpiIcon}>{k.icon}</span>
                <span className={styles.kpiLabel}>{k.label}</span>
              </div>
              <div
                className={`${styles.kpiDelta} ${k.tone === "up" ? styles.up : styles.down}`}
              >
                {k.delta}
              </div>
            </div>
            <div className={styles.kpiValue}>{k.value}</div>
            <div className={styles.kpiTrend}>
              {k.trend.map((v, i) => (
                <div 
                  key={i} 
                  className={styles.trendBar}
                  style={{ 
                    height: `${v * 0.6}px`,
                    background: k.tone === "up" 
                      ? `rgba(99, 102, 241, ${0.3 + (v / 100) * 0.5})`
                      : `rgba(239, 68, 68, ${0.3 + (v / 100) * 0.5})`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Charts + AI Insights */}
      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>📈 Revenue Trend</div>
              <div className={styles.cardSub}>AI forecast vs actual</div>
            </div>
            <div className={styles.cardTag}>
              <span className={styles.tagDot} />
              Updated now
            </div>
          </div>

          <div className={styles.chartWrap}>
            <div className={styles.chartBars}>
              {chartSeries.map((v, idx) => (
                <div key={idx} className={styles.barCol}>
                  <div className={styles.bar} style={{ height: `${v * 2.2}px` }}>
                    <span className={styles.barValue}>{v}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.chartAxis}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#6366f1' }} />
                Actual
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: '#8b5cf6' }} />
                AI Forecast
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>🧠 AI Insights</div>
              <div className={styles.cardSub}>Smart predictions</div>
            </div>
            <div className={styles.aiScore}>98%</div>
          </div>

          <div className={styles.aiInsights}>
            <div className={styles.aiPrediction}>
              <div className={styles.predictionHeader}>
                <span className={styles.predictionLabel}>User Growth</span>
                <span className={styles.predictionValue}>+18.4%</span>
              </div>
              <div className={styles.predictionBar}>
                <div className={styles.predictionFill} style={{ width: '74%' }} />
              </div>
            </div>
            <div className={styles.aiPrediction}>
              <div className={styles.predictionHeader}>
                <span className={styles.predictionLabel}>Engagement</span>
                <span className={styles.predictionValue}>+12.6%</span>
              </div>
              <div className={styles.predictionBar}>
                <div className={styles.predictionFill} style={{ width: '62%' }} />
              </div>
            </div>
            <div className={styles.aiPrediction}>
              <div className={styles.predictionHeader}>
                <span className={styles.predictionLabel}>Revenue</span>
                <span className={styles.predictionValue}>+23.2%</span>
              </div>
              <div className={styles.predictionBar}>
                <div className={styles.predictionFill} style={{ width: '86%' }} />
              </div>
            </div>
          </div>

          <div className={styles.insights}>
            <div className={styles.insightItem}>
              <div className={styles.insightIcon}>⚡</div>
              <div className={styles.insightText}>
                <div className={styles.insightTitle}>AI predicts 12% growth</div>
                <div className={styles.insightDesc}>Next month forecast shows positive trend</div>
              </div>
            </div>
            <div className={styles.insightItem}>
              <div className={styles.insightIcon}>🛡️</div>
              <div className={styles.insightText}>
                <div className={styles.insightTitle}>Security AI active</div>
                <div className={styles.insightDesc}>No anomalies detected in real-time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <div>
            <div className={styles.cardTitle}>📋 Recent Activity</div>
            <div className={styles.cardSub}>AI-sorted priority updates</div>
          </div>
          <div className={styles.activityFilters}>
            <button className={styles.filterBtn}>All</button>
            <button className={styles.filterBtnGhost}>AI</button>
            <button className={styles.filterBtnGhost}>Users</button>
            <button className={styles.filterBtnGhost}>System</button>
          </div>
        </div>

        <div className={styles.table}>
          {[
            { t: "AI analyzed user behavior", d: "12,482 users processed", s: "2m ago", tone: "ok", priority: "High" },
            { t: "Predictive model updated", d: "v3.2 deployed", s: "18m ago", tone: "ok", priority: "Medium" },
            { t: "Anomaly detected", d: "Flagged for review", s: "1h ago", tone: "warn", priority: "Critical" },
            { t: "Smart recommendations", d: "Generated for 1,284 users", s: "3h ago", tone: "ok", priority: "Low" },
            { t: "AI training complete", d: "Model accuracy: 94.7%", s: "Yesterday", tone: "ok", priority: "High" },
          ].map((row, i) => (
            <div className={styles.row} key={i}>
              <div className={styles.cellMain}>
                <span className={styles.rowDot} data-tone={row.tone} />
                <span className={styles.rowTitle}>{row.t}</span>
                <span className={`${styles.priorityBadge} ${styles[row.priority.toLowerCase()]}`}>
                  {row.priority}
                </span>
              </div>
              <div className={styles.cellSub}>{row.d}</div>
              <div className={styles.cellTime}>{row.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Submissions - DataTable */}
      <section className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <div>
            <div className={styles.cardTitle}>📞 Contact Submissions</div>
            <div className={styles.cardSub}>Messages received from the contact form</div>
          </div>
          <div className={styles.activityFilters}>
            {/* Search Input */}
            <div className={styles.datatableSearchWrap}>
              <span className={styles.datatableSearchIcon}>🔍</span>
              <input
                type="text"
                className={styles.datatableSearchInput}
                placeholder="Search by name, email, mobile, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.datatableSearchClear}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            {!loading && (
              <span className={styles.filterBtn}>
                {filteredContacts.length} / {contacts.length} Total
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.datatableEmpty}>
            Loading contacts...
          </div>
        ) : error ? (
          <div className={styles.datatableError}>
            {error}
          </div>
        ) : contacts.length === 0 ? (
          <div className={styles.datatableEmpty}>
            No contacts found yet.
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className={styles.datatableEmpty}>
            No contacts match your search.
          </div>
        ) : (
          <div className={styles.datatableTableWrap}>
            <table className={styles.datatableTable}>
              <thead>
                <tr>
                  <th
                    className={styles.datatableTh}
                    onClick={() => handleSort('name')}
                  >
                    Name <span className={styles.sortIndicator}>{getSortIndicator('name')}</span>
                  </th>
                  <th
                    className={styles.datatableTh}
                    onClick={() => handleSort('email')}
                  >
                    Email <span className={styles.sortIndicator}>{getSortIndicator('email')}</span>
                  </th>
                  <th
                    className={styles.datatableTh}
                    onClick={() => handleSort('mobile')}
                  >
                    Mobile <span className={styles.sortIndicator}>{getSortIndicator('mobile')}</span>
                  </th>
                  <th
                    className={styles.datatableTh}
                    onClick={() => handleSort('message')}
                  >
                    Message <span className={styles.sortIndicator}>{getSortIndicator('message')}</span>
                  </th>
                  <th
                    className={styles.datatableTh}
                    onClick={() => handleSort('created_at')}
                  >
                    Date <span className={styles.sortIndicator}>{getSortIndicator('created_at')}</span>
                  </th>
                  <th className={styles.datatableTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className={styles.datatableTr}>
                    <td className={styles.datatableTd}>{contact.name}</td>
                    <td className={styles.datatableTd}>
                      <span className={styles.datatableEmail}>{contact.email}</span>
                    </td>
                    <td className={styles.datatableTd}>{contact.mobile}</td>
                    <td className={styles.datatableTd}>
                      <span className={styles.datatableMessage} title={contact.message}>
                        {contact.message}
                      </span>
                    </td>
                    <td className={styles.datatableTd}>
                      <span className={styles.datatableDate}>
                        {new Date(contact.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className={styles.datatableTd}>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className={styles.datatableDeleteBtn}
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

      <section className={styles.footerHint}>
        <div className={styles.footerCard}>
          <div className={styles.footerTitle}>🤖 AI Assistant Ready</div>
          <div className={styles.footerText}>
            Ask me anything about your data, predictions, or system status. 
            I'm here to help you make better decisions.
          </div>
          <button className={styles.footerBtn}>
            <span>Start AI Chat</span>
            <span className={styles.footerBtnIcon}>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
