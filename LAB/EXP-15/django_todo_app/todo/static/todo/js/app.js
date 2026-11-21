// Django To-Do: served from todo/static/todo/js/app.js with {% static %}
// Ask before deleting, because a delete cannot be undone.
document.querySelectorAll(".delete-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
        if (!window.confirm('Delete "' + form.dataset.title + '"?')) {
            event.preventDefault();
        }
    });
});
