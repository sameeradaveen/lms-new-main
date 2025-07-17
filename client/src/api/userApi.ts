export async function fetchUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch users');
  return res.json();
}

export async function createUser(user: { username: string, password: string, role: string }) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create user');
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update user');
  return res.json();
}

export async function deleteUser(id: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete user');
  return res.json();
} 