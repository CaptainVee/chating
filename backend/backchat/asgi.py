import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from .middleware import TokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backchat.settings')

from chat import routing


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    "websocket":AllowedHostsOriginValidator(
        TokenAuthMiddleware(
            URLRouter(
                routing.websocket_urlpatterns
            )
        )
    )
})
