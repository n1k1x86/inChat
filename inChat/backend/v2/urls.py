from django.urls import path
from .views import UsersView, RegistrationView, LoginView, GetCSRFView, SessionView, LogoutView

urlpatterns = [
    path('v2/users/', UsersView.as_view()),
    path('v2/register/', RegistrationView.as_view()),
    path('v2/login/', LoginView.as_view()),
    path('v2/csrf/', GetCSRFView.as_view()),
    path('v2/session/', SessionView.as_view()),
    path('v2/logout/', LogoutView.as_view())
]
