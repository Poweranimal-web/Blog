# Generated by Django 4.1 on 2023-07-11 09:11

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("main_content", "0004_remove_customers_token"),
    ]

    operations = [
        migrations.RenameField(
            model_name="myowntoken",
            old_name="customer",
            new_name="user",
        ),
    ]
