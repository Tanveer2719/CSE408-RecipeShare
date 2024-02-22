from django.urls import path

from . import views
from . import user_views
from . import blog_views

urlpatterns = [
    path('refresh/', user_views.refresh, name='index'),
    path('photoinfo/', views.photoInfo, name='photoInfo'),
    path('findcalorie/', views.calculateCalorie, name='findCalorie'),
    path('findrecipe/calorie/', views.getRecipeFromCalorie, name='findRecipeFromCalorie'),
    path('findrecipe/ingredients/', views.getRecipeFromIngredients, name='findRecipeFromIngredients'),
    
    # test ones
    path('ingredientwithnutreints/all/', views.getIngredientsWithNutrients, name='ingredientwithnutreints'),
    
    # user authentication and details
    path('user/login/', user_views.user_login, name='login'),
    path('user/signup/', user_views.user_signup, name='signup'),
    path('user/details/', user_views.user_details, name='user_details'),
    path('user/details/update/', user_views.update_user_details, name='update_user_details'),
    path('user/logout/', user_views.user_logout, name='logout'),
    path('user/image/upload/', user_views.upload_user_image, name='upload_user_image'),
    path('user/image/update/', user_views.update_user_image, name='update_user_image'),
    path('user/get/all/', user_views.get_all_users, name='get_all_users'),
    path('user/delete/', user_views.delete_user, name='delete_user'),
    path('user/add/admin/', user_views.user_add_admin, name='add_admin'),
    path('user/detailsFromId/', user_views.get_user_details, name='view user'),
    
    # user notifications
    path('user/notification/all/', user_views.get_notifications, name='getNotifications'),
    path('user/notification/read/', user_views.read_notification, name='readNotification'),
    path('user/notification/read/all/', user_views.read_all_notifications, name='readAllNotifications'),
    path('user/notification/delete/', user_views.delete_notification, name='deleteNotification'),
    path('user/notification/delete/all/', user_views.delete_all_notifications, name='deleteAllNotifications'),
    
    # user recipe
    path('user/recipe/get/all/', user_views.get_user_recipes, name='get_user_recipes'),
    path('user/recipe/add/', user_views.upload_recipe, name='upload_user_recipe'),
    path('user/recipe/update/', user_views.update_recipe, name='update_user_recipe'),
    path('user/recipe/video/add/', user_views.upload_recipe_video, name='upload_user_recipe_video'),
    path('user/recipe/image/add/', user_views.upload_recipe_image, name='upload_user_recipe_video'),
    
    # user blog
    path('user/blog/get/all/', blog_views.get_user_blogs, name='get_user_blogs'),
    
    # Public Recipe 
    path('recipe/get/', views.get_recipe, name='get_recipe'),
    path('recipe/get/all/', views.get_all_recipe, name='get_all_recipe'),
    path('recipe/get/latest/', views.get_latest_recipes, name='get_latest_recipes'),
    path('recipe/delete/', views.delete_recipe, name='delete_recipe'),
    
    
    #### Blog ####
    path('blog/get/all/', blog_views.get_all_blogs, name='get_all_blog'),
    path('blog/get/', blog_views.get_blog, name='get_blog'),
    path('blog/upload/', blog_views.upload_blog, name='add_blog'),
    path('blog/update/', blog_views.update_blog, name='update_blog'),
    path('blog/delete/', blog_views.delete_blog, name='delete_blog'),
    path('blog/comment/add/', blog_views.add_comment, name='add_comment'),
    path('blog/comment/delete/', blog_views.delete_comment, name='delete_comment'),

]
