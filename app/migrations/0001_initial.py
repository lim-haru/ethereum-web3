# Generated by Django 4.1.7 on 2023-08-01 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LogEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.CharField(max_length=16)),
                ('log_from', models.CharField(max_length=75)),
                ('log_to', models.CharField(max_length=36)),
                ('log_value', models.CharField(max_length=36)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
