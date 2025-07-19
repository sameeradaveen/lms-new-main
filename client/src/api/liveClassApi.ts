export async function fetchLiveLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/liveclasses/active', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch live links');
  return res.json();
}

export async function fetchAllLiveLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/liveclasses', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch all live links');
  return res.json();
}

export async function createLiveLink(link: { 
  title: string, 
  url: string, 
  platform: string, 
  description?: string, 
  scheduledDate?: string, 
  scheduledTime?: string, 
  autoHide?: boolean, 
  hideAfterHours?: number 
}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/liveclasses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(link),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create live link');
  return res.json();
}

export async function updateLiveLink(id: string, link: { 
  title?: string, 
  url?: string, 
  platform?: string, 
  description?: string, 
  scheduledDate?: string, 
  scheduledTime?: string, 
  autoHide?: boolean, 
  hideAfterHours?: number 
}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/liveclasses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(link),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update live link');
  return res.json();
}

export async function toggleLiveLinkStatus(id: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/liveclasses/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to toggle live link status');
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