from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def csrf(request):
    # Просто возвращаем пустой ответ, главное — кука
    return JsonResponse({'detail': 'CSRF cookie set'})
