from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from accounts.models import User

# user = User.objects.first()
@database_sync_to_async
def get_user(decoded_token):
    try:
        user_id = decoded_token['user_id']
        # Assuming you have a custom user model
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        try:
            access_token = (dict((x.split('=') for x in scope['query_string'].decode().split("&")))).get('access_token', None)
            decoded_token = AccessToken(access_token).payload
            scope['user'] = await get_user(decoded_token)
        except Exception as e:
            print(str(e))
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)
