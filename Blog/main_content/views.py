from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework import authentication, permissions
from  rest_framework import viewsets
# Create your views here.

class MainPage(viewsets.ViewSet):
    authentication_classes = [authentication.TokenAuthentication]
    def get(self, request):
        return Response({},status=status.HTTP_200_OK)



