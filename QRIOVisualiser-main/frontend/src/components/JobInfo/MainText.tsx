import React, { useContext } from "react";
import { JobContext } from "../../types/JobContext";
import styles from "../../styles/components/JobInfo/MainText";

type TProps = {
  deviceName: string;
};

const getDeviceString = (device: string | undefined) => {
  return device !== undefined ? `: ${device}` : "";
};

const MainText = ({ deviceName }: TProps) => {
  const jobContext = useContext(JobContext);
  return (
    <div style={styles}>{`${jobContext?.jobName} ${getDeviceString(
      deviceName
    )}`}</div>
  );
};

export default React.memo(MainText);
