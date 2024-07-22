// Repetition code encoder (5 qubits)
OPENQASM 2.0;
include "qelib1.inc";

qreg q[5]; // 5 qubits for encoding
creg c[5]; // 5 classical bits for measurement

// Encode a single qubit using repetition code
// Apply Hadamard gates to create superposition
h q[0];
h q[1];
h q[2];
h q[3];
h q[4];

// Apply CNOT gates for repetition
cx q[0], q[1];
cx q[0], q[2];
cx q[0], q[3];
cx q[0], q[4];
cx q[1], q[2];
cx q[1], q[3];
cx q[1], q[4];
cx q[2], q[3];
cx q[2], q[4];
cx q[3], q[4];


measure q[0] -> c[0];
measure q[1] -> c[1];
measure q[2] -> c[2];
measure q[3] -> c[3];
measure q[4] -> c[4];