
# with open(os.getcwd()+f"/core/backends/Quantum_devices_4/{device_name}/" + device_name + '.py', 'r') as file:
#             content = file.read()
#             local_namespace = {}
#             exec(content, local_namespace)
#             return local_namespace.get('backend')


# for basis_gate in backend.configuration().basis_gates:
#     print('>>', basis_gate)
#     for gate_props in backend_props.gates:
#         data = gate_props.to_dict()
#         if data['gate'] == basis_gate:
#             for param in data['parameters']:
#                 if param['name'] == 'gate_error':
#                     print('  ', data['qubits'], param['value'])