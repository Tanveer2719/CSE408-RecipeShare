import jwt
import json
import requests
from .serializers import *
from MyApp.models import *
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc


# helper to identify the user
def get_user(token):
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGO])        
    return CustomUser.objects.filter(id=payload['id'])[0]

# Create your views here.
def index(request):
    return HttpResponse("Hello from the new app!")


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
    
    
    new_response = []
    
    for recipe in response.json():
        # create url-friendly title
        url_friendly_title = recipe.get("title", "").lower().replace(" ", "-")
        ingredients = [ingredient["name"] 
                       for ingredient in recipe["missedIngredients"]
                       ] + [ingredient["name"]
                        for ingredient in recipe["usedIngredients"]]
        
        new_recipe = {
            "title": recipe["title"],
            "image": recipe["image"],
            "ingredients" : ingredients,
            "link": f"https://spoonacular.com/recipes/{url_friendly_title}-{recipe['id']}"
        }
        new_response.append(new_recipe)
        
    
    return new_response

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
    
    print(querystring)

    headers = {
        "X-RapidAPI-Key": settings.CALORIE_CALCULATOR_API_KEY,
        "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    return JsonResponse({"response": response.json()})

@csrf_exempt  
@api_view(['POST'])
def getRecipeFromCalorie(request):  
    
    url = "https://api.spoonacular.com/mealplanner/generate"
    
    
    json_data = json.loads(request.body.decode('utf-8'))
    
    querystring = {
        "timeFrame": json_data.get("timeFrame", "day"),
        "targetCalories":json_data.get("targetCalories", "2000"),
        "diet": json_data.get("diet", str("vegetarian")),
        "exclude": json_data.get("exclude", ["shellfish","olives"]),
        }
    
    print(querystring)

    headers = {
        'Content-Type': 'application/json',
        'x-api-key': settings.SPOONACULAR_API_KEY,
        }

    response = requests.request("GET", url, headers=headers, params=querystring)
    return JsonResponse({"response": response.json()})
    
@csrf_exempt  
@api_view(['POST'])
def getRecipeFromIngredients(request):
    
    json_body = json.loads(request.body.decode('utf-8'))
    
    ingredients = json_body.get("ingredients")
    recipe_count = json_body.get("number", "1"),
    ignore_pantry = json_body.get("ignorePantry", True),
         
    new_response = get_recipe_list(ingredients, recipe_count, ignore_pantry)
    
    return Response(json.dumps(new_response), status=200)
               
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
    recipes = Recipe.objects.all()[:10]
    return Response(RecipeSerializer(recipes, many=True).data, status=200)

@api_view(['GET'])
def get_latest_recipes(request):
    recipes = Recipe.objects.all().order_by('-last_edited')[:10]
    return Response(RecipeSerializer(recipes, many=True).data, status=200)

