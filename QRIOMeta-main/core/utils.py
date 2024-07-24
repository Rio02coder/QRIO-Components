from qiskit import transpile
import os
import math
import mapomatic as mm
from abc import ABC, abstractmethod
from qiskit_aer import AerSimulator
from qiskit.circuit import QuantumCircuit
from qiskit.providers import Backend, BackendV2Converter
from qiskit_aer.noise import NoiseModel
from math import pi
from core.models import Circuit
from qiskit import QuantumCircuit, ClassicalRegister
from qiskit.quantum_info import hellinger_fidelity
from qiskit.transpiler import PassManager
from qiskit.transpiler.basepasses import TransformationPass
from qiskit.circuit.measure import Measure
from qiskit.circuit import Clbit
from qiskit_ibm_runtime.fake_provider import FakeJakartaV2, FakeKolkata, FakeMumbaiV2, FakeAthensV2, FakeBrooklynV2, FakeManhattanV2, FakeMontrealV2, FakeNairobiV2, FakeCambridgeV2, FakeCasablancaV2

# @dataclass(frozen=False)
class Backend_NoiseModel:
    """Can't extract the noise model from the backend,
    so we need to store them together."""

    def __init__(self, backend = AerSimulator(), noise_model = NoiseModel(), init_fidelity=1.0, name = "default"):
        self.backend = backend
        self.noise_model = noise_model
        self.init_fidelity = init_fidelity
        self.name = name


class MeasureAllUsedQubitsPass(TransformationPass):
    def run(self, dag):
        """Run the MeasureAllUsedQubitsPass on `dag`."""
        # Track all qubits that have been used in the circuit
        used_qubits = set()
        for node in dag.op_nodes():
            for qubit in node.qargs:
                used_qubits.add(qubit)

        # Ensure there's a classical bit for each qubit
        if len(dag.clbits) < len(used_qubits):
            additional_clbits = len(used_qubits) - len(dag.clbits)
            dag.add_clbits(
                [Clbit(ClassicalRegister(1), 0) for _ in range(additional_clbits)]
            )

        # Add measurement to all used qubits if not already present
        for clbit_idx, qubit in enumerate(used_qubits):
            clbit = dag.clbits[clbit_idx]
            measure = Measure()
            dag.apply_operation_back(measure, qargs=[qubit], cargs=[clbit])
        return dag

def modify_gates(circuit: QuantumCircuit) -> QuantumCircuit:
    qc = QuantumCircuit(circuit.num_qubits)
    for item in circuit:
        if item.operation.name == "rz":
            angle: float = item.operation.params[0]
            angle = angle % (2 * pi)
            if angle == pi or angle == -pi:
                qc.z(item[1])
            elif angle == -pi / 2 or angle == 3 * pi / 2:
                qc.s(item[1])
                qc.z(item[1])
            elif abs(pi / 2 - angle) < 0.01 or abs(angle - 3 * pi / 2) < 0.01:
                qc.s(item[1])
            elif angle == 0:
                pass
            else:
                print(
                    f"warning ! the angle is not multiple of pi/2, instead it is {angle}!"
                )
                raise ValueError(
                    "angle is not multiple of pi/2, instead it is " + str(angle)
                )
        elif item.operation.name != "measure" and item.operation.name != "barrier":
            qc.append(item.copy())
    return qc


def _round_to_closest_angle(x):
    pi_over_two = pi / 2
    # Find the closest multiple of pi/2 by rounding
    closest_multiple = round(x / pi_over_two) * pi_over_two
    closest_multiple_upper = closest_multiple + pi_over_two
    return (
        closest_multiple
        if abs(x - closest_multiple) < abs(x - closest_multiple_upper)
        else closest_multiple_upper
    )


def to_clifford(qc: QuantumCircuit, backend=None, is_clifford: bool = True):
    """Convert a circuit to a clifford circuit, if the backend is provided, the circuit
    will be compiled on the backend first, then convert to clifford circuit
    """
    if backend is not None:
        qc = transpile(
            qc,
            backend.backend,
            coupling_map=backend.backend.configuration().coupling_map,
            optimization_level=3,
            seed_transpiler=170,
        )
    new_qc = QuantumCircuit(qc.num_qubits, qc.num_clbits)
    for i in qc:
        new_i = i.copy()
        if i.operation.name == "rz":
            # create a new operation that round the paras to the closes angle
            # if the angle is not multiple of pi
            if i.operation.params[0] % (pi / 2) != 0:
                new_angle = _round_to_closest_angle(i.operation.params[0])
                new_i.operation.params[0] = new_angle
        new_qc.append(new_i)
    # convert the rotation gates to finite sets of gates, s, z
    return modify_gates(new_qc) if is_clifford else qc


