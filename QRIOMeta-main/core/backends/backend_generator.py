import random
import json
import os
import pprint
import networkx as nx
from numpy.random import normal
from qiskit_aer import AerSimulator
from qiskit.transpiler import CouplingMap
from qiskit_aer import AerSimulator
from qiskit.providers.models import BackendProperties, Nduv, GateProperties, GateConfig, BackendConfiguration, QasmBackendConfiguration

edge_probability_list = [0.1, 0.15, 0.3, 0.45, 0.54, 0.67, 0.7, 0.78, 0.89, 0.98]
qubit_list = [15, 20, 27, 35, 50, 60, 78, 85, 95, 100]




# Create a directory to save backend files if it doesn't exist




qubit_props = ['T1', 'T2', 'readout_error', 'readout_length']
unit_map = {'T1': "us", 'T2': "us", 'readout_error': '', 'readout_length': 'ns'}
value_map = {'T1': normal(500e3, 100e3), 'T2': normal(500e3, 100e3), 'readout_error': normal(0.15, 0.05), 'readout_length': 30}
gate_error = normal(0.01, 0.04)
basis_gates = ["ry","rz","cx"]


def build_backend(num_qubits, edge_probability, backend_name):
    qubits = []
    gates = []
    gate_configs = []
    single_qubits = []
    interactions = []

    for i in range(num_qubits):
        qubit_prop = []
        for prop in qubit_props:
            qubit_prop.append(Nduv(date="2018-04-02 15:00:00Z", name=prop, unit=unit_map.get(prop), value=value_map.get(prop)))
        qubits.append(qubit_prop)

    #Single qubit gates

    for gate in basis_gates:
        if gate != 'cx':
            for i in range(num_qubits):
                single_qubits.append([i])
                gates.append(GateProperties(qubits=[i], gate=gate, parameters=[Nduv(date="2018-04-02 15:00:00Z", name='gate_error', unit="", value=gate_error)]))

    coupling_map = CouplingMap()

    for i in range(num_qubits):
        coupling_map.add_physical_qubit(i)

    for i in range(num_qubits):
        is_connected = False
        for j in range(i + 1, num_qubits):
            prob = random.random()
            if prob < edge_probability:
                is_connected = True
                coupling_map.add_edge(i, j)
                gates.append(GateProperties(qubits=[i,j], gate="cx", parameters=[Nduv(date="2018-04-02 15:00:00Z", name='gate_error', unit="", value=gate_error)]))
                interactions.append([i,j])
                # add_interaction(i,j, interactions, gates, coupling_map)
        if not is_connected:
            coupling_map.add_edge(i, 0)
            gates.append(GateProperties(qubits=[i,0], gate="cx", parameters=[Nduv(date="2018-04-02 15:00:00Z", name='gate_error', unit="", value=gate_error)]))
            interactions.append([i,0])
            

    general = [Nduv(date="2018-04-02 15:00:00Z", name='fridge_temperature', unit="mK", value=10)]

    gate_parameter_map = {"u1":["lambda"], "u2":["phi","lambda"], "u3": ["theta","phi","lambda"], "cx": []}
    gate_qasm_def_map = {"u1": "gate u1(lambda) q { U(0,0,lambda) q; }", "u2": "gate u2(phi,lambda) q { U(pi/2,phi,lambda) q; }", "u3" : "u3(theta,phi,lambda) q { U(theta,phi,lambda) q; }", "cx": "gate cx q1,q2 { CX q1,q2; }"}
    gate_cm_map = {"u1": single_qubits, "u2": single_qubits, "u3": single_qubits, "cx": interactions}


    for basis_gate in basis_gates:
        gate_configs.append(GateConfig(name=basis_gate, parameters=gate_parameter_map.get(basis_gate), qasm_def=gate_qasm_def_map.get(basis_gate), coupling_map=gate_cm_map.get(basis_gate)))

    return AerSimulator(
        configuration=BackendConfiguration(backend_name=backend_name, backend_version="1.1.1", n_qubits=num_qubits, basis_gates=basis_gates, gates=gate_configs, local=True, simulator=True, conditional=True, memory=True, max_shots=9000, open_pulse=False, dt=1.33, dtm=10.5, coupling_map=coupling_map, description="A quantum backend"),
        properties=BackendProperties(backend_name=backend_name, qubits=qubits, gates=gates, backend_version="1.1.1", last_update_date="2018-04-02 15:00:00Z", general=general),
        coupling_map=coupling_map,
        basis_gates=basis_gates,
    )


def add_interaction(i, j, interactions, gates, coupling_map):
    interactions.append([i,j])
    gates.append(GateProperties(qubits=[i,j], gate="cx", parameters=[Nduv(date="2018-04-02 15:00:00Z", name='gate_error', unit="", value=gate_error)]))
    coupling_map.add_edge(i, j)



def build_backend_json(num_qubits, edge_probability, backend_name):
    qubits = []
    gates = []
    gate_configs = []
    single_qubits = []
    interactions = []
    gate_error = random.uniform(0.02, 0.04)

    G = nx.Graph()
    
    # Add all qubits as nodes
    G.add_nodes_from(range(num_qubits))
    
    # Ensure each qubit has at least one connection initially
    for i in range(num_qubits - 1):
        G.add_edge(i, i + 1)
    G.add_edge(num_qubits - 1, 0)  # Close the loop to ensure connectivity
    
    # Add additional edges based on the edge probability, without exceeding 4 connections per qubit
    for i in range(num_qubits):
        for j in range(i + 1, num_qubits):
            if random.random() < edge_probability and G.degree[i] < 4 and G.degree[j] < 4:
                G.add_edge(i, j)
    
    # Ensure no qubit has more than 4 connections
    for node in list(G.nodes):
        while G.degree[node] > 4:
            neighbors = list(G.neighbors(node))
            edge_to_remove = random.choice(neighbors)
            G.remove_edge(node, edge_to_remove)
    
    # Ensure the graph is still connected
    while not nx.is_connected(G):
        # Randomly select a pair of nodes that are not connected and have less than 4 connections
        possible_edges = [(u, v) for u, v in nx.non_edges(G) if G.degree[u] < 4 and G.degree[v] < 4]
        if possible_edges:
            edge_to_add = random.choice(possible_edges)
            G.add_edge(*edge_to_add)
        else:
            break  # No more edges can be added without exceeding the degree constraint
    
    # Extract the coupling map from the graph edges
    cl = []
    for edge in G.edges:
        cl.append(edge)
        cl.append((edge[1], edge[0]))


    # coupling_map = CouplingMap.from_full(num_qubits)

    coupling_map = CouplingMap(cl)

    for i in range(num_qubits):
        qubit_prop = []
        for prop in qubit_props:
            prop_dict = {
                "date":"2018-04-02 15:00:00Z",
                "name":f'{prop}',
                "unit":unit_map.get(prop),
                "value":value_map.get(prop)
            }
            qubit_prop.append(prop_dict)
        qubits.append(qubit_prop)

    #Single qubit gates

    for i in range(num_qubits):
        single_qubits.append([i])

    for gate in basis_gates:
        if gate != 'cx':
            for i in range(num_qubits):
                gate_prop = {
                    "qubits":[i],
                    "gate":f'{gate}',
                    "parameters":[{
                        'date':"2018-04-02 15:00:00Z",
                        'name':"gate_error",
                        'unit':"",
                        'value':gate_error
                    }]
                }
                gates.append(gate_prop)

    # coupling_map = CouplingMap.from_grid(10,10)

    for edges in coupling_map.get_edges():
        i = edges[0]
        j = edges[1]
        gate_prop = {
                    "qubits":[i,j],
                    "gate":'cx',
                    "parameters":[{
                        'date':"2018-04-02 15:00:00Z",
                        'name':"gate_error",
                        'unit':"",
                        'value':gate_error
                    }]
                }
        gates.append(gate_prop)
        interactions.append([i,j])
            
    general = [{
        'date':"2018-04-02 15:00:00Z",
        'name':"fridge_temperature",
        'unit':"mK",
        'value':'10'
    }]

    gate_parameter_map = {"u1":["lambda"], "u2":["phi","lambda"], "u3": ["theta","phi","lambda"], "rz": ["theta"], "cx": []}
    gate_qasm_def_map = {"u1": "gate u1(lambda) q { U(0,0,lambda) q; }", "u2": "gate u2(phi,lambda) q { U(pi/2,phi,lambda) q; }", "u3" : "u3(theta,phi,lambda) q { U(theta,phi,lambda) q; }", "rz": "gate rz(theta) q { U(0, 0, theta) q; }", "cx": "gate cx q1,q2 { CX q1,q2; }"}
    gate_cm_map = {"u1": single_qubits, "u2": single_qubits, "u3": single_qubits, "rz": single_qubits, "cx": interactions}


    
    for basis_gate in basis_gates:
        gate_config = {
            'name': f'{basis_gate}',
            'parameters': gate_parameter_map.get(basis_gate),
            'qasm_def': gate_qasm_def_map.get(basis_gate),
            'coupling_map': gate_cm_map.get(basis_gate)
        }
        gate_configs.append(gate_config)


    
    configuration = {
        'backend_name': backend_name,
        'backend_version': "1.1.1",
        'n_qubits': num_qubits,
        'basis_gates': basis_gates,
        'gates': gate_configs,
        'local': 'true',
        'simulator': 'true',
        'conditional': 'true',
        'memory': 'true',
        'max_shots': 9000,
        'dt': 1.33,
        'dtm': 10.5,
        'open_pulse': 'false',
        'coupling_map': interactions,
        'description': f'A {num_qubits} qubit backend'
    }

    properties = {
        'backend_name': backend_name,
        'backend_version': "1.1.1",
        'qubits': qubits,
        'gates': gates,
        'last_update_date': "2018-04-02 15:00:00Z",
        'general': general
    }
    print(gate_error)
    return properties, configuration


