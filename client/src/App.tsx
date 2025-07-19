import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import StudentDashboard from "./pages/StudentDashboard"
import AdminDashboard from "./pages/AdminDashboard"

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/editor/:roomId" element={<EditorPage />} />
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Router>
            <Toast />
        </>
    )
}

export default App
