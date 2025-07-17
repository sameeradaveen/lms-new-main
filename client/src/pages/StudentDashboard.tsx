import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchCourses } from "@/api/courseApi"
import { checkInAttendance, fetchAttendanceByUser } from "@/api/attendanceApi"
import { fetchAssignments, submitAssignment } from "@/api/assignmentApi"
import { fetchLiveLinks } from "@/api/liveClassApi"
import { fetchNotifications } from "@/api/notificationApi"
import { fetchCertificates } from "@/api/certificateApi"
import { fetchPlaygroundLogs } from "@/api/playgroundLogApi"

const modules = [
  "Course Content",
  "Attendance",
  "Live Class Links",
  "Assignments",
  "Playground",
  "Notifications",
  "Certificates"
]

const StudentDashboard = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, [navigate])
  const [active, setActive] = useState(modules[0])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attendance, setAttendance] = useState<any[]>([])
  const [attLoading, setAttLoading] = useState(false)
  const [attError, setAttError] = useState("")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Assignments
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [submissionMsg, setSubmissionMsg] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionForm, setSubmissionForm] = useState<{ [key: string]: { answerText: string; file: File | null } }>({});
  const [assnLoading, setAssnLoading] = useState(false)
  const [assnError, setAssnError] = useState("")
  const [submission, setSubmission] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState("")
  // Live Links
  const [liveLinks, setLiveLinks] = useState<any[]>([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveError, setLiveError] = useState("")
  // Notifications
  const [notifications, setNotifications] = useState<any[]>([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifError, setNotifError] = useState("")
  // Certificates
  const [certificates, setCertificates] = useState<any[]>([])
  const [certLoading, setCertLoading] = useState(false)
  const [certError, setCertError] = useState("")
  // Playground Logs
  const [logs, setLogs] = useState<any[]>([])
  const [logLoading, setLogLoading] = useState(false)
  const [logError, setLogError] = useState("")

  useEffect(() => {
    if (active === "Course Content") {
      setLoading(true)
      setError("")
      fetchCourses()
        .then(setCourses)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [active])

  useEffect(() => {
    if (active === "Attendance") {
      setAttLoading(true)
      fetchAttendanceByUser(user._id)
        .then(setAttendance)
        .catch(err => setAttError(err.message))
        .finally(() => setAttLoading(false))
    }
  }, [active])

  // Fetch data for each module
  useEffect(() => {
    if (active === "Assignments") {
      setAssnLoading(true)
      fetchAssignments()
        .then(setAssignments)
        .catch(err => setAssnError(err.message))
        .finally(() => setAssnLoading(false))
    } else if (active === "Live Class Links") {
      setLiveLoading(true)
      fetchLiveLinks()
        .then(setLiveLinks)
        .catch(err => setLiveError(err.message))
        .finally(() => setLiveLoading(false))
    } else if (active === "Notifications") {
      setNotifLoading(true)
      fetchNotifications(user._id)
        .then(setNotifications)
        .catch(err => setNotifError(err.message))
        .finally(() => setNotifLoading(false))
    } else if (active === "Certificates") {
      setCertLoading(true)
      fetchCertificates(user._id)
        .then(setCertificates)
        .catch(err => setCertError(err.message))
        .finally(() => setCertLoading(false))
    } else if (active === "Playground") {
      setLogLoading(true)
      fetchPlaygroundLogs(user._id)
        .then(setLogs)
        .catch(err => setLogError(err.message))
        .finally(() => setLogLoading(false))
    }
  }, [active])

  const handleCheckIn = async () => {
    setAttError("")
    try {
      await checkInAttendance(user._id, new Date().toISOString().slice(0, 10), new Date().toLocaleTimeString())
      // Refresh attendance log
      setAttLoading(true)
      const updated = await fetchAttendanceByUser(user._id)
      setAttendance(updated)
      setAttLoading(false)
    } catch (err: any) {
      setAttError(err.message)
    }
  }

  // Assignment submission handler
  const handleAssignmentSubmit = async (assignmentId: string, type: string) => {
    setSubmittingAssignmentId(assignmentId);
    setSubmissionMsg('');
    setSubmissionError('');
    try {
      const formData = new FormData();
      formData.append('assignment', assignmentId);
      formData.append('student', user._id); // assuming user is available in context
      if (submissionForm[assignmentId]?.answerText) {
        formData.append('answerText', submissionForm[assignmentId].answerText);
      }
      if (submissionForm[assignmentId]?.file) {
        formData.append('file', submissionForm[assignmentId].file);
      }
      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to submit assignment');
      setSubmissionMsg('Assignment submitted!');
      setSubmissionForm(prev => ({ ...prev, [assignmentId]: { answerText: '', file: null } }));
    } catch (err: any) {
      setSubmissionError(err.message);
    } finally {
      setSubmittingAssignmentId(null);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleSubmissionFormChange = (assignmentId: string, field: 'answerText' | 'file', value: any) => {
    setSubmissionForm(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-[#23293b] p-6 flex flex-col gap-4 shadow-md border-r border-[#388bff22]">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#388bff' }}>Student Dashboard</h2>
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
        {active === "Course Content" ? (
          <div>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <ul className="space-y-4">
              {courses.map((course) => (
                <li key={course._id} className="p-4 rounded shadow mb-4" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                  <div className="font-bold text-lg" style={{ color: '#388bff' }}>{course.title}</div>
                  <div>{course.description}</div>
                  {course.pdfUrl && (
                    <a href={`http://localhost:3000${course.pdfUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#388bff' }}>
                      View PDF
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : active === "Attendance" ? (
          <div>
            <button
              onClick={handleCheckIn}
              className="mb-4 px-6 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }}
            >
              Check In
            </button>
            {attLoading && <div>Loading...</div>}
            {attError && <div className="text-red-500">{attError}</div>}
            <ul className="space-y-2 mt-4">
              {attendance.map((rec) => (
                <li key={rec._id} className="p-2 rounded shadow flex justify-between mb-2" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                  <span>{rec.date?.slice(0, 10)}</span>
                  <span>{rec.time}</span>
                  <span>{rec.checkedIn ? "Present" : "Absent"}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : active === 'Assignments' && (
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-2" style={{ color: '#388bff' }}>Assignments</h4>
            <ul className="space-y-4">
              {assignments.map((a) => (
                <li key={a._id} className="p-4 rounded shadow mb-4" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                  <div className="font-bold text-lg" style={{ color: '#388bff' }}>{a.title}</div>
                  <div>{a.description}</div>
                  {a.type === 'theory' && a.pdfUrl && (
                    <a href={`http://localhost:3000${a.pdfUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#388bff' }}>
                      View PDF
                    </a>
                  )}
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAssignmentSubmit(a._id, a.type);
                    }}
                    className="flex flex-col gap-2 mt-2"
                  >
                    {a.type === 'theory' && (
                      <>
                        <textarea
                          placeholder="Your answer (optional)"
                          value={submissionForm[a._id]?.answerText || ''}
                          onChange={e => handleSubmissionFormChange(a._id, 'answerText', e.target.value)}
                          className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                          style={{ color: '#fff', backgroundColor: '#23293b' }}
                        />
                        <input
                          type="file"
                          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={e => handleSubmissionFormChange(a._id, 'file', e.target.files?.[0] || null)}
                          className="rounded-md border px-3 py-2"
                          style={{ color: '#fff', backgroundColor: '#23293b' }}
                        />
                      </>
                    )}
                    {a.type === 'coding' && (
                      <textarea
                        placeholder="Paste your code here"
                        value={submissionForm[a._id]?.answerText || ''}
                        onChange={e => handleSubmissionFormChange(a._id, 'answerText', e.target.value)}
                        className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                        style={{ color: '#fff', backgroundColor: '#23293b' }}
                        required
                      />
                    )}
                    {submissionError && submittingAssignmentId === a._id && <div className="text-red-500">{submissionError}</div>}
                    {submissionMsg && submittingAssignmentId === a._id && <div className="text-green-500">{submissionMsg}</div>}
                    <button type="submit" className="mt-2 px-6 py-2 rounded font-semibold shadow" style={{ backgroundColor: '#388bff', color: '#fff' }} disabled={submittingAssignmentId === a._id}>
                      {submittingAssignmentId === a._id ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}
        {active === "Live Class Links" ? (
          <div>
            {liveLoading && <div>Loading...</div>}
            {liveError && <div className="text-red-500">{liveError}</div>}
            {liveLinks.length === 0 && !liveLoading ? <div>No live class links.</div> : null}
            <ul className="space-y-2 mt-4">
              {liveLinks.map((link) => (
                <li key={link._id} className="p-2 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
                  <span className="font-semibold">{link.title}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Join</a>
                </li>
              ))}
            </ul>
          </div>
        ) : active === "Notifications" ? (
          <div>
            {notifLoading && <div>Loading...</div>}
            {notifError && <div className="text-red-500">{notifError}</div>}
            {notifications.length === 0 && !notifLoading ? <div>No notifications.</div> : null}
            <ul className="space-y-2 mt-4">
              {notifications.map((n) => (
                <li key={n._id} className="p-2 bg-white dark:bg-gray-800 rounded shadow flex justify-between">
                  <span>{n.message}</span>
                  <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : active === "Certificates" ? (
          <div>
            {certLoading && <div>Loading...</div>}
            {certError && <div className="text-red-500">{certError}</div>}
            {certificates.length === 0 && !certLoading ? <div>No certificates yet.</div> : null}
            <ul className="space-y-2 mt-4">
              {certificates.map((c) => (
                <li key={c._id} className="p-2 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center">
                  <span>{c.courseName}</span>
                  <span>{new Date(c.date).toLocaleDateString()}</span>
                  <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                </li>
              ))}
            </ul>
          </div>
        ) : active === "Playground" ? (
          <div>
            {logLoading && <div>Loading...</div>}
            {logError && <div className="text-red-500">{logError}</div>}
            {logs.length === 0 && !logLoading ? <div>No playground logs yet.</div> : null}
            <ul className="space-y-2 mt-4">
              {logs.map((log) => (
                <li key={log._id} className="p-2 rounded shadow flex flex-col mb-2" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                  <span className="font-semibold" style={{ color: '#388bff' }}>{log.language}</span>
                  <span className="text-xs" style={{ color: '#b0c4de' }}>{new Date(log.createdAt).toLocaleString()}</span>
                  <pre className="p-2 rounded mt-1 overflow-x-auto" style={{ backgroundColor: '#1a1e2a', color: '#fff' }}><code>{log.code}</code></pre>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-lg shadow p-6 min-h-[300px] flex items-center justify-center text-lg" style={{ backgroundColor: '#23293b', color: '#fff' }}>
            {["Course Content", "Attendance", "Live Class Links", "Assignments", "Playground", "Notifications", "Certificates"].includes(active) ? null : `[${active} module coming soon...]`}
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentDashboard 