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

export async function exportAttendance(startDate?: string, endDate?: string, format: string = 'csv') {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('format', format);
  
  const res = await fetch(`/api/attendance/export?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to export attendance');
  
  if (format === 'csv') {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } else {
    return res.json();
  }
} 