export async function fetchCourses() {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/courses', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch courses')
  return res.json()
}

export async function createCourse(course: { title: string, description: string, track: string }) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(course),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create course');
  return res.json();
} 