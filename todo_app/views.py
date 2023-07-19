from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .renderer import UserRenderer
from .models import TodoModel
from .serializers import TodoSerializer, RegisterSerializer, UserProfileSerializer, RegisterGoogleSerializer
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from django.shortcuts import render
from django.contrib.auth.models import User


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todo(request, pk):
    data = TodoModel.objects.get(id=pk)
    serializer = TodoSerializer(data)
    return Response(serializer.data)


def index(request, *args, **kwargs):
    return render(request, 'index.html')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_todo(requests):
    requests.data["updated_at"] = datetime.now()
    serializer = TodoSerializer(data=requests.data, many=False)
    if serializer.is_valid():
        serializer.save(user=requests.user)
        return Response(serializer.data)
    return Response({"status": "serializer is not valid"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_todo(requests, pk):
    task = TodoModel.objects.get(id=pk)
    serializer = TodoSerializer(instance=task, data=requests.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response({"status": "serializer is not valid"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_todo(requests, pk):
    task = TodoModel.objects.get(id=pk)
    task.delete()
    return Response({"status": "Todo deleted successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def all_todo(request):
    task = TodoModel.objects.filter(user=request.user)
    serialize = TodoSerializer(task, many=True)
    return Response(serialize.data)


class RegisterUser(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)


@api_view(["POST"])
def register_user(requests):
    serializer = RegisterSerializer(data=requests.data)
    if serializer.is_valid():
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token': token, 'msg': 'Registration Successful'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserprofileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, requests):
        serializer = UserProfileSerializer(requests.user).data
        if "@" in serializer.get("username"):
            email = serializer.get("username")
            serializer["username"] = serializer.get("email")
            serializer["email"] = email
        return Response(serializer, status=status.HTTP_200_OK)


def check_user(name):
    try:
        return User.objects.get(username=name)
    except:
        return None


@api_view(["GET"])
def hello():
    return Response({"hello": "working"})


@api_view(["POST"])
def get_google_user(request):
    name = request.data.get("email")
    get_user = check_user(name)
    if not get_user:
        data = {"username": request.data.get("email"), "email": request.data.get("name")}
        serializer = RegisterGoogleSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'Registration Successful'}, status=status.HTTP_201_CREATED)
    else:
        token = get_tokens_for_user(get_user)
        return Response({'token': token, 'msg': 'Successful'}, status=status.HTTP_200_OK)
