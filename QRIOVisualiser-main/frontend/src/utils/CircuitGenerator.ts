export default class CircuitGenerator {
  qubits: number;
  isFullyConnected: boolean | false;
  connections?: number[][];
  constructor(
    qubits: number,
    connections?: number[][],
    isFullyConnected: boolean = false
  ) {
    this.qubits = qubits;
    this.connections = connections;
    this.isFullyConnected = isFullyConnected;
  }

  private getHeaderText(): string {
    return `from qiskit import QuantumCircuit`;
  }

  private getCircuitInitializerText(): string {
    return `qc = QuantumCircuit(${this.qubits})`;
  }

  private generateSingleConnection(node1: number, node2: number) {
    return `qc.cx(${node1},${node2})`;
  }

  private generateFullyConnected() {
    const lines: string[] = [];
    for (let i: number = 0; i < this.qubits - 1; i++) {
      for (let j: number = i + 1; j < this.qubits; j++) {
        lines.push(this.generateSingleConnection(i, j));
      }
    }
    return lines.join("\n");
  }

  private generateFromConnections(): string {
    const circConnections = this.connections as number[][];
    const lines = circConnections.map((conn) =>
      this.generateSingleConnection(conn[0], conn[1])
    );
    return lines.join("\n");
  }

  private getFileFromCode(code: string): File {
    console.log(code);
    const blob = new Blob([code], { type: "text/plain" });
    return new File([blob], "example.py", { type: "text/plain" });
  }

  public generateCircuitFile() {
    if (!this.isFullyConnected && !this.connections) {
      throw new Error(
        "Circuit connections are missing when circuit is not fully connected"
      );
    }

    let circuitCode: string[] = [
      this.getHeaderText(),
      this.getCircuitInitializerText(),
    ];

    circuitCode.push(
      this.isFullyConnected
        ? this.generateFullyConnected()
        : this.generateFromConnections()
    );

    return this.getFileFromCode(circuitCode.join("\n"));
  }
}
