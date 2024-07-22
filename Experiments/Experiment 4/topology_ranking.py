# This file perfectly simulates the ranking code of the scheduler.
# Code also compares the score of the device chosen by a random choice strategy and by the strategy of QRIO scheduler (choosing the device with the lowest score)

import requests
import random

# URL to which the POST request is sent
upload_url = 'http://<META-SERVER-IP>:8000/upload-circuit/'


default_topologies = ['full','grid','h_square','line','ring']

for default_topology in default_topologies:
    form_data = {
        'name': default_topology
    }

    file_path = f'./{default_topology}.py'

    files = {
        'file': ('topology-circuit.py', open(file_path, 'rb'), 'text/x-python')
    }

    response = requests.post(upload_url, data=form_data, files=files)

    if response.status_code == 200:
        print('Request was successful.')
    else:
        print('Request failed.')
        print('Status Code:', response.status_code)

# In the real scheduler we would have a filter step, however since all the devices are eligible for the topologies passed, we skip it.


# Ranking step (this also compares the two ranking strategies)

result = {}


for default_topology in default_topologies:
    diff_score = 0
    for j in range(2):
        random_number = random.randint(0,99)
        random_score = 0
        low_score = 10000
        for i in range(100):
            url = f'http://<META-SERVER-IP>:8000/get-score/{default_topology}/backend_{i}/'
            response = requests.get(url=url)
            response_json = response.json()
            score = response_json['score']
            if score <= low_score:
                low_score = score
            if i == random_number:
                random_score = score
        print(f'{default_topology} Round {j}')
        print("random score", random_score)
        print("lowest_Score", low_score)
        print('################')
        diff_score = diff_score + (random_score - low_score)
    
    result[default_topology] = diff_score / 2

print(result)
        
    
