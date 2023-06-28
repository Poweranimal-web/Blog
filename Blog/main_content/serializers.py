from rest_framework.serializers import ModelSerializer
from main_content.models import *
class AccountSerializer(ModelSerializer):
    class Meta:
        model = Customers
        fields = "__all__"