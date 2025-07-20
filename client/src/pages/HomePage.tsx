import { useNavigate } from "react-router-dom"
import nextgenfreeduLogo from "@/assets/nextgenfreedu-logo.jpg"

function HomePage() {
    const navigate = useNavigate()
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background">
            {/* NextGenFreedu Logo */}
            <div className="flex flex-col items-center mb-6">
                <div 
                    className="w-48 h-48 rounded-full shadow-lg mb-4 flex items-center justify-center overflow-hidden"
                    style={{ border: '3px solid #388bff', backgroundColor: 'white' }}
                >
                    <img 
                        src={nextgenfreeduLogo} 
                        alt="NextGenFreedu Logo" 
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.6)' }}
                    />
                </div>
            </div>
            
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
                className="mt-6 px-8 py-3 rounded-md text-lg font-semibold shadow-lg transition hover:bg-blue-600"
                style={{ backgroundColor: '#388bff', color: '#fff' }}
                onClick={() => navigate('/login')}
            >
                Login
            </button>
        </div>
    )
}

export default HomePage
