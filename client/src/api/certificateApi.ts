export async function fetchCertificates(userId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/certificates/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch certificates');
  return res.json();
}

export async function generateCertificate(data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/certificates/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate certificate');
  return res.json();
}

export async function fetchAllCertificates() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/certificates', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch all certificates');
  return res.json();
} 