# Use a lightweight Python image
FROM python:3.9-slim

WORKDIR /django_htmx_chat/app

# Copy requirements.txt and install dependencies
COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY . .
# Copy your Django app code

# Expose the port Django listens on (usually 8000)
EXPOSE 8000

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
