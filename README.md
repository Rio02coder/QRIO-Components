# QRIO Components

Demo video drive link: https://drive.google.com/file/d/1HTfthhcSC0FUswhxCshzbNE1sEZ9NKRA/view?usp=drivesdk

# Setup QRIO Meta server

To setup the QRIO meta server we require to create backends. First we need to: `cd QRIOMeta-main/core/backends` and then change the files `qrio-m02`, `qrio-m03` up till `qrio-m11`. These files are the initial IBM quantum backends we have placed as an example. However, we require to change these to reflect the backends in each node in the cluster. Also, the number of files to modify/create here are the `number nodes in the cluster - 1` (as one of the nodes in the cluster will be the master server and no job is scheduled there). Additionally, we can ignore other files currently in the directory.

# Running QRIO Meta server

When the setup of QRIO meta is done, we can run it in the following way:

1. cd `QRIOMeta-main` from the root of the project.
2. Create a virtual environment for Python
3. `pip install -r requirements.txt`
4. `python3 manage.py showmigrations`
5. `python3 manage.py makemigrations`
6. `python3 manage.py migrate`
7. `python3 manage.py runserver <IP ADDRESS-WHICH-IS-NOT-LOCALHOST>:8000`

# Setup QRIO Visualizer

To setup the QRIO Visualizer we simply require to change the endpoints of the Meta server and Master server. To do so, first `cd QRIOVisualiser-main/frontend/src/backend/server.ts` from the root directory of the project. It is necessary that you do not run the metaserver in `localhost`

# Running QRIO Visualizer

We need to first ensure that the most recent version of `node` and `React` is installed in the system. Following that, we can perform the following steps:

1. `cd QRIOVisualiser-main/frontend`
2. `npm install`
3. `npm start`

# Setup the cluster

To setup the cluster, one must have the following setup(In a real setting this is usually the job of the Vendor):

1. Docker (Once setup make sure that you are logged in to your docker account in docker hub. This can be made sure using commands for docker login.
   The login step is crucial as the master server will your namespace which is linked to your docker account to upload docker containers.)
   https://docs.docker.com/desktop/install/mac-install/ - Docker for mac installation
   https://hub.docker.com - Docker hub
   Once again, make sure you are logged in to your docker hub account in your docker desktop.
2. Kubernetes
3. Kubectl
   Kubernetes and Kubectl installation on mac - https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/
4. Minikube
   Minikube installation: https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Fx86-64%2Fstable%2Fbinary+download

Once setup run the following command in the root directory of your system to setup the minikube cluster:

```bash
  minikube start -p qrio -n <ENTER THE NUMBER OF NODES FOR THE CLUSTER>
```

Once the command finishes executing you should be having the set number of nodes in the minikube cluster with the node labelled `qrio` as the master node and other nodes as `qrio-m02`, `qrio-m03` and so on.

Once the cluster nodes are setup we need to set some properties for each node. These properties include the number of qubits, error rates and other characteristics like T1, T2 times for the device. We generally suggest the vendor to set these properties. However, we provided a `setup.sh` file which has a configuration for certain IBM devices. These IBM devices are Fake backends created by IBM.

To run the setup file, we need to do have two terminals opened. In one of the terminals run the following command

```bash
kubectl proxy
```

In the other terminal run the following command

```bash
cd <DIRECTORY WHERE THE PROJECT IS STORED>
run setup.sh
```

# Setup Quantum Nodes in the cluster

Once the cluter is setup we require to setup the Quantum devices in each node(except the master node).
To do so, perform the following for all nodes except the master node (or control plane node in Kubernetes terminology)

1. Log in to the node
   `sudo docker exec -it <NODE-NAME> bash`

2. Create a file called `backend.py`

```bash
# Note that whatever backend you create, it has to be a Qiskit backend and must be exposed in a variable called backend
backend = <YOUR QUANTUM BACKEND AS A QISKIT BACKEND>
```

As example backends we have provided some IBM fake backends in the files `qrio-m02.py` to `qrio-m11.py` in the root directory `QRIOMeta-main/core/backends` (This is considering a 11 node cluster. So, we have 10 worker nodes and 1 master node).
The contents of these files can be placed in `backend.py` in the worker nodes in the cluster.

# Setup the scheduler

We need to first register the IP address and of the meta server in the scheduler.

To do so, first `cd QRIO-Components/scheduler-plugins-master/pkg/circuitnoise/NodeData.go`. In line 26 enter ip address of the meta server you have registered in the QRIO Visualizer.

To setup the scheduler of QRIO, we require to build its docker image.

