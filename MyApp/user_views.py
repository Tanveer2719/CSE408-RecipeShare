from RecipeShare.settings import NUTRITIONIX_API_KEY, NUTRITIONIX_APP_ID
from .serializers import *
from .views import *
from MyApp.models import *
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg

# Create your views here.

@api_view(['GET'])
def refresh(request):
    print("inside refresh")
    for recipe in Recipe.objects.all():
        user_data = {
            'title': recipe.title,
            'ingredients': recipe.ingredients,
            'tags': recipe.tags  # Use existing tags if present
        }
        print(user_data)
        update_recipe_tags(recipe.id, user_data)
        
    return Response({'message': 'Refreshed successfully'}, status=200)

@csrf_exempt
@api_view(['PUT'])
def update_user_image(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    
    try:
        user = get_user(token)
        
        imageURL = data.get('image')
        user.image = imageURL
        user.save() 
        
        return JsonResponse({'message': 'Image updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
      
@csrf_exempt
@api_view(['POST'])
def upload_user_image(request):
    
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    
    try:
        user = get_user(token)
        imageURL = data.get('image')
        user.image = imageURL
        user.save() 
        
        return JsonResponse({'message': 'Image uploaded successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def user_signup(request):
    json_data = json.loads(request.body.decode('utf-8'))
    username = json_data.get('username')
    password = json_data.get('password')
    email = json_data.get('email')
    image = json_data.get('image')
    date_joined = timezone.now()
    
    if username is None or password is None or email is None:
        return Response({'error': 'Please provide proper credintials'}, status=400)
    
    # check if user already exists
    existing_user = CustomUser.objects.filter(name=username).exists()
    
    if not existing_user:
        user = CustomUser.objects.create_user(name=username, password=password, email=email, date_joined=date_joined, image=image)
        if user is not None:
            # serialize the user and return with status code
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        else:
            return Response({'error': 'Invalid credentials'}, status=401)
    else:
        return Response({'error': 'Username already exists'}, status=400)
  
@csrf_exempt
@api_view(['POST'])
def user_login(request):
    json_data = json.loads(request.body.decode('utf-8'))
    username = json_data.get('username')
    password = json_data.get('password')
    
    user = authenticate(request, name=username, password=password)

    if user is not None:
        user.last_login = timezone.now()
        user.save()
        
        payload = {
            'id': user.id,
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(minutes=60),
            'iat': datetime.utcnow()
        }

        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.ALGO)

        response = Response(status=200)

        response.set_cookie(key='jwt', value=token, httponly=False)
        response.data = {
            'jwt': token
        }
        return response 
        
    else:
        return Response({'error': 'Invalid credentials'}, status=401)

@csrf_exempt   
@api_view(['POST'])
def user_details(request):
    print('inside user details')
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt') 
    print(token)
       
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    
    try:
        user = get_user(token)
        print(user)
        serializer = UserSerializer(user)
        return Response({'user_details': serializer.data}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def get_notifications(request):
    
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            notifications = Notifications.objects.filter(user=user)
            serializer = NotificationSerializer(notifications, many=True)
            return Response({'notifications': serializer.data}, status=200)
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt
@api_view(['POST'])
def get_user_recipes(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return Response({'error: token not found'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            if not user:
                return Response({'error': 'User not found'}, status=401)
            print(user)
            recipes = Recipe.objects.filter(user=user)
            print(recipes)
            # recipes = Recipe.objects.all()
            return Response(RecipeSerializer(recipes, many=True).data, status=200)
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt
@api_view(['PUT'])
def read_notification(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            notification_id = request.data.get('notification_id')
            notification = Notifications.objects.get(id=notification_id)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification read successfully'}, status=200)
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt       
@api_view(['PUT'])
def read_all_notifications(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            notifications = Notifications.objects.filter(user=user)
            for notification in notifications:
                notification.is_read = True
                notification.save()
            return Response({'message': 'All notifications read successfully'}, status=200)
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt       
@api_view(['DELETE'])
def delete_notification(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            notification_id = request.data.get('notification_id')
            notification = Notifications.objects.get(id=notification_id)
            notification.delete()
            return Response({'message': 'Notification deleted successfully'}, status=200)
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt          
@api_view(['DELETE'])
def delete_all_notifications(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            notifications = Notifications.objects.filter(user=user)
            for notification in notifications:
                notification.delete()
            return Response({'message': 'All notifications deleted successfully'}, status=200)
        except Exception as e:
            return Response(str(e), status=401)
 
@csrf_exempt       
@api_view(['POST'])
def user_logout(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'Logout successful'
        }
        return response
 
def update_recipe_tags(recipe_id, user_data):
    recipe = Recipe.objects.get(pk=recipe_id)
    
    # Extract data
    title = user_data.get('title', '')
    ingredients = user_data.get('ingredients', [])
    user_tags = user_data.get('tags', [])


    # Process ingredients
    ingredient_names = []
    for ingredient in ingredients:
        ingredient_name = ingredient.get('ingredient', '').lower().strip()
        if ingredient_name:
            ingredient_names.append(ingredient_name)
    
    # print(ingredient_names)

    # Create or retrieve tags
    all_tags = []
    for tag_name in set(title.lower().strip().split()) | set(ingredient_names) | set(user_tags):
        tag, _ = RecipeSearchTags.objects.get_or_create(tag=tag_name)
        all_tags.append(tag)
        
    # print(all_tags)

    # Update recipe tags
    recipe.recipeSearchTags.clear()
    recipe.recipeSearchTags.add(*all_tags)
    recipe.save()
   
@csrf_exempt
@api_view(['POST'])
def upload_recipe(request):
    
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
                        
            ing = json_data.get('ingredients')
            serve = json_data.get('servings')
            
                
            # calculate calories
            calorie = get_nutrition_value(ing)
            print(calorie)

            
            # return Response({'message': 'Calories calculated successfully'}, status=200)
            
            # create recipe object
            recipe = Recipe.objects.create(
                title=json_data.get('title'),
                description=json_data.get('description'),
                cooking_time=json_data.get('cooking_time'),
                difficulty_level=json_data.get('difficulty_level'),
                ingredients= ing,
                tags=json_data.get('tags'),
                calories = calorie/serve,
                servings=serve,
                image=json_data.get('image'),
                video=json_data.get('video'),
                meal_type=json_data.get('meal_type'),
                # current date and time
                last_edited= datetime.now(),
                user = user
            )
            
            # create recipe steps
            for step in json_data.get('steps'):
                RecipeSteps.objects.create(
                    order=step.get('order'),
                    step=step.get('step'),
                    image=step.get('image'),
                    recipe=recipe
                )
            
            # Update tags using the optimized function
            update_recipe_tags(recipe.id, json_data)
            
            # return the serialized recipe object
            return Response(RecipeSerializer(recipe).data, status=200)
        
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt
@api_view(['PUT'])
def update_recipe(request):
        
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
                                        
            # create recipe object
            recipe = Recipe.objects.get(id=json_data.get('id'))
            
            if not recipe:
                return Response({'error': 'Invalid recipe id'}, status=401)
            
            user = get_user(token)  # get user from token
                        
            ing = json_data.get('ingredients')
            serve = json_data.get('servings')
            
                
            # calculate calories
            calorie = get_nutrition_value(ing)
            print(calorie)

            
            # return Response({'message': 'Calories calculated successfully'}, status=200)
            
            recipe.title=json_data.get('title')
            recipe.description=json_data.get('description')
            # cooking_time = json_data.get('cooking_time')
            # print(type(cooking_time))
            recipe.cooking_time=int(json_data.get('cooking_time'))
            recipe.difficulty_level=json_data.get('difficulty_level')
            recipe.ingredients= ing
            recipe.tags=json_data.get('tags')
            recipe.calories = calorie/serve
            recipe.servings=serve
            recipe.image=json_data.get('image')
            recipe.video=json_data.get('video')
            recipe.meal_type=json_data.get('meal_type')
            # current date and time
            recipe.last_edited= datetime.now()
            recipe.user = user
            
            recipe.save()
            
            #update recipe steps
            RecipeSteps.objects.filter(recipe=recipe).delete()
            # create recipe steps
            for step in json_data.get('steps'):
                RecipeSteps.objects.create(
                    order=step.get('order'),
                    step=step.get('step'),
                    image=step.get('image'),
                    recipe=recipe
                )
            
            # Update tags using the optimized function
            update_recipe_tags(recipe.id, json_data)
            
            # return the serialized recipe object
            return Response(RecipeSerializer(recipe).data, status=200)
        
        except Exception as e:
            print(e)
            return Response(str(e), status=401)

@csrf_exempt  
@api_view(['POST'])
def upload_recipe_video(request):
    
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            
            recipe_id = json_data.get('recipe_id')
            videoURL = json_data.get('video')
            
             
            if not videoURL:
                return Response({'error': 'No video found'}, status=400)
            
            # get the recipe object
            recipe = Recipe.objects.get(id=recipe_id)
            
            if not recipe:
                return Response({'error': 'Invalid recipe id'}, status=401)
            
            recipe.video = videoURL
            recipe.save()
            
            # return the serialized recipe object
            return Response(RecipeSerializer(recipe).data, status=200)
        
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt         
@api_view(['PUT'])
def update_user_details(request):
    
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
                    
            user.email = json_data.get('email')
            user.image = json_data.get('image')
            user.save()
            
            return Response({'message': 'User details updated successfully'}, status=200)
        
        except Exception as e:
            return Response(str(e), status=401)

@csrf_exempt         
@api_view(['POST'])
def get_recipe_details(request):
    data  = json.loads(request.body.decode('utf-8'))
    try:
        recipe_id = data.get('recipe_id')
        recipe = Recipe.objects.get(id=recipe_id)
        return Response(RecipeSerializer(recipe).data, status=200)
    except Exception as e:
        return Response(str(e), status=401)
     
@api_view(['GET'])
def get_all_users(request):
    users = CustomUser.objects.all()
    return Response(UserSerializer(users, many=True).data, status=200)


@csrf_exempt
@api_view(['DELETE'])
def delete_user(request):
    data = json.loads(request.body.decode('utf-8'))
    user_id = data.get('user_id')
    user = CustomUser.objects.get(id=user_id)
    user.delete()
    return Response({'message': 'User deleted successfully'}, status=200)

@csrf_exempt
@api_view(['PUT'])
def user_add_admin(request):
    data = json.loads(request.body.decode('utf-8'))
    user_id = data.get('user_id')
    user = CustomUser.objects.get(id=user_id)
    user.is_admin = True
    user.save()
    return Response({'message': 'User is now an admin'}, status=200)

@csrf_exempt
@api_view(['POST'])
def get_user_details(request):
    data = json.loads(request.body.decode('utf-8'))
    user_id = data.get('user_id')
    user = CustomUser.objects.get(id=user_id)
    return Response(UserSerializer(user).data, status=200)

@csrf_exempt
@api_view(['PUT'])
def upload_recipe_image(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    
    if not token:
        return Response({'error': 'Unauthenticated'}, status=401)
    try:
        user = get_user(token)  # get user from token
                                        
        # create recipe object
        recipe = Recipe.objects.get(id=json_data.get('recipe_id'))
        recipe.image = json_data.get('image')
        recipe.save()
        return Response({'message': 'Image uploaded successfully'}, status=200)    
    except Exception as e:
        return Response({'error': str(e)}, status=401)
    
# check the IngredientsWithNutrition if it has the ingredient
# if it does then calculate the nutrition value and return it
# if it does not then send a request and then update the ingredient table and 
# then calculate the nutrition value and return it
def get_nutrition_value(ingredient_list):
    tot_calorie = 0
    ing_list = ""
    for i in ingredient_list:
        ingredient_obj = IngredientsWithNutrition.objects.filter(
            name__iexact=i.get('ingredient', None).lower(),
            unit__iexact=i.get('unit', None).lower(),
            amount=i.get('amount')
        ).first()
        if ingredient_obj:
            tot_calorie += ingredient_obj.calorie
        else:
            str_value = str(i.get('amount')) + " " + i.get('unit') + " \'" + i.get('ingredient') + "\'"
            ing_list += str_value + " ,"
            
    if len(ing_list) == 0:
        return tot_calorie
    else:
        url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
        headers = {
            "Content-Type": "application/json",
            "x-app-id": NUTRITIONIX_APP_ID,  # Replace with your Nutritionix app ID
            "x-app-key": NUTRITIONIX_API_KEY,  # Replace with your Nutritionix app key
        }
        data = {"query": ing_list}

        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            foods = response.json().get('foods',[])
            for food in foods:
                ingredient = IngredientsWithNutrition.objects.create(
                name=food.get('food_name'),
                amount=food.get('serving_qty'),
                unit=food.get('serving_unit').split()[0],
                gm_weight=food.get('serving_weight_grams'),
                calorie=food.get('nf_calories'),
                fat=food.get('nf_total_fat'),
                protein=food.get('nf_protein'),
                carbohydrate=food.get('nf_total_carbohydrate')
                )
                ingredient.save()
                tot_calorie += ingredient.calorie
            return tot_calorie 
        else:
            # Handle error gracefully, e.g., log error, raise exception, return None
            raise Exception(f"Nutritionix API error: {response.status_code}")


@csrf_exempt
@api_view(['POST'])
def add_ratings(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)

        data = json.loads(request.body.decode('utf-8'))

        recipe_id = data.get('recipe_id')
        ratings = data.get('ratings')
        # Find the recipe post
        recipe_post = Recipe.objects.get(id=recipe_id)
        
        # Check if the user has already rated this blog post
        existing_rating = RecipePostRating.objects.filter(recipe_post=recipe_post, user=user).first()

        if existing_rating:
            # Update the existing rating
            existing_rating.ratings = ratings
            existing_rating.save()
        else:
            # Create a new rating
            RecipePostRating.objects.create(recipe_post=recipe_post, user=user, ratings=ratings)

        # Calculate the new average rating
        average_rating = RecipePostRating.objects.filter(recipe_post=recipe_post).aggregate(Avg('ratings'))['ratings__avg']
        recipe_post.ratings = average_rating
        recipe_post.save()

        # Return the new average rating in the response
        return JsonResponse({'average_rating': average_rating}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)
    
@csrf_exempt
@api_view(['POST'])
def add_comment(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    print(token)
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)

        data = json.loads(request.body.decode('utf-8'))
        
        text = data['text']
        date = timezone.now()
        recipe_id = data['recipe_id']
        
        comment = RecipeComments.objects.create(
            text=text,
            date=date,
            recipe_post=Recipe.objects.get(id=recipe_id),
            user=user
        )
        '''
        class Notifications(models.Model):
            notification = models.CharField(max_length=200)
            date = models.DateTimeField('date published')
            is_read = models.BooleanField(default=False)
            user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)   # who receives the notification 
            
            def __str__(self):
                return self.notification
        '''
        
        # update notification table
        recipe = Recipe.objects.get(id=recipe_id)
        notification = Notifications.objects.create(
            notification = user.name + " commented on your recipe",
            date = date,
            user = recipe.user,
            is_recipe = True,
            recipe = recipe,
            blog=None
        )
        notification.save()
        
        serializer = RecipeCommentsSerializer(comment, many=False)
        print(serializer.data)
        return Response(RecipeCommentsSerializer(comment).data, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400) 
    
@csrf_exempt
@api_view(['POST'])
def get_recipe_from_user_id(request): 
    # get all the recipes of the user id 
    data = json.loads(request.body.decode('utf-8'))
    user_id = data.get('user_id')
    if not user_id:
        return Response({'error': 'User id required'}, status=401)
    try:
        recipes = Recipe.objects.filter(user=user_id)
        return Response(MinimizedRecipeSerializer(recipes, many=True).data, status=200)
    except:
        return Response({'error': 'User not found'}, status=401)
      