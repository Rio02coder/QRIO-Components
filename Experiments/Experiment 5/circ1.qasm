// QASM file with both Clifford and non-Clifford gates for a 7-qubit quantum circuit
OPENQASM 2.0;
include "qelib1.inc";

// Declare 7 qubits
qreg q[7];
creg c[7];

// Apply some Clifford gates
h q[0];
cx q[0], q[1];
s q[2];
cz q[3], q[4];
x q[5];
y q[6];

// Apply some non-Clifford gates
t q[0];
tdg q[1]; // T-dagger gate (T inverse)
u1(pi/3) q[2]; // U1 gate with pi/3 phase shift
u3(pi/2, pi/3, pi/4) q[3]; // U3 gate with three parameters
ccx q[4], q[5], q[6]; // Toffoli gate

// Additional gates to add complexity
h q[0];
h q[1];
h q[2];
h q[3];
h q[4];
h q[5];
h q[6];

cx q[0], q[6];
cx q[1], q[5];
cx q[2], q[4];

s q[3];
sdg q[4];
t q[5];
tdg q[6];

// Measure all qubits
measure q[0] -> c[0];
measure q[1] -> c[1];
measure q[2] -> c[2];
measure q[3] -> c[3];
measure q[4] -> c[4];
measure q[5] -> c[5];
measure q[6] -> c[6];