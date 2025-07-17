export async function fetchPlaygroundLogs(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/playgroundlogs/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch playground logs');
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