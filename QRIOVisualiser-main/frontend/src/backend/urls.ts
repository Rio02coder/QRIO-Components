export const Endpoints = {
  "Node Info": "get-job-info",
  "Cluster Info": "get-cluster-info",
  "Upload Qasm": "upload-qasm",
};

export const events = {
  "Node Info": "nodeInfo",
  "Cluster Info": "clusterInfo",
  "Send Job Info": "sendJob",
  "Log Info": "clusterInfo",
};

export enum MASTER_SERVER_ENDPOINTS {
  SUBMIT_JOB = "submit-job/",
  META_FIDELITY = "upload-fidelity/",
  META_TOPOLOGY = "upload-circuit/",
}
