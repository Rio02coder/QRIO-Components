import { exec } from "child_process";
import util from "node:util";
/**
 * This class is responsible for
 * getting a Pod info either from
 * pod name or the job it is associated to.
 */
class PodInfo {
  private jobName = "";

  constructor(jobName: string) {
    this.jobName = jobName;
  }

  getNodeName(flatJSON: string) {
    const nodeNameIndex = flatJSON.indexOf("nodeName");
    const preemptionPolicyIndex = flatJSON.indexOf("preemptionPolicy");
    return flatJSON.substring(nodeNameIndex + 11, preemptionPolicyIndex - 3);
  }

  async getNodeForJob() {
    const command = `kubectl get pods --selector=job-name=${this.jobName} -o=jsonpath='{.items[0].spec.nodeName}'`;
    const execPromise = util.promisify(exec);
    const { stdout, stderr } = await execPromise(command);
    return stdout;
  }
}

export default PodInfo;
