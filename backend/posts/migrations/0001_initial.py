# Generated by Django 5.0.6 on 2024-06-15 15:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=75)),
                ('body', models.TextField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('price', models.CharField(default='free', max_length=15)),
                ('town', models.CharField(default=None, max_length=15)),
                ('image', models.ImageField(default='fallback.png', upload_to='')),
                ('category', models.CharField(default='any', max_length=15)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('number', models.CharField(max_length=9, null=True)),
                ('author', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
