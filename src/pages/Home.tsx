import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createScan } from '../api/client';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await createScan(domain);
      navigate(`/scan/${result.scan_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h1 className="headline">Domain Security Scanner</h1>
          <p className="subtext">
            Scan any domain for vulnerabilities and security misconfigurations.
          </p>
        </header>

        <div className="card card-glow">
          <form onSubmit={handleSubmit} className="input-group">
            <input
              type="text"
              className="input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              disabled={loading}
              required
            />
            <button 
              type="submit" 
              className="btn btn-full"
              disabled={loading || !domain.trim()}
            >
              {loading && <span className="spinner" />}
              {loading ? 'Scanning...' : 'Run Scan'}
            </button>
          </form>
          
          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <p className="muted" style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          No signup required
        </p>
      </div>
    </div>
  );
}
