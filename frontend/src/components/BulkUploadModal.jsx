import React, { useState } from 'react';
import Modal from './Modal';

const BulkUploadModal = ({ isOpen, onClose, uploadType, onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a valid CSV or Excel file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await onUpload(formData);
      setResults(response);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadSample = () => {
    const headers = uploadType === 'student'
      ? ['Name', 'College mail', 'Date of Birth', 'Degree', 'Department', 'Gender', 'Tutor name', 'Student contact', 'Personal mail']
      : ['Name', 'College mail', 'Date of Birth', 'Department', 'Contact Number', 'Designation'];

    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${uploadType}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setResults(null);
    setError(null);
    setUploading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Bulk Upload ${uploadType === 'student' ? 'Students' : 'Staff'}`}>
      <div className="p-6">
        {!results && !error && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Upload a CSV or Excel file containing {uploadType} data. Make sure the file follows the correct format.
              </p>
              <button
                onClick={downloadSample}
                className="text-blue-500 hover:text-blue-700 text-sm underline"
              >
                Download sample CSV template
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select File</label>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
                disabled={uploading}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            <button
              onClick={resetModal}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {results && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Upload Results</h3>
            <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-2">
              <p><strong>Successful:</strong> {results.successful} records</p>
            </div>
            {results.failed > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-2">
                <p><strong>Failed:</strong> {results.failed} records</p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">View errors</summary>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {results.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BulkUploadModal;
