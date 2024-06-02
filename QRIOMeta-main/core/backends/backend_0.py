# Generated Quantum Backend
import datetime
from qiskit_aer import AerSimulator
from qiskit.providers.models import BackendProperties, Nduv, GateProperties, GateConfig, BackendConfiguration
from qiskit.transpiler import CouplingMap
from core.backends.backend_generator import GFGRandomGraph
from core.backends.backend_generator import custom_noise_model
from numpy.random import normal

# Create a fully connected coupling map
# nm = custom_noise_model(1)

# Define gate and relaxation errors
# cx_error = 0.02
# reset_error = 0.02
# measure_error = 0.02
# t1 = 0.02
# t2 = 0.02

# Create BackendProperties object

qubits = []
qubit_props = ['T1', 'T2', 'readout_error']
unit_map = {'T1': "us", 'T2': "us", 'readout_error': ''}
value_map = {'T1': normal(500e3, 100e3), 'T2': normal(500e3, 100e3), 'readout_error': normal(0.15, 0.05)}
gate_error = normal(0.04, 0.015)


gates = []
gate_configs = []
single_qubits = []
interactions = []

basis_gates = ["u1","u2","u3","cx"]

for i in range(20):
    qubit_prop = []
    for prop in qubit_props:
        qubit_prop.append(Nduv(date="2018-04-02 15:00:00Z", name=prop, unit=unit_map.get(prop), value=value_map.get(prop)))
    qubits.append(qubit_prop)


#Single qubit gates


for gate in basis_gates:
    if gate != 'cx':
        for i in range(20):
            single_qubits.append([i])
            gates.append(GateProperties(qubits=[i], gate=gate, parameters=[Nduv(date="2018-04-02 15:00:00Z", name='gate_error', unit="", value=gate_error)]))


full_connected_map = CouplingMap()

for i in range(20):
    full_connected_map.add_physical_qubit(i)


for i in range(20):
    for j in range(i + 1, 20):
        interactions.append([i,j])
        gates.append(GateProperties(qubits=[i,j], gate="cx", parameters=[Nduv(date="2018-04-02 15:00:00Z", name='gate_error', unit="", value=gate_error)]))
        full_connected_map.add_edge(i, j)

general = [Nduv(date="2018-04-02 15:00:00Z", name='fridge_temperature', unit="mK", value=10)]

gate_parameter_map = {"u1":["lambda"], "u2":["phi","lambda"], "u3": ["theta","phi","lambda"], "cx": []}
gate_qasm_def_map = {"u1": "gate u1(lambda) q { U(0,0,lambda) q; }", "u2": "gate u2(phi,lambda) q { U(pi/2,phi,lambda) q; }", "u3" : "u3(theta,phi,lambda) q { U(theta,phi,lambda) q; }", "cx": "gate cx q1,q2 { CX q1,q2; }"}
gate_cm_map = {"u1": single_qubits, "u2": single_qubits, "u3": single_qubits, "cx": interactions}


for basis_gate in basis_gates:
    gate_configs.append(GateConfig(name=basis_gate, parameters=gate_parameter_map.get(basis_gate), qasm_def=gate_qasm_def_map.get(basis_gate), coupling_map=gate_cm_map.get(basis_gate)))


backend = AerSimulator(
    configuration=BackendConfiguration(backend_name="backend_0", backend_version="1.1.1", n_qubits=20, basis_gates=basis_gates, gates=gate_configs, local=True, simulator=True, conditional=True, memory=True, max_shots=9000, open_pulse=False, dt=1.33, dtm=10.5, coupling_map=full_connected_map, description=""),
    properties=BackendProperties(backend_name="backend_0", qubits=qubits, gates=gates, backend_version="1.1.1", last_update_date="2018-04-02 15:00:00Z", general=general),
    coupling_map=full_connected_map,
    basis_gates=basis_gates,
)