def save_json_to_file(json_string, file_path):
    with open(file_path, "w") as json_file:
        json.dump(json_string, json_file, indent=4)



def generate_fake_backend_text(backend_type: str, backend_class: str, ) -> str:
    import_text = "import os\n"
    import_text += "from qiskit.providers.models import BackendProperties, QasmBackendConfiguration"
    from_import_text = "from qiskit_ibm_runtime.fake_provider import fake_pulse_backend, fake_backend\n\n"
    
    class_text = f"class FakeAthensV2({backend_class}.FakeBackendV2):\n"
    class_text += "\t\"\"\"A fake 5 qubit backend.\"\"\"\n\n"
    class_text += "\tdirname = os.path.dirname(__file__)  # type: ignore\n"
    class_text += "\tconf_filename = \"conf_athens.json\"  # type: ignore\n"
    class_text += "\tprops_filename = \"props_athens.json\"  # type: ignore\n"
    class_text += "\tdefs_filename = \"defs_athens.json\"  # type: ignore\n"
    class_text += "\tbackend_name = \"fake_athens\"  # type: ignore\n\n"

    

    class_text += f"class FakeAthens({backend_type}.FakePulseBackend):\n"
    class_text += "\t\"\"\"A fake 5 qubit backend.\"\"\"\n\n"
    class_text += "\tdirname = os.path.dirname(__file__)  # type: ignore\n"
    class_text += "\tconf_filename = \"conf_athens.json\"  # type: ignore\n"
    class_text += "\tprops_filename = \"props_athens.json\"  # type: ignore\n"
    class_text += "\tdefs_filename = \"defs_athens.json\"  # type: ignore\n"
    class_text += "\tbackend_name = \"fake_athens\"  # type: ignore\n"

    return import_text + from_import_text + class_text


if not os.path.exists("Quantum_devices"):
    os.makedirs("Quantum_devices")
BASE_DIR = 'Quantum_devices'
idx = 0
for i in qubit_list:
    for j in edge_probability_list:
        os.makedirs(f'{BASE_DIR}/backend_{idx}')
        properties, config = build_backend_json(i, j, f'backend_{idx}')
        prop_formatted_dict = pprint.pformat(properties, indent=4)
        config_formatted_dict = pprint.pformat(config, indent=4)
        properties_filename = 'properties.json'
        configuration_filename = 'configuration.json'
        filename = f"backend_{idx}.py"
        filepath = os.path.join(BASE_DIR, f'backend_{idx}', filename)
        with open(filepath, "w") as python_file:
            python_file.write("from qiskit.providers.models import BackendProperties, QasmBackendConfiguration\n")
            python_file.write("from qiskit_aer import AerSimulator\n")
            python_file.write(f"prop_dict = {prop_formatted_dict}\n")
            python_file.write(f"config_dict = {config_formatted_dict}\n")
            python_file.write(f"backend = AerSimulator(properties=BackendProperties.from_dict(prop_dict), configuration=QasmBackendConfiguration.from_dict(config_dict), basis_gates=['u1','u2','u3','rz','cx'])")
        idx = idx + 1

