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
          <button className={styles.actionBtnSecondary}>
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