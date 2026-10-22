import json

from rest_framework import generics
from rest_framework.exceptions import ParseError
from rest_framework.parsers import (
    JSONParser,
    FormParser,
    MultiPartParser,
)

from common.permissions import IsAdminOrStaff
from products.models import Product
from ...serializers import ProductSerializer

class ProductMultipartMixin:
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def get_serializer(self, *args, **kwargs):
        request = getattr(self, "request", None)

        if (
            request
            and request.method in ("POST", "PUT", "PATCH")
            and request.content_type
            and request.content_type.startswith("multipart/")
            and kwargs.get("data") is not None
        ):
            try:
                payload = json.loads(request.data.get("data", "{}"))
            except (json.JSONDecodeError, TypeError):
                raise ParseError({
                    "data": "Must contain valid JSON."
                })

            if not isinstance(payload, dict):
                raise ParseError({
                    "data": "Must be a JSON object."
                })

            uploaded_files = request.FILES.getlist("media")

            # Only override media_files when files were actually uploaded.
            if uploaded_files:
                payload["media_files"] = uploaded_files

            kwargs["data"] = payload

        return super().get_serializer(*args, **kwargs)

class ProductCreateAPIView(
    ProductMultipartMixin,
    generics.CreateAPIView,
):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrStaff]

class ProductRetrieveUpdateAPIView(
    ProductMultipartMixin,
    generics.RetrieveUpdateAPIView,
):
    queryset = (
        Product.objects
        .select_related(
            "brand",
            "model",
            "category",
            "shipping_class_rates",
        )
        .prefetch_related(
            "collections",
            "tags",
            "options",
            "variants",
            "media",
            "metafields",
        )
    )

    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrStaff]