from itertools import combinations
import string
import jwt
import json
import requests
from .serializers import *
from MyApp.models import *
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from django.db.models import Q

def get_recipe_list_from_database(ingredients):
    # Combine filtering using a single Q object (assuming tags are the primary search criteria)
    search_options = Q()
    for ingredient_name in ingredients:
        search_options |= Q(recipeSearchTags__tag__iexact=ingredient_name)

    # Filter recipes based on combined search criteria
    filtered_recipes = Recipe.objects.filter(search_options)

    new_response = []
    for recipe in filtered_recipes:
        ingredient_names = [ingredient['ingredient'] for ingredient in recipe.ingredients]
        new_recipe = {
            "id": recipe.id,
            "title": recipe.title,
            "image": recipe.image,
            "ingredients": ingredient_names,
            "link": "",  # Replace with link generation logic if available
            "online": False
        }
        new_response.append(new_recipe)
        
    return new_response

def get_recipe_list_from_online(ingredients, number, ignorePantry=True):
    url = "https://api.spoonacular.com/recipes/findByIngredients"
        
    querystring = {
        "ingredients":ingredients,
        "number": str(number),
        "ignorePantry":ignorePantry,
    }
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': settings.SPOONACULAR_API_KEY,
    }
    
    response = requests.request("GET", url, headers=headers, params=querystring)
    
    new_response = []
    
    for recipe in response.json():
        # create url-friendly title
        url_friendly_title = recipe.get("title", "").lower().replace(" ", "-")
        ingredients = [ingredient["name"] 
                       for ingredient in recipe["missedIngredients"]
                       ] + [ingredient["name"]
                        for ingredient in recipe["usedIngredients"]]
        
        new_recipe = {
            "id":"",
            "title": recipe["title"],
            "image": recipe["image"],
            "ingredients" : ingredients,
            "link": f"https://spoonacular.com/recipes/{url_friendly_title}-{recipe['id']}",
            "online": True
        }
        new_response.append(new_recipe)
    return new_response
    
def get_recipe_list(ingredients, number, ignorePantry=True):
    
    new_response = get_recipe_list_from_database(ingredients)
    # if new_response size is less than number then update number and look for recipes online
    
    if(len(new_response) < number):
        number = number - len(new_response)
        new_response += get_recipe_list_from_online(ingredients, number, ignorePantry)
          
    return new_response

def get_recipe_list_for_target_calorie(totalcalorie):
    totalcalorie = int(totalcalorie)
    try:
        all_recipes = Recipe.objects.all()

        # Find all combinations of three recipes and calculate the calorie sum
        for combination in combinations(all_recipes, 3):
            calorie_sum = sum(recipe.calories for recipe in combination)

            # if calorie sum is within 100 of the target calorie, return the combination
            if abs(calorie_sum - totalcalorie) <= 100:
                return (combination, calorie_sum)
        return ([], 0)
                
    except Exception as e:
        print(e)
        return ([],0)
        
     
# helper to identify the user
def get_user(token):
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGO])        
    return CustomUser.objects.filter(id=payload['id'])[0]

@csrf_exempt
@api_view(['POST'])
def photoInfo(request):

    # Your PAT (Personal Access Token) can be found in the portal under Authentification
    PAT = settings.CLARIFAI_API_KEY
    # Specify the correct user_id/app_id pairings
    # Since you're making inferences outside your app's scope
    USER_ID = 'clarifai'
    APP_ID = 'main'
    
    # Change these to whatever model and image URL you want to use
    MODEL_ID = 'food-item-recognition'
    MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'
        
    json_body = json.loads(request.body.decode('utf-8'))
    IMAGE_URL = json_body.get('url')
    
    ############################################################################
    # YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ############################################################################


    # Establish a gRPC channel
    channel = ClarifaiChannel.get_grpc_channel()
    stub = service_pb2_grpc.V2Stub(channel)

    # meatadata is optional, but provides extra information that is useful to have
    metadata = (('authorization', 'Key ' + PAT),)

    # This will be used by every Clarifai endpoint call.
    userDataObject = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)
    
    # create the ingredients array
    FINAL_INGREDIENTS_LIST = set() 
    for image in IMAGE_URL:
        # Generate the post model outputs request
        post_model_output_request = service_pb2.PostModelOutputsRequest(
            user_app_id=userDataObject,  # The userDataObject is created in the overview and is required when using a PAT
            model_id=MODEL_ID,
            version_id=MODEL_VERSION_ID,  # This is optional. Defaults to the latest model version
            inputs=[
                resources_pb2.Input(
                    data=resources_pb2.Data(
                        image=resources_pb2.Image(
                            url=image
                            #base64=image_base64
                        )
                    )
                )
            ]
        )
        
        # Make the API call and handle errors
        try:
            post_model_outputs_response = stub.PostModelOutputs(
                post_model_output_request,
                metadata=metadata
            )
        except Exception as e:
            print("Error while calling the API: %s" % e)
            raise e
        
    
        # Since we have one input, one output will exist here
        output = post_model_outputs_response.outputs[0]

        # print("Predicted concepts:")
        # for concept in output.data.concepts:
        #     print("%s %.2f" % (concept.name, concept.value))

        # # Uncomment this line to print the full Response JSON
        # print(output)
        
        ingredients = []
        for concept in output.data.concepts:
            if concept.value * 100 > 50:
                ingredients.append({"name": concept.name, "percentage": concept.value*100})
                FINAL_INGREDIENTS_LIST.add(concept.name)  
    
    print(list(FINAL_INGREDIENTS_LIST))
    
    new_response = get_recipe_list(list(FINAL_INGREDIENTS_LIST), 10, True) 
    
    # print(new_response)   

    # Send JSON response
    response = JsonResponse(new_response, safe=False)  # Avoid unnecessary escaping for complex data
    response["Content-Type"] = "application/json"
    return response

