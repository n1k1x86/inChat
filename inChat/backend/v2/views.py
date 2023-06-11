import json

# from django.http import JsonResponse

from .models import User

from .serializers import RegistrationSerializer, UserLoginSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.views import APIView


class UsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    data = User.objects.all()

    def get(self, request):
        data_set = self.data
        serializer = UserSerializer(data_set, many=True)
        return Response(serializer.data)


class GetCSRFView(APIView):
    def get(self, request):
        return Response({
            'detail': 'CSRF cookie set',
            'X-CSRFToken': get_token(request)
        })


class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=self.request.data, context={'request': self.request})
        print(request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response(None, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(None, status=status.HTTP_403_FORBIDDEN)


class LogoutView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'You\'re not logged in.'}, status=400)

        logout(request)
        return Response({'detail': 'Successfully logged out.'})


class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @staticmethod
    def get(request):
        return Response({'isAuthenticated': True})


class RegistrationView(APIView):
    def post(self, request):
        registration_serializer = RegistrationSerializer(data=request.data)

        if registration_serializer.is_valid():
            user = registration_serializer.save()
            return Response({
                "user": {
                    "id": registration_serializer.data["id"],
                    "username": registration_serializer.data["username"]
                },
                "status": {
                    "message": "User created",
                    "code": f"{status.HTTP_200_OK} OK",
                },
            })
        return Response(
            {
                "error": registration_serializer.errors,
                "status": f"{status.HTTP_203_NON_AUTHORITATIVE_INFORMATION} NON AUTHORITATIVE INFORMATION"
            }
        )
