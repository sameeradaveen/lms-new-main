import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchCourses } from "@/api/courseApi"
import { checkInAttendance, fetchAttendanceByUser } from "@/api/attendanceApi"
import { fetchAssignments, submitAssignment } from "@/api/assignmentApi"
import { fetchLiveLinks } from "@/api/liveClassApi"
import { fetchNotifications, fetchUnreadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/api/notificationApi"
import { fetchCertificates } from "@/api/certificateApi"
import { fetchPlaygroundLogs } from "@/api/playgroundLogApi"
import CodePlayground from "@/components/CodePlayground"

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
  const [attSuccess, setAttSuccess] = useState("")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Debug: Log user information
  useEffect(() => {
    console.log("Current user object:", user)
    if (!user || !user._id) {
      console.warn("User ID not found. User object:", user)
    }
  }, [user])

  // Check if user has already checked in today
  const hasCheckedInToday = () => {
    if (!attendance || attendance.length === 0) return false;
    const today = new Date().toISOString().slice(0, 10);
    return attendance.some(record => {
      const recordDate = new Date(record.date).toISOString().slice(0, 10);
      return recordDate === today && record.checkedIn;
    });
  };

  // Get today's attendance record
  const getTodayAttendance = () => {
    if (!attendance || attendance.length === 0) return null;
    const today = new Date().toISOString().slice(0, 10);
    return attendance.find(record => {
      const recordDate = new Date(record.date).toISOString().slice(0, 10);
      return recordDate === today && record.checkedIn;
    });
  };

  const todayRecord = getTodayAttendance();

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
  const [unreadCount, setUnreadCount] = useState(0)
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
      if (!user || !user._id) {
        setAttError("User not found. Please log in again.")
        return
      }
      
      setAttLoading(true)
      setAttError("")
      fetchAttendanceByUser(user._id)
        .then(setAttendance)
        .catch(err => setAttError(err.message))
        .finally(() => setAttLoading(false))
    }
  }, [active, user._id])

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
      if (!user || !user._id) {
        setNotifError("User not found. Please log in again.")
        return
      }
      
      setNotifLoading(true)
      setNotifError("")
      
      Promise.all([
        fetchNotifications(user._id),
        fetchUnreadNotifications(user._id)
      ])
        .then(([allNotifications, unreadNotifications]) => {
          setNotifications(allNotifications)
          setUnreadCount(unreadNotifications.length)
        })
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
    if (!user || !user._id) {
      setAttError("User not found. Please log in again.")
      return
    }
    
    if (hasCheckedInToday()) {
      setAttError("You have already checked in today!")
      return
    }
    
    setAttLoading(true)
    setAttError("")
    setAttSuccess("")
    
    try {
      await checkInAttendance(user._id, new Date().toISOString().slice(0, 10), new Date().toLocaleTimeString())
      setAttSuccess("Attendance recorded successfully!")
      // Refresh attendance data
      const updated = await fetchAttendanceByUser(user._id)
      setAttendance(updated)
    } catch (err: any) {
      setAttError(err.message)
    } finally {
      setAttLoading(false)
    }
  }

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update the notification in the list
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user || !user._id) return;
    
    try {
      await markAllNotificationsAsRead(user._id);
      // Update all notifications to read
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleCodeSubmit = (code: string, language: string, output: string) => {
    // This will be used when submitting code from playground to assignments
    console.log('Code submitted from playground:', { code, language, output });
    // You can implement assignment submission logic here
  };

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
            <div className="mb-6 p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
              <h4 className="text-lg font-bold mb-4" style={{ color: '#388bff' }}>Daily Check-in</h4>
              <p className="mb-4 text-sm" style={{ color: '#b0c4de' }}>
                Click the button below to mark your attendance for today. 
                <strong> Only one check-in per day is allowed.</strong> 
                If you've already checked in today, the button will be disabled.
              </p>
              
              {/* Debug: Show user info */}
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#1a1e2a', color: '#b0c4de' }}>
                <p className="text-sm"><strong>User ID:</strong> {user._id || 'Not found'}</p>
                <p className="text-sm"><strong>Username:</strong> {user.username || 'Not found'}</p>
                <p className="text-sm"><strong>Role:</strong> {user.role || 'Not found'}</p>
                <p className="text-sm">
                  <strong>Today's Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${hasCheckedInToday() ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {hasCheckedInToday() 
                      ? `✅ Checked In at ${todayRecord?.time || 'N/A'}` 
                      : '⏰ Not Checked In'
                    }
                  </span>
                </p>
              </div>
              
              <button
                onClick={handleCheckIn}
                className="px-6 py-3 rounded font-semibold shadow text-lg" 
                style={{ backgroundColor: '#388bff', color: '#fff' }}
                disabled={!user._id || hasCheckedInToday()}
              >
                {!user._id ? 'Please log in again' : hasCheckedInToday() ? 'Already checked in today' : 'Check In Today'}
              </button>
            </div>

            <h4 className="text-lg font-bold mb-4" style={{ color: '#388bff' }}>Attendance History</h4>
            {attLoading && <div>Loading attendance records...</div>}
            {attError && <div className="text-red-500">{attError}</div>}
            {attSuccess && <div className="text-green-500">{attSuccess}</div>}
            {!attLoading && !attError && attendance.length === 0 && (
              <div className="text-center py-8" style={{ color: '#b0c4de' }}>
                No attendance records found. Check in to start tracking your attendance!
              </div>
            )}
            {!attLoading && !attError && attendance.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
                  <thead>
                    <tr style={{ backgroundColor: '#1a1e2a', color: '#388bff' }}>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Time</th>
                      <th className="py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((rec) => (
                      <tr key={rec._id} style={{ backgroundColor: '#23293b', color: '#fff' }}>
                        <td className="py-2 px-4">{new Date(rec.date).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{rec.time || 'N/A'}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${rec.checkedIn ? 'bg-green-600' : 'bg-red-600'}`}>
                            {rec.checkedIn ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
            <h4 className="text-lg font-bold mb-4" style={{ color: '#388bff' }}>Live Class Links</h4>
            {liveLoading && <div>Loading live class links...</div>}
            {liveError && <div className="text-red-500">{liveError}</div>}
            {!liveLoading && !liveError && liveLinks.length === 0 && (
              <div className="text-center py-8" style={{ color: '#b0c4de' }}>
                No live class links available at the moment.
              </div>
            )}
            {!liveLoading && !liveError && liveLinks.length > 0 && (
              <div className="grid gap-4">
                {liveLinks.map((link) => (
                  <div key={link._id} className="p-4 rounded shadow" style={{ backgroundColor: '#23293b', color: '#fff' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold" style={{ color: '#388bff' }}>{link.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${link.active ? 'bg-green-600' : 'bg-red-600'}`}>
                          {link.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: '#b0c4de' }}>
                          {link.platform === 'Google Meet' && '🔵 Google Meet'}
                          {link.platform === 'Zoom' && '🔴 Zoom'}
                          {link.platform === 'Microsoft Teams' && '🟣 Teams'}
                          {link.platform === 'Other' && '⚪ Other'}
                        </span>
                      </div>
                    </div>
                    
                    {link.description && (
                      <p className="mb-2 text-sm" style={{ color: '#b0c4de' }}>{link.description}</p>
                    )}
                    
                    {link.scheduledDate && (
                      <p className="mb-2 text-sm" style={{ color: '#b0c4de' }}>
                        📅 Scheduled: {new Date(link.scheduledDate).toLocaleDateString()} 
                        {link.scheduledTime && ` at ${link.scheduledTime}`}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-2 rounded font-semibold shadow inline-flex items-center gap-2" 
                        style={{ backgroundColor: '#388bff', color: '#fff' }}
                      >
                        🎥 Join Meeting
                      </a>
                      <span className="text-xs" style={{ color: '#b0c4de' }}>
                        Created by: {link.createdBy?.username || 'Admin'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : active === "Notifications" ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: '#388bff' }}>Notifications</h4>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#b0c4de' }}>
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </span>
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="px-3 py-1 rounded text-sm" 
                    style={{ backgroundColor: '#388bff', color: '#fff' }}
                  >
                    Mark All as Read
                  </button>
                </div>
              )}
            </div>
            
            {notifLoading && <div>Loading notifications...</div>}
            {notifError && <div className="text-red-500">{notifError}</div>}
            {!notifLoading && !notifError && notifications.length === 0 && (
              <div className="text-center py-8" style={{ color: '#b0c4de' }}>
                No notifications available.
              </div>
            )}
            {!notifLoading && !notifError && notifications.length > 0 && (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`p-4 rounded shadow border-l-4 ${
                      !notification.isRead ? 'border-l-blue-500' : 'border-l-gray-500'
                    }`} 
                    style={{ 
                      backgroundColor: notification.isRead ? '#1a1e2a' : '#23293b', 
                      color: '#fff' 
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-semibold ${!notification.isRead ? 'font-bold' : ''}`} style={{ color: '#388bff' }}>
                          {notification.title}
                        </span>
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
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      {!notification.isRead && (
                        <button 
                          onClick={() => handleMarkNotificationAsRead(notification._id)}
                          className="px-2 py-1 rounded text-xs" 
                          style={{ backgroundColor: '#388bff', color: '#fff' }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                    
                    <p className="mb-2">{notification.message}</p>
                    
                    <div className="text-sm" style={{ color: '#b0c4de' }}>
                      <p>From: {notification.createdBy?.username || 'Admin'}</p>
                      <p>Time: {new Date(notification.createdAt).toLocaleString()}</p>
                      {notification.scheduledFor && (
                        <p>Scheduled: {new Date(notification.scheduledFor).toLocaleString()}</p>
                      )}
                      {notification.expiresAt && (
                        <p>Expires: {new Date(notification.expiresAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <div className="h-full">
            {!user || !user._id ? (
              <div className="text-red-500">User not found. Please log in again.</div>
            ) : (
              <CodePlayground 
                userId={user._id}
                onCodeSubmit={handleCodeSubmit}
              />
            )}
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