
import numpy as np
import time
from qiskit import QuantumCircuit, transpile, Aer, assemble
from qiskit_aer import AerSimulator
from qiskit.tools.visualization import plot_histogram


def read_noise_from_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        # Dynamically execute the content of the file in a local namespace
        local_namespace = {}
        exec(content, local_namespace)
        # Access the 'noise' variable from the local namespace
        noise = local_namespace.get('noise_bit_flip')
    return noise

# Assuming the volume is mounted at '/path/to/mount' inside the container
volume_path = '/host'

# Read the 'noise' variable from a Python file in the volume
noise_bit_flip = read_noise_from_file(f'{volume_path}/noise.py')
cq_file = "./Grover.qasm"
with open(cq_file, "r") as file:
    cq = file.read()

qc = QuantumCircuit.from_qasm_str(cq)
transpiled_qc = transpile(qc, Aer.get_backend('qasm_simulator'), optimization_level=0)
quantum_object = assemble(transpiled_qc, shots=16)


print("########## Noisy Simulation ##########")
result = Aer.get_backend('qasm_simulator').run(quantum_object, noise_model=noise_bit_flip).result()
print(result.get_counts())
print("##########")
print("Sleeping for 30 seconds")
time.sleep(30)
print("Finished work")
    