from itertools import combinations
import string
from django.forms import FloatField
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
    print("inside get_recipe_list_from_database")
    recipes = Recipe.objects.all()
    for ingredient_name in ingredients:
        recipes = recipes.filter(Q(recipeSearchTags__tag__iexact=ingredient_name))
        
    new_response = []
    for recipe in recipes:
        ingredient_names = [ingredient['ingredient'] for ingredient in recipe.ingredients]
        print(ingredient_names)
        new_recipe = {
            "id": recipe.id,
            "title": recipe.title,
            "image": recipe.image,
            "ingredients" : ingredient_names,
            "link": "",
            "online": False
        }
        new_response.append(new_recipe)
    return new_response

def get_recipe_list(ingredients, number, ignorePantry=True):
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
    
    
    new_response = get_recipe_list_from_database(ingredients)
    
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

'''
def get_recipe_list_from_calorie(target_calorie, num_recipes=3, meal_type=None, tolerance=100):
    tolerance_level = tolerance
    
 
    # Filter and order recipes based on conditions
    query = Q()
         
    
    recipes = Recipe.objects.filter(query).annotate(
        abs_diff=ExpressionWrapper(
        Func(F('calories') - target_calorie, function='ABS'),
        output_field=fields.FloatField()
    )
    ).order_by('abs_diff')[:num_recipes * 2]  # Fetch potentially twice as many as needed
     
    
    for recipe in recipes:
        print(recipe.title, recipe.calories, recipe.abs_diff)
        

    # Select recipes within the tolerance level efficiently
    matching_recipes = []
    for recipe in recipes:
        if abs(recipe.abs_diff) <= tolerance_level:
            matching_recipes.append({'title': recipe.title, 'calories': recipe.calories})
            if len(matching_recipes) == num_recipes:
                break  # Stop once enough recipes are found

    return matching_recipes


def get_recipe_list_for_target_calorie(target_calorie, num_recipes=3, tolerance=100):
    lower_limit = target_calorie - tolerance
    upper_limit = target_calorie + tolerance

    query = Q()  # Add meal_type filter here if needed
    recipes = Recipe.objects.filter(query).annotate(
        abs_diff=F('calories') - target_calorie
    ).order_by('abs_diff')  # Maintain original order for accurate comparisons

    best_combination = []
    best_total_calories = None

    for recipe in recipes:
        calories = recipe.calories

        # Check if this recipe fits within the limits and improves the current best
        if lower_limit <= calories <= upper_limit and (
            best_total_calories is None or
            abs(calories - target_calorie) < abs(best_total_calories - target_calorie)
        ):
            current_combination = best_combination + [recipe]
            current_total_calories = sum(recipe.calories for recipe in current_combination)

            # Only consider combinations with the appropriate number of recipes
            if len(current_combination) == num_recipes:
                best_combination = current_combination
                best_total_calories = current_total_calories
                break  # Found the best possible combination

    # Handle cases where no matching combinations are found
    if not best_combination:
        print("No matching recipes found within the target calorie range.")
        return []  # Or return an appropriate error response

    # Format the response with the best recipes
    recipe_data = [{'id': recipe.id, 'title': recipe.title, 'calories': recipe.calories} for recipe in best_combination]
    return recipe_data  # Or return a JsonResponse with the data

'''  
    
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
    
    # Generate the post model outputs request
    post_model_output_request = service_pb2.PostModelOutputsRequest(
        user_app_id=userDataObject,  # The userDataObject is created in the overview and is required when using a PAT
        model_id=MODEL_ID,
        version_id=MODEL_VERSION_ID,  # This is optional. Defaults to the latest model version
        inputs=[
            resources_pb2.Input(
                data=resources_pb2.Data(
                    image=resources_pb2.Image(
                        url=IMAGE_URL
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
    ingredients_name=[]
    for concept in output.data.concepts:
        if concept.value * 100 > 5:
            ingredients.append({"name": concept.name, "percentage": concept.value*100})
            ingredients_name.append(concept.name)   
    
    new_response = get_recipe_list(ingredients_name, 10, True)    

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
         
    querystring = {
        "timeFrame": timeframe,
        "targetCalories":targetCalories,
        "diet": diet,
        "exclude": exclude,
        }
    
    print(querystring)
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': settings.SPOONACULAR_API_KEY,
        }

    response = requests.request("GET", url, headers=headers, params=querystring)
    
    # print(get_recipe_list_for_target_calorie(targetCalories))
    
    return JsonResponse({"response": response.json()})
    
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