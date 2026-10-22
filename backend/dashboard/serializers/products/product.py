import os

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.db.models import Max

from rest_framework import serializers

from products.models import (
    Product,
    Brand,
    Model as ProductModel,
    Category,
    Collection,
    Tag,
    ShippingClassRate,
    Currency,
    OptionVariable,
    Option,
    Variant,
    Media,
    Metafield,
)

# ==========================================================
# Validation helper
# ==========================================================

def run_model_validation(instance, *, full_clean=True):
    try:
        if full_clean:
            instance.full_clean()
        else:
            instance.clean()
    except DjangoValidationError as exc:
        if hasattr(exc, "message_dict"):
            detail = exc.message_dict
        else:
            detail = exc.messages

        raise serializers.ValidationError(detail)


# ==========================================================
# Option serializer
# ==========================================================

class OptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    option_variable = serializers.PrimaryKeyRelatedField(
        queryset=OptionVariable.objects.all(),
        required=False,
    )

    value = serializers.CharField(required=False)

    position = serializers.IntegerField(
        required=False,
        min_value=0,
    )

    class Meta:
        model = Option
        fields = [
            "id",
            "option_variable",
            "value",
            "position",
        ]


# ==========================================================
# Variant option values
# ==========================================================

class VariantOptionValueSerializer(serializers.Serializer):
    option_variable = serializers.PrimaryKeyRelatedField(
        queryset=OptionVariable.objects.all()
    )

    value = serializers.CharField()


# ==========================================================
# Variant serializer
# ==========================================================

class VariantSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    currency = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(),
        required=False,
    )

    option_values = VariantOptionValueSerializer(
        many=True,
        required=False,
        write_only=True,
    )

    options = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
    )

    sku = serializers.CharField(required=False)

    price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
    )

    compare_at_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    cost_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        allow_null=True,
    )

    position = serializers.IntegerField(
        required=False,
        min_value=0,
    )

    purchase_limit = serializers.IntegerField(
        required=False,
        min_value=1,
    )

    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = Variant
        fields = [
            "id",
            "sku",
            "price",
            "compare_at_price",
            "cost_price",
            "currency",
            "options",
            "option_values",
            "position",
            "purchase_limit",
            "is_active",
        ]


# ==========================================================
# Metafield serializer
# ==========================================================

class MetafieldSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    namespace = serializers.CharField(required=False)
    key = serializers.CharField(required=False)
    value = serializers.CharField(required=False)

    class Meta:
        model = Metafield
        fields = [
            "id",
            "namespace",
            "key",
            "value",
        ]


# ==========================================================
# Media serializer: response only
# ==========================================================

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = [
            "id",
            "file",
            "media_type",
            "alt_text",
            "position",
            "created_at",
        ]
        read_only_fields = fields


# ==========================================================
# Product serializer
# ==========================================================