def heli_fide_helper(
    circuit: QuantumCircuit,
    baseline: Backend_NoiseModel,
    backend2: Backend_NoiseModel,
    shots: int = 1000,
    measure: bool = True,
    print_circuit: bool = False
):
    """helper function for heli_fide"""
    if measure:
        pass_manager = PassManager([MeasureAllUsedQubitsPass()])
        circuit = pass_manager.run(circuit)
    if print_circuit:
        print(circuit)
    # ensure the circuit are post transpiled
    res1 = baseline.backend.run(
        circuit, shots=shots, pass_manager=PassManager()
    ).result()
    res2 = backend2.backend.run(
        circuit, shots=shots, pass_manager=PassManager()
    ).result()
    fidelity = hellinger_fidelity(res1.get_counts(), res2.get_counts())
    return fidelity
    
class CircuitScorer(ABC):

    @abstractmethod
    def get_circuit(self, file_path: str) -> QuantumCircuit:
        """Returns a Quantum Circuit"""

    @abstractmethod
    def score_circuit(self, circuit: Circuit , device_name: str):
        """Score Circuit"""

    def get_device(self, device_name):    
        """Get Backend"""
        # The following is the original code for the normal workflow with the tool
        with open(os.getcwd()+f"/core/backends/" + device_name + '.py', 'r') as file:
            content = file.read()
            local_namespace = {}
            exec(content, local_namespace)
            return local_namespace.get('backend')
        
        # Comment everything in this function and uncomment the following for Experiment 2
        # with open(os.getcwd()+f"/core/backends/Experiment_2_backends/" + device_name + '.py', 'r') as file:
        #     content = file.read()
        #     local_namespace = {}
        #     exec(content, local_namespace)
        #     return local_namespace.get('backend')

        # Comment everything in this function and uncomment the following for Experiment 4 & 5
        # with open(os.getcwd()+f"/core/backends/Quantum_devices/{device_name}/" + device_name + '.py', 'r') as file:
        #     content = file.read()
        #     local_namespace = {}
        #     exec(content, local_namespace)
        #     return local_namespace.get('backend')

class FidelityScorer(CircuitScorer):

    def __init__(self):
        super()
        self.penalty_factor = 10.0
    
    def get_circuit(self, file_path: str):
        with open(file_path, "r") as file:
            qasm = file.read()
        return QuantumCircuit.from_qasm_str(qasm)
    
    def score_circuit(self, circuit: Circuit, device_name: str):
        device = BackendV2Converter(super().get_device(device_name=device_name))
        # device = super().get_device(device_name=device_name)
        file_path = circuit.circuit_file.path
        user_desired_fidelity = circuit.fidelity #This assumes fidelity to be not null
        quantum_circuit = self.get_circuit(file_path=file_path)

        # Clifford simulation process
        noise_model = NoiseModel.from_backend(device)
        backend = Backend_NoiseModel(backend=AerSimulator(
            noise_model=noise_model,
            coupling_map=device.coupling_map,
            basis_gates=noise_model.basis_gates,
        ),
        noise_model=noise_model,
        init_fidelity=1.0,
        name=device.name)
        # This is the fidelity of the original circuit converted to a clifford circuit.
        achieved_fidelity = heli_fide_helper(to_clifford(quantum_circuit, backend=backend, is_clifford=True), Backend_NoiseModel(), backend, shots=900, measure=True)

        # Uncomment for Experiment 5
        # # This is the fidelity of the original circuit converted to a clifford circuit.
        # print_circuit = False
        # if (circuit.name == 'circ1' and device_name == 'backend_100') or(circuit.name == 'bv' and device_name == 'backend_0'):
        #     print_circuit = True
        # achieved_fidelity = heli_fide_helper(to_clifford(quantum_circuit, backend=backend, is_clifford=True), Backend_NoiseModel(), backend, shots=900, measure=True, print_circuit=print_circuit)
        # # This is the fidelity of the original circuit not converted to a clifford circuit
        # oracle_fidelity = heli_fide_helper(to_clifford(quantum_circuit, backend=backend, is_clifford=False), Backend_NoiseModel(), backend, shots=900, measure=False, print_circuit=print_circuit)
        #Scoring process
        diff = abs(user_desired_fidelity - achieved_fidelity)
        if achieved_fidelity < user_desired_fidelity:
            diff *= self.penalty_factor

        # diff_2 = abs(user_desired_fidelity - oracle_fidelity)
        # if oracle_fidelity < user_desired_fidelity:
        #     diff_2 *= self.penalty_factor

        return diff
        # return diff, diff_2, achieved_fidelity, oracle_fidelity

class TopologyScorer(CircuitScorer):
    def get_circuit(self, file_path: str) -> QuantumCircuit:
        with open(file_path, 'r') as file:
            content = file.read()
            # Dynamically execute the content of the file in a local namespace
            local_namespace = {}
            exec(content, local_namespace)
            return local_namespace.get('qc')

    def score_circuit(self, circuit: Circuit, device_name: str):
        file_path = circuit.circuit_file.path
        device = super().get_device(device_name=device_name)
        quantum_circuit: QuantumCircuit = self.get_circuit(file_path)
        trans_qc = transpile(quantum_circuit, device)
        print(trans_qc)
        small_qc = mm.deflate_circuit(trans_qc)
        layouts = mm.matching_layouts(small_qc, device)
        scores = mm.evaluate_layouts(small_qc, layouts, backend=device)
        if len(scores) == 0:
            print("Score Empty")
            return 0.01
        return scores[0][1]
