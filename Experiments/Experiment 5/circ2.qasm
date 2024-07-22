// QASM file with random CX connections for an 8-qubit quantum circuit
OPENQASM 2.0;
include "qelib1.inc";

// Declare 8 qubits
qreg q[8];

// Apply random CX gates
cx q[0], q[1];
cx q[2], q[3];
cx q[4], q[5];
cx q[6], q[7];
cx q[1], q[2];
cx q[3], q[4];
cx q[5], q[6];
cx q[7], q[0];
cx q[2], q[5];
cx q[6], q[1];
cx q[4], q[7];
cx q[3], q[0];

// Measure all qubits
creg c[8];
measure q[0] -> c[0];
measure q[1] -> c[1];
measure q[2] -> c[2];
measure q[3] -> c[3];
measure q[4] -> c[4];
measure q[5] -> c[5];
measure q[6] -> c[6];
measure q[7] -> c[7];