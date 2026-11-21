from django.test import TestCase
from django.urls import reverse

from .models import Task


class TaskListTests(TestCase):
    def test_empty_list(self):
        response = self.client.get(reverse("task_list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No tasks yet.")

    def test_list_uses_base_template_and_partials(self):
        Task.objects.create(title="Read chapter 4")
        response = self.client.get(reverse("task_list"))
        used = [t.name for t in response.templates]
        for name in ["todo/task_list.html", "todo/base.html", "todo/partials/_header.html",
                     "todo/partials/_messages.html", "todo/partials/_task_item.html",
                     "todo/partials/_footer.html"]:
            self.assertIn(name, used)

    def test_static_files_are_linked(self):
        response = self.client.get(reverse("task_list"))
        self.assertContains(response, 'href="/static/todo/css/style.css"')
        self.assertContains(response, 'src="/static/todo/js/app.js"')
        self.assertContains(response, 'href="/static/todo/img/logo.svg"')

    def test_title_is_escaped(self):
        Task.objects.create(title="<script>alert(1)</script>")
        response = self.client.get(reverse("task_list"))
        self.assertNotContains(response, "<script>alert(1)</script>")
        self.assertContains(response, "&lt;script&gt;alert(1)&lt;/script&gt;")


class AddTaskTests(TestCase):
    def test_add_task(self):
        response = self.client.post(reverse("add_task"), {"title": "  Buy milk  "}, follow=True)
        self.assertRedirects(response, reverse("task_list"))
        self.assertEqual(Task.objects.get().title, "Buy milk")       # spaces stripped
        self.assertContains(response, "Added &quot;Buy milk&quot;.")  # success message

    def test_blank_and_spaces_only_titles_are_rejected(self):
        for title in ["", "   "]:
            response = self.client.post(reverse("add_task"), {"title": title})
            self.assertEqual(response.status_code, 200)               # form shown again
            self.assertContains(response, "This field is required.")
        self.assertEqual(Task.objects.count(), 0)

    def test_title_longer_than_200_is_rejected(self):
        response = self.client.post(reverse("add_task"), {"title": "a" * 201})
        self.assertContains(response, "Ensure this value has at most 200 characters (it has 201).")
        self.assertEqual(Task.objects.count(), 0)

    def test_post_without_csrf_token_is_refused(self):
        from django.test import Client
        strict = Client(enforce_csrf_checks=True)
        response = strict.post(reverse("add_task"), {"title": "x"})
        self.assertEqual(response.status_code, 403)


class ToggleAndDeleteTests(TestCase):
    def setUp(self):
        self.task = Task.objects.create(title="Write report")

    def test_toggle_twice(self):
        url = reverse("toggle_task", args=[self.task.id])
        self.client.post(url)
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)
        self.client.post(url)
        self.task.refresh_from_db()
        self.assertFalse(self.task.completed)

    def test_delete(self):
        response = self.client.post(reverse("delete_task", args=[self.task.id]))
        self.assertRedirects(response, reverse("task_list"))
        self.assertFalse(Task.objects.exists())

    def test_get_does_not_change_anything(self):
        for name in ["toggle_task", "delete_task"]:
            response = self.client.get(reverse(name, args=[self.task.id]))
            self.assertEqual(response.status_code, 405)               # Method Not Allowed
        self.task.refresh_from_db()
        self.assertFalse(self.task.completed)
        self.assertTrue(Task.objects.filter(id=self.task.id).exists())

    def test_unknown_id_gives_404_not_500(self):
        for name in ["toggle_task", "delete_task"]:
            response = self.client.post(reverse(name, args=[999]))
            self.assertEqual(response.status_code, 404)
