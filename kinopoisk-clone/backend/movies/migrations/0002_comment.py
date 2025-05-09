# Generated by Django 5.2 on 2025-04-24 17:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(help_text='Comment text', verbose_name='text')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Date when comment was created', verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Date when comment was last updated', verbose_name='updated at')),
                ('movie', models.ForeignKey(help_text='Movie being commented on', on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='movies.movie', verbose_name='movie')),
                ('user', models.ForeignKey(help_text='User who posted the comment', on_delete=django.db.models.deletion.CASCADE, related_name='comments', to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'verbose_name': 'comment',
                'verbose_name_plural': 'comments',
                'ordering': ['-created_at'],
                'indexes': [models.Index(fields=['user'], name='comment_user_idx'), models.Index(fields=['movie'], name='comment_movie_idx'), models.Index(fields=['created_at'], name='comment_created_idx')],
            },
        ),
    ]
