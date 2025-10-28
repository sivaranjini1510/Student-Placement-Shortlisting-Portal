import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const StudentLayout = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Student Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/student/dashboard" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
            📊 Dashboard
          </Link>
          <Link to="/student/profile" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
            👤 Profile
          </Link>
          <Link to="/student/placement" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
            💼 Placement Status
          </Link>
          <Link to="/student/feedback" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
            💬 Submit Feedback
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-left hover:bg-blue-700 px-3 py-2 rounded">
            🚪 Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50"><Outlet /></main>
    </div>
  );
};

export default StudentLayout;
