# from decimal import Decimal

# from django.contrib.auth import get_user_model
# from django.db.models import (
#     Count,
#     DecimalField,
#     OuterRef,
#     Q,
#     Subquery,
#     Sum,
#     Value,
# )
# from django.db.models.functions import Coalesce

# from orders.models import Order

# User = get_user_model()

# class CustomersService:

#     @staticmethod
#     def get_customers():
#         latest_order = Order.objects.filter(
#             user_id=OuterRef("pk"),
#         ).order_by("-created_at", "-id")

#         return (
#             User.objects
#             .annotate(
#                 orders_count=Count("orders", distinct=True),
#                 total_spent=Coalesce(
#                     Sum(
#                         "orders__total",
#                         filter=Q(
#                             orders__status=Order.Status.DELIVERED,
#                             orders__payment__status="paid",
#                         ),
#                     ),
#                     Value(Decimal("0.00")),
#                     output_field=DecimalField(
#                         max_digits=12,
#                         decimal_places=2,
#                     ),
#                 ),
#                 latest_phone=Subquery(
#                     latest_order.values("phone_number")[:1]
#                 ),
#             )
#             .order_by("-id")
#         )

#     @staticmethod
#     def serialize_customers(customers):
#         return [
#             {
#                 "id": customer.id,
#                 "name": (
#                     customer.get_full_name()
#                     or customer.username
#                     or customer.email
#                     or ""
#                 ),
#                 "email": customer.email or "",
#                 "phone": customer.latest_phone or "",
#                 "status": (
#                     "active" if customer.is_active else "inactive"
#                 ),
#                 "orders_count": customer.orders_count,
#                 "total_spent": f"{customer.total_spent:.2f}",
#                 "joined_at": (
#                     customer.created_at.isoformat()
#                     if customer.created_at else None
#                 ),
#                 "last_login": (
#                     customer.last_login.isoformat()
#                     if customer.last_login else None
#                 ),
#             }
#             for customer in customers
#         ]





from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db.models import (
    Count,
    DecimalField,
    Exists,
    OuterRef,
    Q,
    Subquery,
    Sum,
    Value,
)
from django.db.models.functions import Coalesce
from django.utils import timezone

from orders.models import Order

User = get_user_model()


class CustomersService:

    JOINED_RANGES = {
        "1d": timedelta(days=1),
        "1w": timedelta(weeks=1),
        "1m": timedelta(days=30),
        "1y": timedelta(days=365),
    }

    LAST_LOGIN_RANGES = JOINED_RANGES

    @staticmethod
    def get_customers(query_params=None):
        query_params = query_params or {}

        customers = User.objects.all()

        # 1. Filter by customer ID
        customer_id = query_params.get("id")

        if customer_id:
            customers = customers.filter(pk=customer_id)

        # 2. Filter by account status
        status = query_params.get("status")

        if status == "active":
            customers = customers.filter(is_active=True)
        elif status == "inactive":
            customers = customers.filter(is_active=False)

        # 3. Filter customers who have placed an order or not
        has_orders = query_params.get("has_orders")

        order_exists = Order.objects.filter(
            user_id=OuterRef("pk"),
        )

        if has_orders == "true":
            customers = customers.filter(Exists(order_exists))
        elif has_orders == "false":
            customers = customers.filter(~Exists(order_exists))

        # 4. Filter by registration date
        joined = query_params.get("joined")

        if joined in CustomersService.JOINED_RANGES:
            cutoff = (
                timezone.now()
                - CustomersService.JOINED_RANGES[joined]
            )
            customers = customers.filter(created_at__gte=cutoff)

        # 5. Filter by last login date
        last_login = query_params.get("last_login")

        if last_login in CustomersService.LAST_LOGIN_RANGES:
            cutoff = (
                timezone.now()
                - CustomersService.LAST_LOGIN_RANGES[last_login]
            )
            customers = customers.filter(last_login__gte=cutoff)

        # Existing customer annotations
        latest_order = Order.objects.filter(
            user_id=OuterRef("pk"),
        ).order_by("-created_at", "-id")

        return (
            customers
            .annotate(
                orders_count=Count("orders", distinct=True),
                total_spent=Coalesce(
                    Sum(
                        "orders__total",
                        filter=Q(
                            orders__status=Order.Status.DELIVERED,
                            orders__payment__status="paid",
                        ),
                    ),
                    Value(Decimal("0.00")),
                    output_field=DecimalField(
                        max_digits=12,
                        decimal_places=2,
                    ),
                ),
                latest_phone=Subquery(
                    latest_order.values("phone_number")[:1]
                ),
            )
            .order_by("-id")
        )

    @staticmethod
    def serialize_customers(customers):
        return [
            {
                "id": customer.id,
                "name": (
                    customer.get_full_name()
                    or customer.username
                    or customer.email
                    or ""
                ),
                "email": customer.email or "",
                "phone": customer.latest_phone or "",
                "status": (
                    "active" if customer.is_active else "inactive"
                ),
                "has_orders": customer.orders_count > 0,
                "orders_count": customer.orders_count,
                "total_spent": f"{customer.total_spent:.2f}",
                "joined_at": (
                    customer.created_at.isoformat()
                    if customer.created_at else None
                ),
                "last_login": (
                    customer.last_login.isoformat()
                    if customer.last_login else None
                ),
            }
            for customer in customers
        ]
