from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, name, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    password = models.CharField(max_length=200, default=1)
    image = models.CharField(max_length=1000, default='')
    last_login = models.DateTimeField('last login', default=timezone.now)
    date_joined = models.DateTimeField('date joined', default=timezone.now)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name
    
class Notifications(models.Model):
    notification = models.CharField(max_length=200)
    date = models.DateTimeField('date published')
    is_read = models.BooleanField(default=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)   # who receives the notification 
    
    def __str__(self):
        return self.notification
    
class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) # who gives the review
    review = models.CharField(max_length=200)
    date = models.DateTimeField('date published')
    def __str__(self):
        return self.review

class Recipe(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=500, default='')
    cooking_time = models.IntegerField(default=0)
    difficulty_level = models.CharField(max_length=10)
    servings=models.IntegerField(default=1)
    ingredients = models.JSONField()
    tags = models.JSONField()
    calories = models.IntegerField(default=0)
    ratings = models.FloatField(default=0)
    meal_type = models.CharField(max_length=200)
    last_edited = models.DateTimeField('last edited', auto_now=True)
    reviews = models.ManyToManyField(Review)
    image = models.CharField(max_length=1000, default=None)
    video = models.CharField(max_length=1000, default=None)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)   # who uploads the recipe
    recipeSearchTags = models.ManyToManyField('RecipeSearchTags')
     
    def __str__(self):
        return self.title

class RecipePostRating(models.Model):
    recipe_post = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ratings = models.IntegerField()
   
class RecipeSteps(models.Model):
    order = models.IntegerField(default=0)
    step = models.CharField(max_length=1000)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    image = models.CharField(max_length=1000, default=None)
    
    def __str__(self):
        return self.step 
  
class Cuisine(models.Model):
    name = models.CharField(max_length=200)
    recipes = models.ManyToManyField(Recipe)
    def __str__(self):
        return self.name

class BlogPosts(models.Model):
    title = models.CharField(max_length=200)
    image = models.CharField(max_length=1000, default=None)
    summary = models.CharField(max_length=1000, default='')
    publication_date = models.DateTimeField('publication date')
    last_modification_date = models.DateTimeField('last modification date')
    tags = models.JSONField()
    ratings = models.FloatField(default=0)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)   # who uploads the blog

    def __str__(self):
        return self.title
    
class BlogPostRating(models.Model):
    blog_post = models.ForeignKey(BlogPosts, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ratings = models.IntegerField()

class BlogSections(models.Model):
    title = models.CharField(max_length=200)
    content = models.CharField(max_length=1500)
    image = models.JSONField()
    order = models.IntegerField(default=0)
    blog_post = models.ForeignKey(BlogPosts, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title

class BlogComments(models.Model):
    text = models.CharField(max_length=200)
    date = models.DateTimeField('date published')
    blog_post = models.ForeignKey(BlogPosts, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)   # who uploads the comment
      
class RecipeSearchTags(models.Model):
    tag = models.CharField(max_length=200)
    def __str__(self):
        return self.tag
    
class IngredientsWithNutrition(models.Model):
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=200)
    amount = models.IntegerField(default=0)
    gm_weight = models.IntegerField(default=0)
    calorie = models.IntegerField(default=0)
    protein = models.IntegerField(default=0)
    fat = models.IntegerField(default=0)
    carbohydrate = models.IntegerField(default=0)
    
    def __str__(self):
        return self.ingredient
    
class RecipeComments(models.Model):
    text = models.CharField(max_length=200)
    date = models.DateTimeField('date published')
    recipe_post = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)   # who uploads the comment

   