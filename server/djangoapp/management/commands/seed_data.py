from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from djangoapp.models import CarMake, CarModel, Dealer, Review

class Command(BaseCommand):
    help = 'Seeds the database with users, car makes, car models, dealers, and reviews.'

    def handle(self, *args, **options):
        # 1. Create Superuser if not exists
        if not User.objects.filter(username='root').exists():
            User.objects.create_superuser('root', 'root@example.com', 'adminpassword')
            self.stdout.write(self.style.SUCCESS('Superuser "root" created.'))
        else:
            self.stdout.write('Superuser "root" already exists.')

        # Clear existing data to avoid duplicates
        CarModel.objects.all().delete()
        CarMake.objects.all().delete()
        Dealer.objects.all().delete()
        Review.objects.all().delete()
        self.stdout.write('Cleared old CarMake, CarModel, Dealer, and Review data.')

        # 2. Seed Car Makes
        toyota = CarMake.objects.create(name="Toyota", description="Leading Japanese automaker known for reliability.", country="Japan")
        ford = CarMake.objects.create(name="Ford", description="Historic American brand producing robust trucks and muscle cars.", country="USA")
        honda = CarMake.objects.create(name="Honda", description="Famous Japanese brand for engines, motorcycles, and fuel-efficient cars.", country="Japan")
        chevrolet = CarMake.objects.create(name="Chevrolet", description="Popular American general motors division.", country="USA")

        # 3. Seed Car Models
        CarModel.objects.create(car_make=toyota, name="Camry", type="Sedan", year=2021)
        CarModel.objects.create(car_make=toyota, name="RAV4", type="SUV", year=2022)
        CarModel.objects.create(car_make=toyota, name="Corolla", type="Sedan", year=2021)
        CarModel.objects.create(car_make=toyota, name="Prius", type="Hatchback", year=2022)
        CarModel.objects.create(car_make=toyota, name="Highlander", type="SUV", year=2021)
        CarModel.objects.create(car_make=ford, name="Mustang", type="Convertible", year=2020)
        CarModel.objects.create(car_make=ford, name="F-150", type="Pickup", year=2022)
        CarModel.objects.create(car_make=ford, name="Explorer", type="SUV", year=2021)
        CarModel.objects.create(car_make=ford, name="Escape", type="SUV", year=2022)
        CarModel.objects.create(car_make=honda, name="Accord", type="Sedan", year=2021)
        CarModel.objects.create(car_make=honda, name="CR-V", type="SUV", year=2022)
        CarModel.objects.create(car_make=honda, name="Civic", type="Sedan", year=2022)
        CarModel.objects.create(car_make=honda, name="Pilot", type="SUV", year=2021)
        CarModel.objects.create(car_make=chevrolet, name="Corvette", type="Convertible", year=2023)
        CarModel.objects.create(car_make=chevrolet, name="Silverado", type="Pickup", year=2022)
        CarModel.objects.create(car_make=chevrolet, name="Malibu", type="Sedan", year=2021)

        self.stdout.write(self.style.SUCCESS('Car makes and models seeded.'))

        # 4. Seed 50 Dealers (Keeping Wichita, Austin, and Seattle as first 3)
        Dealer.objects.create(
            id=1,
            city="Wichita",
            state="Kansas",
            address="123 Wichita Dr",
            zip="67201",
            lat=37.6872,
            long=-97.3301,
            short_name="Toyota Wichita",
            full_name="Toyota Dealership of Wichita"
        )
        Dealer.objects.create(
            id=2,
            city="Austin",
            state="Texas",
            address="456 Austin Blvd",
            zip="78701",
            lat=30.2672,
            long=-97.7431,
            short_name="Ford Austin",
            full_name="Ford Dealership of Austin"
        )
        Dealer.objects.create(
            id=3,
            city="Seattle",
            state="Washington",
            address="789 Seattle Way",
            zip="98101",
            lat=47.6062,
            long=-122.3321,
            short_name="Honda Seattle",
            full_name="Honda Dealership of Seattle"
        )

        # Seed remaining 47 dealers to make a total of 50
        for i in range(4, 51):
            state_choices = ["Kansas", "Texas", "California", "New York", "Florida"]
            state = state_choices[i % len(state_choices)]
            city = f"City {i}"
            Dealer.objects.create(
                id=i,
                city=city,
                state=state,
                address=f"{i * 12} Street Rd",
                zip=f"{60000 + i}",
                lat=30.0 + (i * 0.1),
                long=-90.0 - (i * 0.1),
                short_name=f"Dealer {i}",
                full_name=f"Dealership {i} of {state}"
            )

        self.stdout.write(self.style.SUCCESS('50 Dealers seeded.'))

        # 5. Seed Reviews
        Review.objects.create(
            dealer_id=1,
            name="Alice Smith",
            purchase=True,
            review_text="Fantastic services! The sales representatives were very polite and the processing was quick.",
            purchase_date="2026-08-10",
            car_make="Toyota",
            car_model="Camry",
            car_year=2021,
            sentiment="positive"
        )
        Review.objects.create(
            dealer_id=1,
            name="Bob Jones",
            purchase=False,
            review_text="Average dealership experience. Clean showroom but waiting times for service were slightly long.",
            sentiment="neutral"
        )
        Review.objects.create(
            dealer_id=2,
            name="Charlie Brown",
            purchase=True,
            review_text="Bought a Mustang here. Great services and friendly atmosphere! Highly recommend.",
            purchase_date="2026-07-22",
            car_make="Ford",
            car_model="Mustang",
            car_year=2020,
            sentiment="positive"
        )
        Review.objects.create(
            dealer_id=2,
            name="David Miller",
            purchase=False,
            review_text="Bad customer service. Nobody offered to help me for 30 minutes, terrible experience.",
            sentiment="negative"
        )

        self.stdout.write(self.style.SUCCESS('Reviews seeded.'))
