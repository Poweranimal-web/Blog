from rest_framework.serializers import ModelSerializer,Serializer
from rest_framework import serializers
from main_content.models import *
class AccountSerializer(ModelSerializer):
    class Meta:
        model = Customers
        fields = ['last_name','first_name','email','password','phone_number','about_me']
        def save(self):
            return super().save()
class BlogSerializer(ModelSerializer):
    class Meta:
        model = Blogs
        fields = ['title_image','title','main_images','author']
        def save(self):
            return super().save()
class TestSerializer(Serializer):
    name = serializers.CharField(max_length=100)
    status = serializers.CharField(max_length=100)