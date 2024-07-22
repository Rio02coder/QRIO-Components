from qiskit import QuantumCircuit


qc = QuantumCircuit(7)

qc.cx(0, 1)
qc.cx(0, 2)
qc.cx(0, 3)
qc.cx(3, 6)
qc.cx(1, 4)
qc.cx(2, 5)