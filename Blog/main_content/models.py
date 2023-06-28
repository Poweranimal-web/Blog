from django.db import models

# Create your models here.
class Customers(models.Model):
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15,blank=True,null=True)
    about_me = models.TextField(max_length=1000,blank=True, null=True)


