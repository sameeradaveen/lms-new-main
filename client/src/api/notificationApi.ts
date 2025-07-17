export async function fetchNotifications(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/notifications/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch notifications');
  return res.json();
}

export async function createNotification(notification: { message: string, type: string, recipients: string[] }) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(notification),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create notification');
  return res.json();
}

export async function fetchAllNotifications() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/notifications', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch all notifications');
  return res.json();
} 