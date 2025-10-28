import React, { useState, useEffect } from 'react';
import FormSection from '../../components/FormSection';
import studentService from '../../services/studentService';

const ProfileForm = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentService.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If token is invalid or expired, redirect to login
        if (error.response && error.response.status === 401) {
          window.location.href = '/';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await studentService.updateProfile(formData);
      alert('Profile updated successfully!');
      // Refresh profile data after update
      const updatedData = await studentService.getProfile();
      setProfileData(updatedData);
      setEditMode(false); // Switch back to view mode
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please login again.');
        window.location.href = '/';
      } else {
        alert('Failed to update profile.');
      }
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading profile...</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Student Profile</h2>
        {!editMode && (
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <FormSection section="basic" data={profileData} />
          <FormSection section="sslc" data={profileData} />
          <FormSection section="hsc" data={profileData} />
          <FormSection section="diploma" data={profileData} />
          <FormSection section="academic" data={profileData} />
          <FormSection section="other" data={profileData} />
          <FormSection section="parent" data={profileData} />
          <FormSection section="address" data={profileData} />
          <FormSection section="uploads" data={profileData} />
          <div className="mt-6 flex gap-4">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Save Changes
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Section Navigation */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveSection('basic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'basic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👤 Basic Information
              </button>
              <button
                onClick={() => setActiveSection('sslc')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'sslc'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📚 SSLC (10th) Details
              </button>
              <button
                onClick={() => setActiveSection('hsc')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'hsc'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎓 HSC (12th) Details
              </button>
              <button
                onClick={() => setActiveSection('diploma')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'diploma'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎓 Diploma Details
              </button>
              <button
                onClick={() => setActiveSection('academic')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'academic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Academic Records
              </button>
              <button
                onClick={() => setActiveSection('other')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'other'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ℹ️ Other Details
              </button>
              <button
                onClick={() => setActiveSection('parent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'parent'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👨‍👩‍👧 Parent Details
              </button>
              <button
                onClick={() => setActiveSection('address')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'address'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏠 Address Details
              </button>
              <button
                onClick={() => setActiveSection('uploads')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'uploads'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📎 Additional Profile Uploads
              </button>
            </div>
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => {
                  const sections = ['basic', 'sslc', 'hsc', 'diploma', 'academic', 'other', 'parent', 'address', 'uploads'];
                  const currentIndex = sections.indexOf(activeSection);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
                  setActiveSection(sections[prevIndex]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Section {['basic', 'sslc', 'hsc', 'diploma', 'academic', 'other', 'parent', 'address', 'uploads'].indexOf(activeSection) + 1} of 9
              </span>
              <button
                onClick={() => {
                  const sections = ['basic', 'sslc', 'hsc', 'diploma', 'academic', 'other', 'parent', 'address', 'uploads'];
                  const currentIndex = sections.indexOf(activeSection);
                  const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
                  setActiveSection(sections[nextIndex]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
          {/* Conditional Rendering of Sections */}
          {activeSection === 'basic' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">👤 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Name:</strong> {profileData?.fullName || '-'}</div>
                <div><strong>Degree:</strong> {profileData?.degree || '-'}</div>
                <div><strong>Department:</strong> {profileData?.department || '-'}</div>
                <div><strong>Gender:</strong> {profileData?.gender || '-'}</div>
                <div><strong>City:</strong> {profileData?.address?.city || '-'}</div>
                <div><strong>Date of Birth:</strong> {profileData?.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : '-'}</div>
                <div><strong>Phone:</strong> {profileData?.studentContact || '-'}</div>
                <div><strong>College Email:</strong> {profileData?.collegeEmail || '-'}</div>
                <div><strong>Personal Email:</strong> {profileData?.personalEmail || '-'}</div>
                <div><strong>Tutor Name:</strong> {profileData?.tutorName || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'sslc' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">📚 SSLC (10th) Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>School Name:</strong> {profileData?.sslc?.schoolName || '-'}</div>
                <div><strong>Board:</strong> {profileData?.sslc?.board || '-'}</div>
                <div><strong>Year of Passing:</strong> {profileData?.sslc?.yearOfPassing || '-'}</div>
                <div><strong>Percentage:</strong> {profileData?.sslc?.percentage || '-'}</div>
                <div><strong>Medium:</strong> {profileData?.sslc?.medium || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'hsc' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">🎓 HSC (12th) Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>School Name:</strong> {profileData?.hsc?.schoolName || '-'}</div>
                <div><strong>Board:</strong> {profileData?.hsc?.board || '-'}</div>
                <div><strong>Year of Passing:</strong> {profileData?.hsc?.yearOfPassing || '-'}</div>
                <div><strong>Percentage:</strong> {profileData?.hsc?.percentage || '-'}</div>
                <div><strong>Cut-off Marks:</strong> {profileData?.hsc?.cutoffMarks || '-'}</div>
                <div><strong>Medium:</strong> {profileData?.hsc?.medium || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'diploma' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">🎓 Diploma Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>College Name:</strong> {profileData?.diploma?.collegeName || '-'}</div>
                <div><strong>Quota:</strong> {profileData?.diploma?.quota || '-'}</div>
                <div><strong>Year of Passing:</strong> {profileData?.diploma?.yearOfPassing || '-'}</div>
                <div><strong>Percentage:</strong> {profileData?.diploma?.percentage || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'academic' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">📊 Academic Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>CGPA:</strong> {profileData?.cgpa || '-'}</div>
                <div><strong>Arrears Details:</strong> {typeof profileData?.arrears === 'object' ? (profileData?.arrears?.current > 0 ? 'Active Backlog' : profileData?.arrears?.history > 0 ? 'History of Arrears' : 'No Backlog') : profileData?.arrears || '-'}</div>
                <div><strong>Placement Status:</strong> {profileData?.placementStatus || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'other' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">ℹ️ Other Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Blood Group:</strong> {profileData?.bloodGroup || '-'}</div>
                <div><strong>Aadhaar Number:</strong> {profileData?.aadhaarNumber || '-'}</div>
                <div><strong>PAN Number:</strong> {profileData?.panNumber || '-'}</div>
                <div><strong>Accommodation:</strong> {profileData?.accommodation || '-'}</div>
                <div><strong>Key Skills:</strong> {profileData?.keySkills?.join(', ') || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'parent' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">👨‍👩‍👧 Parent Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Father's Name:</strong> {profileData?.father?.name || '-'}</div>
                <div><strong>Father's Occupation:</strong> {profileData?.father?.occupation || '-'}</div>
                <div><strong>Father's Phone:</strong> {profileData?.father?.contactNumber || '-'}</div>
                <div><strong>Mother's Name:</strong> {profileData?.mother?.name || '-'}</div>
                <div><strong>Mother's Occupation:</strong> {profileData?.mother?.occupation || '-'}</div>
                <div><strong>Mother's Phone:</strong> {profileData?.mother?.contactNumber || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'address' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">🏠 Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Permanent Address:</strong> {profileData?.address?.permanentAddress || '-'}</div>
                <div><strong>City:</strong> {profileData?.address?.city || '-'}</div>
                <div><strong>District:</strong> {profileData?.address?.district || '-'}</div>
                <div><strong>State:</strong> {profileData?.address?.state || '-'}</div>
                <div><strong>Pincode:</strong> {profileData?.address?.pincode || '-'}</div>
                <div><strong>Native Place:</strong> {profileData?.address?.nativePlace || '-'}</div>
              </div>
            </div>
          )}
          {activeSection === 'uploads' && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">📎 Additional Profile Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Photo:</strong>
                  {profileData?.profilePhoto ? (
                    <div className="mt-2">
                      <a href={`http://localhost:5001/${profileData.profilePhoto}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">View Photo</a>
                    </div>
                  ) : '-'}
                </div>
                <div>
                  <strong>Resume:</strong>
                  {profileData?.resume ? (
                    <div className="mt-2">
                      <a href={`http://localhost:5001/${profileData.resume}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">View Resume</a>
                    </div>
                  ) : '-'}
                </div>
                <div>
                  <strong>GitHub Profile:</strong>
                  {profileData?.githubProfile ? (
                    <div className="mt-2">
                      <a href={profileData.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{profileData.githubProfile}</a>
                    </div>
                  ) : '-'}
                </div>
                <div>
                  <strong>LinkedIn Profile:</strong>
                  {profileData?.linkedinProfile ? (
                    <div className="mt-2">
                      <a href={profileData.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{profileData.linkedinProfile}</a>
                    </div>
                  ) : '-'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
