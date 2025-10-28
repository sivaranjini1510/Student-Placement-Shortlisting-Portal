import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import staffService from '../../services/staffService';
import { useAuthContext } from '../../context/AuthContext';

const NotPlacedStudents = () => {
  const { user } = useAuthContext();
  const [students, setStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const departments = ['IT', 'CSE', 'AI&DS', 'Civil', 'Mech', 'ECE', 'EEE'];

  useEffect(() => {
    fetchStudents();
  }, [selectedDepartment]);

  const fetchStudents = async () => {
    try {
      if (user.role === 'staff') {
        // Use staff service for staff users
        const data = await staffService.getNotPlacedStudents(selectedDepartment);
        setStudents(data);
      } else {
        // Use admin service for admin users - always get not placed students
        const data = await adminService.getNotPlacedStudents(selectedDepartment);
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching not placed students:', error);
    }
  };

  const handleExportNotPlacedStudents = async () => {
    try {
      const blob = await adminService.exportNotPlacedStudentsList(selectedDepartment);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'not_placed_students_list.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting not placed students list:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Not Placed Students</h1>
            <div className="flex gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <button
                onClick={handleExportNotPlacedStudents}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium shadow-sm"
              >
                Export Not Placed Students List
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Department</th>
                  <th className="px-6 py-4 text-left font-semibold">Not Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-lg">
                      No not placed students yet
                    </td>
                  </tr>
                ) : (
                  students.map((s, index) => (
                    <tr key={s._id} className={`hover:bg-gray-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 text-gray-900 font-medium">{s.fullName}</td>
                      <td className="px-6 py-4 text-gray-700">{s.department}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Not Placed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotPlacedStudents;
