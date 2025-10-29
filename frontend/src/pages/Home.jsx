import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-2" style={{ backgroundImage: 'url(/nec.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/nec.jpeg)', filter: 'blur(1px)' }}></div>
      <div className="max-w-4xl w-full px-4 relative z-10">
        <div className="text-center mb-4">
          <div className="mb-1">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-1 tracking-tight">
            Student Placement Shortlisting Portal
          </h1>
          <p className="text-sm text-gray-600 mb-2 max-w-md mx-auto leading-relaxed">
            Your comprehensive gateway to career opportunities, streamlined placement management, and professional development at National Engineering College
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:bg-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Students</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create your profile, upload resume and track your placement journey with ease.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200 hover:bg-green-100 hover:shadow-lg transition-all duration-300">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Staff</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Set company criteria, shortlist candidates, manage feedback, and oversee the placement process.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 hover:bg-purple-100 hover:shadow-lg transition-all duration-300">
            <div className="text-purple-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Admins</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Register users, monitor statistics, manage the entire system, and ensure smooth operations.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-700 transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started - Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
