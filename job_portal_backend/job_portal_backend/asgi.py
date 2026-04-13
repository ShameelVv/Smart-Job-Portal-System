import os

# ✅ This MUST be the very first line before any Django imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal_backend.settings')

# ✅ This must come second — sets up Django before anything else loads
import django
django.setup()

# ✅ Now it's safe to import everything else
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from jobs.consumers import JobNotificationConsumer
from jobs.middleware import JwtAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtAuthMiddleware(
        URLRouter([
            path("ws/notifications/", JobNotificationConsumer.as_asgi()),
        ])
    ),
})