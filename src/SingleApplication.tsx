import React from "react";
import styles from "./SingleApplication.module.css";
import { TApplicationClientDto } from "./api/fetchApplications";

const SingleApplication = ({ application }: { application: TApplicationClientDto }) => {
  const { id, company, firstName, lastName, email, loanAmount, dateCreated, expiryDate } = application;

  return (
    <div className={styles.SingleApplication}>
      <div className={styles.cell}>
        <sub className={styles.cellCaption}>Company</sub>
        <span className={styles.cellValue}>{company || "-"}</span>
      </div>
      <div className={styles.cell}>
        <sub className={styles.cellCaption}>Name</sub>
        <span className={styles.cellValue}>{firstName} {lastName}</span>
      </div>
      <div className={styles.cell}>
        <sub className={styles.cellCaption}>Email</sub>
        <span className={styles.cellValue}>
          {email ? <a className={styles.emailLink} href={`mailto:${email}`}>{email}</a> : "-"}</span>
      </div>
      <div className={styles.cell}>
        <sub className={styles.cellCaption}>Loan Amount</sub>
        <span className={styles.cellValue}>{loanAmount}</span>
      </div>
      <div className={styles.cell}>
        <sub className={styles.cellCaption}>Application Date</sub>
        <span className={styles.cellValue}>{dateCreated}</span>
      </div>
      <div className={styles.cell}>
        <sub className={styles.cellCaption}>Expiry Date</sub>
        <span className={styles.cellValue}>{expiryDate}</span>
      </div>
    </div >
  );
};

export default SingleApplication;
