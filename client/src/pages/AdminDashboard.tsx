import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchUsers, createUser, deleteUser } from "@/api/userApi"
import { createCourse, fetchCourses } from "@/api/courseApi"
import { fetchAllAttendance, exportAttendance } from "@/api/attendanceApi"
import { fetchAllLiveLinks, createLiveLink, updateLiveLink, toggleLiveLinkStatus, deleteLiveLink } from "@/api/liveClassApi"
import { fetchAllNotifications, createNotification, deleteNotification } from "@/api/notificationApi"

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

  // Live Link Management state
  const [liveLinks, setLiveLinks] = useState<any[]>([])
  const [liveLinkLoading, setLiveLinkLoading] = useState(false)
  const [liveLinkError, setLiveLinkError] = useState("")
  const [liveLinkMsg, setLiveLinkMsg] = useState("")
  const [liveLinkForm, setLiveLinkForm] = useState({
    title: '',
    url: '',
    platform: 'Google Meet',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    autoHide: false,
    hideAfterHours: 24
  })

  // Attendance monitoring state
  const [attendance, setAttendance] = useState<any[]>([])
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  const [attendanceError, setAttendanceError] = useState("")
  const [exportLoading, setExportLoading] = useState(false)
  const [exportError, setExportError] = useState("")
  const [exportMsg, setExportMsg] = useState("")
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })

  // Notification management state
  const [notifications, setNotifications] = useState<any[]>([])
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationError, setNotificationError] = useState("")
  const [notificationMsg, setNotificationMsg] = useState("")
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'medium',
    recipients: [] as string[],
    scheduledFor: '',
    expiresAt: '',
    relatedData: {
      courseId: '',
      assignmentId: '',
      liveClassId: ''
    }
  })

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

  // Fetch attendance records
  useEffect(() => {
    if (active === "Attendance/Submission Monitoring") {
      setAttendanceLoading(true)
      setAttendanceError("")
      fetchAllAttendance()
        .then(setAttendance)
        .catch(err => setAttendanceError(err.message))
        .finally(() => setAttendanceLoading(false))
    }
  }, [active])

  // Fetch live links
  useEffect(() => {
    if (active === "Live Link Management") {
      setLiveLinkLoading(true)
      setLiveLinkError("")
      fetchAllLiveLinks()
        .then(setLiveLinks)
        .catch(err => setLiveLinkError(err.message))
        .finally(() => setLiveLinkLoading(false))
    }
  }, [active])

  // Fetch notifications
  useEffect(() => {
    if (active === "Notifications") {
      setNotificationLoading(true)
      setNotificationError("")
      fetchAllNotifications()
        .then(setNotifications)
        .catch(err => setNotificationError(err.message))
        .finally(() => setNotificationLoading(false))
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

  const handleExportAttendance = async () => {
    setExportLoading(true)
    setExportError("")
    setExportMsg("")
    try {
      await exportAttendance(dateRange.startDate, dateRange.endDate, 'csv')
      setExportMsg("Attendance report exported successfully!")
    } catch (err: any) {
      setExportError(err.message)
    } finally {
      setExportLoading(false)
    }
  }

  const handleLiveLinkFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setLiveLinkForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCreateLiveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLiveLinkMsg('');
    setLiveLinkError('');
    try {
      await createLiveLink(liveLinkForm);
      setLiveLinkMsg('Live class link created successfully!');
      setLiveLinkForm({
        title: '',
        url: '',
        platform: 'Google Meet',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        autoHide: false,
        hideAfterHours: 24
      });
      // Refresh live links list
      const updated = await fetchAllLiveLinks();
      setLiveLinks(updated);
    } catch (err: any) {
      setLiveLinkError(err.message);
    }
  };

  const handleToggleLiveLinkStatus = async (id: string) => {
    try {
      await toggleLiveLinkStatus(id);
      // Refresh live links list
      const updated = await fetchAllLiveLinks();
      setLiveLinks(updated);
    } catch (err: any) {
      setLiveLinkError(err.message);
    }
  };

  const handleDeleteLiveLink = async (id: string) => {
    if (!window.confirm('Delete this live class link?')) return;
    try {
      await deleteLiveLink(id);
      setLiveLinks(links => links.filter(link => link._id !== id));
    } catch (err: any) {
      setLiveLinkError(err.message);
    }
  };

  const handleNotificationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('relatedData.')) {
      const field = name.split('.')[1];
      setNotificationForm(prev => ({
        ...prev,
        relatedData: {
          ...prev.relatedData,
          [field]: value
        }
      }));
    } else {
      setNotificationForm(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationMsg('');
    setNotificationError('');
    
    try {
      const notificationData = {
        ...notificationForm,
        recipients: notificationForm.recipients.length > 0 ? notificationForm.recipients : users.map(u => u._id), // Send to all users if no specific recipients
        scheduledFor: notificationForm.scheduledFor || undefined,
        expiresAt: notificationForm.expiresAt || undefined,
        relatedData: {
          courseId: notificationForm.relatedData.courseId || undefined,
          assignmentId: notificationForm.relatedData.assignmentId || undefined,
          liveClassId: notificationForm.relatedData.liveClassId || undefined
        }
      };
      
      await createNotification(notificationData);
      setNotificationMsg('Notification sent successfully!');
      setNotificationForm({
        title: '',
        message: '',
        type: 'general',
        priority: 'medium',
        recipients: [],
        scheduledFor: '',
        expiresAt: '',
        relatedData: {
          courseId: '',
          assignmentId: '',
          liveClassId: ''
        }
      });
      // Refresh notifications list
      const updated = await fetchAllNotifications();
      setNotifications(updated);
    } catch (err: any) {
      setNotificationError(err.message);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await deleteNotification(id);
      setNotifications(notifications => notifications.filter(n => n._id !== id));
    } catch (err: any) {
      setNotificationError(err.message);
    }
  };

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
    setUserError("")
    
    try {
      console.log('Creating user:', newUser)
      const result = await createUser(newUser)
      console.log('User created successfully:', result)
      setCreateMsg("User created successfully!")
      setNewUser({ username: '', password: '', role: 'student' })
      // Refresh user list
      setUserLoading(true)
      const updated = await fetchUsers()
      setUsers(updated)
      setUserLoading(false)
    } catch (err: any) {
      console.error('Error creating user:', err)
      setUserError(err.message || 'Failed to create user')
      setCreateMsg("")
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
            {userError && <div className="mb-4 text-red-500">{userError}</div>}
            {userLoading && <div>Loading...</div>}
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
          ) : active === "Live Link Management" ? (
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-2" style={{ color: '#388bff' }}>Create New Live Link</h4>
              <form onSubmit={handleCreateLiveLink} className="flex flex-col gap-3 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                <input
                  type="text"
                  name="title"
                  placeholder="Title (e.g., 'Daily Standup')"
                  value={liveLinkForm.title}
                  onChange={handleLiveLinkFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                  required
                />
                <input
                  type="url"
                  name="url"
                  placeholder="Live Meeting URL (e.g., https://meet.google.com/abc-123-def)"
                  value={liveLinkForm.url}
                  onChange={handleLiveLinkFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                  required
                />
                <select
                  name="platform"
                  value={liveLinkForm.platform}
                  onChange={handleLiveLinkFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                >
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Others">Others</option>
                </select>
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  value={liveLinkForm.description}
                  onChange={handleLiveLinkFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    name="scheduledDate"
                    value={liveLinkForm.scheduledDate}
                    onChange={handleLiveLinkFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  />
                  <input
                    type="time"
                    name="scheduledTime"
                    value={liveLinkForm.scheduledTime}
                    onChange={handleLiveLinkFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="autoHide"
                    checked={liveLinkForm.autoHide}
                    onChange={handleLiveLinkFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  />
                  <label className="text-sm">Auto-hide after scheduled time</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="hideAfterHours"
                    value={liveLinkForm.hideAfterHours}
                    onChange={handleLiveLinkFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  />
                  <label className="text-sm">Hide after (hours)</label>
                </div>
                {liveLinkError && <div className="text-red-500">{liveLinkError}</div>}
                {liveLinkMsg && <div className="text-green-500">{liveLinkMsg}</div>}
                <button type="submit" disabled={liveLinkLoading} className="mt-2 px-6 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                  {liveLinkLoading ? 'Creating...' : 'Create Live Link'}
                </button>
              </form>

              <h4 className="text-lg font-bold mb-2 mt-8" style={{ color: '#388bff' }}>Live Link List</h4>
              {liveLinkLoading && <div>Loading live links...</div>}
              {liveLinkError && <div className="text-red-500">{liveLinkError}</div>}
              {!liveLinkLoading && !liveLinkError && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
                    <thead>
                      <tr style={{ backgroundColor: '#1a1e2a', color: '#388bff' }}>
                        <th className="py-2 px-4">Title</th>
                        <th className="py-2 px-4">URL</th>
                        <th className="py-2 px-4">Platform</th>
                        <th className="py-2 px-4">Scheduled</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveLinks.map(link => (
                        <tr key={link._id} style={{ backgroundColor: '#23293b', color: '#fff' }}>
                          <td className="py-2 px-4">{link.title}</td>
                          <td className="py-2 px-4">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#388bff' }}>{link.url}</a>
                          </td>
                          <td className="py-2 px-4">{link.platform}</td>
                          <td className="py-2 px-4">
                            {link.scheduledDate 
                              ? `${new Date(link.scheduledDate).toLocaleDateString()} ${link.scheduledTime || ''}`
                              : 'Not scheduled'
                            }
                          </td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${link.active ? 'bg-green-600' : 'bg-red-600'}`}>
                              {link.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            <button onClick={() => handleToggleLiveLinkStatus(link._id)} className="px-2 py-1 rounded" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                              {link.active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDeleteLiveLink(link._id)} className="ml-2 px-2 py-1 rounded" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : active === "Notifications" ? (
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-2" style={{ color: '#388bff' }}>Send Notification</h4>
              <form onSubmit={handleCreateNotification} className="flex flex-col gap-3 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                <input
                  type="text"
                  name="title"
                  placeholder="Notification Title"
                  value={notificationForm.title}
                  onChange={handleNotificationFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                  required
                />
                <textarea
                  name="message"
                  placeholder="Notification Message"
                  value={notificationForm.message}
                  onChange={handleNotificationFormChange}
                  className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                  style={{ color: '#fff', backgroundColor: '#23293b' }}
                  required
                />
                <div className="flex gap-2">
                  <select
                    name="type"
                    value={notificationForm.type}
                    onChange={handleNotificationFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  >
                    <option value="general">General</option>
                    <option value="class_timing">Class Timing</option>
                    <option value="deadline">Deadline</option>
                    <option value="assignment_upload">Assignment Upload</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select
                    name="priority"
                    value={notificationForm.priority}
                    onChange={handleNotificationFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    name="scheduledFor"
                    value={notificationForm.scheduledFor}
                    onChange={handleNotificationFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                    placeholder="Schedule for (optional)"
                  />
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={notificationForm.expiresAt}
                    onChange={handleNotificationFormChange}
                    className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                    style={{ color: '#fff', backgroundColor: '#23293b' }}
                    placeholder="Expires at (optional)"
                  />
                </div>
                {notificationError && <div className="text-red-500">{notificationError}</div>}
                {notificationMsg && <div className="text-green-500">{notificationMsg}</div>}
                <button type="submit" disabled={notificationLoading} className="mt-2 px-6 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                  {notificationLoading ? 'Sending...' : 'Send Notification'}
                </button>
              </form>

              <h4 className="text-lg font-bold mb-2 mt-8" style={{ color: '#388bff' }}>Notification History</h4>
              {notificationLoading && <div>Loading notifications...</div>}
              {notificationError && <div className="text-red-500">{notificationError}</div>}
              {!notificationLoading && !notificationError && (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification._id} className="p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold" style={{ color: '#388bff' }}>{notification.title}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            notification.priority === 'urgent' ? 'bg-red-600' :
                            notification.priority === 'high' ? 'bg-orange-600' :
                            notification.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {notification.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            notification.type === 'urgent' ? 'bg-red-600' :
                            notification.type === 'deadline' ? 'bg-orange-600' :
                            notification.type === 'class_timing' ? 'bg-blue-600' :
                            notification.type === 'assignment_upload' ? 'bg-purple-600' : 'bg-gray-600'
                          }`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteNotification(notification._id)} className="px-2 py-1 rounded" style={{ backgroundColor: '#388bff', color: '#fff' }}>
                          Delete
                        </button>
                      </div>
                      <p className="mb-2">{notification.message}</p>
                      <div className="text-sm" style={{ color: '#b0c4de' }}>
                        <p>Created by: {notification.createdBy?.username || 'Admin'}</p>
                        <p>Created: {new Date(notification.createdAt).toLocaleString()}</p>
                        {notification.scheduledFor && <p>Scheduled for: {new Date(notification.scheduledFor).toLocaleString()}</p>}
                        {notification.expiresAt && <p>Expires: {new Date(notification.expiresAt).toLocaleString()}</p>}
                        <p>Recipients: {notification.recipients?.length || 0} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : active === "Attendance/Submission Monitoring" ? (
            <div>
              <div className="mb-6 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                <h4 className="text-lg font-bold mb-4" style={{ color: '#388bff' }}>Export Attendance Report</h4>
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="block text-sm mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                      style={{ color: '#fff', backgroundColor: '#23293b' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                      style={{ color: '#fff', backgroundColor: '#23293b' }}
                    />
                  </div>
                  <button
                    onClick={handleExportAttendance}
                    disabled={exportLoading}
                    className="px-6 py-2 rounded font-semibold shadow" 
                    style={{ backgroundColor: '#388bff', color: '#fff' }}
                  >
                    {exportLoading ? 'Exporting...' : 'Export CSV'}
                  </button>
                </div>
                {exportMsg && <div className="mt-2 text-green-500">{exportMsg}</div>}
                {exportError && <div className="mt-2 text-red-500">{exportError}</div>}
              </div>

              <h4 className="text-lg font-bold mb-4" style={{ color: '#388bff' }}>Attendance Records</h4>
              {attendanceLoading && <div>Loading attendance records...</div>}
              {attendanceError && <div className="text-red-500">{attendanceError}</div>}
              {!attendanceLoading && !attendanceError && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
                    <thead>
                      <tr style={{ backgroundColor: '#1a1e2a', color: '#388bff' }}>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Username</th>
                        <th className="py-2 px-4">Time</th>
                        <th className="py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map(record => {
                        const user = record.user as any;
                        return (
                          <tr key={record._id} style={{ backgroundColor: '#23293b', color: '#fff' }}>
                            <td className="py-2 px-4">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="py-2 px-4">{user?.username || 'Unknown'}</td>
                            <td className="py-2 px-4">{record.time || 'N/A'}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${record.checkedIn ? 'bg-green-600' : 'bg-red-600'}`}>
                                {record.checkedIn ? 'Present' : 'Absent'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
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