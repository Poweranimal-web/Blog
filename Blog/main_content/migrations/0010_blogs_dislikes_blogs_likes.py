# Generated by Django 4.1 on 2023-07-27 13:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main_content", "0009_remove_blogs_main_images_blogimages"),
    ]

    operations = [
        migrations.AddField(
            model_name="blogs",
            name="dislikes",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="blogs",
            name="likes",
            field=models.IntegerField(default=0),
        ),
    ]
