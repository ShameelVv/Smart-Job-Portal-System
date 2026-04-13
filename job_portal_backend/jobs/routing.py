from django.urls import re_path
from .consumers import JobNotificationConsumer

websocket_urlpatterns = [
    re_path(r'ws/notifications/$', JobNotificationConsumer.as_asgi()),
]