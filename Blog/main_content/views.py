from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import authentication, permissions
from  rest_framework.views import APIView
from main_content.serializers import *
from rest_framework.parsers import JSONParser
from django.core.serializers import serialize
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_protect
from main_content.models import Customers,MyOwnToken
from rest_framework.authtoken.models import Token
import json
# Create your views here.
class MainPage(APIView):
    def post(self, request):
        data = request.data
        if data["state"] == "check_auth":
            data = check_token(data)
        return Response(data=data, status=status.HTTP_200_OK)
class RegPage(APIView):
    def post(self, request):
        data = request.data
        email = data["email"]
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            customer = Customers.objects.get(email=email)
            token = MyOwnToken.objects.create(user=customer)
            return Response({"state":"success", "token": token.key})
        else:
            print(serializer.errors)
            return Response({"state":"failed"})
class AuthPage(APIView):
    def post(self, request):
        data = request.data
        print(data)
        try:
            response = Customers.objects.filter(email=data["email"],password=data["password"]).values()[0]
        except IndexError:
            return Response(data={"state": "doesn't exist"},status=status.HTTP_200_OK)
        else:
            token = MyOwnToken.objects.filter(user=response['id']).values()[0]
            response = {}
            response["token"] = token["key"]
            response["state"] = "exist"
            return Response(data=response,status=status.HTTP_200_OK)
def check_token(request):
    data = request
    if data["state"] == "check_auth":
        exist_token = MyOwnToken.objects.filter(key=data["token"]).exists()
        if exist_token:
            token = MyOwnToken.objects.filter(key=data["token"]).values()[0]
            auth_data = Customers.objects.filter(pk=int(token["user_id"])).values()[0]
            auth_data["state"] = "exist"
            data = auth_data
        else:
            data["state"] = "not exist"
    return data


