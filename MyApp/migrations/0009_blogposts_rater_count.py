# Generated by Django 5.0.1 on 2024-02-25 09:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MyApp', '0008_recipe_servings'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogposts',
            name='rater_count',
            field=models.IntegerField(default=0),
        ),
    ]
