from django.db import models
from django.contrib.auth.models import User


class TodoModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default="New-Todo")
    description = models.TextField(blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)

# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CommentModel
#         fields = '__all__'
