import React from "react";
import { useNavigate } from "react-router-dom"
import logo from "@/assets/logo.svg"

function HomePage() {
    const navigate = useNavigate()
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background">
            <h1
                className="text-4xl font-bold text-center mb-2"
                style={{ color: '#388bff' }}
            >
                Welcome to NextGenFreeEdu LMS
            </h1>
            <p className="text-center max-w-xl text-lg text-white mb-4">
                Free Full Stack & Cybersecurity Learning Portal. Use the navigation bar above to access your courses, assignments, playground, and more.
            </p>
            <button
                className="mt-6 px-8 py-3 rounded-md text-lg font-semibold shadow-lg transition"
                style={{ backgroundColor: '#388bff', color: '#fff' }}
                onClick={() => navigate('/login')}
            >
                Login
            </button>
        </div>
    )
}

export default HomePage
