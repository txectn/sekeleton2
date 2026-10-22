from django.urls import path

from ...views import (
    ProductCreateAPIView,
    ProductRetrieveUpdateAPIView,
)

urlpatterns = [
    path(
        "admin/products/",
        ProductCreateAPIView.as_view(),
        name="product-create",
    ),
    path(
        "admin/products/<int:pk>/",
        ProductRetrieveUpdateAPIView.as_view(),
        name="product-detail",
    ),
]