import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const StudentDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentService.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profileData) return 0;
    const fields = [profileData.resume, profileData.profilePhoto, profileData.profileCompleted];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-3 lg:px-4 py-3 sm:py-4">
        {/* Welcome Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg mb-2 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 tracking-tight leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{profileData?.fullName || 'Student'}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Your placement journey starts here. Keep your profile updated and stay ahead in the game.
          </p>
        </div>

        {/* Profile Status Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/95 w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 backdrop-blur-sm flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">Profile Status</h2>
                  <p className="text-blue-100 text-xs font-medium">Track your completion progress</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl sm:text-3xl font-bold text-white">{completionPercentage}%</div>
                <div className="text-blue-100 text-xs">Complete</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            {/* Progress Bar */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Overall Progress</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
              {/* Profile Completion */}
              <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-3 sm:mb-4 flex items-center justify-center shadow-md ${
                  profileData?.profileCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {profileData?.profileCompleted ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">Profile Information</p>
                  <p className="text-sm text-gray-600 mb-3">Complete your personal details</p>
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
                    profileData?.profileCompleted
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {profileData?.profileCompleted ? '✓ Complete' : '✗ Incomplete'}
                  </span>
                </div>
              </div>

              {/* Resume */}
              <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-3 sm:mb-4 flex items-center justify-center shadow-md ${
                  profileData?.resume
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {profileData?.resume ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">Resume Upload</p>
                  <p className="text-sm text-gray-600 mb-3">Upload your professional resume</p>
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
                    profileData?.resume
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {profileData?.resume ? '✓ Uploaded' : '✗ Not Uploaded'}
                  </span>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full mb-3 sm:mb-4 flex items-center justify-center shadow-md ${
                  profileData?.profilePhoto
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {profileData?.profilePhoto ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-base sm:text-lg mb-1">Profile Photo</p>
                  <p className="text-sm text-gray-600 mb-3">Upload a professional headshot</p>
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${
                    profileData?.profilePhoto
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {profileData?.profilePhoto ? '✓ Uploaded' : '✗ Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
