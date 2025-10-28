import React, { useState } from 'react';
import adminService from '../../services/adminService';
import { EMAIL_REGEX } from '../../config/constants';
import BulkUploadModal from '../../components/BulkUploadModal';

const RegisterUser = () => {
  const [form, setForm] = useState({
    role: '',
    fullName: '',
    username: '',
    dob: '',
    degree: '',
    department: '',
    gender: '',
    tutorName: '',
    studentContact: '',
    personalEmail: '',
    contactNumber: '',
    designation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [bulkUploadType, setBulkUploadType] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'role') {
      setBulkUploadType(e.target.value.toLowerCase());
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.role) {
      alert('Please select a role');
      setIsSubmitting(false);
      return;
    }
    if (!form.fullName || !form.username || !form.dob) {
      alert('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }
    if (!EMAIL_REGEX.test(form.username)) {
      alert('Invalid NEC email');
      setIsSubmitting(false);
      return;
    }

    if (form.role === 'student') {
      if (!form.degree || !form.department || !form.gender || !form.tutorName || !form.studentContact || !form.personalEmail) {
        alert('Please fill all student fields');
        setIsSubmitting(false);
        return;
      }
    } else if (form.role === 'staff') {
      if (!form.department || !form.contactNumber || !form.designation) {
        alert('Please fill all staff fields');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await adminService.registerUser({
        ...form,
        collegeEmail: form.username,
        dateOfBirth: form.dob
      });
      alert('User registered successfully');
      setForm({
        role: '',
        fullName: '',
        username: '',
        dob: '',
        degree: '',
        department: '',
        gender: '',
        tutorName: '',
        studentContact: '',
        personalEmail: '',
        contactNumber: '',
        designation: ''
      });
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpload = () => {
    setIsBulkUploadModalOpen(true);
  };

  const handleBulkUploadComplete = async (formData) => {
    try {
      const response = await adminService.bulkUpload(bulkUploadType, formData);
      alert(`Successfully uploaded ${response.successful} ${bulkUploadType}s. ${response.failed > 0 ? `Failed: ${response.failed}` : ''}`);
      setIsBulkUploadModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload file');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Register New User</h1>
          <p className="text-gray-600 mt-1">Add new students or staff members to the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection with Bulk Upload Button */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                  Role*
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              {form.role && (
                <button
                  type="button"
                  onClick={handleBulkUpload}
                  className="mt-7 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Bulk Upload {form.role === 'student' ? 'Students' : 'Staff'}
                </button>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NEC Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="name@nec.edu.in"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {form.role === 'student' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Degree</option>
                    <option value="B.E.">B.E.</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.E.">M.E.</option>
                    <option value="M.Tech">M.Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tutor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tutorName"
                    value={form.tutorName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="studentContact"
                    value={form.studentContact}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Personal Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={form.personalEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Staff Specific Fields */}
          {form.role === 'staff' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-4">Staff Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="Placement Cell">Placement Cell</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : 'Register User'}
            </button>
          </div>
        </form>

        {/* Bulk Upload Modal */}
        <BulkUploadModal
          isOpen={isBulkUploadModalOpen}
          onClose={() => setIsBulkUploadModalOpen(false)}
          onUpload={handleBulkUploadComplete}
          uploadType={bulkUploadType}
        />
      </div>
    </div>
  );
};

export default RegisterUser;
