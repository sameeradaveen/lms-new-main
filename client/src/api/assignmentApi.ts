export async function fetchAssignments() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/assignments', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch assignments');
  return res.json();
}

export async function createAssignment(assignment: any) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/assignments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(assignment),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create assignment');
  return res.json();
}

export async function fetchSubmissions(assignmentId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/assignments/${assignmentId}/submissions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch submissions');
  return res.json();
}

export async function giveFeedback(assignmentId: string, submissionId: string, feedback: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/assignments/${assignmentId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ submissionId, feedback }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to give feedback');
  return res.json();
}

export async function submitAssignment(assignmentId: string, data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Submission failed');
  return res.json();
} 