from django.apps import AppConfig


class TodoConfig(AppConfig):
    # Django 6 uses BigAutoField for ids by default, Django 5.2 uses AutoField.
    # Saying it here keeps the migration the same on both versions.
    default_auto_field = "django.db.models.BigAutoField"
    name = "todo"
