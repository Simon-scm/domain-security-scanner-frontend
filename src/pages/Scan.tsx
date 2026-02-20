import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScan, ScanDetails } from '../api/client';

export default function Scan() {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<ScanDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;
    let timeoutId: number;

    const fetchScan = async () => {
      try {
        const data = await getScan(id);
        if (!active) return;

        setScan(data);

        if (data.status === 'queued' || data.status === 'running') {
          timeoutId = window.setTimeout(fetchScan, 1500);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    };

    fetchScan();

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <div className="alert alert-error">{error}</div>
            <Link to="/" className="back-link" style={{ marginTop: 'var(--space-lg)' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="page">
        <div className="container">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span className="spinner" />
              <span className="loading-text">Loading scan results...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPolling = scan.status === 'queued' || scan.status === 'running';

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <div className="card">
          <h1>Scan Results</h1>
          
          <div className="info-row">
            <span className="info-label">Domain</span>
            <span className="info-value">{scan.domain}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className={`badge badge-${scan.status}`}>{scan.status}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Created</span>
            <span className="info-value">{new Date(scan.created_at).toLocaleString()}</span>
          </div>
          
          {scan.score !== null && (
            <div className="info-row">
              <span className="info-label">Security Score</span>
              <div className="score-display">
                <span className="score-value">{scan.score}</span>
                <span className="score-label">/ 100</span>
              </div>
            </div>
          )}
          
          {scan.warning && (
            <div className="alert alert-warning">{scan.warning}</div>
          )}
          
          {isPolling && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
              <span className="spinner" />
              <span className="loading-text">Scanning in progress...</span>
            </div>
          )}
        </div>

        {scan.result_json && (
          <div className="card result-block">
            <h2>Detailed Results</h2>
            <pre className="result-pre">{scan.result_json}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
