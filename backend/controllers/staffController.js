const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Company = require('../models/Company');
const Feedback = require('../models/Feedback');
const { generateShortlistPDF } = require('../utils/pdfGenerator');

// @desc    Create company criteria and drive with student filtering and email notifications
// @route   POST /api/staff/companies
// @access  Private (Staff only)
const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      jobDescription,
      ctc,
      location,
      criteria,
      driveDate,
      registrationDeadline,
      venue
    } = req.body;

    const company = await Company.create({
      companyName,
      jobRole,
      jobDescription,
      ctc,
      location,
      criteria,
      driveDate,
      registrationDeadline,
      venue,
      createdBy: req.user._id
    });

    // Filter eligible students based on criteria
    const Student = require('../models/Student');
    const filterQuery = {
      profileCompleted: true,
      placementStatus: 'Not Placed'
    };

    // Department filter
    if (criteria.departments && criteria.departments.length > 0) {
      filterQuery.department = { $in: criteria.departments };
    }

    // CGPA filter
    if (criteria.minCGPA) {
      filterQuery.cgpa = { $gte: criteria.minCGPA };
    }

    // SSLC percentage
    if (criteria.minSSLC) {
      filterQuery['sslc.percentage'] = { $gte: criteria.minSSLC };
    }

    // HSC percentage
    if (criteria.minHSC) {
      filterQuery['hsc.percentage'] = { $gte: criteria.minHSC };
    }

    // Arrears - filter based on allowedArrears array
    if (criteria.allowedArrears && criteria.allowedArrears.length > 0) {
      filterQuery.arrears = { $in: criteria.allowedArrears };
    }

    // Year of passing
    if (criteria.yearOfPassing) {
      filterQuery.degreeYearOfPassing = criteria.yearOfPassing;
    }

    const eligibleStudents = await Student.find(filterQuery)
      .select('fullName username department collegeEmail cgpa sslc hsc arrears')
      .sort({ cgpa: -1 });

    // Add to shortlistedStudents
    const shortlistedStudents = eligibleStudents.map(student => ({
      student: student._id,
      shortlistedDate: new Date()
    }));

    company.shortlistedStudents = shortlistedStudents;
    await company.save();

    // Populate the shortlisted students for the response
    await company.populate('shortlistedStudents.student', 'fullName username department collegeEmail cgpa sslc hsc arrears');

    // Send eligibility notification emails
    const { sendEmail } = require('../utils/emailService');

    const emailPromises = eligibleStudents.map(async (student) => {
      const html = `
        <h2>You are eligible for ${companyName}!</h2>
        <p>Dear ${student.fullName},</p>
        <p>You have been shortlisted based on the criteria for ${companyName}.</p>
        <p>Best regards,<br>Placement Cell</p>
      `;

      await sendEmail(
        student.collegeEmail,
        `Eligibility Notification for ${companyName}`,
        html
      );
    });

    await Promise.all(emailPromises);

    res.status(201).json({
      message: 'Company created, students filtered, and emails sent',
      company,
      eligibleCount: eligibleStudents.length
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies created by staff
// @route   GET /api/staff/companies
// @access  Private (Staff only)
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ createdBy: req.user._id })
      .populate('shortlistedStudents.student', 'fullName username department collegeEmail')
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single company by ID
// @route   GET /api/staff/companies/:id
// @access  Private (Staff only)
const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('shortlistedStudents.student', 'fullName username department collegeEmail cgpa sslc hsc arrears');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Filter students based on company criteria
// @route   POST /api/staff/filter
// @access  Private (Staff only)
const filterStudents = async (req, res) => {
  try {
    const criteria = req.body;
    console.log('Received criteria:', criteria);

    // Build filter query based on criteria
    const filterQuery = {
      profileCompleted: true,
      placementStatus: 'Not Placed'
    };

    // Department filter
    if (criteria.departments && criteria.departments.length > 0) {
      filterQuery.department = { $in: criteria.departments };
    }

    // CGPA filter
    if (criteria.minCGPA) {
      filterQuery.cgpa = { $gte: parseFloat(criteria.minCGPA) };
    }

    // SSLC percentage
    if (criteria.minSSLC) {
      filterQuery['sslc.percentage'] = { $gte: parseFloat(criteria.minSSLC) };
    }

    // HSC percentage
    if (criteria.minHSC) {
      filterQuery['hsc.percentage'] = { $gte: parseFloat(criteria.minHSC) };
    }

    // Arrears - filter based on allowedArrears array
    if (criteria.allowedArrears && criteria.allowedArrears.length > 0) {
      filterQuery.arrears = { $in: criteria.allowedArrears };
    }

    // Year of passing (batch)
    if (criteria.batch) {
      filterQuery.degreeYearOfPassing = parseInt(criteria.batch);
    }

    const finalQuery = filterQuery;

    console.log('Built filter query:', JSON.stringify(finalQuery, null, 2));

    const eligibleStudents = await Student.find(finalQuery)
      .select('fullName username department collegeEmail cgpa sslc hsc arrears keySkills')
      .sort({ cgpa: -1 });

    console.log('Found eligible students count:', eligibleStudents.length);
    console.log('Eligible students:', eligibleStudents.map(s => ({ fullName: s.fullName, department: s.department, cgpa: s.cgpa, sslc: s.sslc?.percentage, hsc: s.hsc?.percentage, arrears: s.arrears?.total })));

    // Format as shortlistedStudents for frontend consistency
    const shortlistedStudents = eligibleStudents.map(student => ({
      student: student,
      shortlistedDate: new Date()
    }));

    // Send eligibility notification emails
    const { sendEmail } = require('../utils/emailService');

    const emailPromises = eligibleStudents.map(async (student) => {
      const html = `
        <h2>You are eligible for ${criteria.companyName || 'the position'}!</h2>
        <p>Dear ${student.fullName},</p>
        <p>You have been shortlisted based on the criteria for the position.</p>
        <p>Best regards,<br>Placement Cell</p>
      `;

      await sendEmail(
        student.collegeEmail,
        `Eligibility Notification for ${criteria.companyName || 'Position'}`,
        html
      );
    });

    await Promise.all(emailPromises);

    res.json({
      message: 'Students filtered and emails sent',
      eligibleCount: eligibleStudents.length,
      shortlistedStudents: shortlistedStudents
    });
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get final shortlist
// @route   GET /api/staff/companies/:id/shortlist
// @access  Private (Staff only)
const getShortlist = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate({
        path: 'shortlistedStudents.student',
        select: 'fullName username department collegeEmail studentContact personalEmail cgpa resume'
      });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      company: company.companyName,
      jobRole: company.jobRole,
      shortlist: company.shortlistedStudents.map(s => s.student)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download shortlist as PDF or DOCX
// @route   GET /api/staff/companies/:id/download?format=pdf|docx
// @access  Private (Staff only)
const downloadShortlist = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate({
        path: 'shortlistedStudents.student',
        select: 'fullName username department collegeEmail studentContact cgpa keySkills'
      });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const shortlistData = {
      shortlist: company.shortlistedStudents.map(s => ({ student: s.student }))
    };

    const filename = `${company.companyName.replace(/\s+/g, '_')}_Shortlist_${Date.now()}.pdf`;
    const filePath = await generateShortlistPDF(shortlistData, filename);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      // Optionally delete the file after download
      // fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/staff/feedbacks
// @access  Private (Staff only)
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('student', 'fullName username department collegeEmail')
      .sort({ submittedDate: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get placed students
// @route   GET /api/staff/placed-students
// @access  Private (Staff only)
const getPlacedStudents = async (req, res) => {
  try {
    const { department } = req.query;
    let matchCondition = { placementStatus: 'Placed' };

    if (department && department !== '') {
      matchCondition.department = department;
    }

    const students = await Student.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'student',
          as: 'feedback'
        }
      },
      {
        $addFields: {
          feedbackStatus: {
            $cond: {
              if: { $gt: [{ $size: '$feedback' }, 0] },
              then: {
                $cond: {
                  if: { $in: [{ $arrayElemAt: ['$feedback.status', 0] }, ['Submitted', 'Verified']] },
                  then: 'Completed',
                  else: 'Pending'
                }
              },
              else: 'Pending'
            }
          }
        }
      },
      { $sort: { placementDate: -1 } },
      { $project: { password: 0, feedback: 0 } }
    ]);

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get not placed students
// @route   GET /api/staff/not-placed-students
// @access  Private (Staff only)
const getNotPlacedStudents = async (req, res) => {
  try {
    const { department } = req.query;
    const query = { placementStatus: 'Not Placed' };

    if (department && department !== '') {
      query.department = department;
    }

    const students = await Student.find(query)
      .select('fullName department collegeEmail')
      .sort({ fullName: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company status
// @route   PUT /api/staff/companies/:id/status
// @access  Private (Staff only)
const updateCompanyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    company.status = status;
    await company.save();

    res.json({ message: 'Company status updated', company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  filterStudents,
  getShortlist,
  downloadShortlist,
  getFeedbacks,
  getPlacedStudents,
  getNotPlacedStudents,
  updateCompanyStatus
};
