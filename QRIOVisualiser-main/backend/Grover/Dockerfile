
FROM python:3.8
# Set the working directory to /app
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY GroverCircuit.py .
COPY Grover.qasm .
COPY requirements.txt .

# Install system dependencies
RUN apt-get update &&     apt-get install -y build-essential libhdf5-dev
# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# Run GroverCircuit.py when the container launches
CMD ["python", "./GroverCircuit.py"]
    