# we need to config all of our different urls so we can link em up and go to the correct route
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# TokenObtainPairView, TokenRefreshView these are pre-built views that allow us to obtain our access and refresh tokens  and to refresh the token
# once the user is created we can use these pre-built views to obtain the token for that user and effectively sign em in
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
]
