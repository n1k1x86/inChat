from .models import User

from .serializers import RegistrationSerializer, UserLoginSerializer

from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, serializers
from rest_framework.authtoken.models import Token


class HelloView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        context = {"message": "Hello, World!"}
        return Response(context)


class RegistrationView(APIView):
    """Registration view"""

    def post(self, request, *args, **kwargs):
        registration_serializer = RegistrationSerializer(data=request.data)

        # gen tokens for existing users
        for user in User.objects.all():
            if not user:
                break
            else:
                try:
                    Token.objects.get(user_id=user.id)
                except Token.DoesNotExist:
                    Token.objects.create(user=user)

        if registration_serializer.is_valid():
            user = registration_serializer.save()
            token = Token.objects.create(user=user)

            return Response(
                {
                    "user": {
                        "id": registration_serializer.data["id"],
                        "username": registration_serializer.data["username"]
                    },
                    "status": {
                        "message": "User created",
                        "code": f"{status.HTTP_201_CREATED} CREATED",
                    },
                    "token": token.key
                }
            )
        return Response(
            {
                "error": registration_serializer.errors,
                "status": f"{status.HTTP_203_NON_AUTHORITATIVE_INFORMATION} NON AUTHORITATIVE INFORMATION"
            }
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        login_serializer = UserLoginSerializer(data=request.data)

        if login_serializer.is_valid():
            user = authenticate(request, **login_serializer.data)

            if user is None:
                raise serializers.ValidationError({
                    "error": {
                        "message": "Invalid Username or Password. Please try again.",
                        "status": f"{status.HTTP_400_BAD_REQUEST} BAD REQUEST"
                    }
                })

            token, created_token = Token.objects.get_or_create(user_id=user)

            if isinstance(created_token, Token):
                token = created_token

            return Response(
                {
                    "user": login_serializer.data,
                    "status": {
                        "message": "User is authenticated",
                        "code": f"{status.HTTP_200_OK} OK"
                    },
                    "token": token.key
                }
            )
        else:
            return Response(
                {
                    "error": {
                        "message": login_serializer.errors,
                        "status": f"{status.HTTP_403_FORBIDDEN} FORBIDDEN"
                    }
                }
            )
