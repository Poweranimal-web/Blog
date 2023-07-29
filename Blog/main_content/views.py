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
from main_content.models import Customers,MyOwnToken,Blogs,BlogImages
from rest_framework.authtoken.models import Token
import os
import json
from rest_framework.parsers import MultiPartParser
from django.http import QueryDict
# Create your views here.
class MainPage(APIView):
    def post(self, request):
        data = request.data
        if data["state"] == "check_auth":
            data = check_token(data)
        elif data["state"] == "get_data":
            data = {"state": "good!"}
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
class DeleteBlog(APIView):
    def post(self, request):
        data = request.data
        id = data["id"]
        Blogs.objects.filter(id=id).delete()
        return Response({"state":"deleted"})
class BlogsPage(APIView):
    def post(self, request):
        data = request.data
        email = data["email"]
        response = {}
        data_user = Customers.objects.filter(email=email).values()[0]
        try:
            blogs = Blogs.objects.filter(author=int(data_user["id"])).values()
            for blog in blogs:
                exist_extra_image = BlogImages.objects.filter(blog=blog["id"]).values()
                blog["extra_image"] = exist_extra_image
            response['state'] = 'exist'
            response['data'] = blogs
        except IndexError:
            response = {"state": "doesn't exist"}
        return Response(data=response)
class MainContent(APIView):
    def post(self, request):
        data = request.data
        blogs = Blogs.objects.all().order_by("-create_date","create_time").values()
        if data["state"] == "get_data":
            for blog in blogs:
                author = Customers.objects.filter(id=blog['author_id']).values()[0]
                blog["last_name"] = author["last_name"]
                blog["first_name"] = author["first_name"]
        return Response(blogs)
class AboutBlog(APIView):
    def get(self, request):
        data = request.query_params
        response = {}
        if data["state"] == "get_data":
            blog = Blogs.objects.filter(id=data["id"]).values()[0]
            customer = Customers.objects.filter(id=blog["author_id"]).values()[0]
            images = BlogImages.objects.filter(blog__id=data["id"]).values()
            blog["images"] = images
            blog["last_name"] = customer["last_name"]
            blog["first_name"] = customer["first_name"]
            response = blog
        return Response(response)
class DetailBlogPage(APIView):
    parser_classes = [MultiPartParser]
    def get(self, request):
        data = request.query_params
        blog = Blogs.objects.filter(id=int(data["id"])).values()[0]
        blog["change_extra_images"] = False
        blog["change_title_image"] = False
        blog["title_image"] = os.path.basename(blog["title_image"])
        exist_extra_images = BlogImages.objects.filter(blog=blog["id"]).values()
        try:
            for exist_extra_image in exist_extra_images:
                exist_extra_image["filename"] = os.path.basename(exist_extra_image["main_images"])
            blog["extra_images"] = exist_extra_images
        except IndexError:
            blog["extra_images"] = []
        return Response(data=blog)
    def post(self, request):
        data = request.data
        dict_data = data.dict()
        blog = Blogs.objects.get(id=dict_data["id_blog"])
        on_delete = json.loads(dict_data["on_delete"])
        if dict_data["change_title_image"] == 'true' and dict_data["change_extra_images"] == 'true':
            blog.title_image = dict_data["title_image"]
            blog.title = dict_data["title"]
            blog.main_text = dict_data["main_text"]
            for index in range(len(request.FILES)-1):
                file_key = f'image_{index}'
                file_obj = request.FILES.get(file_key)
                BlogImages.objects.update_or_create(main_images=file_obj, blog=blog)
            for id in on_delete:
                BlogImages.objects.filter(id=id).delete()
        elif dict_data["change_title_image"] == 'true':
            blog.title_image = dict_data["title_image"]
            blog.title = dict_data["title"]
            blog.main_text = dict_data["main_text"]
            for id in on_delete:
                BlogImages.objects.filter(id=id).delete()
        elif dict_data["change_extra_images"] == 'true':
            blog.title = dict_data["title"]
            blog.main_text = dict_data["main_text"]
            for index in range(len(request.FILES)):
                file_key = f'image_{index}'
                file_obj = request.FILES.get(file_key)
                BlogImages.objects.update_or_create(main_images=file_obj, blog=blog)
            for id in on_delete:
                BlogImages.objects.filter(id=id).delete()
        else:
            blog.title = dict_data["title"]
            blog.main_text = dict_data["main_text"]
            for id in on_delete:
                BlogImages.objects.filter(id=id).delete()
        blog.save()
        return Response({"state": "good"})
class CreateBlog(APIView):
    def post(self, request):
        data = request.data
        dict_data = data.dict()
        author = Customers.objects.get(id=dict_data["id_customer"])
        blog = Blogs.objects.create(title_image=dict_data["title_image"], title=dict_data["title"], main_text=dict_data["main_text"], author=author)
        for index in range(len(request.FILES) - 1):
            file_key = f'image_{index}'
            file_obj = request.FILES.get(file_key)
            BlogImages.objects.create(main_images=file_obj, blog=blog)
        return Response({"state": "good"})
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


