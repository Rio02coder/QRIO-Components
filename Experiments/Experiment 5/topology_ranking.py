# This file perfectly simulates the ranking code of the scheduler.
# Code also compares the score of the device chosen by a random choice strategy and by the strategy of QRIO scheduler (choosing the device with the lowest score)

import requests
import random

# URL to which the POST request is sent
upload_url = 'http://127.0.0.1:8000/upload-fidelity/'

default_topologies = ['bv','grover','hsp','rep','circ1', 'circ2']

# for default_topology in default_topologies:
#     form_data = {
#         'name': default_topology,
#         'fidelity': 0.99
#     }

#     file_path = f'./{default_topology}.qasm'

#     files = {
#         'file': (file_path, open(file_path, 'rb'), 'text/x-python')
#     }

#     response = requests.post(upload_url, data=form_data, files=files)

#     if response.status_code == 200:
#         print('Request was successful.')
#     else:
#         print('Request failed.')
#         print('Status Code:', response.status_code)


for default_topology in default_topologies:
    for j in range(1):
        random_number = random.randint(0,99)
        random_score = 0
        random_fidelity = 0
        low_score = 10000
        low_oracle_score = 10000
        scheduled_fidelity = 0
        scheduled_oracle_fidelity = 0
        for i in range(100):
            url = f'http://127.0.0.1:8000/get-score/{default_topology}/backend_{i}/'
            response = requests.get(url=url)
            response_json = response.json()
            score = response_json['score']
            oracle_score = response_json['oracle_score']
            fidelity = response_json['fidelity']
            oracle_fidelity = response_json['oracle_fidelity']
            if score <= low_score:
                low_score = score
                scheduled_fidelity = fidelity
            if oracle_score <= low_oracle_score:
                low_oracle_score = oracle_score
                scheduled_oracle_fidelity = oracle_fidelity
            if i == random_number:
                random_score = score
                random_fidelity = fidelity
        print(f'{default_topology} Round {j}')
        print("random score", random_score)
        print("lowest_Score", low_score)
        print("lowest oracle score", low_oracle_score)
        print("random fidelity", random_fidelity)
        print("scheduled device fidelity", scheduled_fidelity)
        print("Oracle fidelity", scheduled_oracle_fidelity) 
        print('################')