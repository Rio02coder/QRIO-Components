import { JobContextType } from "../types/JobContext";

type FormValidator = (jobConfig: JobContextType) => boolean;

const jobConfigurationValidator = (jobConfig: JobContextType) => {
  let error: boolean = false;

  if (jobConfig.imageName === "") {
    error = true;
    jobConfig.setError("imageName", "Image name cannot be blank");
  }

  if (jobConfig.jobName === "") {
    error = true;
    jobConfig.setError("jobName", "Job name cannot be blank");
  }

  if (jobConfig.qubits === 0) {
    error = true;
    jobConfig.setError("qubits", "Qubit number can't be 0");
  }

  if (!error) {
    jobConfig.clearError();
  }

  return !error;
};

const errorConfigurationValidator = (jobConfig: JobContextType) => {
  return true;
};

const topologyFormValidator = (jobConfig: JobContextType) => {
  if (jobConfig.topologyFile === null && jobConfig.fidelity === undefined) {
    alert("You have not selected a topology or set a fidelity");
    return false;
  }
  return true;
};

export const formValidators = new Map<string, FormValidator>([
  ["Configure Job", jobConfigurationValidator],
  ["Configure Error", errorConfigurationValidator],
  ["Choose Topology", topologyFormValidator],
]);