@csrf_exempt  
@api_view(['POST'])
def calculateCalorie(request):
    
    # activity level: Sedentary = level_2, ModeratelyActive = level_4, very_active = level_6
    url = "https://fitness-calculator.p.rapidapi.com/dailycalorie"

    json_data = json.loads(request.body.decode('utf-8'))
    querystring = {
        "age":json_data.get('age', "25"),
        "gender":json_data.get('gender',"male"),
        "height":json_data.get('height', "180"),
        "weight":json_data.get("weight", "70"),
        "activitylevel":json_data.get('level', "level_1")
    }
    
    goal = json_data.get('goal', "Weight loss")
    print(goal)
    
        
    headers = {
        "X-RapidAPI-Key": settings.CALORIE_CALCULATOR_API_KEY,
        "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring).json()
    response = response['data'].get('goals')
    
    data = {}
    
    if(goal == "maintain weight"):
        data = {'calorie': response['maintain weight'] }
    
    data = {'calorie': response.get('Weight loss').get('calory')}
        
    return JsonResponse(data)

@csrf_exempt  
@api_view(['POST'])
def getRecipeFromCalorie(request): 
    
    url = "https://api.spoonacular.com/mealplanner/generate"
    
    
    json_data = json.loads(request.body.decode('utf-8'))
    
    timeframe = json_data.get("timeFrame", "day")
    targetCalories = json_data.get("targetCalories", "2000")
    diet = json_data.get("diet", "vegetarian")
    exclude = json_data.get("exclude", ["shellfish","olives"])
    
    new_response=[]
         
    combinations, calorie_sum = get_recipe_list_for_target_calorie(targetCalories)
    
    if combinations:
        print('found in db')
        new_response.append({'origin': 'database', 'calories': calorie_sum})
        for recipe in combinations:
            new_recipe = {
                "id": recipe.id,
                "title": recipe.title,
                "image": recipe.image,
                "link": "",
                "online": False
            }
            new_response.append(new_recipe)  
    else:
        print('not found in db')
        querystring = {
            "timeFrame": timeframe,
            "targetCalories":targetCalories,
            "diet": diet,
            "exclude": exclude,
            }
                
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': settings.SPOONACULAR_API_KEY,
            }

        
        response = requests.request("GET", url, headers=headers, params=querystring)
        # print(response.json())
        response = response.json()
        # calories = response['nutrients']['calories']
        calories = response.get('nutrients').get('calories')
        new_response.append({'origin': 'online', 'calories':calories})
        for recipe in response.get("meals"):
            new_recipe = {
                "id": "",
                "title": recipe["title"],
                "image": "",
                "link": recipe["sourceUrl"],
                "online": True
            }
            new_response.append(new_recipe)
            
    # Send JSON response
    response = JsonResponse(new_response, safe=False)  # Avoid unnecessary escaping for complex data
    response["Content-Type"] = "application/json"
    return response
    
@csrf_exempt  
@api_view(['POST'])
def getRecipeFromIngredients(request):
    
    json_body = json.loads(request.body.decode('utf-8'))
    
    ingredients = json_body.get("ingredients")
    recipe_count = json_body.get("number", "1")
    ignore_pantry = True
    
    get_recipe_list_from_database(ingredients)
         
    new_response = get_recipe_list(ingredients, recipe_count, ignore_pantry)
    
    # Send JSON response
    response = JsonResponse(new_response, safe=False)  # Avoid unnecessary escaping for complex data
    response["Content-Type"] = "application/json"
    return response
               
