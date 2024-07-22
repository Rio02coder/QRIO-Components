# Experiment 5

This experiment evaluates the performance of QRIO for the fidelity ranking aspect of the scheduler. This basically compares the following algorithms: Random scheduler, QRIO simulated scheduler and Oracle algorithm.

Throughout the experiment we demand a 99% fidelity. This experiment is designed to mimic the trend in experiment 4.3 in the paper. However, there will not be an exact simulation as the devices used for the evaluation in the paper is slightly different from the devices used for this experiment. The reason for that being the non determinism in the custom backend generation algorithm. The custom backend generation algorithm uses probability to generate the error rates and topologies.

Having said that, the thing to evaluate is that the trend is similar i.e. the Oracle has the best fidelity, then the fidelity of the device chosen by the scheduler, and lastly the random choice.

# How to run ?

If you have a virtual environment already running and has `requests` installed then you can we keep using that. If not please do follow the following steps

```bash
Create a virtual environment
pip install requests
```

We need to do some changes in QRIOMeta-main

1. Go to QRIOMeta-main/core/utils.py comment line 198 to 202 and uncomment 205 to 209

2. Go to QRIOMeta-main/core/views.py comment line 48 to 49 and uncomment 50 to 51

The reason for this change is that this way the QRIO meta server gives us all the details required for the experiment. Otherwise, we require to run the experiment in different settings multiple times.

Once that is done run the following command

```bash
python3 topology_ranking.py
```

As output you would find the scores and fidelities for each circuit found by the random scheduling strategy, QRIO scheduling strategy and Oracle.
