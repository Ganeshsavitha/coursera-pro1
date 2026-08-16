# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY server/frontend/package.json ./
RUN npm install
COPY server/frontend/ ./
RUN npm run build

# Stage 2: Django server
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ ./
# Copy built static files from frontend-builder
COPY --from=frontend-builder /app/frontend/static /app/frontend/static

# Expose port
EXPOSE 8000

# Run migrations, seed, and start server
CMD python manage.py migrate && python manage.py seed_data && python manage.py runserver 0.0.0.0:8000
