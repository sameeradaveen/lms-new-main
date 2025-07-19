export async function fetchNotifications(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/notifications/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch notifications');
  return res.json();
}

export async function fetchUnreadNotifications(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/notifications/user/${userId}/unread`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch unread notifications');
  return res.json();
}

export async function createNotification(notification: { 
  title: string;
  message: string; 
  type: string; 
  priority?: string;
  recipients: string[];
  scheduledFor?: string;
  expiresAt?: string;
  relatedData?: {
    courseId?: string;
    assignmentId?: string;
    liveClassId?: string;
  };
}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(notification),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create notification');
  return res.json();
}

export async function markNotificationAsRead(notificationId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to mark notification as read');
  return res.json();
}

export async function markAllNotificationsAsRead(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/notifications/user/${userId}/read-all`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to mark all notifications as read');
  return res.json();
}

export async function deleteNotification(notificationId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete notification');
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