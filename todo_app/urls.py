from django.urls import path

from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('add-todo/', views.add_todo, name='add-todo'),
    path('get-todo/<int:pk>', views.get_todo, name='get-todo'),
    path('update-todo/<int:pk>/', views.update_todo, name='update-todo'),
    path('all-todo/', views.all_todo, name='all-todo'),
    path('delete-todo/<int:pk>/', views.delete_todo, name='all-todo'),
    path('profile/', views.UserprofileView.as_view()),
    path('', TemplateView.as_view(template_name='index.html')),
    path('login/', TemplateView.as_view(template_name='index.html')),
    path('home/', TemplateView.as_view(template_name='index.html')),
    path("google_user/", views.get_google_user),
    path("hello/", views.hello)
]
