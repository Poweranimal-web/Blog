from faker import Faker
from main_content.serializers import BlogSerializer
from main_content.models import Blogs
import random
fake = Faker()


for _ in range(100):
    blog_data = {
        'title_image': fake.image_url(width=800, height=400),
        'title': fake.sentence(nb_words=6),
        'main_images': [fake.image_url(width=1200, height=800) for _ in range(random.randint(1, 5))],
        'main_text': fake.paragraphs(nb=random.randint(3, 5)),
    }
    ser = BlogSerializer(data=blog_data)
    if ser.is_valid():
        print("yes")
        ser.save()
    else:
        print(ser.errors)