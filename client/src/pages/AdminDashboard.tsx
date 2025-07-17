import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchUsers, createUser, deleteUser } from "@/api/userApi"
import { createCourse, fetchCourses } from "@/api/courseApi"

const modules = [
  "Credential Management",
  "Course Content Upload",
  "Assignment Management",
  "Live Link Management",
  "Attendance/Submission Monitoring",
  "Playground Logs",
  "Reports",
  "Certificate Generation",
  "Notifications"
]

const AdminDashboard = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, [navigate])
  const [active, setActive] = useState(modules[0])

  // User management state
  const [users, setUsers] = useState<any[]>([])
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState("")
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' })
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState("")

  // Course content upload state
  const [courseForm, setCourseForm] = useState({ title: '', description: '', track: 'fullstack' })
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseMsg, setCourseMsg] = useState("")
  const [courseError, setCourseError] = useState("")
  const [courses, setCourses] = useState<any[]>([])
  const [pdf, setPdf] = useState<File | null>(null);

  // Assignment upload state
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    type: 'theory',
    pdf: null as File | null,
    testCases: [{ input: '', output: '' }],
  });
  const [assignmentMsg, setAssignmentMsg] = useState('');
  const [assignmentError, setAssignmentError] = useState('');
  const [assignmentList, setAssignmentList] = useState<any[]>([]);

  // Fetch users
  useEffect(() => {
    if (active === "Credential Management") {
      setUserLoading(true)
      fetchUsers()
        .then(setUsers)
        .catch(err => setUserError(err.message))
        .finally(() => setUserLoading(false))
    }
  }, [active])

  // Fetch courses
  useEffect(() => {
    if (active === "Course Content Upload") {
      setCourseLoading(true)
      fetchCourses()
        .then(setCourses)
        .catch(err => setCourseError(err.message))
        .finally(() => setCourseLoading(false))
    }
  }, [active])

  useEffect(() => {
    if (active === 'Assignment Management') {
      fetch('/api/assignments')
        .then(res => res.json())
        .then(setAssignmentList)
        .catch(() => setAssignmentList([]));
    }
  }, [active, assignmentMsg]);

  const handleAssignmentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAssignmentPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignmentForm(prev => ({ ...prev, pdf: e.target.files?.[0] || null }));
  };
  const handleTestCaseChange = (idx: number, field: 'input' | 'output', value: string) => {
    setAssignmentForm(prev => {
      const testCases = [...prev.testCases];
      testCases[idx][field] = value;
      return { ...prev, testCases };
    });
  };
  const addTestCase = () => {
    setAssignmentForm(prev => ({ ...prev, testCases: [...prev.testCases, { input: '', output: '' }] }));
  };
  const removeTestCase = (idx: number) => {
    setAssignmentForm(prev => ({ ...prev, testCases: prev.testCases.filter((_, i) => i !== idx) }));
  };
  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentMsg('');
    setAssignmentError('');
    try {
      const formData = new FormData();
      formData.append('title', assignmentForm.title);
      formData.append('description', assignmentForm.description);
      formData.append('type', assignmentForm.type);
      if (assignmentForm.type === 'theory' && assignmentForm.pdf) {
        formData.append('pdf', assignmentForm.pdf);
      }
      if (assignmentForm.type === 'coding') {
        formData.append('testCases', JSON.stringify(assignmentForm.testCases));
      }
      const res = await fetch('/api/assignments', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create assignment');
      setAssignmentMsg('Assignment created!');
      setAssignmentForm({ title: '', description: '', type: 'theory', pdf: null, testCases: [{ input: '', output: '' }] });
    } catch (err: any) {
      setAssignmentError(err.message);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!window.confirm('Delete this assignment and all related submissions?')) return;
    try {
      const res = await fetch(`/api/assignments/${assignmentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete assignment');
      setAssignmentList(list => list.filter(a => a._id !== assignmentId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Add user handler
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateMsg("")
    try {
      await createUser(newUser)
      setCreateMsg("User created!")
      setNewUser({ username: '', password: '', role: 'student' })
      // Refresh user list
      setUserLoading(true)
      const updated = await fetchUsers()
      setUsers(updated)
      setUserLoading(false)
    } catch (err: any) {
      setCreateMsg(err.message)
    } finally {
      setCreating(false)
    }
  }

  // Delete user handler
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      setUsers(users.filter(u => u._id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Add course handler
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseLoading(true);
    setCourseMsg("");
    setCourseError("");
    try {
      const formData = new FormData();
      formData.append('title', courseForm.title);
      formData.append('description', courseForm.description);
      formData.append('track', courseForm.track);
      if (pdf) formData.append('pdf', pdf);

      const res = await fetch('/api/courses', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create course');
      setCourseMsg("Course module created!");
      setCourseForm({ title: '', description: '', track: 'fullstack' });
      setPdf(null);
      // Refresh course list
      const updated = await fetchCourses();
      setCourses(updated);
    } catch (err: any) {
      setCourseError(err.message);
    } finally {
      setCourseLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleDeletePdf = async (courseId: string) => {
    if (!window.confirm('Delete the PDF for this course?')) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/pdf`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete PDF');
      // Refresh course list
      const updated = await fetchCourses();
      setCourses(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-[#23293b] p-6 flex flex-col gap-4 shadow-md border-r border-[#388bff22]">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#388bff' }}>Admin Dashboard</h2>
        <button onClick={handleLogout} className="mb-4 px-4 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }}>Logout</button>
        {modules.map(m => (
          <button
            key={m}
            className={`text-left px-4 py-2 rounded-md font-medium`}
            style={active === m ? { backgroundColor: '#388bff', color: '#fff' } : { backgroundColor: 'transparent', color: '#fff', border: '1px solid #388bff22' }}
            onClick={() => setActive(m)}
          >
            {m}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <h3 className="text-2xl font-semibold mb-6" style={{ color: '#388bff' }}>{active}</h3>
        {active === "Credential Management" ? (
          <div>
            <form onSubmit={handleAddUser} className="flex gap-2 items-end mb-4 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
                required
              />
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" disabled={creating} className="px-4 py-1 rounded bg-primary text-black font-semibold">Add</button>
            </form>
            {createMsg && <div className="mb-4 text-green-600">{createMsg}</div>}
            {userLoading && <div>Loading...</div>}
            {userError && <div className="text-red-500">{userError}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
                <thead>
                  <tr style={{ backgroundColor: '#1a1e2a', color: '#388bff' }}>
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Role</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ backgroundColor: '#23293b', color: '#fff' }}>
                      <td className="py-2 px-4">{user.username}</td>
                      <td className="py-2 px-4">{user.role}</td>
                      <td className="py-2 px-4">
                        <button onClick={() => handleDeleteUser(user._id)} className="px-2 py-1 rounded" style={{ backgroundColor: '#388bff', color: '#fff' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : active === "Course Content Upload" ? (
          <div>
            <form onSubmit={handleAddCourse} className="flex gap-2 items-end mb-4 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
              <input
                type="text"
                placeholder="Title"
                value={courseForm.title}
                onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={courseForm.description}
                onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
                required
              />
              <select
                value={courseForm.track}
                onChange={e => setCourseForm({ ...courseForm, track: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
              >
                <option value="fullstack" style={{ backgroundColor: '#23293b', color: '#fff' }}>Full Stack</option>
                <option value="cybersecurity" style={{ backgroundColor: '#23293b', color: '#fff' }}>Cybersecurity</option>
              </select>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setPdf(e.target.files?.[0] || null)}
                className="rounded-md border px-3 py-2"
                style={{ color: '#fff', backgroundColor: '#23293b' }}
              />
              <button type="submit" disabled={courseLoading} className="px-4 py-1 rounded bg-primary text-black font-semibold">Add</button>
            </form>
            {courseMsg && <div className="mb-4 text-green-600">{courseMsg}</div>}
            {courseError && <div className="text-red-500">{courseError}</div>}
            {courseLoading && <div>Loading...</div>}
            <ul className="space-y-2 mt-4">
              {courses.map((c) => (
                <li key={c._id} className="p-2 rounded shadow flex flex-col" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                  <span className="font-semibold" style={{ color: '#388bff' }}>{c.title}</span>
                  <span className="text-xs" style={{ color: '#b0c4de' }}>{c.track}</span>
                  <span>{c.description}</span>
                  {c.pdfUrl && (
                    <div className="flex items-center gap-2 mt-1">
                      <a href={`http://localhost:3000${c.pdfUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#388bff' }}>
                        View PDF
                      </a>
                      <button onClick={() => handleDeletePdf(c._id)} className="px-2 py-1 rounded" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                        Delete PDF
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : active === 'Assignment Management'
          ? (
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-2" style={{ color: '#388bff' }}>Create Assignment</h4>
              <form onSubmit={handleAssignmentSubmit} className="flex flex-col gap-3 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={assignmentForm.title}
                  onChange={handleAssignmentFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={assignmentForm.description}
                  onChange={handleAssignmentFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                  required
                />
                <select
                  name="type"
                  value={assignmentForm.type}
                  onChange={handleAssignmentFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                >
                  <option value="theory">Theory (PDF)</option>
                  <option value="coding">Coding Challenge</option>
                </select>
                {assignmentForm.type === 'theory' && (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleAssignmentPdfChange}
                    className="rounded-md border px-3 py-2"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  />
                )}
                {assignmentForm.type === 'coding' && (
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold mb-1">Test Cases</div>
                    {assignmentForm.testCases.map((tc, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Input"
                          value={tc.input}
                          onChange={e => handleTestCaseChange(idx, 'input', e.target.value)}
                          className="rounded-md border px-2 py-1 bg-background text-white border-[#388bff55]"
                          style={{ color: '#fff', backgroundColor: '#23293b' }}
                        />
                        <input
                          type="text"
                          placeholder="Expected Output"
                          value={tc.output}
                          onChange={e => handleTestCaseChange(idx, 'output', e.target.value)}
                          className="rounded-md border px-2 py-1 bg-background text-white border-[#388bff55]"
                          style={{ color: '#fff', backgroundColor: '#23293b' }}
                        />
                        <button type="button" onClick={() => removeTestCase(idx)} className="px-2 py-1 rounded" style={{ backgroundColor: '#388bff', color: '#fff' }}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={addTestCase} className="px-2 py-1 rounded w-fit" style={{ backgroundColor: '#388bff', color: '#fff' }}>Add Test Case</button>
                  </div>
                )}
                {assignmentError && <div className="text-red-500">{assignmentError}</div>}
                {assignmentMsg && <div className="text-green-500">{assignmentMsg}</div>}
                <button type="submit" className="mt-2 px-6 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }}>Create Assignment</button>
              </form>
              <h4 className="text-lg font-bold mb-2 mt-8" style={{ color: '#388bff' }}>Assignments List</h4>
              <ul className="space-y-4">
                {assignmentList.map((a) => (
                  <li key={a._id} className="p-4 rounded shadow mb-4" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                    <div className="font-bold text-lg" style={{ color: '#388bff' }}>{a.title}</div>
                    <div>{a.description}</div>
                    {a.type === 'theory' && a.pdfUrl && (
                      <a href={`http://localhost:3000${a.pdfUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#388bff' }}>
                        View PDF
                      </a>
                    )}
                    <button onClick={() => handleDeleteAssignment(a._id)} className="mt-2 px-4 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                      Delete Assignment
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
          : (
            <div className="rounded-lg shadow p-6 min-h-[300px] flex items-center justify-center text-lg" style={{ backgroundColor: '#23293b', color: '#fff' }}>
              {[
                "Credential Management",
                "Course Content Upload",
                "Assignment Management",
                "Live Link Management",
                "Attendance/Submission Monitoring",
                "Playground Logs",
                "Reports",
                "Certificate Generation",
                "Notifications"
              ].includes(active) ? null : `[${active} module coming soon...]`}
            </div>
          )
        }
      </main>
    </div>
  )
}

export default AdminDashboard 