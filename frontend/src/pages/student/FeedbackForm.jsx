import React, { useState, useEffect } from 'react';
import feedbackService from '../../services/feedbackService';
import studentService from '../../services/studentService';

const FeedbackForm = () => {
  const [form, setForm] = useState({
    companyName: '',
    package: '',
    role: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [editingFeedback, setEditingFeedback] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await studentService.getProfile();
        setCanSubmit(profileData.placementStatus === 'Placed');

        if (profileData.placementStatus === 'Placed') {
          const feedbackData = await feedbackService.getStudentFeedback();
          setFeedbacks(feedbackData.feedbacks || []);
          // Hide form if feedback already submitted
          setShowForm(feedbackData.feedbacks.length === 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setError('Please select a PDF file only');
      return;
    }
    setForm({ ...form, file });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.package || !form.role || !form.file) {
      setError('Please fill all fields and select a PDF file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== '') {
          data.append(key, val);
        }
      });

      await feedbackService.uploadFeedback(data);

      // Refresh feedbacks list
      const feedbackData = await feedbackService.getStudentFeedback();
      setFeedbacks(feedbackData.feedbacks || []);

      setForm({
        companyName: '',
        package: '',
        role: '',
        file: null,
      });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setForm({
      companyName: feedback.companyName,
      package: feedback.ctc,
      role: feedback.jobRole,
      file: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackService.deleteFeedback(id);
        const feedbackData = await feedbackService.getStudentFeedback();
        setFeedbacks(feedbackData.feedbacks || []);
      } catch (error) {
        console.error('Error deleting feedback:', error);
        setError('Failed to delete feedback. Please try again.');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.package || !form.role) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== '') {
          data.append(key, val);
        }
      });

      await feedbackService.updateFeedback(editingFeedback._id, data);

      // Refresh feedbacks list
      const feedbackData = await feedbackService.getStudentFeedback();
      setFeedbacks(feedbackData.feedbacks || []);

      setForm({
        companyName: '',
        package: '',
        role: '',
        file: null,
      });
      setEditingFeedback(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating feedback:', error);
      setError(error.response?.data?.message || 'Failed to update feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  if (!canSubmit) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
          <p className="text-yellow-700 mb-4">
            Only students who have been placed can submit feedback.
            Please contact your placement coordinator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Feedback Management</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Feedbacks List */}
        {feedbacks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Your Submitted Feedbacks</h3>
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{feedback.companyName}</h4>
                      <p className="text-gray-600">{feedback.jobRole} - ₹{feedback.ctc} LPA</p>

                      <p className="text-sm text-gray-500">Status: {feedback.status}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(feedback)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* Form */}
        {showForm && (
          <form onSubmit={editingFeedback ? handleUpdate : handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package (LPA) *
                </label>
                <input
                  type="number"
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  placeholder="e.g., 6.5"
                  step="0.1"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Position *
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Document (PDF) *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition duration-200">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload feedback PDF</span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFile}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  {form.file && (
                    <p className="text-sm text-green-600 font-medium">
                      Selected: {form.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingFeedback(null);
                  setForm({
                    companyName: '',
                    package: '',
                    role: '',
                    file: null,
                  });
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingFeedback ? 'Updating...' : 'Submitting...'}
                  </div>
                ) : (
                  editingFeedback ? 'Update Feedback' : 'Submit Feedback'
                )}
              </button>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
