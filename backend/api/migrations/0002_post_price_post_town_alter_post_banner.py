# Generated by Django 5.0.6 on 2024-06-10 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='price',
            field=models.CharField(default='free', max_length=15),
        ),
        migrations.AddField(
            model_name='post',
            name='town',
            field=models.CharField(default=None, max_length=15),
        ),
        migrations.AlterField(
            model_name='post',
            name='banner',
            field=models.ImageField(default='fallback.png', upload_to=''),
        ),
    ]
