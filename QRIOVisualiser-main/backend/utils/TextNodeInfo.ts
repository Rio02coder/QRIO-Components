import { exec } from "child_process";
import util from "node:util";
import NodeInfo from "./NodeInfo.js";

class TextNodeInfo extends NodeInfo {
  constructor(nodeName: string) {
    super(nodeName);
  }

  async getInfo() {
    const execPromise = util.promisify(exec);
    const command = `kubectl describe node ${this.nodeName}`;
    const { stdout, stderr } = await execPromise(command);
    return stdout;
  }
}

export default TextNodeInfo;
