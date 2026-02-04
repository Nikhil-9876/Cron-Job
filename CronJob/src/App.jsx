import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [jobs, setJobs] = useState([])
  const [logs, setLogs] = useState([])

  const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5173'

  // Fetch jobs and logs on mount and refresh every 30 seconds
  useEffect(() => {
    fetchJobs()
    fetchLogs()
    
    const interval = setInterval(() => {
      fetchJobs()
      fetchLogs()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`)
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/logs`)
      const data = await response.json()
      if (data.logs) {
        setLogs(data.logs.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp).toLocaleString()
        })))
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container">
      <h1>🕐 Vercel Cron Job Monitor</h1>
      <p className="subtitle">Your cron jobs are running automatically on Vercel's servers 24/7</p>

      <div className="info-card">
        <div className="info-banner">
          ⚡ Jobs are configured in <code>api/config.js</code> and run automatically!
        </div>
      </div>

      {/* Active Jobs */}
      {jobs.length > 0 ? (
        <div className="jobs-card">
          <h2>Active Cron Jobs ({jobs.length})</h2>
          <div className="jobs-list">
            {jobs.map((job, index) => (
              <div key={job.id || index} className="job-item job-permanent">
                <div className="job-info">
                  <div className="job-header">
                    <span className="job-url">{job.url}</span>
                    <span className="badge-permanent">🔒 Active</span>
                  </div>
                  <div className="job-meta">
                    <span>⏱️ Every {job.interval}s ({Math.floor(job.interval / 60)} min)</span>
                    {job.lastRun && (
                      <span>Last run: {new Date(job.lastRun).toLocaleString()}</span>
                    )}
                    {job.description && (
                      <span className="job-description">📝 {job.description}</span>
                    )}
                  </div>
                </div>
                <div className="job-status">✅</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="jobs-card">
          <h2>No Jobs Configured</h2>
          <p className="no-jobs">
            Add jobs in <code>api/config.js</code> to start monitoring websites automatically.
          </p>
        </div>
      )}

      <div className="logs-card">
        <div className="logs-header">
          <h2>Activity Logs</h2>
          <div className="logs-actions">
            <span className="log-count">{logs.length} entries</span>
            <button onClick={clearLogs} className="btn-clear-logs">
              🗑️ Clear
            </button>
          </div>
        </div>
        <div className="logs-container">
          {logs.length === 0 ? (
            <p className="no-logs">No logs yet. Jobs will appear here once they start executing.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className={`log-entry log-${log.status}`}>
                <span className="log-time">{log.timestamp}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="footer-note">
        <p>💡 To add or modify cron jobs, edit <code>api/config.js</code> and redeploy</p>
      </div>
    </div>
  )
}

export default App
