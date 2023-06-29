from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import authentication, permissions
from  rest_framework.views import APIView
from main_content.serializers import *
# Create your views here.

class MainPage(APIView):
    def get(self, request):
        data = {"Name": "Nikita", "status": "develop"}
        return Response(data=data,status=status.HTTP_200_OK)



