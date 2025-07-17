export async function checkInAttendance(user: string, date: string, time: string) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/attendance/checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ user, date, time }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Check-in failed');
  return res.json();
}

export async function fetchAttendanceByUser(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/attendance/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch attendance');
  return res.json();
}

export async function fetchAllAttendance() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/attendance', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch all attendance');
  return res.json();
} 