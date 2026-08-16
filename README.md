# Antigravity Motors - Dealership Reviews Capstone

A full-stack, responsive automotive dealership platform designed to view verified dealerships across the US, filter locations by state, inspect detailed customer reviews with automated AI-driven sentiment analysis, and allow registered users to submit their purchasing feedback.

---

## Technical Stack

- **Backend**: Python, Django 6.0.3 (REST APIs and session-based authentication)
- **Frontend**: React 18 (Vite SPA bundler, Axios, CSS design system)
- **Database**: SQLite (relational storage for users, car inventory, dealerships, and reviews)
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes Manifests (Deployment & Service)
- **CI-CD**: GitHub Actions workflows

---

## Installation & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations to initialize the database:
   ```bash
   python manage.py makemigrations djangoapp
   python manage.py migrate
   ```
4. Seed initial dealerships, reviews, and car inventory:
   ```bash
   python manage.py seed_data
   ```
5. Launch the Django server:
   ```bash
   python manage.py runserver
   ```
   The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd server/frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Build the static production bundle:
   ```bash
   npm run build
   ```
   The build will compile files directly into the Django static directory (`server/frontend/static/index.js`).

---

## API Documentation

All backend API endpoints are routed under `/djangoapp/`:

### Authentication
- `POST /djangoapp/register`: Register a new user profile.
- `POST /djangoapp/login`: Authenticate an existing user.
- `POST /djangoapp/logout`: Clear user session.

### Dealerships and Cars
- `GET /djangoapp/get_dealers`: Retrieve all dealerships.
- `GET /djangoapp/get_dealers/<state>`: Filter dealerships by US State (e.g. `Kansas`).
- `GET /djangoapp/dealer/<dealer_id>`: Retrieve specific dealership metadata by ID.
- `GET /djangoapp/get_cars`: Retrieve list of all car makes and models in inventory.

### Reviews and Sentiment
- `GET /djangoapp/reviews/dealer/<dealer_id>`: Fetch all customer reviews for a given dealership.
- `POST /djangoapp/add_review`: Submit a new dealer review.
- `POST /djangoapp/analyze`: Custom sentiment analysis endpoint (evaluates text as positive, neutral, or negative).

---

## Containerization and Deployment

### Docker Run
To run the fully containerized application:
```bash
docker build -t dealership-app .
docker run -p 8000:8000 dealership-app
```

### Kubernetes Run
Apply manifests to your cluster:
```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```
