"""Blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from main_content import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.MainPage.as_view(), name="main"),
    path("reg", views.RegPage.as_view(), name="reg"),
    path("auth", views.AuthPage.as_view(), name="auth"),
    path("blogs", views.BlogsPage.as_view(), name="blogs"),
    path("blogs/detail",views.DetailBlogPage.as_view(), name="detail"),
    path("blogs/create",views.CreateBlog.as_view(), name="create"),
    path("blogs/delete",views.DeleteBlog.as_view(), name="delete"),
    path("main", views.MainContent.as_view(), name="main"),
    path("about", views.AboutBlog.as_view(), name="about"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
