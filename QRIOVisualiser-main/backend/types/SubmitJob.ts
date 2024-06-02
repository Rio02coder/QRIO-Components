import { UNIT_NAMES } from "../utils/Units/UnitMap";

type MandatorySubmitJobRequest = {
  jobName: string;
  imageName: string;
  circuitFile: File;
  qubits: number;
  cpu: number;
  memory: number;
  errorRate: number;
  readout: number;
  T1: number;
  T2: number;
  T1Unit: UNIT_NAMES;
  T2Unit: UNIT_NAMES;
};

type OptionalSubmitJobRequest = {
  // topologyFile?: File;
  // fidelity?: number;
};

export type SubmitJobRequest = MandatorySubmitJobRequest &
  OptionalSubmitJobRequest;
