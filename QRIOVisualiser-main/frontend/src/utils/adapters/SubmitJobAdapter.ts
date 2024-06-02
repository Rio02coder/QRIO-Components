import { SubmitJobRequestProps } from "../../types/BackendSchemas/SubmitJob";
import { JobContextType } from "../../types/JobContext";
import Adapter from "./Adapter";

export default class SubmitJobAdapter
  implements Adapter<JobContextType, SubmitJobRequestProps>
{
  public adapt(adaptee: JobContextType): SubmitJobRequestProps {
    return {
      // fidelity: adaptee.fidelity,
      jobName: adaptee.jobName,
      imageName: adaptee.imageName,
      T1: adaptee.T1,
      T2: adaptee.T2,
      errorRate: adaptee.errorRate,
      readout: adaptee.readout,
      T1Unit: adaptee.T1Unit,
      T2Unit: adaptee.T2Unit,
      qubits: adaptee.qubits,
      cpu: adaptee.cpu,
      memory: adaptee.memory,
      circuitFile: adaptee.circuitFile as File,
      // topologyFile:
      //   adaptee.topologyFile === null ? undefined : adaptee.topologyFile,
    };
  }
}
