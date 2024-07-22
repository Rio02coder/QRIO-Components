# Experiment 4

This experiment shows the performance of the ranking strategy of the scheduler. This basically shows that the device chosen by the scheduler has a lower score than the device chosen a random choice scheduling strategy. Semantically a lower score would mean that the device chosen by the scheduler confirms better to the device chosen randomly. Since, the scheduler always outperforms the random scheduling strategy, this experiment showcases the average decrease in score of QRIO's scheduler vs Random scheduler. This experiment is supposed to mimic the experiment 4.2 in the paper. However, there will not be an exact simulation as the devices used for the evaluation in the paper is slightly different from the devices used for this experiment. The reason for that being the non determinism in the custom backend generation algorithm. The custom backend generation algorithm uses probability to generate the error rates and topologies.

Having said that, the trend is similar in the sense that the scheduler always outperforms a random scheduling strategy.

# How to run ?

If you have a virtual environment already running and has `requests` installed then you can we keep using that. If not please do follow the following steps

```bash
Create a virtual environment
pip install requests
```

We need to do one change in QRIOMeta-main

Go to QRIOMeta-main/core/utils.py comment line 198 to 202 and uncomment 205 to 209

Once that is done run the following command

```bash
python3 topology_ranking.py
```

As output you would find the scores found by the random scheduling strategy and the QRIO scheduling strategy and also a dictionary saying the average decrease in scores of QRIO's scheduled device and the device chosen at random.
