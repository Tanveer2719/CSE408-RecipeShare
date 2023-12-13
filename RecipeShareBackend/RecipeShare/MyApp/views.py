from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
import requests

# Create your views here.

def index(request):
    return HttpResponse("Hello from the new app!")

def photoInfo(request):
    # # Replace 'YOUR_API_KEY' with your actual Clarifai API key
    # clarifai_app = ClarifaiApp(api_key='my-first-application-6wq8d')

    # # Use the Food Model
    # model = clarifai_app.public_models.food_model

    # # Replace 'IMAGE_URL' with the URL of your image
    # response = model.predict_by_url(url='https://unsplash.com/photos/sliced-carrots-and-green-vegetable-bRdRUUtbxO0')

    # # Extract and print the names of vegetables
    # if 'concepts' in response['outputs'][0]:
    #     vegetables = [concept['name'] for concept in response['outputs'][0]['data']['concepts']]
    #     print("Detected Vegetables:", vegetables)
    #     return HttpResponse("This is the photo info page!")
    
    ##################################################################################################
    # In this section, we set the user authentication, user and app ID, model details, and the URL
    # of the image we want as an input. Change these strings to run your own example.
    #################################################################################################

    # Your PAT (Personal Access Token) can be found in the portal under Authentification
    PAT = '9832e2bb442149adad1d44b5badb7e61'
    # Specify the correct user_id/app_id pairings
    # Since you're making inferences outside your app's scope
    USER_ID = 'clarifai'
    APP_ID = 'main'
    # Change these to whatever model and image URL you want to use
    MODEL_ID = 'food-item-recognition'
    MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'
    
    ########### for uploaded image ############
    # # Access uploaded image file
    # uploaded_image_file = request.files['image']

    # # Save image temporarily
    # temp_image_path = tempfile.NamedTemporaryFile().name
    # uploaded_image_file.save(temp_image_path)

    # # Read image data
    # with open(temp_image_path, 'rb') as f:
    #     image_data = f.read()

    # # Convert image data to base64
    # image_base64 = base64.b64encode(image_data).decode('utf-8')
    
    
    IMAGE_URL = 'https://www.healthifyme.com/blog/wp-content/uploads/2023/06/shutterstock_2239704493-1.jpg'

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
    # return HttpResponse("Hello from the new app!")
    ingredients = []
    for concept in output.data.concepts:
        if concept.value * 100 > 5:
            ingredients.append({"name": concept.name, "percentage": concept.value*100})

    # Send JSON response
    return JsonResponse({"ingredients": ingredients})

def calculate_calorie(request):
    url = "https://fitness-calculator.p.rapidapi.com/dailycalorie"

    querystring = {"age":"25","gender":"male","height":"180","weight":"70","activitylevel":"level_1"}

    headers = {
        "X-RapidAPI-Key": "18e16ed062mshad6c0e93ab38703p195cd4jsn3a395cd6cb63",
        "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    print(response.json())
    return JsonResponse({"response": response.json()})
    