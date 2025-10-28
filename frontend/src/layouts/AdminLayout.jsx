import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  const getPanelTitle = () => {
    if (isAdmin) return 'Admin Panel';
    if (isStaff) return 'Staff Panel';
    return 'Panel';
  };

  const getBasePath = () => {
    if (isAdmin) return '/admin';
    if (isStaff) return '/staff';
    return '/';
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">{getPanelTitle()}</h2>
        <nav className="flex flex-col gap-2">
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
                📊 Dashboard
              </Link>
              <Link to="/admin/register" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
                👤 Register Users
              </Link>
              <Link to="/admin/staff" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
                👨‍🏫 All Staff
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to={`${getBasePath()}/students`} className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
              🎓 All Students
            </Link>
          )}
          <Link to={`${getBasePath()}/placed-students`} className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
            ✅ Placed Students
          </Link>
          <Link to={`${getBasePath()}/not-placed-students`} className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
            ❌ Not Placed Students
          </Link>
          {isStaff && (
            <>
              <Link to={`${getBasePath()}/company`} className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
                🏢 Company Criteria
              </Link>
              <Link to={`${getBasePath()}/feedbacks`} className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
                💬 Feedbacks
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin/feedbacks" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded">
              💬 Feedbacks
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-left hover:bg-blue-700 px-3 py-2 rounded">
            🚪 Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
