from django.db import models

# Create your models here.
class Circuit(models.Model):
    circuit_file = models.FileField(upload_to='circuits/')
    name = models.CharField(max_length=600)
    fidelity = models.FloatField(null=True, blank=True)

class CircuitScore(models.Model):
    file_name = models.CharField(max_length=600)
    device_name = models.CharField(max_length=600)
    score = models.FloatField()