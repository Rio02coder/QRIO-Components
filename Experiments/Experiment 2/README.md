# Experiment 2

This experiment is meant to try out the topology ranking accuracy of the scheduler. For this part we will not be focusing on the tool as we are not concerned with the job running. However, this experiment is just concerned with the selection of the device which confirms to the desired topology.

The overview is that we have three different backends - `backend_0`, `backend_1`, `backend_2` in QRIOMeta-main . There is a `topology-circuit.py` file in this folder which signifies the topology the user wants to have. We have chosen this topology exactly similar to the experiment 4.4 in the paper. Moreover, this topology is exactly similar to `backend_0`. So, the scheduler will choose the `backend_0` all the time and this is what this experiment using the simulated scheduler ranking code in `topology.py`.

# How to run ?

If you have a virtual environment already running and has `requests` installed then you can we keep using that. If not please do follow the following steps

```bash
Create a virtual environment
pip install requests
```

In topology.py we need to enter the META-SERVER-IP in line 4 and line 41

We need to do one change in QRIOMeta-main

Go to QRIOMeta-main/core/utils.py uncomment 164 to 168 and comment everything else

Once that is done run the following command

```bash
python3 topology.py
```

This should output `backend_0`
