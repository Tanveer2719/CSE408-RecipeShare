import json
import string
from .views import *
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from MyApp.models import *
from MyApp.serializers import *
from MyApp.views import get_user
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Avg

def update_blog_tags(blog_id, data):
    # get blog
    blog = BlogPosts.objects.get(id=blog_id)
    
    # extract data
    title = data.get('title', '')
    user_tags = data.get('tags', [])
    
    all_tags = []
    for tag_name in set(title.lower().strip().split()) | set(user_tags):
        tag, _ = BlogSearchTags.objects.get_or_create(tag=tag_name)
        all_tags.append(tag)
        
    blog.blogSearchTags.clear()
    blog.blogSearchTags.add(*all_tags)
    blog.save()


@api_view(['POST'])
def get_blog(request):
    
    data = json.loads(request.body.decode('utf-8'))
    blog_id = data.get('blog_id')
    if not blog_id:
        return JsonResponse({'error': 'Blog id required'}, status=400)
    blog = BlogPosts.objects.get(id=blog_id)
    
    if not blog:
        return JsonResponse({'error': 'Blog not found'}, status=404)

    serializer = BlogPostsSerializer(blog, many=False)
    # return a json response
    return Response(serializer.data)

@api_view(['GET'])
def get_all_blogs(request):
    blogs = BlogPosts.objects.all()
    serializer = BlogSerializerForAll(blogs, many=True)
    # return a json response
    return Response(serializer.data)

@api_view(['POST'])
def get_user_blogs(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)
        blogs = BlogPosts.objects.filter(user=user)
        serializer = BlogSerializerForAll(blogs, many=True)
        # return a json response
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt  
@api_view(['POST'])
def upload_blog(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)
        
        data = json.loads(request.body.decode('utf-8'))
        
        blog = BlogPosts.objects.create(
            title=data['title'],
            image=data['image'],
            summary=data['summary'],
            publication_date=timezone.now(),
            last_modification_date=timezone.now(),
            tags=data['tags'],
            user=user
        )
        blog.save()
        # add the sections
        for section in data['sections']:
            BlogSections.objects.create(
                title=section['title'],
                content=section['content'],
                order=section['order'],
                image=section['image'],
                blog_post=blog
            )
            
        # Update tags using the optimized function
        update_blog_tags(blog.id, data)
        
        serializer = BlogPostsSerializer(blog, many=False)
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt  
@api_view(['PUT'])
def update_blog(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)
        
        data = json.loads(request.body.decode('utf-8'))
        
        blog = BlogPosts.objects.get(id=data['blog_id'])
        blog.title = data['title']
        blog.image = data['image']
        blog.summary = data['summary']
        blog.last_modification_date = timezone.now()
        blog.tags = data['tags']
        blog.save()
        
        # update the sections
        # get the section ids and based on that update the sections
        # if the id is not present then create a new section
        for section in data['sections']:
            if section.get('section_id'):
                blog_section = BlogSections.objects.get(id=section['section_id'])
                blog_section.title = section['title']
                blog_section.content = section['content']
                blog_section.order = section['order']
                blog_section.image = section['image']
                blog_section.save()
            else:
                BlogSections.objects.create(
                    title=section['title'],
                    content=section['content'],
                    order=section['order'],
                    image=section['image'],
                    blog_post=blog
                )
                
        # Update tags using the optimized function
        update_blog_tags(blog.id, data)

        serializer = BlogPostsSerializer(blog, many=False)
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)    

@csrf_exempt
@api_view(['POST']) 
def add_comment(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)
        
        data = json.loads(request.body.decode('utf-8'))
        blog_id = data['blog_id']
        
        comment = BlogComments.objects.create(
            text=data['text'],
            date=timezone.now(),
            blog_post=BlogPosts.objects.get(id=blog_id),
            user=user
        )
        comment.save()
        
        # update notification table
        blog = BlogPosts.objects.get(id=blog_id)
        notification = Notifications.objects.create(
            notification = user.name + " commented on your blog",
            date = timezone.now(),
            user = blog.user,
            is_recipe = False,
            blog = blog,
            recipe=None
        )
        notification.save()
        
        serializer = BlogCommentsSerializer(comment, many=False)
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
  
@csrf_exempt
@api_view(['DELETE'])
def delete_blog(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        data = json.loads(request.body.decode('utf-8'))
        blog_id = data.get('blog_id')
        blog = BlogPosts.objects.get(id=blog_id)
        blog.delete()
        return JsonResponse({'success': 'Blog deleted successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@api_view(['DELETE'])
def delete_comment(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        data = json.loads(request.body.decode('utf-8'))
        comment_id = data.get('comment_id')
        comment = BlogComments.objects.get(id=comment_id)
        comment.delete()
        return JsonResponse({'success': 'Comment deleted successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
 
@csrf_exempt
@api_view(['POST'])
def add_ratings(request):
    json_data = json.loads(request.body.decode('utf-8'))
    token = json_data.get('jwt')
    if not token:
        return JsonResponse({'error': 'Login required'}, status=401)
    try:
        user = get_user(token)

        blog_id = json_data.get('blog_id')
        ratings = json_data.get('ratings')
        
        # Find the blog post
        blog_post = BlogPosts.objects.get(id=blog_id)

        # Check if the user has already rated this blog post
        existing_rating = BlogPostRating.objects.filter(blog_post=blog_post, user=user).first()

        if existing_rating:
            # Update the existing rating
            existing_rating.ratings = ratings
            existing_rating.save()
        else:
            # Create a new rating
            BlogPostRating.objects.create(blog_post=blog_post, user=user, ratings=ratings)

        # Calculate the new average rating
        average_rating = BlogPostRating.objects.filter(blog_post=blog_post).aggregate(Avg('ratings'))['ratings__avg']
        blog_post.ratings = average_rating
        blog_post.save()

        # Return the new average rating in the response
        return JsonResponse({'response':'rating updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=401)

@csrf_exempt
@api_view(['PUT'])
def update_blog_search_tags(request):
     
    # loop through all the existing blogs
    # extract the tags and title from the blog
    # create a new tag if it does not exist in the RecipeSearchTags
    # add the tag to the blog
    for blog in BlogPosts.objects.all():
        title = blog.title
        user_tags = blog.tags
        all_tags = []
        for tag_name in set(title.lower().strip().split()) | set(user_tags):
            tag, _ = BlogSearchTags.objects.get_or_create(tag=tag_name)
            all_tags.append(tag)
        blog.blogSearchTags.clear()
        blog.blogSearchTags.add(*all_tags)
        blog.save()
    return JsonResponse({'response':'tags updated successfully'}, status=200)
    
@csrf_exempt
@api_view(['POST'])
def search_blogs(request):
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
            search_query |= Q(blogSearchTags__tag__icontains=term)
        
        blogs = BlogPosts.objects.filter(search_query).distinct()
        serializer = BlogSerializerForAll(blogs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)