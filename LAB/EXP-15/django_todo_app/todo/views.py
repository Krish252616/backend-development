from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .forms import TaskForm
from .models import Task


def task_list(request):
    tasks = Task.objects.all().order_by('-created_at')
    done = tasks.filter(completed=True).count()
    return render(request, 'todo/task_list.html', {'tasks': tasks, 'done': done})


def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():                 # required, at most 200 characters, spaces stripped
            task = form.save()
            messages.success(request, f'Added "{task.title}".')
            return redirect('task_list')
    else:
        form = TaskForm()
    # A GET, or a POST that failed: show the form again, with its errors
    return render(request, 'todo/add_task.html', {'form': form})


@require_POST                               # changing data only with POST, never with a plain link
def toggle_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)   # 404 instead of a 500 error for an unknown id
    task.completed = not task.completed
    task.save()
    return redirect('task_list')


@require_POST
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    messages.info(request, f'Deleted "{task.title}".')
    return redirect('task_list')
