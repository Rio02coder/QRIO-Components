import PodInfo from "./PodInfo.js";

const getNodeNameWithJob = (jobName: string) => {
  const podInfo = new PodInfo(jobName);
  return podInfo.getNodeForJob();
};

export default getNodeNameWithJob;
