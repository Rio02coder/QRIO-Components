import { exec } from "child_process";
import fs from "fs";
import util from "node:util";

class JobCreator {
  promiseExec = util.promisify(exec);
  async createJob(
    dirName: string,
    imageName: string,
    jobFileName: string,
    qasmFileName: string,
    pythonFileName: string,
    qubits: string,
    T1: string,
    T2: string,
    errorRate: string,
    readoutRate: string,
    jobName: string
  ) {
    console.log("Creating requirements file");
    this.createRequirementsFile(dirName);
    console.log("Creating docker file");
    this.createDockerFile(dirName, qasmFileName, pythonFileName);
    console.log("Creating python file");
    this.createPythonFile(qasmFileName, dirName, pythonFileName);
    console.log("Creating job yaml");
    this.createJobYaml(
      imageName,
      dirName,
      jobFileName,
      qubits,
      T1,
      T2,
      readoutRate,
      errorRate,
      jobName
    );
    console.log("Building docker file");
    const buildCommand = `
    cd ${dirName}
    docker build -t ${imageName} .`;
    await this.promiseExec(buildCommand);
    console.log("Pushing docker file");
    const pushCommand = `
    cd ${dirName}
    docker push ${imageName}`;
    await this.promiseExec(pushCommand);
    console.log("Creating job command");
    const createCommand = `
    cd ${dirName}
    kubectl apply -f ${jobFileName}.yaml`;
    await this.promiseExec(createCommand);
    console.log("done");
  }

  private createDockerFile(
    dirName: string,
    fileName: string,
    pythonFileName: string
  ) {
    const dockerString = `
# Use Alpine Linux as base image
FROM python:3.8-alpine AS build

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apk update && \
    apk add --no-cache build-base hdf5-dev

# Copy the application files
COPY ${pythonFileName}.py ${fileName}.qasm requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Final runtime image
FROM python:3.8-alpine

# Copy Python dependencies from the build stage
COPY --from=build /install /usr/local

# Set the working directory
WORKDIR /app

# Copy the application files
COPY --from=build /app/${pythonFileName}.py /app/${fileName}.qasm /app/requirements.txt ./

# Run the application
CMD ["python", "./${pythonFileName}.py"]
    `;
    fs.writeFileSync(`${dirName}/Dockerfile`, dockerString);
  }

  createRequirementsFile(dirName: string) {
    const contents = `
qiskit
mapomatic
qiskit-aer
matplotlib
qiskit_ibmq_provider
qiskit_ibm_runtime
    `;
    fs.writeFileSync(`${dirName}/requirements.txt`, contents);
  }

  private createJobYaml(
    imageName: string,
    dirName: string,
    fileName: string,
    qubits: string,
    T1: string,
    T2: string,
    readoutRate: string,
    errorRate: string,
    jobName: string
  ) {
    const contents = `
apiVersion: batch/v1
kind: Job
metadata:
  name: ${jobName}
spec:
  template:
    spec:
      containers:
        - name: ${jobName}
          image: ${imageName}
          resources:
            requests:
              qrio.com/qubits: ${qubits}
            limits:
              qrio.com/qubits: ${qubits}
          volumeMounts:
          - name: noise-volume
            mountPath: /host
      volumes:
      - name: noise-volume
        hostPath:
          path: /
          type: Directory
      restartPolicy: Never
`;
    fs.writeFileSync(`${dirName}/${fileName}.yaml`, contents);
  }

  private createPythonFile(
    fileName: string,
    dirName: string,
    pythonFileName: string
  ) {
    const contents = `
from qiskit import QuantumCircuit, transpile


def read_backend_from_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        # Dynamically execute the content of the file in a local namespace
        local_namespace = {}
        exec(content, local_namespace)
        # Access the 'noise' variable from the local namespace
        backend = local_namespace.get('backend')
    return backend

# Assuming the volume is mounted at '/path/to/mount' inside the container
volume_path = '/host'

# Read the 'backend' variable from a Python file in the volume
backend = read_backend_from_file(f'{volume_path}/backend.py')
cq_file = "./${fileName}.qasm"
with open(cq_file, "r") as file:
    cq = file.read()

qc = QuantumCircuit.from_qasm_str(cq)
transpiled_qc = transpile(qc, backend)

print("########## Noisy Simulation ##########")
result = backend.run(transpiled_qc).result()
try:
    print(result.get_counts())
except:
    print("No logs")
print("##########")
    `;
    fs.writeFileSync(`${dirName}/${pythonFileName}.py`, contents);
  }
}

export const jobCreator = new JobCreator();