class ProductSerializer(serializers.ModelSerializer):

    # Existing related records
    brand = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all()
    )

    model = serializers.PrimaryKeyRelatedField(
        queryset=ProductModel.objects.all(),
        required=False,
        allow_null=True,
    )

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )

    collections = serializers.PrimaryKeyRelatedField(
        queryset=Collection.objects.all(),
        many=True,
        required=False,
    )

    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
    )

    shipping_class_rates = serializers.PrimaryKeyRelatedField(
        queryset=ShippingClassRate.objects.all(),
        required=False,
        allow_null=True,
    )

    # Nested data
    options = OptionSerializer(
        many=True,
        required=False,
    )

    variants = VariantSerializer(
        many=True,
        required=False,
    )

    metafields = MetafieldSerializer(
        many=True,
        required=False,
    )

    # Uploaded images: multipart/form-data input.
    # Send each file using the "media" form field.
    media_files = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True,
        allow_empty=True,
    )

    # Existing images in the response.
    media = MediaSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "description",
            "brand",
            "model",
            "category",
            "collections",
            "tags",
            "shipping_class_rates",
            "is_active",
            "options",
            "variants",
            "media_files",
            "media",
            "metafields",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    # ------------------------------------------------------
    # Product validation
    # ------------------------------------------------------

    def validate(self, attrs):
        instance = self.instance

        brand = attrs.get(
            "brand",
            instance.brand if instance else None,
        )

        product_model = attrs.get(
            "model",
            instance.model if instance else None,
        )

        if product_model and brand:
            if product_model.brand_id != brand.id:
                raise serializers.ValidationError({
                    "model": (
                        "The selected model does not belong "
                        "to the selected brand."
                    )
                })

        return attrs

    # ------------------------------------------------------
    # Nested ownership validation
    # ------------------------------------------------------

    @staticmethod
    def _get_owned_object(
        model_class,
        object_id,
        product,
        field_name,
    ):
        try:
            return model_class.objects.get(
                pk=object_id,
                product=product,
            )
        except model_class.DoesNotExist:
            raise serializers.ValidationError({
                field_name: (
                    f"ID {object_id} does not exist or "
                    "does not belong to this product."
                )
            })

    # ------------------------------------------------------
    # Save options
    # ------------------------------------------------------

    def save_options(self, product, options_data):
        for item in options_data:
            item = item.copy()
            option_id = item.pop("id", None)

            if option_id is not None:
                option = self._get_owned_object(
                    Option,
                    option_id,
                    product,
                    "options",
                )

                for field, value in item.items():
                    setattr(option, field, value)

                run_model_validation(option)
                option.save()

            else:
                required_fields = [
                    "option_variable",
                    "value",
                ]

                missing_fields = [
                    field
                    for field in required_fields
                    if field not in item
                ]

                if missing_fields:
                    raise serializers.ValidationError({
                        "options": (
                            "New options require: "
                            + ", ".join(missing_fields)
                            + "."
                        )
                    })

                if "position" not in item:
                    current_max = product.options.aggregate(
                        max_position=Max("position")
                    )["max_position"]

                    item["position"] = (
                        0 if current_max is None
                        else current_max + 1
                    )

                option = Option(
                    product=product,
                    **item,
                )

                run_model_validation(option)
                option.save()

    # ------------------------------------------------------
    # Save variants
    # ------------------------------------------------------

    def save_variants(self, product, variants_data):
        for item in variants_data:
            item = item.copy()

            variant_id = item.pop("id", None)
            option_values = item.pop("option_values", None)

            if variant_id is not None:
                variant = self._get_owned_object(
                    Variant,
                    variant_id,
                    product,
                    "variants",
                )

                for field, value in item.items():
                    setattr(variant, field, value)

                if not variant.currency_id:
                    raise serializers.ValidationError({
                        "variants": (
                            "Currency is required for every variant."
                        )
                    })

                run_model_validation(variant)
                variant.save()

            else:
                required_fields = [
                    "sku",
                    "price",
                    "currency",
                ]

                missing_fields = [
                    field
                    for field in required_fields
                    if field not in item
                ]

                if missing_fields:
                    raise serializers.ValidationError({
                        "variants": (
                            "New variants require: "
                            + ", ".join(missing_fields)
                            + "."
                        )
                    })

                variant = Variant(
                    product=product,
                    **item,
                )

                run_model_validation(variant)
                variant.save()

            # Preserve current options unless option_values was sent.
            if option_values is not None:
                selected_options = []

                for option_value in option_values:
                    option = Option.objects.filter(
                        product=product,
                        option_variable=(
                            option_value["option_variable"]
                        ),
                        value=option_value["value"],
                    ).first()

                    if option is None:
                        raise serializers.ValidationError({
                            "variants": (
                                "Each option_values entry must match "
                                "an option belonging to this product."
                            )
                        })

                    selected_options.append(option)

                variant.options.set(selected_options)

    # ------------------------------------------------------
    # Save metafields
    # ------------------------------------------------------

    def save_metafields(self, product, metafields_data):
        for item in metafields_data:
            item = item.copy()
            metafield_id = item.pop("id", None)

            if metafield_id is not None:
                metafield = self._get_owned_object(
                    Metafield,
                    metafield_id,
                    product,
                    "metafields",
                )

                for field, value in item.items():
                    setattr(metafield, field, value)

                run_model_validation(metafield)
                metafield.save()

            else:
                required_fields = [
                    "namespace",
                    "key",
                    "value",
                ]

                missing_fields = [
                    field
                    for field in required_fields
                    if field not in item
                ]

                if missing_fields:
                    raise serializers.ValidationError({
                        "metafields": (
                            "New metafields require: "
                            + ", ".join(missing_fields)
                            + "."
                        )
                    })

                metafield = Metafield(
                    product=product,
                    **item,
                )

                run_model_validation(metafield)
                metafield.save()

    # ------------------------------------------------------
    # Save uploaded media
    # ------------------------------------------------------

    def save_media_files(self, product, files):
        if not files:
            return

        current_max = product.media.aggregate(
            max_position=Max("position")
        )["max_position"]

        position = (
            0 if current_max is None
            else current_max + 1
        )

        for file in files:
            Media.objects.create(
                product=product,
                file=file,
                media_type="image",
                alt_text=os.path.basename(file.name),
                position=position,
            )

            position += 1

    # ------------------------------------------------------
    # Create product
    # ------------------------------------------------------

    @transaction.atomic
    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        variants_data = validated_data.pop("variants", [])
        metafields_data = validated_data.pop("metafields", [])
        media_files = validated_data.pop("media_files", [])

        collections = validated_data.pop("collections", [])
        tags = validated_data.pop("tags", [])

        product = Product.objects.create(**validated_data)

        product.collections.set(collections)
        product.tags.set(tags)

        # Options must exist before variants reference them.
        self.save_options(product, options_data)
        self.save_variants(product, variants_data)
        self.save_metafields(product, metafields_data)
        self.save_media_files(product, media_files)

        return product

    # ------------------------------------------------------
    # Update product
    # ------------------------------------------------------

    @transaction.atomic
    def update(self, instance, validated_data):
        options_data = validated_data.pop("options", None)
        variants_data = validated_data.pop("variants", None)
        metafields_data = validated_data.pop("metafields", None)
        media_files = validated_data.pop("media_files", [])

        collections = validated_data.pop("collections", None)
        tags = validated_data.pop("tags", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        run_model_validation(instance, full_clean=False)
        instance.save()

        if collections is not None:
            instance.collections.set(collections)

        if tags is not None:
            instance.tags.set(tags)

        if options_data is not None:
            self.save_options(instance, options_data)

        if variants_data is not None:
            self.save_variants(instance, variants_data)

        if metafields_data is not None:
            self.save_metafields(instance, metafields_data)

        # Append new images; do not delete existing images.
        self.save_media_files(instance, media_files)

        return instance