# Experiment 1

This experiment is made with the goal of testing the functionality of the tool in its entirety i.e. the visualizer, the master server, meta server and the kubernetes server. So, this assumes that the tester has followed the README document and setup all components.

To run this experiment, use the visualizer and upload the circuit given in the file bv.qasm (This is a 10 qubit Bernstien Vazirani circuit).

In the first page,

enter the job name (make sure the name is in lowercase letters)
enter the image name of the format <>:<> (make sure everything is lowercase)
enter the number of qubits as `10`
enter the CPU and Memory as 0

In the second page,
enter error rate as 0.00933
T1 as 0.000059
T2 as 0.000033
Readout as 0.00912

In the third page, you can set either Fidelity or Topology. This part is entirely up to the evaluator. No matter what the chosen strategy is the scheduler will try for the best device satisfying that requirement.

To verify the fidelity requirement:

Check the logs for the terminal where the meta server is running and note the fidelities of the devices.

Check the final device where the process has been scheduled. It has a fidelity which greater than or equal to the fidelity requested.

Verifying the topology request is slightly harder as it requires analyzing the topology and topology of the transpiled circuit. However, a cursory check would be that the device where the process is scheduled has the lowest score amongst all the filtered devices. This can be viewed from the logs running the Meta server.

Overall, from this experiment, the scheduler Filters and Ranks and runs job in the cluster.
