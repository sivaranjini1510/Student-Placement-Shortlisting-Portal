import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import feedbackService from '../../services/feedbackService';

const PlacementStatus = () => {
  const [profileData, setProfileData] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await studentService.getProfile();
        setProfileData(profile);

        if (profile.placementStatus === 'Placed') {
          const feedback = await feedbackService.getStudentFeedback();
          setFeedbackStatus(feedback);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading placement status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Placement Status</h1>
          <p className="text-blue-100 text-lg">Track your placement journey and academic progress.</p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Current Status</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placement Status:</label>
              <p className={`text-lg font-semibold ${
                profileData?.placementStatus === 'Placed' ? 'text-green-600' :
                profileData?.placementStatus === 'Not Placed' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {profileData?.placementStatus || 'Not Updated'}
              </p>
            </div>

            {profileData?.placementStatus === 'Placed' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placed Company:</label>
                  <p className="text-lg font-semibold text-gray-900">{profileData?.placedCompany || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placement Date:</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {profileData?.placementDate ? new Date(profileData.placementDate).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>



        {/* Status Messages */}
        {profileData?.placementStatus === 'Placed' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-800">Congratulations!</h3>
            </div>
            <p className="text-green-700 mb-6 text-lg">
              You have been successfully placed at <strong className="text-green-900">{profileData?.placedCompany}</strong>.
              {feedbackStatus?.feedbacks?.length > 0 ? (
                <span className="block mt-3 text-green-600 font-medium">
                  You have already submitted your placement feedback. Thank you for helping future students!
                </span>
              ) : (
                <span className="block mt-3">Please submit your placement feedback to help future students.</span>
              )}
            </p>
            <Link
              to="/student/feedback"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 shadow-md"
            >
              {feedbackStatus?.feedbacks?.length > 0 ? 'View Feedback' : 'Submit Feedback'}
            </Link>
          </div>
        )}

        {profileData?.placementStatus !== 'Placed' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-800">Keep Applying!</h3>
            </div>
            <p className="text-blue-700 mb-6 text-lg">
              Your placement status is currently "{profileData?.placementStatus || 'Not Updated'}".
              Continue updating your profile and applying for opportunities.
            </p>
            <Link
              to="/student/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition duration-200 shadow-md"
            >
              View Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementStatus;
