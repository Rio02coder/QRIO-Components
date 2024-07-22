
# Use base image
FROM python:3.8

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update &&     apt-get install -y build-essential libhdf5-dev

# Copy the application files
COPY bv-py.py bv.qasm requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the application
CMD ["python", "./bv-py.py"]
    