from django.db import migrations, models
from django.utils.text import slugify
from django.db.utils import IntegrityError


def generate_slugs(apps, schema_editor):
    Genre = apps.get_model('movies', 'Genre')
    for genre in Genre.objects.all():
        try:
            if not genre.slug:
                base_slug = slugify(genre.name)
                unique_slug = base_slug
                counter = 1

                while Genre.objects.filter(slug=unique_slug).exclude(pk=genre.pk).exists():
                    unique_slug = f"{base_slug}-{counter}"
                    counter += 1

                genre.slug = unique_slug
                genre.save(update_fields=['slug'])
        except IntegrityError:
            continue


class Migration(migrations.Migration):
    dependencies = [
        ('movies', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='genre',
            name='slug',
            field=models.SlugField(max_length=100, null=True, blank=True),
        ),
        migrations.RunPython(
            generate_slugs,
            reverse_code=migrations.RunPython.noop
        ),
        migrations.AlterField(
            model_name='genre',
            name='slug',
            field=models.SlugField(max_length=100, unique=True, blank=True),
        ),
    ]