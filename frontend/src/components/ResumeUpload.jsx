import React from 'react';

const ResumeUpload = ({ onUpload }) => (
  <div className="mt-4">
    <label className="block mb-2">Upload Resume (PDF/DOC)</label>
    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => onUpload(e.target.files[0])} className="border p-2" />
  </div>
);

export default ResumeUpload;
