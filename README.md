# build the docker file
docker build -t django-app .      

# run the app
 docker run -p 8000:8000 django-app