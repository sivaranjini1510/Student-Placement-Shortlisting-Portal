import React, { useState } from 'react';
import SimpleLayout from '../../layouts/SimpleLayout';
import studentService from '../../services/studentService';
import GPAInput from '../../components/GPAInput';
import ResumeUpload from '../../components/ResumeUpload';

const EditGPAResume = () => {
  const [gpas, setGpas] = useState([0, 0, 0, 0, 0]);
  const [cgpa, setCgpa] = useState(0);
  const [resume, setResume] = useState(null);

  const handleGPAChange = (index, value) => {
    const updated = [...gpas];
    updated[index] = parseFloat(value);
    setGpas(updated);
    const total = updated.reduce((sum, gpa) => sum + gpa, 0);
    setCgpa((total / updated.length).toFixed(2));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('cgpa', cgpa);
    data.append('gpas', JSON.stringify(gpas));
    if (resume) data.append('resume', resume);
    await studentService.updateAcademic(data);
    alert('GPA and Resume updated');
  };

  return (
    <SimpleLayout>
      <h2 className="text-xl font-semibold mb-4">Edit GPA & Resume</h2>
      <GPAInput gpas={gpas} onChange={handleGPAChange} />
      <ResumeUpload onUpload={setResume} />
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded mt-4">Save Changes</button>
    </SimpleLayout>
  );
};

export default EditGPAResume;
