# Generated by Django 5.1 on 2024-09-02 15:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0015_alter_post_reposted'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='quote',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='quotes', to='posts.post'),
        ),
    ]
