from rest_framework import serializers
from .models import *

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ('id', 'notification', 'date', 'is_read', 'user')
        
class RecipeSerializer(serializers.ModelSerializer):
    ingredients = serializers.JSONField()
    tags = serializers.JSONField()
    steps = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ('id', 'title','description','cooking_time', 'difficulty_level', 'image','video','ingredients',
                  'tags','rating','meal_type','last_edited','reviews','user','steps')

    def get_steps(self, obj):
        return StepSerializer(obj.recipesteps_set.all(), many=True).data
    
class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeSteps
        fields = ('order','step', 'image')

# when a certain user's information is wanted
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'name', 'email', 'image', 'date_joined', 'last_login', 'is_admin')

# when only the username is wanted 
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name']  # Include other fields as needed

class BlogSectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogSections
        fields = ['id','title', 'content', 'image', 'order']
        
class BlogCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComments
        fields = ['id','text', 'date', 'user']
        
class BlogPostsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # Assuming you have a CustomUserSerializer
    comments = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = BlogPosts
        fields = ['id','title', 'summary', 'image', 'publication_date', 'last_modification_date',
                  'tags', 'ratings', 'user', 'sections', 'comments']
        
    def get_sections(self, obj):
        return BlogSectionsSerializer(obj.blogsections_set.all(), many=True).data
    def get_comments(self, obj):
        return BlogCommentsSerializer(obj.blogcomments_set.all(), many=True).data
    def get_user(self, obj):
        return CustomUserSerializer(obj.user).data  

    
# when all blogs are wanted
class BlogSerializerForAll(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = BlogPosts
        fields = ['id','title','publication_date', 'image', 'last_modification_date',
                  'tags', 'ratings', 'user']
        
        
# class BlogCommentsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BlogComments
#         fields = ['id', 'text', 'date', 'user']

# class BlogSectionsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BlogSections
#         fields = ['id', 'title', 'content', 'image', 'order']

# class BlogPostsSerializer(serializers.ModelSerializer):
    
#     user = serializers.StringRelatedField()
#     comments = BlogCommentsSerializer(many=True, read_only=True)
#     sections = BlogSectionsSerializer(many=True, read_only=True)

#     class Meta:
#         model = BlogPosts
#         fields = ['id', 'title', 'summary', 'image', 'publication_date', 'last_modification_date',
#                   'tags', 'ratings', 'user', 'sections', 'comments']

        
