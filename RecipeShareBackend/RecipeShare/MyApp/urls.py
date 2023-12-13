
from django.urls import path
from . import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('photoinfo/', views.photoInfo, name='photoInfo'),
    path('findcalorie/', views.calculate_calorie, name='findCalorie'),
]
