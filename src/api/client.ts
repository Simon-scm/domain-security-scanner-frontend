const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ScanCreateResponse {
  scan_id: string;
  status: string;
}

export interface ScanDetails {
  id: string;
  domain: string;
  status: string;
  created_at: string;
  score: number | null;
  result_json: string | null;
  warning: string | null;
}

export async function createScan(domain: string): Promise<ScanCreateResponse> {
  const response = await fetch(`${API_BASE_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create scan: ${response.status}`);
  }

  return response.json();
}

export async function getScan(scanId: string): Promise<ScanDetails> {
  const response = await fetch(`${API_BASE_URL}/api/scan/${scanId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch scan: ${response.status}`);
  }

  return response.json();
}

