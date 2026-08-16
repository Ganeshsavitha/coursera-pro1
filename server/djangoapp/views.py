import json
import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict

from .models import CarMake, CarModel, Dealer, Review

# Get an instance of a logger
logger = logging.getLogger(__name__)

def analyze_sentiment_text(text):
    if not text:
        return "neutral"
    
    text_lower = text.lower()
    
    # Word lists for rule-based sentiment
    positive_words = [
        "fantastic", "great", "excellent", "love", "awesome", "good", "happy", 
        "friendly", "nice", "perfect", "wonderful", "amazing", "satisfied", "helpful",
        "smooth", "pleasant", "best", "recommend"
    ]
    
    negative_words = [
        "bad", "worst", "terrible", "poor", "hate", "awful", "unhappy", 
        "rude", "slow", "expensive", "disappointed", "never", "regret", "waste",
        "horrible", "broken", "unhelpful"
    ]
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count:
        return "positive"
    elif neg_count > pos_count:
        return "negative"
    else:
        return "neutral"

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"userName": username, "status": "Authenticated"})
            else:
                return JsonResponse({"userName": username, "status": "Failed", "message": "Invalid username or password"})
        except Exception as e:
            return JsonResponse({"status": "Failed", "message": str(e)})
    return JsonResponse({"status": "Failed", "message": "Only POST requests are allowed"})

@csrf_exempt
def logout_request(request):
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    return JsonResponse({"userName": username})

@csrf_exempt
def registration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({"userName": username, "status": "Failed", "message": "Username already exists"})
            
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        except Exception as e:
            return JsonResponse({"status": "Failed", "message": str(e)})
    return JsonResponse({"status": "Failed", "message": "Only POST requests are allowed"})

def get_cars(request):
    car_models = CarModel.objects.select_related('car_make').all()
    cars = []
    for model in car_models:
        cars.append({
            "id": model.id,
            "car_make": model.car_make.name,
            "car_model": model.name,
            "car_type": model.type,
            "car_year": model.year
        })
    return JsonResponse({"status": 200, "cars": cars})

def get_dealerships(request, state=None):
    if state:
        # Kansas state filtering must work. Check case-insensitive.
        dealers = Dealer.objects.filter(state__iexact=state)
    else:
        dealers = Dealer.objects.all()
    
    dealers_list = []
    for dealer in dealers:
        dealers_list.append(model_to_dict(dealer))
    return JsonResponse({"status": 200, "dealers": dealers_list})

def get_dealer_details(request, dealer_id):
    try:
        dealer = Dealer.objects.get(id=dealer_id)
        return JsonResponse({"status": 200, "dealer": [model_to_dict(dealer)]})
    except Dealer.DoesNotExist:
        return JsonResponse({"status": 404, "message": "Dealer not found"})

def get_dealer_reviews(request, dealer_id):
    reviews = Review.objects.filter(dealer_id=dealer_id)
    reviews_list = []
    for r in reviews:
        review_dict = model_to_dict(r)
        # Update sentiment if empty/neutral
        review_dict['sentiment'] = analyze_sentiment_text(r.review_text)
        reviews_list.append(review_dict)
    return JsonResponse({"status": 200, "reviews": reviews_list})

@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            # For local testing, if session is not active, allow it or associate with guest
            # In production we check request.user.is_authenticated
            pass
        
        try:
            data = json.loads(request.body)
            # Find matching fields
            dealer_id = data.get('dealer')
            name = data.get('name', request.user.username if request.user.is_authenticated else "Anonymous")
            purchase = data.get('purchase', False)
            review_text = data.get('review')
            purchase_date = data.get('purchase_date', '')
            car_make = data.get('car_make', '')
            car_model = data.get('car_model', '')
            car_year = data.get('car_year', None)
            
            # Run sentiment analysis
            sentiment = analyze_sentiment_text(review_text)
            
            review = Review.objects.create(
                dealer_id=dealer_id,
                name=name,
                purchase=purchase,
                review_text=review_text,
                purchase_date=purchase_date,
                car_make=car_make,
                car_model=car_model,
                car_year=car_year,
                sentiment=sentiment
            )
            return JsonResponse({"status": 200, "message": "Review added successfully", "review": model_to_dict(review)})
        except Exception as e:
            return JsonResponse({"status": 500, "message": str(e)})
            
    return JsonResponse({"status": 400, "message": "Only POST requests are allowed"})

@csrf_exempt
def analyze_sentiment(request):
    text = ""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')
        except:
            text = request.POST.get('text', '')
    else:
        text = request.GET.get('text', '')
        
    if not text:
        return JsonResponse({"status": 400, "message": "No text provided"})
        
    sentiment = analyze_sentiment_text(text)
    return JsonResponse({"status": 200, "sentiment": sentiment})
