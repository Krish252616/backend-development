from django import forms
from .models import Task


class TaskForm(forms.ModelForm):
    """Checks the title before it is saved.

    A ModelForm uses the model's rules: the title is required and at most 200 characters.
    forms.CharField also strips spaces, so a title of only spaces counts as empty.
    """

    class Meta:
        model = Task
        fields = ["title"]
        widgets = {
            "title": forms.TextInput(attrs={"placeholder": "Task title", "autofocus": True}),
        }
