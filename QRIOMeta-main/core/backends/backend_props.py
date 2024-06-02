from qiskit_ibm_runtime.fake_provider import FakeJakartaV2,FakeJakarta, FakeKolkataV2, FakeMumbaiV2, FakeAthensV2, FakeBrooklynV2, FakeManhattanV2, FakeMontrealV2, FakeNairobiV2, FakeCambridgeV2, FakeCasablancaV2
from qiskit_aer.noise import NoiseModel
from qiskit.quantum_info import average_gate_fidelity

device_props = {}

backend_list = [FakeJakartaV2(), FakeKolkataV2(), FakeMumbaiV2(), FakeAthensV2(), FakeBrooklynV2(), FakeManhattanV2(), FakeMontrealV2(), FakeNairobiV2(), FakeCambridgeV2(), FakeCasablancaV2()]

def get_T1(backend, qubit):
    return backend.qubit_properties(qubit).t1

def get_T2(backend, qubit):
    return backend.qubit_properties(qubit).t2

def get_readout_error(backend, qubit):
    return backend.target["measure"][(qubit,)].error

def get_error_rate(backend, gate):
    return backend.target["cx"][gate].error

qubit_prop_list = ['t1', 't2', 'readout']
gate_prop_list = ['error_rate']
qubit_command_dict = {'t1': get_T1, 't2': get_T2, 'readout': get_readout_error}
gate_command_dict = {'error_rate': get_error_rate}

def avg_qubit_val_for_prop(backend, prop_string):
    avg = 0.0
    for qubit in range(backend.num_qubits):
        avg = avg + qubit_command_dict[prop_string](backend, qubit)
    return avg / backend.num_qubits

def avg_gate_val_for_prop(backend, prop_string):
    avg = 0.0
    for gate in backend.target["cx"]:
        avg = avg + gate_command_dict[prop_string](backend, gate)
    return avg / len(backend.target["cx"])

# min_val = 1
# max_val = -1
# for backend in backend_list:
#     prop = {"qubits" : backend.num_qubits}
#     for qubit_prop in qubit_prop_list:
#         ans = avg_qubit_val_for_prop(backend, qubit_prop)
#         prop["avg"+qubit_prop] = ans

#     for gate_prop in gate_prop_list:
#         ans = avg_gate_val_for_prop(backend, gate_prop)
#         min_val = min(min_val, ans)
#         max_val = max(max_val, ans)
#         prop["avg"+gate_prop] = ans

#     device_props[backend.name] = prop

# print(device_props)
# print(min_val)
# print(max_val)

backend = FakeJakarta()  
noise = NoiseModel.from_backend(backend)

cx_error = noise._local_quantum_errors['cx'][(1,0)]
error_cal = 1 - average_gate_fidelity(cx_error)
error_rep = backend.properties().gate_error('cx',(1,0))

print(f'gate error from noise model: {error_cal:0.2%}')
print(f'gate error from backend: {error_rep:0.2%}')

## avgt1 = 0.00010989992554871337 * 10^5 = 10.9 => 10.9 * 1000 = 10900
## If user specifies a t1 time, it means that it is the maximum the user can tolerate.

## avgt1 and avgt2 the user specifies the minimum it wants.

## 'avgreadout': 0.024599999999999955 = 0.0245 * 10000 = 245 : 10000 - 245 

## t1: min: 