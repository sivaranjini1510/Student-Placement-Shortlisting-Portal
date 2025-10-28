import React, { useState } from 'react';
import styles from '../styles/per-component/FeedbackCard.module.css';
import adminService from '../services/adminService';

const FeedbackCard = ({ data }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (data.feedbackDocument) {
      try {
        setDownloading(true);
        const blob = await adminService.downloadFeedbackDocument(data._id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `feedback_${data.student?.username || 'student'}_${data.companyName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Failed to download the file. Please try again.');
      } finally {
        setDownloading(false);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{data.companyName}</h3>
        <span className={`${styles.status} ${styles[data.status?.toLowerCase()]}`}>
          {data.status || 'Pending'}
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.studentInfo}>
          <p><strong>Student:</strong> {data.student?.fullName} ({data.student?.username})</p>
          <p><strong>Department:</strong> {data.student?.department}</p>
        </div>

        <div className={styles.placementInfo}>
          <p><strong>Role:</strong> {data.jobRole}</p>
          <p><strong>Package:</strong> {data.ctc} LPA</p>
          <p><strong>Placement Date:</strong> {new Date(data.placementDate).toLocaleDateString()}</p>
          <p><strong>Submitted:</strong> {new Date(data.submittedDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleDownload}
          className={styles.downloadBtn}
          disabled={!data.feedbackDocument || downloading}
        >
          {downloading ? 'Downloading...' : data.feedbackDocument ? 'Download PDF' : 'No File Available'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
