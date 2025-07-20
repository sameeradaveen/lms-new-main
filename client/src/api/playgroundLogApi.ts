export async function fetchPlaygroundLogs(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/playgroundlogs/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch playground logs');
  return res.json();
}

export async function createPlaygroundLog(log: { 
  user: string; 
  language: string; 
  code: string; 
  input?: string; 
  output?: string; 
}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/playgroundlogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(log),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create playground log');
  return res.json();
}

export async function fetchAllPlaygroundLogs() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/playgroundlogs', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch all playground logs');
  return res.json();
}

export async function deletePlaygroundLogs(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/playgroundlogs/user/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete playground logs');
  return res.json();
} 