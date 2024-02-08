from .serializers import *
from .views import *
from MyApp.models import *
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt') 
       
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    
    try:
        
        user = get_user(token)
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
        return Response({'error': 'Unauthenticated'}, status=401)
    else:
        try:
            user = get_user(token)  # get user from token
            recipes = Recipe.objects.filter(user=user)
            serializer = RecipeSerializer(recipes, many=True)
            return Response({'recipes': serializer.data}, status=200)
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
                        
            # create recipe object
            recipe = Recipe.objects.create(
                title=json_data.get('title'),
                description=json_data.get('description'),
                cooking_time=json_data.get('cooking_time'),
                difficulty_level=json_data.get('difficulty_level'),
                ingredients=json_data.get('ingredients'),
                tags=json_data.get('tags'),
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
            recipe = Recipe.objects.get(id=json_data.get('recipe_id'))
            
            if not recipe:
                return Response({'error': 'Invalid recipe id'}, status=401)
            
            recipe.title=json_data.get('title')
            recipe.cooking_time=json_data.get('cooking_time')
            recipe.difficulty_level=json_data.get('difficulty_level')
            recipe.ingredients=json_data.get('ingredients')
            recipe.tags=json_data.get('tags')
            recipe.meal_type=json_data.get('meal_type')
            recipe.image=json_data.get('image')
            recipe.video=json_data.get('video')
            # current date and time
            recipe.last_edited=timezone.now()

            recipe.user = user
            
            recipe.save()
            
            # create recipe steps
            for step in json_data.get('steps'):
                # get the step object
                step_obj = RecipeSteps.objects.get(recipe=recipe, order=step.get('order'))
                #update the step object
                step_obj.step=step.get('step')
                step_obj.image=step.get('image')
                step_obj.save()
            
            # return the serialized recipe object
            return Response(RecipeSerializer(recipe).data, status=200)
        
        except Exception as e:
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
