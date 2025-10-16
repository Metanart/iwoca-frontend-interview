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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (applications.length === 0) {
    return <div>No applications found</div>;
  }

  const renderLoadMoreButton = () => {
    if (isLoading) {
      return <Button className={styles.loadMoreButton}>Loading...</Button >
    }

    if (error) {
      return <Button className={styles.loadMoreButton} onClick={refresh}>Retry</Button>
    }

    if (hasNext) {
      return <Button className={styles.loadMoreButton} onClick={loadMore}>Load More</Button>
    }

    return null;
  }

  return (
    <div className={styles.Applications}>
      <div className={styles.applicationsList}>
        {applications.map(application => {
          return (
            <div className={styles.applicationsListItem} key={application.id}>
              <SingleApplication application={application} />
            </div>
          )
        })}
      </div>

      <div className={styles.loadMoreButtonContainer}>{renderLoadMoreButton()}</div>
    </div>
  );
};

export default Applications;
