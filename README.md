
# RecipeShare

This is the django Backend for the term project for the course CSE-408. PostgreSql database is used. Both the database and the backend code is hosted in Render. 


## Environment setup

At first create a python virtual environment. 

```bash
  python -m venv "environment_name"
```

Clone the github repository
```bash
    git clone https://github.com/Tanveer2719/CSE408-RecipeShare.git
```
First,  activate the virtual envrionment by navigating where the 'bin' file is present and activate it:
```bash
    source bin/activate
```

Now, Navigate to the directory where 'manage.py' is present. Install necessary packages from the requirements.txt
```bash
    pip install -r requirements.txt
```

Update the envrionment variables by creating a .env file and update the necessary environment variables that are mentioned in the settings.py file


In order to run in the local database, uncomment the databse section in the settings.py file

```bash
    # DATABASES = {
    #     'default': {
    #         'ENGINE': 'django.db.backends.postgresql',
    #         'NAME': 'RecipeShare',
    #         'USER': 'postgres',
    #         'PASSWORD': POSTGRES_PASSWORD,
    #         'HOST': 'localhost',   # Set to the PostgreSQL server's hostname or IP address
    #         'PORT': '5432',        # Set to the PostgreSQL server's port
    #     }
    # }
```

and comment the other part for the database,
```bash
    # Render deployment
    import dj_database_url
    DATABASE_URL = config('DATABASE_URL')
    DATABASES= {
        'default': dj_database_url.parse(DATABASE_URL)
    }
```



## Start server

Go to the directory where manage.py is situated and start the server
```bash
    python3 manage.py runserver
```

And you are on ....