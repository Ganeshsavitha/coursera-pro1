from django.contrib import admin
from .models import CarMake, CarModel, Dealer, Review

class CarModelInline(admin.StackedInline):
    model = CarModel
    extra = 1

class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'description')
    inlines = [CarModelInline]

class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ('type', 'year', 'car_make')

class DealerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'city', 'state', 'id')
    list_filter = ('state', 'city')

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'dealer_id', 'sentiment', 'purchase')
    list_filter = ('sentiment', 'purchase')

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
admin.site.register(Dealer, DealerAdmin)
admin.site.register(Review, ReviewAdmin)
