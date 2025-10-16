import React from "react";
import styles from "./SingleApplication.module.css";

const SingleApplication = ({ application }) => {
  return (
    <div className={styles.SingleApplication}>
      <div className={styles.cell}>
        <sub>Company</sub>
        {application.company || "-"}
      </div>
      <div className={styles.cell}>
        <sub>Name</sub>
        {application.first_name} {application.lastName}
      </div>
      <div className={styles.cell}>
        <sub>Email</sub>
        {application.email || "-"}
      </div>
      <div className={styles.cell}>
        <sub>Loan Amount</sub>
        {application.loanAmount}
      </div>
      <div className={styles.cell}>
        <sub>Application Date</sub>
        {application.dateCreated}
      </div>
      <div className={styles.cell}>
        <sub>Expiry date</sub>
        {application.expiryDate}
      </div>
    </div>
  );
};

export default SingleApplication;
