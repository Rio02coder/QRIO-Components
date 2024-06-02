import { SubmitJobRequestProps } from "../../types/BackendSchemas/SubmitJob";
import { JobContextType } from "../../types/JobContext";
import SubmitJobAdapter from "../../utils/adapters/SubmitJobAdapter";
import { BASE_URL, META_URL, baseServer } from "../server";
import { MASTER_SERVER_ENDPOINTS } from "../urls";

export default class SubmitJobContactor {
  private URL = MASTER_SERVER_ENDPOINTS.SUBMIT_JOB;
  private META_FIDELITY_URL = MASTER_SERVER_ENDPOINTS.META_FIDELITY;
  private META_TOPOLOGY_URL = MASTER_SERVER_ENDPOINTS.META_TOPOLOGY;
  private adapter: SubmitJobAdapter;
  private data: JobContextType;

  constructor(data: JobContextType) {
    this.adapter = new SubmitJobAdapter();
    this.data = data;
  }

  private getFormData(data: SubmitJobRequestProps) {
    const formData = new FormData();

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key as keyof SubmitJobRequestProps];

        // Check if the value is defined
        if (typeof value !== "undefined") {
          // Check if the value is a File object
          if (value instanceof File) {
            // If it's a File object, append it with the same key
            formData.append(key, value);
          } else {
            // Otherwise, convert the value to string and append the key-value pair
            formData.append(key, String(value));
          }
        }
      }
    }

    return formData;
  }

  private getFidelityFormData() {
    const formData = new FormData();
    formData.append("file", this.data.circuitFile as File);
    formData.append("fidelity", this.data.fidelity as unknown as string);
    formData.append("name", this.data.jobName);
    return formData;
  }

  private getTopologyFormData() {
    const formData = new FormData();
    formData.append("file", this.data.topologyFile as File);
    formData.append("name", this.data.jobName);
    return formData;
  }

  private contactMetaServer() {
    return this.data.fidelity
      ? baseServer.post(
          META_URL + this.META_FIDELITY_URL,
          this.getFidelityFormData()
        )
      : baseServer.post(
          META_URL + this.META_TOPOLOGY_URL,
          this.getTopologyFormData()
        );
  }

  public contact() {
    return this.contactMetaServer().then(() => {
      const formData = this.getFormData(this.adapter.adapt(this.data));
      return baseServer.post(BASE_URL + this.URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  }
}
