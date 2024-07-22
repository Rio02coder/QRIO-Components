OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

// Hadamard gate on all qubits to create a superposition
h q[0];
h q[1];
h q[2];

// Oracle: Mark the solution by applying X gate on the target state (in this case, state |110>)
x q[0];
x q[1];
// No X gate on the third qubit to mark the state |110>

// Apply Hadamard again to amplify the amplitude of the marked state
h q[0];
h q[1];
h q[2];

// Grover diffusion operator: Invert about the mean
// Apply X and H gates to all qubits
x q[0];
x q[1];
x q[2];
h q[2];

// Apply Controlled-Z gate (CZ) between q[0] and q[2]
cz q[0], q[2];

// Apply X and H gates to all qubits again
h q[2];
x q[0];
x q[1];
x q[2];

// Measure the qubits to observe the result
measure q[0] -> c[0];
measure q[1] -> c[1];
measure q[2] -> c[2];