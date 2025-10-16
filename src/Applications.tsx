import React from "react";
import SingleApplication from "./SingleApplication";
import { getSingleApplicationFixture } from "./__fixtures__/applications.fixture";
import styles from "./Applications.module.css";
import { useApplications } from "./hooks/useApplications";
import { Button } from "./ui/Button/Button";

const Applications = () => {
  const hardcodedApplications = getSingleApplicationFixture;

  const { applications, isLoading, error, hasNext, loadMore, refresh } = useApplications(1, 5);

  console.log(applications, isLoading, error, hasNext, loadMore, refresh)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (applications.length === 0) {
    return <div>No applications found</div>;
  }

  return (
    <div className={styles.Applications}>
      {applications.map(application => {
        return <SingleApplication key={application.id} application={application} />
      })}
      {hasNext && <Button className={styles.loadMoreButton} onClick={loadMore}>Load More</Button>}
      {error && <Button className={styles.retryButton} onClick={refresh}>Retry</Button>}
    </div>
  );
};

export default Applications;
