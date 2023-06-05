from django.urls import path
from .views import HelloView, RegistrationView, LoginView

urlpatterns = [
    path('test_view/', HelloView.as_view()),
    path('v2/register/', RegistrationView.as_view()),
    path('v2/login/', LoginView.as_view()),
]
