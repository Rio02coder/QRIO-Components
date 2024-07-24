# Experiment 5

This experiment evaluates the performance of QRIO for the fidelity ranking aspect of the scheduler. This basically compares the following algorithms: Random scheduler, QRIO simulated scheduler and Oracle algorithm.

Throughout the experiment we demand a 100% fidelity. Since no device is capable of providing the fidelity requested, we give the best possible backend closes to the requested fidelity. The script gets two different fidelities the fidelity of the original circuit and the fidelity of the clifford converted circuit. The device with the best (highest) fidelity of the clifford converted circuit is the device the scheduler runs on. The device with the highest oracle fidelity is the device where the Oracle algorithm will schedule the circuit. Now, this experiment is all about proving that the original fidelity of the device where the simulated scheduler scheduled the circuit is not greater than the oracle fidelity i.e. the original fidelity of the device where the Oracle algorithm would choose to schedule the circuit. This experiment is designed to mimic the trend in experiment 4.3 in the paper. However, there will not be an exact simulation as the devices used for the evaluation in the paper is slightly different from the devices used for this experiment. The reason for that being the non determinism in the custom backend generation algorithm. The custom backend generation algorithm uses probability to generate the error rates and topologies.

Having said that, the thing to evaluate is that the trend is similar i.e. the Oracle has the best fidelity, then the fidelity of the device chosen by the scheduler, and lastly the random choice.

We also show the diagrams of converted(to clifford) and unconverted(to clifford) circuits of two qasm files bv and circ1. The thing to note here is that circ1 has some non clifford gates which are transformed after conversion to clifford. However, bv does not have such gates, so the converted and unconverted gates are similar.

# How to run ?

If you have a virtual environment already running and has `requests` installed then you can we keep using that. If not please do follow the following steps

```bash
Create a virtual environment
pip install requests
```

We need to then enter the META-SERVER-URL in lines 8, 46, 81, 82 of fidelity_ranking.py

We need to do some changes in QRIOMeta-main

1. Go to QRIOMeta-main/core/utils.py uncomment 171 to 176 and comment everything else in that function
   Comment line 189 and uncomment 190. Comment line 206 and uncomment 209 to 215. Uncomment 221 to 223. Comment 225 and uncomment 226.

2. Go to QRIOMeta-main/core/views.py comment line 48 to 49 and uncomment 50 to 51

The reason for this change is that this way the QRIO meta server gives us all the details required for the experiment. Otherwise, we require to run the experiment in different settings multiple times.

Once that is done run the following command

```bash
python3 fidelity_ranking.py
```

Output (should be similar to):
bv Round 0
random fidelity 0.0032317452299887137
scheduled device fidelity 0.3820572189362527
Oracle fidelity 0.3820572189362527
Oracle backend backend_87
Original backend backend_87
Average fidelity 0.026677790722921556
Median Fidelity 0.0032131414592208598
################
hsp Round 0
random fidelity 0.35334201971849455
scheduled device fidelity 0.8192678008393258
Oracle fidelity 0.8192678008393258
Oracle backend backend_87
Original backend backend_87
Average fidelity 0.38474741970694176
Median Fidelity 0.3528701090451422
################
rep Round 0
random fidelity 0.9819414098337695
scheduled device fidelity 0.984077273674334
Oracle fidelity 0.9903994292909956
Oracle backend backend_42
Original backend backend_1
Average fidelity 0.9822250625091944
Median Fidelity 0.9828074287832163
################
grover Round 0
random fidelity 0.0900000000000001
scheduled device fidelity 0.7488888888888888
Oracle fidelity 0.7488888888888888
Oracle backend backend_42
Original backend backend_42
Average fidelity 0.2132
Median Fidelity 0.1305555555555556
################
circ1 Round 0
random fidelity 0.8203115431384835
scheduled device fidelity 0.9173805613161197
Oracle fidelity 0.9173805613161197
Oracle backend backend_42
Original backend backend_42
Average fidelity 0.7838041475948553
Median Fidelity 0.7751766518876981
################
circ2 Round 0
random fidelity 0.004444444444444502
scheduled device fidelity 0.4622222222222222
Oracle fidelity 0.4622222222222222
Oracle backend backend_42
Original backend backend_42
Average fidelity 0.03830000000000009
Median Fidelity 0.005555555555555636
################
Look at the terminal running QRIOMeta-Server and observe the logs

As output you would find the scores and fidelities for each circuit found by the random scheduling strategy, QRIO scheduling strategy and Oracle. Also, you can look at the Meta server terminal to look for the diagrams of the normal (non converted) circuit and the converted circuit.
