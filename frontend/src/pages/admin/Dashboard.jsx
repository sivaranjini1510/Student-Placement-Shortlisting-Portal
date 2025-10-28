import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const handleExportResumes = async () => {
  try {
    const blob = await adminService.exportStudentResumes();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_resumes_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting resumes:', error);
    alert('Failed to export resumes. Please try again.');
  }
};

const Dashboard = () => {
  const [status, setStatus] = useState({
    totalStudents: 0,
    totalStaff: 0,
    placedStudents: 0,
    notPlacedStudents: 0,
    totalCompanies: 0,
    totalFeedbacks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getDashboardStats();
        setStatus({
          totalStudents: data.totalStudents || 0,
          totalStaff: data.totalStaff || 0,
          placedStudents: data.placedStudents || 0,
          notPlacedStudents: data.notPlacedStudents || 0,
          totalCompanies: data.totalCompanies || 0,
          totalFeedbacks: data.totalFeedbacks || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refreshStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStatus({
        totalStudents: data.totalStudents || 0,
        totalStaff: data.totalStaff || 0,
        placedStudents: data.placedStudents || 0,
        notPlacedStudents: data.notPlacedStudents || 0,
        totalCompanies: data.totalCompanies || 0,
        totalFeedbacks: data.totalFeedbacks || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={refreshStats}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <Link to="/admin/register?role=student" className="bg-blue-500 text-white p-4 rounded shadow text-center hover:bg-blue-600">
          Add Student
        </Link>
        <Link to="/admin/register?role=staff" className="bg-green-500 text-white p-4 rounded shadow text-center hover:bg-green-600">
          Add Staff
        </Link>
        <Link to="/admin/students" className="bg-purple-500 text-white p-4 rounded shadow text-center hover:bg-purple-600">
          View Students
        </Link>
        <Link to="/admin/staff" className="bg-orange-500 text-white p-4 rounded shadow text-center hover:bg-orange-600">
          View Staff
        </Link>
        <Link to="/admin/feedbacks" className="bg-red-500 text-white p-4 rounded shadow text-center hover:bg-red-600">
          View Feedbacks
        </Link>
        <button
          onClick={handleExportResumes}
          className="bg-indigo-500 text-white p-4 rounded shadow text-center hover:bg-indigo-600"
        >
          Export Resumes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-3xl">{loading ? '...' : status.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Staff</h2>
          <p className="text-3xl">{loading ? '...' : status.totalStaff}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Placed Students</h2>
          <p className="text-3xl">{loading ? '...' : status.placedStudents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Not Placed Students</h2>
          <p className="text-3xl">{loading ? '...' : status.notPlacedStudents}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Companies</h2>
          <p className="text-3xl">{loading ? '...' : status.totalCompanies}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Feedbacks</h2>
          <p className="text-3xl">{loading ? '...' : status.totalFeedbacks}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
