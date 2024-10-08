# Generated by Django 5.1 on 2024-08-30 10:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_userprofile_date'),
        ('posts', '0012_post_reposted_delete_repost'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='accounts.userprofile'),
        ),
    ]
