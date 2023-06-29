from rest_framework.serializers import ModelSerializer,Serializer
from rest_framework import serializers
from main_content.models import *
class AccountSerializer(ModelSerializer):
    class Meta:
        model = Customers
        fields = "__all__"
class TestSerializer(Serializer):
    name = serializers.CharField(max_length=100)
    status = serializers.CharField(max_length=100)