@csrf_exempt  
@api_view(['POST'])
def get_recipe(request):
    data = json.loads(request.body.decode('utf-8'))
    try:
        recipe_id = data.get('recipe_id')
        recipe = Recipe.objects.get(id=recipe_id)
        return Response(RecipeSerializer(recipe).data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
def get_all_recipe(request):
    # get 10 recipes
    recipes = Recipe.objects.all()
    return Response(RecipeSerializer(recipes, many=True).data, status=200)

@api_view(['GET'])
def get_latest_recipes(request):
    recipes = Recipe.objects.all().order_by('-last_edited')[:10]
    return Response(RecipeSerializer(recipes, many=True).data, status=200)

@csrf_exempt
@api_view(['DELETE'])
def delete_recipe(request):
    data = json.loads(request.body.decode('utf-8'))
    token = data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        recipe_id = data.get('recipe_id')
        recipe = Recipe.objects.get(id=recipe_id)
        recipe.delete()
        return Response({'message': 'Recipe deleted successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
   

"""_summary_
    Below are the Test Codes to modify the DB
    Not included in the main workflow
"""
@csrf_exempt
@api_view(['GET'])
def getIngredientsWithNutrients(request):
    #return all from IngredientsWithNutrition
    ing = IngredientsWithNutrition.objects.all()
    return Response(IngredientNutritionSerializer(ing, many=True).data, status=200)
    
@csrf_exempt
@api_view(['POST'])
def updateCalorie(request):
    data = json.loads(request.body.decode('utf-8'))
    try:
        recipe = Recipe.objects.get(id=data.get('recipe_id'))
        recipe.calories = data.get('calories')
        recipe.save()
        return Response({'message': 'Calorie updated successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)   
     
@csrf_exempt
@api_view(['POST'])
def search_recipes(request):
    print("what ??")
    # Get the search parameters from the request body
    data = json.loads(request.body.decode('utf-8'))
    print('Received data:', data)
    name = data.get('name')
    mealType = data.get('mealType')
    cuisineType = data.get('cuisineType')
    ingredients = data.get('ingredients')
    keywords = data.get('keywords')
    # Extract individual words from each key-value pair and store in a list
    search = []
    for key, value in data.items():
        words = value.split(",")  # Split the value by commas
        search.extend(words)  # Add the words to the search list

    print(search)
    print(ingredients)

    # Query the Recipe model based on the search parameters
    #recipes = Recipe.objects.all()
    #print(recipes)
   # Construct a Q object to combine all search terms using the AND operator
    search_query = Q()
    for search_name in search:
        search_query &= Q(recipeSearchTags_tag_icontains=search_name)

    recipes = Recipe.objects.filter(search_query).distinct()
    print(recipes)


    # Construct the response data
    new_response = []
    for recipe in recipes:
        #ingredient_names = [ingredient['ingredient'] for ingredient in recipe.ingredients]
        #title_names = [name['name'] for name in recipe.title]
        #keyword_names=[keywords['keywords'] for keywords in recipe.tags]
        #print(ingredient_names)
        #title_names = recipe.title['name']
        ingredient_names = [ingredient['ingredient'] for ingredient in recipe.ingredients]
        #tags_list = [tag for tag in recipe.tags]
        new_recipe = {
            "id": recipe.id,
            "title": recipe.title,
            "image": recipe.image,
            "ingredients" : ingredient_names,
            "tags":recipe.tags,
            "link": "",
            "online": False
        }
        new_response.append(new_recipe)

    print('Constructed response data:', new_response)
    # Return the response as JSON
    return JsonResponse({'response':new_response}, safe=False)

@csrf_exempt
@api_view(['POST'])
def search_recipes2(request):
    json_data = json.loads(request.body.decode('utf-8'))
    search_query = json_data.get('query')
    if not search_query:
        return JsonResponse({'error': 'Search query required'}, status=400)
    try:
        # Search for blogs with the given search query
        # at first split the search query using both commas and spaces
        search_terms = (
            search_query.lower().translate(str.maketrans('', '', string.punctuation))
            .replace(',', ' ')  # Handle any remaining commas
            .strip()
            .split()
        )
        print(search_terms)
        search_query = Q()
        for term in search_terms:
            # Search blog search tags using Q object and contains operator
            search_query |= Q(recipeSearchTags__tag__icontains=term)
        
        recipes = Recipe.objects.filter(search_query).distinct()
        serializer = MinimizedRecipeSerializer(recipes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)