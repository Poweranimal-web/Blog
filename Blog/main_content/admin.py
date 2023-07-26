from django.contrib import admin
from main_content.models import Roles, Customers, Blogs, MyOwnToken, BlogImages
# Register your models here.
admin.site.register(Roles)
admin.site.register(Customers)
admin.site.register(Blogs)
admin.site.register(MyOwnToken)
admin.site.register(BlogImages)