export async function fetchLiveLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/liveclasses/active', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch live links');
  return res.json();
}

export async function createLiveLink(link: { title: string, url: string }) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/liveclasses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(link),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create live link');
  return res.json();
}

export async function deleteLiveLink(id: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/liveclasses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete live link');
  return res.json();
} 