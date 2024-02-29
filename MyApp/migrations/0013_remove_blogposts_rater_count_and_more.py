# Generated by Django 5.0.1 on 2024-02-29 11:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MyApp', '0012_blogposts_total_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogposts',
            name='rater_count',
        ),
        migrations.RemoveField(
            model_name='blogposts',
            name='total_rating',
        ),
        migrations.AlterField(
            model_name='blogposts',
            name='ratings',
            field=models.FloatField(default=0),
        ),
        migrations.CreateModel(
            name='BlogPostRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ratings', models.IntegerField()),
                ('blog_post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MyApp.blogposts')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MyApp.customuser')),
            ],
        ),
    ]
