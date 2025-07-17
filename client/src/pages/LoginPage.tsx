import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "@/api/authApi"

const LoginPage = () => {
    const [role, setRole] = useState("student")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const { token, user } = await login(username, password)
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            if (user.role === "admin") {
                navigate("/admin")
            } else {
                navigate("/student")
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="w-full max-w-md bg-[#23293b] rounded-lg shadow-md p-8 border border-[#388bff]/20">
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#388bff' }}>Login to NextGenFreeEdu</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex justify-center gap-4 mb-2">
                        <button type="button" className={`px-4 py-2 rounded ${role === "student" ? "font-bold" : ""}`} style={role === "student" ? { backgroundColor: '#388bff', color: '#fff' } : { backgroundColor: '#23293b', color: '#fff', border: '1px solid #388bff55' }} onClick={() => setRole("student")}>Student</button>
                        <button type="button" className={`px-4 py-2 rounded ${role === "admin" ? "font-bold" : ""}`} style={role === "admin" ? { backgroundColor: '#388bff', color: '#fff' } : { backgroundColor: '#23293b', color: '#fff', border: '1px solid #388bff55' }} onClick={() => setRole("admin")}>Admin</button>
                    </div>
                    <div className="text-xs text-center mb-2" style={{ color: '#388bffbb' }}>Role selection is for navigation only. Your actual access is determined by your credentials.</div>
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                        style={{ color: '#fff', backgroundColor: '#23293b' }}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="rounded-md border px-3 py-2 focus:outline-none bg-background text-white border-[#388bff55]"
                        style={{ color: '#fff', backgroundColor: '#23293b' }}
                        required
                    />
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <button type="submit" className="mt-4 w-full rounded-md text-lg font-semibold shadow-lg transition" style={{ backgroundColor: '#388bff', color: '#fff' }} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage 