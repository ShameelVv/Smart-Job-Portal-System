import json
from channels.generic.websocket import AsyncWebsocketConsumer

class JobNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 1. Get the user object from the connection scope
        self.user = self.scope["user"]

        # 2. Check if the user is logged in
        if self.user.is_authenticated:
            # Create a unique group name for this specific user (e.g., "user_5")
            self.group_name = f"user_{self.user.id}"

            # Join their private group
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            # Deny connection if they aren't logged in
            await self.close()

    async def disconnect(self, close_code):
        # Only discard if they were authenticated and joined a group
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        # Send the message to the frontend (React)
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))