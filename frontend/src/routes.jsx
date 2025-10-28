import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './middleware/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import NotFound from './pages/NotFound';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import RegisterUser from './pages/admin/RegisterUser';
import ViewStudents from './pages/admin/ViewStudents';
import ViewStaff from './pages/admin/ViewStaff';
import PlacedStudents from './pages/admin/PlacedStudents';
import NotPlacedStudents from './pages/admin/NotPlacedStudents';
import Feedbacks from './pages/staff/Feedbacks';

import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import ProfileForm from './pages/student/ProfileForm';
import PlacementStatus from './pages/student/PlacementStatus';
import FeedbackForm from './pages/student/FeedbackForm';
import EditGPAResume from './pages/student/EditGPAResume';


import CompanyCriteriaForm from './pages/staff/CompanyCriteriaForm';
import ShortlistView from './pages/staff/ShortlistView';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/register" element={<RegisterUser />} />
          <Route path="/admin/students" element={<ViewStudents />} />
          <Route path="/admin/staff" element={<ViewStaff />} />
          <Route path="/admin/placed-students" element={<PlacedStudents />} />
          <Route path="/admin/not-placed-students" element={<NotPlacedStudents />} />
          <Route path="/admin/feedbacks" element={<Feedbacks />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<ProfileForm />} />
          <Route path="/student/placement" element={<PlacementStatus />} />
          <Route path="/student/feedback" element={<FeedbackForm />} />
          <Route path="/student/edit" element={<EditGPAResume />} />
        </Route>
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute role="staff" />}>
        <Route element={<AdminLayout />}>
          <Route path="/staff/company" element={<CompanyCriteriaForm />} />
          <Route path="/staff/feedbacks" element={<Feedbacks />} />
          <Route path="/staff/placed-students" element={<PlacedStudents />} />
          <Route path="/staff/not-placed-students" element={<NotPlacedStudents />} />
        </Route>
      </Route>

      <Route path="/logout" element={<Logout />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
