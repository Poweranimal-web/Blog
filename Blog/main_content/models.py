import binascii
import os

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
import django
# Create your models here.
class Roles(models.Model):
    name = models.CharField(max_length=120)
    def __str__(self):
        return self.name
class Customers(models.Model):
    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15,blank=True,null=True)
    about_me = models.TextField(max_length=1000,blank=True, null=True)
    role = models.ForeignKey(Roles,on_delete=models.CASCADE,blank=True,null=True)
    def __str__(self):
        return "{surname} {name}".format(surname=self.last_name,name=self.first_name)
class Blogs(models.Model):
    title_image = models.ImageField(upload_to="title/",blank=True,null=True)
    title = models.CharField(max_length=120)
    main_text = models.TextField()
    author = models.ForeignKey(Customers,on_delete=models.CASCADE, blank=True, null=True)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    create_date = models.DateField(auto_now_add=True)
    create_time = models.TimeField(auto_now_add=True)
class Comments(models.Model):
    comment = models.TextField()
    blog = models.ForeignKey(Blogs,on_delete=models.CASCADE, blank=True, null=True)
    customer = models.ForeignKey(Customers,on_delete=models.CASCADE, blank=True, null=True)
    type = models.CharField(max_length=50)
    answer_on = models.IntegerField(blank=True, null=True)
    create_date = models.DateField(auto_now_add=True)
    create_time = models.TimeField(auto_now_add=True)
class ReactionsCustomers(models.Model):
    likes = models.BooleanField()
    dislikes = models.BooleanField()
    customer = models.ForeignKey(Customers,on_delete=models.CASCADE, blank=True, null=True)
    blog = models.ForeignKey(Blogs,on_delete=models.CASCADE,blank=True,null=True)
class BlogImages(models.Model):
    main_images = models.ImageField(upload_to="main/", blank=True, null=True)
    blog = models.ForeignKey(Blogs,on_delete=models.CASCADE, blank=True, null=True)
class MyOwnToken(models.Model):
    """
    The default authorization token model.
    """
    key = models.CharField(_("Key"), max_length=40, primary_key=True)

    user = models.OneToOneField(
        Customers, related_name='auth_token',
        on_delete=models.CASCADE, verbose_name="Customers"
    )
    created = models.DateTimeField(_("Created"), auto_now_add=True)

    class Meta:
        verbose_name = _("Token")
        verbose_name_plural = _("Tokens")

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super(MyOwnToken, self).save(*args, **kwargs)

    @classmethod
    def generate_key(self):
        return binascii.hexlify(os.urandom(20)).decode()

    def __str__(self):
        return self.key


