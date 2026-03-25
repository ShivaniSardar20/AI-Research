from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def healthcheck(_request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('', healthcheck),
    path('health/', healthcheck),
    path('api/', include('papers.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
