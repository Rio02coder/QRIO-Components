# This file perfectly simulates the ranking code of the scheduler.
# Code also compares the score of the device chosen by a random choice strategy and by the strategy of QRIO scheduler (choosing the device with the lowest score)

import requests
import random

# URL to which the POST request is sent
upload_url = 'http://<META-SERVER-IP>:8000/upload-fidelity/'

default_topologies = ['bv', 'hsp', 'rep', 'grover', 'circ1', 'circ2']

for default_topology in default_topologies:
    form_data = {
        'name': default_topology,
        'fidelity': 1
    }

    file_path = f'./{default_topology}.qasm'

    files = {
        'file': (file_path, open(file_path, 'rb'), 'text/x-python')
    }

    response = requests.post(upload_url, data=form_data, files=files)

    if response.status_code == 200:
        print('Request was successful.')
    else:
        print('Request failed.')
        print('Status Code:', response.status_code)

for default_topology in default_topologies:
    for j in range(1):
        random_number = random.randint(0,99)
        random_score = 0
        random_fidelity = 0
        low_score = 10000
        low_oracle_score = 10000
        scheduled_fidelity = 0
        original_circuit_scheduled_fidelity = 0
        scheduled_oracle_fidelity = 0
        oracle_backend = ''
        original_backend = ''
        data = []
        for i in range(100):
            url = f'http://<META-SEVER-IP>:8000/get-score/{default_topology}/backend_{i}/'
            response = requests.get(url=url)
            response_json = response.json()
            fidelity = response_json['fidelity']
            # This is the fidelity of the circuit not converted to clifford
            original_fidelity = response_json['oracle_fidelity']
            data.append(original_fidelity)
            if fidelity >= scheduled_fidelity:
                scheduled_fidelity = fidelity
                original_circuit_scheduled_fidelity = original_fidelity
                original_backend = f'backend_{i}'
            if original_fidelity >= scheduled_oracle_fidelity:
                scheduled_oracle_fidelity = original_fidelity
                oracle_backend = f'backend_{i}'
            if i == random_number:
                random_fidelity = original_fidelity
        print(f'{default_topology} Round {j}')
        print("random fidelity", random_fidelity)
        print("scheduled device fidelity", original_circuit_scheduled_fidelity)
        print("Oracle fidelity", scheduled_oracle_fidelity) 
        print("Oracle backend", oracle_backend) 
        print("Original backend", original_backend) 
        print("Average fidelity", sum(data) / len(data))
        sorted_data = sorted(data)
        n = len(sorted_data)
        if n % 2 == 0:
            print("Median Fidelity", (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2)
        else:
            print("Median Fidelity", sorted_data[n//2])
        print('################')

# Notice the Meta server's terminal output when the following code runs
# For each of the two requests, the circuit which prints first is the clifford converted circuit
# and the circuit which follows is the original circuit. The thing to note here is that for 'grover' or url 1,
# the circuits are same and for the second the circuits are different.
print("Look at the terminal running QRIOMeta-Server and observe the logs")
url = f'http://<META-SERVER-IP>:8000/get-score/bv/backend_{0}/'
url_2 = f'http://<META-SERVER-IP>:8000/get-score/circ1/backend_{100}/'
requests.get(url=url)
requests.get(url=url_2)