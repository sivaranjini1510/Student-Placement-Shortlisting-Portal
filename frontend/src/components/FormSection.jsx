import React, { useState, useEffect } from 'react';

const FormSection = ({ section, data }) => {
  const [numSemesters, setNumSemesters] = useState(5);
  const [semesterGPAs, setSemesterGPAs] = useState({});
  const [arrearsValue, setArrearsValue] = useState(data?.arrears ? (data.arrears.current > 0 ? 'Active Backlog' : data.arrears.history > 0 ? 'History of Arrears' : 'No Backlog') : '');

  useEffect(() => {
    const initial = {};
    for (let i = 1; i <= numSemesters; i++) {
      const existing = data?.semesterGPA?.find(g => g.semester === i)?.gpa;
      if (existing) initial[i] = parseFloat(existing);
    }
    setSemesterGPAs(initial);
  }, [data, numSemesters]);

  const calculateCGPA = () => {
    const values = Object.values(semesterGPAs).filter(v => v > 0);
    if (values.length === 0) return '';
    return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
  };

  const addSemester = () => {
    if (numSemesters < 8) {
      setNumSemesters(numSemesters + 1);
    }
  };

  const handleGPAChange = (sem, value) => {
    const newGPAs = { ...semesterGPAs, [sem]: parseFloat(value) || 0 };
    setSemesterGPAs(newGPAs);
  };

  switch (section) {
    case 'basic':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">1. Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="fullName" placeholder="Full Name *" className="border p-2" defaultValue={data?.fullName || ''} />
            <select name="degree" className="border p-2" defaultValue={data?.degree || ''}>
              <option value="">Select Degree</option><option>B.E.</option><option>B.Tech</option>
            </select>
            <select name="department" className="border p-2" defaultValue={data?.department || ''}>
              <option value="">Select Department</option><option>CSE</option><option>ECE</option><option>IT</option><option>AI&DS</option><option>MECH</option><option>CIVIL</option><option>EEE</option>
            </select>
            <select name="gender" className="border p-2" defaultValue={data?.gender || ''}>
              <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input name="tutorName" placeholder="Tutor Name *" className="border p-2" defaultValue={data?.tutorName || ''} />
            <input name="dob" type="date" placeholder="Date of Birth (DD/MM/YYYY) *" className="border p-2" defaultValue={data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : ''} />
            <input name="studentContact" type="tel" placeholder="Student Contact Number (10 digits) *" className="border p-2" defaultValue={data?.studentContact || ''} />
            <input name="collegeEmail" type="email" placeholder="College Email ID (@nec.edu.in) *" className="border p-2" defaultValue={data?.collegeEmail || ''} />
            <input name="personalEmail" type="email" placeholder="Personal Email ID *" className="border p-2" defaultValue={data?.personalEmail || ''} />
          </div>
        </div>
      );
    case 'sslc':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">2. SSLC (10th) Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="sslcPercentage" type="number" placeholder="Percentage *" className="border p-2" defaultValue={data?.sslc?.percentage || ''} />
            <input name="sslcSchoolName" placeholder="School Name *" className="border p-2" defaultValue={data?.sslc?.schoolName || ''} />
            <select name="sslcMedium" className="border p-2" defaultValue={data?.sslc?.medium || ''}><option value="">Medium of Study</option><option>Tamil</option><option>English</option></select>
            <select name="sslcBoard" className="border p-2" defaultValue={data?.sslc?.board || ''}><option value="">Board of Study</option><option>State</option><option>Matric</option><option>CBSE</option></select>
            <input name="sslcYear" type="number" placeholder="Year of Passing *" className="border p-2" defaultValue={data?.sslc?.yearOfPassing || ''} />
          </div>
        </div>
      );
    case 'hsc':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">3. HSC (12th) Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="hscPercentage" type="number" placeholder="Percentage *" className="border p-2" defaultValue={data?.hsc?.percentage || ''} />
            <input name="hscCutoff" type="number" step="0.01" placeholder="Cut-off Marks *" className="border p-2" defaultValue={data?.hsc?.cutoffMarks || ''} />
            <input name="hscYear" type="number" placeholder="Year of Passing *" className="border p-2" defaultValue={data?.hsc?.yearOfPassing || ''} />
            <input name="hscSchoolName" placeholder="School Name *" className="border p-2" defaultValue={data?.hsc?.schoolName || ''} />
            <select name="hscMedium" className="border p-2" defaultValue={data?.hsc?.medium || ''}><option value="">Medium of Study</option><option>Tamil</option><option>English</option></select>
            <select name="hscBoard" className="border p-2" defaultValue={data?.hsc?.board || ''}><option value="">Board of Study</option><option>State</option><option>Matric</option><option>CBSE</option></select>
          </div>
        </div>
      );
    case 'diploma':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">4. Diploma Details (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="diplomaPercentage" type="number" placeholder="Percentage" className="border p-2" defaultValue={data?.diploma?.percentage || ''} />
            <input name="diplomaYear" type="number" placeholder="Year of Passing" className="border p-2" defaultValue={data?.diploma?.yearOfPassing || ''} />
            <input name="diplomaCollegeName" placeholder="College Name" className="border p-2" defaultValue={data?.diploma?.collegeName || ''} />
            <select name="diplomaQuota" className="border p-2" defaultValue={data?.diploma?.quota || ''}><option value="">Quota of Admission</option><option>Government</option><option>Management</option></select>
          </div>
        </div>
      );
    case 'academic':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">5. Academic Records</h3>
          <div className="mb-4">
            <h4>Semester GPA</h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: numSemesters }, (_, i) => i + 1).map(sem => {
                const existingGPA = data?.semesterGPA?.find(g => g.semester === sem)?.gpa || '';
                return (
                  <input
                    key={sem}
                    name={`sem${sem}GPA`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder={`Sem ${sem} GPA`}
                    className="border p-2"
                    defaultValue={existingGPA}
                    onChange={(e) => handleGPAChange(sem, e.target.value)}
                  />
                );
              })}
            </div>
            {numSemesters < 8 && (
              <button type="button" onClick={addSemester} className="mt-2 text-blue-600 hover:text-blue-800">
                + Add New Semester GPA
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="cgpa" type="number" placeholder="CGPA" className="border p-2" value={calculateCGPA()} readOnly />
            <input name="degreeYearOfPassing" type="number" placeholder="Degree Year of Passing" className="border p-2" defaultValue={data?.degreeYearOfPassing || ''} />
          </div>
          <div className="mt-4">
            <h4>Arrears Details</h4>
            <select name="arrears" className="border p-2 w-full" value={arrearsValue} onChange={(e) => setArrearsValue(e.target.value)}>
              <option value="">Select Arrears Details</option>
              <option value="No Backlog">No Backlog</option>
              <option value="Active Backlog">Active Backlog</option>
              <option value="History of Arrears">History of Arrears</option>
            </select>
          </div>
        </div>
      );
    case 'other':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">6. Other Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="keySkills" placeholder="Key Skills (comma-separated)" className="border p-2" defaultValue={data?.keySkills?.join(', ') || ''} />
            <input name="aadhaarNumber" placeholder="Aadhaar Number" className="border p-2" defaultValue={data?.aadhaarNumber || ''} />
            <input name="panNumber" placeholder="PAN Number" className="border p-2" defaultValue={data?.panNumber || ''} />
            <select name="bloodGroup" className="border p-2" defaultValue={data?.bloodGroup || ''}><option value="">Blood Group</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
            <select name="accommodation" className="border p-2" defaultValue={data?.accommodation || ''}><option value="">Hostel / Day Scholar</option><option>Hostel</option><option>Day Scholar</option></select>
          </div>
        </div>
      );
    case 'parent':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">7. Parent Details</h3>
          <div className="mb-4">
            <h4>Father</h4>
            <div className="grid grid-cols-2 gap-4">
              <input name="fatherName" placeholder="Name" className="border p-2" defaultValue={data?.father?.name || ''} />
              <input name="fatherOccupation" placeholder="Occupation" className="border p-2" defaultValue={data?.father?.occupation || ''} />
              <input name="fatherAnnualIncome" type="number" placeholder="Annual Income" className="border p-2" defaultValue={data?.father?.annualIncome || ''} />
              <input name="fatherContact" type="tel" placeholder="Contact Number (10 digits)" className="border p-2" defaultValue={data?.father?.contact || ''} />
            </div>
          </div>
          <div>
            <h4>Mother</h4>
            <div className="grid grid-cols-2 gap-4">
              <input name="motherName" placeholder="Name" className="border p-2" defaultValue={data?.mother?.name || ''} />
              <input name="motherOccupation" placeholder="Occupation" className="border p-2" defaultValue={data?.mother?.occupation || ''} />
              <input name="motherAnnualIncome" type="number" placeholder="Annual Income" className="border p-2" defaultValue={data?.mother?.annualIncome || ''} />
              <input name="motherContact" type="tel" placeholder="Contact Number (10 digits)" className="border p-2" defaultValue={data?.mother?.contact || ''} />
            </div>
          </div>
        </div>
      );
    case 'address':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">8. Address Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <textarea name="permanentAddress" placeholder="Permanent Address" className="border p-2 col-span-2" rows="3" defaultValue={data?.address?.permanentAddress || ''}></textarea>
            <input name="city" placeholder="City" className="border p-2" defaultValue={data?.address?.city || ''} />
            <input name="district" placeholder="District" className="border p-2" defaultValue={data?.address?.district || ''} />
            <input name="pincode" type="number" placeholder="Pincode" className="border p-2" defaultValue={data?.address?.pincode || ''} />
            <input name="state" placeholder="State" className="border p-2" defaultValue={data?.address?.state || ''} />
            <input name="nativePlace" placeholder="Native Place" className="border p-2 col-span-2" defaultValue={data?.address?.nativePlace || ''} />
          </div>
        </div>
      );
    case 'uploads':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">9. Additional Profile Uploads</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Profile Photo (JPEG/PNG)</label>
              <input name="profilePhoto" type="file" accept="image/*" className="border p-2" />
            </div>
            <div>
              <label>GitHub Profile Link</label>
              <input name="githubProfile" type="url" placeholder="https://github.com/username" className="border p-2" defaultValue={data?.githubProfile || ''} />
            </div>
            <div>
              <label>LinkedIn Profile Link</label>
              <input name="linkedinProfile" type="url" placeholder="https://linkedin.com/in/username" className="border p-2" defaultValue={data?.linkedinProfile || ''} />
            </div>
            <div>
              <label>Resume Upload (PDF/DOC)</label>
              <input name="resume" type="file" accept=".pdf,.doc,.docx" className="border p-2" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default FormSection;
