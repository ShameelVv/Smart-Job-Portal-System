# jobs/middleware.py
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from channels.db import database_sync_to_async

# This function runs in a thread (because database calls can't run in async)
# It takes the raw token string, decodes it, and returns the matching User
@database_sync_to_async
def get_user_from_token(token_string):
    try:
        token = AccessToken(token_string)   # decode the JWT
        user_id = token['user_id']          # extract user id from token
        return User.objects.get(id=user_id) # fetch user from database
    except Exception:
        return AnonymousUser()              # if anything fails, return guest user

# This middleware runs on every WebSocket connection request
class JwtAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Read the query string from the URL
        # e.g. ws://localhost:8000/ws/notifications/?token=xxxxx
        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]  # extract token value

        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)