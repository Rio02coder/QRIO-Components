# Experiment 3

This experiment shows the performance of the filtering algorithm of the scheduler on 100 quantum devices with different average two qubit error rates. This mimics the situation where the user asks for devices with a specific maximum two qubit error rate and the scheduler filters from the available devices the set of devices which satisfy the request. This experiment is to show this phenomena. The error rates of these devices are stored in the file `scheduler_filter.py` in this folder. In the real scheduler code this is stored in a similar data structure. Since, we cannot locally run a 100 node kubernetes cluster, we went for a simulated code which perfectly simulates the filtering algorithm of the scheduler.

# How to run ?

If you have a virtual environment already running then you can we keep using that. If not please do follow the following steps

```bash
Create a virtual environment
```

Once that is done run the following command

```bash
python3 scheduler_filter.py
```

The output is similar to the trends shown in experiment 4.5 in the paper. The reason for not being exactly similar is that the backends used during the original evaluation was slightly different to the ones used for the experiments documentation. The reason for this different in the non determinism in probabilistically generating the devices topologies and error rates.
