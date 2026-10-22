from .users.urls import urlpatterns as users_urls

from .products.urls import urlpatterns as products_urls

urlpatterns = [
    *users_urls,
    *products_urls
]