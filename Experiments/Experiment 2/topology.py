import requests

# URL to which the POST request is sent
upload_url = 'http://<META-SERVER-URL>:8000/upload-circuit/'


# Form data to be sent in the POST request
form_data = {
    'name': 'example-topology',
}

# Path to the Python file to be uploaded
file_path = './topology-circuit.py'

# File to be uploaded
files = {
    'file': ('topology-circuit.py', open(file_path, 'rb'), 'text/x-python')
}

# Send the POST request with form data and file
response = requests.post(upload_url, data=form_data, files=files)

# Check the status code of the response
if response.status_code == 200:
    print('Request was successful.')
else:
    print('Request failed.')
    print('Status Code:', response.status_code)


# This is the code which perfectly simulates the ranking code for the actual scheduler

# These are the filtered devices which are capable of running the circuit.
# In the real scheduler code this would be identical to the actual filtered devices
filtered_devices = ['backend_0', 'backend_1', 'backend_2']

score = 10000 # A high number
best_device = ''

for filtered_device in filtered_devices:
    url = f'http://<META-SERVER-URL>:8000/get-score/example-topology/{filtered_device}/'
    response = requests.get(url=url)
    response_json = response.json()
    if response_json['score'] < score:
        score = response_json['score']
        best_device = filtered_device
    

print(best_device)

