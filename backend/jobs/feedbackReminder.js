const cron = require('node-cron');
const Student = require('../models/Student');
const Feedback = require('../models/Feedback');
const emailService = require('../utils/emailService');

const sendFeedbackReminders = async () => {
  try {
    console.log('Running feedback reminder job...');

    // Get all students
    const students = await Student.find({});

    for (const student of students) {
      // Only send to placed students who haven't submitted feedback
      if (student.placementStatus === 'Placed') {
        // Check if student has submitted any feedback
        const submittedFeedback = await Feedback.findOne({
          studentId: student._id,
          status: { $in: ['Submitted', 'Verified'] }
        });

        // If no submitted feedback, send reminder
        if (!submittedFeedback) {
          const subject = 'Feedback Submission Reminder - NEC Placement Portal';
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Feedback Submission Reminder</h2>
              <p>Dear ${student.fullName},</p>
              <p>This is a friendly reminder to submit your placement feedback on the NEC Placement Portal.</p>
              <p>Your feedback helps us improve our placement services and support other students.</p>
              <p>Please log in to your account and submit your feedback at your earliest convenience.</p>
              <p>If you have already submitted feedback, please disregard this message.</p>
              <p>Best regards,<br>NEC Placement Team</p>
            </div>
          `;

          await emailService.sendEmail(student.collegeEmail, subject, html);
          console.log(`Feedback reminder sent to ${student.collegeEmail}`);
        }
      }
    }

    console.log('Feedback reminder job completed successfully');
  } catch (error) {
    console.error('Error in feedback reminder job:', error);
  }
};

// Schedule the job to run daily at 5 PM
const scheduleFeedbackReminders = () => {
  cron.schedule('0 17 * * *', sendFeedbackReminders, {
    timezone: 'Asia/Kolkata'
  });
  console.log('Feedback reminder job scheduled to run daily at 5 PM IST');
};

// Export for testing purposes
module.exports = {
  sendFeedbackReminders,
  scheduleFeedbackReminders
};
