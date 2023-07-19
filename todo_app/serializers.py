from .models import TodoModel
from rest_framework import serializers

from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class TodoSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer

    class Meta:
        model = TodoModel
        fields = ('id', 'title', 'description', 'created_at', 'updated_at', 'status')

    def create(self, validated_data):
        return TodoModel.objects.create(**validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, required=True, allow_blank=False)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data["email"])
        user.set_password(validated_data["password"])
        return user


class RegisterGoogleSerializer(serializers.ModelSerializer):
    email = serializers.CharField(write_only=True, required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ('username', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data["email"])
        return user

# class SignupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserData
#         fields = '__all__'
#
#     def create(self, validated_data):
#         user = UserData.objects.create_user(username=validated_data["username"],
#                                             email=validated_data["email"])
#         user.set_password(validated_data["password"])
#         user.save()
#         return user

# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CommentModel
#         fields = '__all__'
