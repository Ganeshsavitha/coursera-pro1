from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    CAR_TYPES = [
        ('Sedan', 'Sedan'),
        ('SUV', 'SUV'),
        ('Wagon', 'Wagon'),
        ('Hatchback', 'Hatchback'),
        ('Pickup', 'Pickup'),
        ('Convertible', 'Convertible'),
    ]
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default='Sedan')
    year = models.IntegerField(
        validators=[
            MaxValueValidator(2030),
            MinValueValidator(2015)
        ]
    )

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"


class Dealer(models.Model):
    id = models.IntegerField(primary_key=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    address = models.CharField(max_length=250)
    zip = models.CharField(max_length=20)
    lat = models.FloatField(default=0.0)
    long = models.FloatField(default=0.0)
    short_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200)

    def __str__(self):
        return self.full_name


class Review(models.Model):
    dealer_id = models.IntegerField()
    name = models.CharField(max_length=100)
    purchase = models.BooleanField(default=False)
    review_text = models.TextField()
    purchase_date = models.CharField(max_length=50, blank=True, null=True) # Text representation for simplicity of date format
    car_make = models.CharField(max_length=100, blank=True, null=True)
    car_model = models.CharField(max_length=100, blank=True, null=True)
    car_year = models.IntegerField(blank=True, null=True)
    sentiment = models.CharField(max_length=20, default='neutral')

    def __str__(self):
        return f"Review for Dealer {self.dealer_id} by {self.name}"
