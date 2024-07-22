
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
cq_file = "./bv.qasm"
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
    