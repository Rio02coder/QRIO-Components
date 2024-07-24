# Experiment 4

This experiment shows the performance of the ranking strategy of the scheduler. This basically shows that the device chosen by the scheduler has a lower score than the device chosen a random choice scheduling strategy. Semantically a lower score would mean that the device chosen by the scheduler confirms better to the device chosen randomly. Since, the scheduler always outperforms the random scheduling strategy, this experiment showcases the average decrease in score of QRIO's scheduler vs Random scheduler. This experiment is supposed to mimic the experiment 4.2 in the paper. However, there will not be an exact simulation as the devices used for the evaluation in the paper is slightly different from the devices used for this experiment. The reason for that being the non determinism in the custom backend generation algorithm. The custom backend generation algorithm uses probability to generate the error rates and topologies.

Having said that, the trend is similar in the sense that the scheduler always outperforms a random scheduling strategy.

# How to run ?

If you have a virtual environment already running and has `requests` installed then you can we keep using that. If not please do follow the following steps

```bash
Create a virtual environment
pip install requests
```

We need to then enter the META-SERVER-URL in lines 8 and line 47 of topology_ranking.py

We need to do one change in QRIOMeta-main

Go to QRIOMeta-main/core/utils.py uncomment 171 to 176 and comment everything else in the function

Once that is done run the following command

```bash
python3 topology_ranking.py
```

The output is `similar` to:
full Round 0
random score 0.9999858466127605
lowest_Score 0.19418617712031871
################
full Round 1
random score 0.9999664725245402
lowest_Score 0.20385764418426555
################
grid Round 0
random score 0.8173709749983582
lowest_Score 0.046861651948303384
################
grid Round 1
random score 0.5889804427833296
lowest_Score 0.046861651948303384
################
h_square Round 0
random score 0.3849874598722839
lowest_Score 0.06946242495991461
################
h_square Round 1
random score 0.9999831415904125
lowest_Score 0.06946242495991461
################
line Round 0
random score 0.9988985309728632
lowest_Score 0.05822983320040409
################
line Round 1
random score 0.9999961464992105
lowest_Score 0.05822983320040409
################
ring Round 0
random score 0.9948626402510966
lowest_Score 0.08056104441696343
################
ring Round 1
random score 0.9999999999692435
lowest_Score 0.08056104441696343
################
{'full': 0.8009542489163581, 'grid': 0.6563140569425405, 'h_square': 0.6230228757714336, 'line': 0.9412175055356328, 'ring': 0.9168702756932066}

As the dictionary output (which shows the average difference between the score obtained by the scheduler and the score obtained by the random scheduler) you would find the scores found by the random scheduling strategy and the QRIO scheduling strategy and also a dictionary saying the average decrease in scores of QRIO's scheduled device and the device chosen at random.
