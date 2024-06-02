import axios from "axios";
import { SubmitFidelity } from "../../../types/MetaServer/SubmitFidelity";
import { SubmitTopology } from "../../../types/MetaServer/SubmitTopology";

export interface MetaServerRequestor {
  parameter: any;
  executeRequest: () => Promise<any>;
}

export class MetaServerFidelityRequestor implements MetaServerRequestor {
  parameter: SubmitFidelity;
  constructor(parameter: SubmitFidelity) {
    this.parameter = parameter;
  }

  public executeRequest(): Promise<void> {
    const formData = new FormData();
    formData.append("file", this.parameter.circuitFile);
    formData.append("fidelity", this.parameter.fidelity.toString());
    return axios.post("", formData);
  }
}

export class MetaServerTopologyRequestor implements MetaServerRequestor {
  parameter: SubmitTopology;

  constructor(parameter: SubmitTopology) {
    this.parameter = parameter;
  }

  public executeRequest(): Promise<void> {
    const formData = new FormData();
    formData.append("file", this.parameter.topologyFile);
    return axios.post("", formData);
  }
}
