import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SimpleLayout from '../../layouts/SimpleLayout';
import staffService from '../../services/staffService';

const CompanyCriteriaForm = () => {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState({
    companyName: '',
    criteria: {
      minCGPA: '',
      allowedArrears: ['No Backlog', 'Active Backlog', 'History of Arrears'],
      minHSC: '',
      minSSLC: '',
      departments: [],
      yearOfPassing: '2027',
    },
  });
  const [shortlistedStudents, setShortlistedStudents] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'departmentWise'
  const [loading, setLoading] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState(companyId || null);

  useEffect(() => {
    const id = companyId || currentCompanyId;
    if (id) {
      loadCompany(id);
    }
  }, [companyId, currentCompanyId]);

  const loadCompany = async (id) => {
    try {
      const company = await staffService.getCompany(id);
      setCompanyData(company);
      setShortlistedStudents(company.shortlistedStudents || []);
    } catch (error) {
      console.error('Error loading company:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Map form data to backend format for company creation
      const companyPayload = {
        companyName: companyData.companyName,
        jobRole: companyData.companyName, // Use companyName as jobRole
        jobDescription: `Filtered for ${companyData.companyName}`,
        ctc: 0,
        location: 'TBD',
        criteria: {
          minCGPA: parseFloat(companyData.criteria.minCGPA) || 0,
          allowedArrears: companyData.criteria.allowedArrears,
          minHSC: parseFloat(companyData.criteria.minHSC) || 0,
          minSSLC: parseFloat(companyData.criteria.minSSLC) || 0,
          departments: companyData.criteria.departments,
          yearOfPassing: parseInt(companyData.criteria.yearOfPassing),
        },
        driveDate: new Date().toISOString(),
        registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        venue: 'TBD',
      };

      const result = await staffService.createCompany(companyPayload);
      setCurrentCompanyId(result.company._id);
      setShortlistedStudents(result.company.shortlistedStudents || []);
      alert(`Company created and ${result.eligibleCount} eligible students filtered and emailed.`);
    } catch (error) {
      alert('Error creating company and filtering students.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('criteria.')) {
      const field = name.split('.')[1];
      setCompanyData({
        ...companyData,
        criteria: { ...companyData.criteria, [field]: value }
      });
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const handleCriteriaCheckboxChange = (dept) => {
    setCompanyData({
      ...companyData,
      criteria: {
        ...companyData.criteria,
        departments: companyData.criteria.departments.includes(dept)
          ? companyData.criteria.departments.filter(d => d !== dept)
          : [...companyData.criteria.departments, dept]
      }
    });
  };

  const handleArrearsCheckboxChange = (arrearType) => {
    setCompanyData({
      ...companyData,
      criteria: {
        ...companyData.criteria,
        allowedArrears: companyData.criteria.allowedArrears.includes(arrearType)
          ? companyData.criteria.allowedArrears.filter(a => a !== arrearType)
          : [...companyData.criteria.allowedArrears, arrearType]
      }
    });
  };

  const handleDownload = async () => {
    try {
      const blob = await staffService.downloadShortlist(companyId || currentCompanyId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyData.companyName.replace(/\s+/g, '_')}_Shortlist.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Error downloading file.');
      console.error(error);
    }
  };

  if (companyId && shortlistedStudents.length === 0) {
    return <SimpleLayout><p>Loading company...</p></SimpleLayout>;
  }

  return (
    <SimpleLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{companyId ? 'Company Shortlist' : 'Company Criteria'}</h1>
              <p className="text-gray-600 mt-1">
                {companyId ? 'View filtered students for this company' : 'Set criteria to filter eligible students for placement'}
              </p>
            </div>
            {shortlistedStudents.length > 0 && (
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-600 font-medium">{shortlistedStudents.length} Eligible Students</span>
              </div>
            )}
          </div>

          {!companyId ? (
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    name="companyName"
                    value={companyData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Eligibility Criteria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum CGPA</label>
                      <input
                        name="criteria.minCGPA"
                        value={companyData.criteria.minCGPA}
                        onChange={handleChange}
                        placeholder="e.g., 7.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Allowed Arrears</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['No Backlog', 'Active Backlog', 'History of Arrears'].map((arrearType) => (
                          <label key={arrearType} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={companyData.criteria.allowedArrears?.includes(arrearType) || false}
                              onChange={() => handleArrearsCheckboxChange(arrearType)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{arrearType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum HSC %</label>
                      <input
                        name="criteria.minHSC"
                        value={companyData.criteria.minHSC}
                        onChange={handleChange}
                        placeholder="e.g., 75"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum SSLC %</label>
                      <input
                        name="criteria.minSSLC"
                        value={companyData.criteria.minSSLC}
                        onChange={handleChange}
                        placeholder="e.g., 80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passed Out Year</label>
                    <select
                      name="criteria.yearOfPassing"
                      value={companyData.criteria.yearOfPassing}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Eligible Departments</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS'].map((dept) => (
                        <label key={dept} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={companyData.criteria.departments.includes(dept)}
                            onChange={() => handleCriteriaCheckboxChange(dept)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Filtering Students...
                    </>
                  ) : (
                    'Filter Students'
                  )}
                </button>
              </div>
            </div>
          ) : null}

          {shortlistedStudents.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Filtered Students</h2>
                  <p className="text-gray-600 mt-1">Company: {companyData.companyName}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-50 px-3 py-1 rounded-full">
                    <span className="text-green-600 font-medium">{shortlistedStudents.length} Students</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export PDF
                    </button>
                    <button
                      onClick={() => setViewMode(viewMode === 'all' ? 'departmentWise' : 'all')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {viewMode === 'all' ? 'View Department Wise' : 'View All'}
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'all' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CGPA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SSLC %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          HSC %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Arrears
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shortlistedStudents.map((item) => (
                        <tr key={item.student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {item.student?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.student.fullName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {item.student.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.student.cgpa}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.student.collegeEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.student.sslc?.percentage || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.student.hsc?.percentage || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.student.arrears?.total || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(shortlistedStudents.reduce((acc, item) => {
                    const dept = item.student.department || 'Unknown';
                    if (!acc[dept]) acc[dept] = [];
                    acc[dept].push(item);
                    return acc;
                  }, {})).map(([dept, items]) => (
                    <div key={dept} className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{dept} ({items.length} students)</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student Details
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CGPA
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SSLC %
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                HSC %
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Arrears
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                              <tr key={item.student._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {item.student?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'N/A'}
                                  </span>
                                </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{item.student.fullName}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.student.cgpa}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.student.collegeEmail}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.student.sslc?.percentage || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.student.hsc?.percentage || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.student.arrears?.total || 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p>Students filtered based on the specified eligibility criteria.</p>
              </div>
            </div>
          )}

          {companyId && shortlistedStudents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shortlisted students</h3>
              <p className="mt-1 text-sm text-gray-500">No students match the current criteria.</p>
            </div>
          ) : null}
        </div>
      </div>
    </SimpleLayout>
  );
};

export default CompanyCriteriaForm;