To do so, first `cd` to `scheduler-plugins-master` inside `QRIO Components` and then to `hack`. In the file `build-images.sh` change line 26 to 29 to reflect your docker registry.

Once done, get back to `scheduler-plugins-master` and run the following command:

```bash
make local-image
```

Once the image is built, run the following command

```bash
docker push <REGISTRY/IMAGE_NAME:TAG>
```

the values for these were set by you in `QRIO Components/scheduler-plugins-master/hack/build-images.sh`

We now require to set this scheduler in the cluster. To do so, perform the following steps:

1. Log in to the master node of the cluster

```bash
sudo docker exec -it qrio bash
```

2. Backup the original kubernetes scheduler

```bash
cp /etc/kubernetes/manifests/kube-scheduler.yaml /etc/kubernetes/kube-scheduler.yaml
```

3. Create `etc/kubernetes/circuitnoise-config.yaml`

```bash
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: "/etc/kubernetes/scheduler.conf"
profiles:
  - schedulerName: default-scheduler
    plugins:
      score:
        disabled:
          - name: "*"
        enabled:
          - name: CircuitNoise
```

4. Rewrite `/etc/kubernetes/manifests/kube-scheduler.yaml` The final version should look like this:

```bash
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    component: kube-scheduler
    tier: control-plane
  name: kube-scheduler
  namespace: kube-system
spec:
  containers:
    - command:
        - kube-scheduler
        - --authentication-kubeconfig=/etc/kubernetes/scheduler.conf
        - --authorization-kubeconfig=/etc/kubernetes/scheduler.conf
        - --bind-address=127.0.0.1
        - --kubeconfig=/etc/kubernetes/scheduler.conf
        - --config=/etc/kubernetes/circuitnoise-config.yaml
      image: shmeelok/kube-scheduler:v0.0.14
      imagePullPolicy: IfNotPresent
      livenessProbe:
        failureThreshold: 8
        httpGet:
          host: 127.0.0.1
          path: /healthz
          port: 10259
          scheme: HTTPS
        initialDelaySeconds: 10
        periodSeconds: 10
        timeoutSeconds: 15
      name: kube-scheduler
      resources:
        requests:
          cpu: 100m
      startupProbe:
        failureThreshold: 24
        httpGet:
          host: 127.0.0.1
          path: /healthz
          port: 10259
          scheme: HTTPS
        initialDelaySeconds: 10
        periodSeconds: 10
        timeoutSeconds: 15
      volumeMounts:
        - mountPath: /etc/kubernetes/scheduler.conf
          name: kubeconfig
          readOnly: true
        - mountPath: /etc/kubernetes/circuitnoise-config.yaml
          name: circuitnoise-config
          readOnly: true
  hostNetwork: true
  priority: 2000001000
  priorityClassName: system-node-critical
  securityContext:
    seccompProfile:
      type: RuntimeDefault
  volumes:
    - hostPath:
        path: /etc/kubernetes/scheduler.conf
        type: FileOrCreate
      name: kubeconfig
    - hostPath:
        path: /etc/kubernetes/circuitnoise-config.yaml
        type: FileOrCreate
      name: circuitnoise-config
```

Once done, we can check the installation with the following command.

```bash
kubectl get pods -n kube-system
```

We should see all pods with a status of `Running`

# Setup QRIO Master server

The QRIO master server is pretty lightweight to setup. We only need to go to line 35 in QRIOVisualiser-main/backend/utils/Processor/Request/SubmitJob.ts and enter your docker namespace which is available in your docker hub when you login. This is really important as the master server uploads the created docker containers to this namespace.

# Running QRIO Master server

We need to first ensure that the most recent version of `node` is installed in the system. Following that, we can perform the following steps:

1. `cd QRIOVisualiser-main/backend`
2. `npm run build`
3. `npm run start`

Once all the components are setup and running, we can start interacting with the cluster through QRIO Visualizer.

# Experiments

Once all the above instructions are followed we can start running the experiments. We recommend going through them in order. Experiment 1 - Experiment 5. The details on how to run these experiments are given in their individual folders.

An IMPORTANT NOTE: Since these experiments (2-5) use a custom backend we can have issues with transpilation as mentioned in this GitHub issue: https://github.com/Qiskit/qiskit/pull/11333/commits/735e958e36026bc0981c0f3627106c47e6ae8ac7#diff-00276708f86c726ae04a2c670e74177eaad6aad971e017951bb5792501d13bf5 To fix this, go the virtual env folder of QRIOMeta-main folder and then to lib/python3.11/site-packages/qiskit/transpiler/target.py line 581 and replace that with `return qargs - {None}` . This fix is suggested by this GitHub issue.
