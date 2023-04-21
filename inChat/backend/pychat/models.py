from django.db import models


class Profiles(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30)
    pass_hash = models.CharField(max_length=75)


class UserFeatures(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(Profiles, on_delete=models.CASCADE)
    features = models.CharField(max_length=400)


class Sessions(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(Profiles, on_delete=models.CASCADE)
    session = models.CharField(max_length=100)
    expiration = models.DateTimeField()
