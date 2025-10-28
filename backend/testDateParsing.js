const { validateStudentData, validateStaffData } = require('./utils/bulkUploadParser');

// Test student data
const studentTestData = [
  {
    'Name': 'John Doe',
    'College mail': 'john@nec.edu.in',
    'Date of Birth': '12/25/2000',
    'Degree': 'B.E.',
    'Department': 'CSE',
    'Gender': 'Male',
    'Tutor name': 'Dr. Smith',
    'Student contact': '9876543210',
    'Personal mail': 'john@gmail.com'
  }
];

// Test staff data
const staffTestData = [
  {
    'name': 'Srinivasagan',
    'college mail': 'hodit@nec.edu.in',
    'date of birth': '16/10/1974', // DD/MM/YYYY format as per user
    'department': 'IT',
    'contact number': '7689543123',
    'designation': 'HOD'
  }
];

console.log('=== Student Test ===');
const studentResult = validateStudentData(studentTestData);
console.log('Valid data:', JSON.stringify(studentResult.validData, null, 2));
console.log('Errors:', studentResult.errors);

console.log('\n=== Staff Test ===');
const staffResult = validateStaffData(staffTestData);
console.log('Valid data:', JSON.stringify(staffResult.validData, null, 2));
console.log('Errors:', staffResult.errors);
