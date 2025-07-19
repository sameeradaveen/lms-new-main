export async function fetchUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch users');
    } catch (parseError) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }
  }
  return res.json();
}

export async function createUser(user: { username: string, password: string, role: string }) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create user');
    } catch (parseError) {
      throw new Error(`Failed to create user: ${res.status} ${res.statusText}`);
    }
  }
  return res.json();
}

export async function updateUser(id: string, data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update user');
    } catch (parseError) {
      throw new Error(`Failed to update user: ${res.status} ${res.statusText}`);
    }
  }
  return res.json();
}

export async function deleteUser(id: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete user');
    } catch (parseError) {
      throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
    }
  }
  return res.json();
} 