import hashlib

# from django.http import JsonResponse

from .models import User

from .serializers import RegistrationSerializer, UserLoginSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.core.cache import cache
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


class GetUserName(APIView):
    def get(self, request):
        session = request.session
        uid = session.get('_auth_user_id')
        user = User.objects.get(id=uid)
        return Response({
            'username': user.username
        })


class CacheFeatures(APIView):

    @staticmethod
    def get_user_for_connection(features, user_features):
        max_count = 0
        prob_user = ''

        for feature in features:
            count = 0
            for i in range(3):
                if feature[0][i] == user_features[0][i]:
                    count += 1
            if count == 3:
                prob_user = feature[1]
                break
            if count >= max_count:
                max_count = count
                prob_user = feature[1]
            if max_count != 0:
                prob_user = feature[1]
                break

        return prob_user

    @staticmethod
    def get_room_name(username, user_for_connect):
        user1 = username
        user2 = user_for_connect
        raw_room = user1 + user2 if user1 > user2 else user2 + user1

        return raw_room

    def post(self, request):
        username = request.data['username']
        user_features = (User.objects.get(username=username).features, username)
        cache.set(username, user_features, timeout=10)
        users = cache.keys('*')
        features = [cache.get(i) for i in users if i != username]
        user_for_connect = self.get_user_for_connection(features, user_features)
        room_name = self.get_room_name(username, user_for_connect)

        return Response({
            'detail': user_features,
            'cache_data': features,
            'room_name': room_name,
            'user_for_connect': user_for_connect
        })
