from django.contrib import admin
from .models import TodoModel


class TodoAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description", "created_at", "updated_at", "status"]


admin.site.register(TodoModel, TodoAdmin)
