
# RecipeShare - Full Stack Recipe Management Application

**RecipeShare** is an intuitive full-stack web application designed for managing recipes, meal planning, and nutritional tracking. Whether you are an aspiring chef or someone looking to maintain a healthy diet, RecipeShare allows users to upload, search, organize, and plan their meals effectively. The app integrates a third-party API for meal planning and calorie calculations, making it easy to meet your daily nutritional goals.

## Features

- **Recipe Upload and Editing**: Users can seamlessly upload new recipes, edit existing ones, and manage their recipe collection. The interface is user-friendly and ensures easy interaction for all skill levels.
- **Categorization and Tagging**: Recipes can be categorized by meal types (e.g., breakfast, lunch, dinner) and tagged with relevant keywords (e.g., vegetarian, gluten-free, spicy) for easy organization and searching.
- **Search and Filters**: The powerful search functionality allows users to search for recipes based on ingredients, tags, categories, or even user ratings. Filters further refine results, enabling users to find the perfect recipe for their needs.
- **User Profiles**: Users can create and maintain profiles, where they can save favorite recipes, track nutritional information, and personalize their meal plans based on their preferences.
- **Rating and Reviews**: Users can rate recipes and leave detailed reviews, helping others to discover the best dishes and make more informed decisions about which recipes to try.
- **Meal Planning**: The meal planning feature uses a third-party API to calculate daily calorie requirements based on user inputs such as age, gender, activity level, and dietary preferences. Meal plans are automatically adjusted, providing suggestions for balanced nutrition.
- **Health Blog**: The health blog section provides valuable content on healthy living, nutrition, and wellness. Users can access articles on topics such as balanced diets, fitness, and general well-being.
- **User Notifications**: Users receive real-time notifications for activities such as new recipes, updates to their saved recipes, and new blog posts. Notifications keep users engaged and informed about the latest updates on the platform.

## Technologies Used

### Frontend
- **Next.js**: A React framework for building server-side rendered and statically generated web applications. Next.js powers the entire frontend, ensuring fast load times and great SEO.
- **Tailwind CSS**: A utility-first CSS framework that makes it easy to design visually appealing and responsive web pages without writing custom CSS. Tailwind's approach allows rapid development with a clean, scalable design.

### Backend
- **Django**: A high-level Python web framework that facilitates rapid development of secure and maintainable web applications. Django powers the backend, handling user authentication, recipe management, and other API services.
- **PostgreSQL**: A powerful open-source relational database used to store all data, including user profiles, recipes, ratings, and comments. PostgreSQL provides robustness and scalability for the backend.

### Third-Party API
- **Meal Planning API**: A third-party API integrated to calculate personalized calorie requirements for users. The API takes user inputs and provides meal suggestions tailored to meet specific nutritional goals.

## Architecture Overview

The **RecipeShare** application follows a classic **Model-View-Controller (MVC)** architecture:

- **Model**: The Django ORM is used to define models for users, recipes, ratings, reviews, and meal plans. PostgreSQL serves as the database for storing these models.
- **View**: The frontend, built with Next.js, interacts with the backend through REST APIs and dynamically updates the user interface.
- **Controller**: Django views handle the logic for managing user requests, performing CRUD operations on recipes, and calculating calorie requirements based on meal planning inputs.

## Getting Started

### Prerequisites

To run the RecipeShare application locally, you will need the following software:

- **Node.js** (v16 or higher) - Required for the frontend development.
- **Python 3.x** - Required for the backend development with Django.
- **PostgreSQL** - Relational database system to store and manage data.

### Installation Steps

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/recipeshare.git
   ```

2. Set up the frontend:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install required dependencies:
     ```bash
     npm install
     ```

3. Set up the backend:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up your PostgreSQL database:
     - Create a PostgreSQL database and configure the database settings in Django’s `settings.py`.
   - Apply database migrations to set up the schema:
     ```bash
     python manage.py migrate
     ```

4. Run both frontend and backend servers:
   - Start the frontend server:
     ```bash
     npm run dev
     ```
   - Start the backend server:
     ```bash
     python manage.py runserver
     ```

5. Access the application at `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.

### Usage

- **Create a User Profile**: Register an account and log in to personalize your experience.
- **Browse and Search Recipes**: Use the search bar and filters to discover recipes that suit your needs.
- **Meal Planning**: Enter your daily nutritional requirements and receive tailored meal suggestions based on available recipes.
- **Rate and Review**: Rate and review recipes that you have tried, and view others' feedback on recipes.

## Contribution

This project is a collaborative effort, and contributions are welcome! If you'd like to contribute, here are some ways you can get involved:

- **Fork the repository** and create a pull request with your improvements.
- **Add new features**: If there's a feature you'd like to see, feel free to open an issue or submit a pull request with your idea.
- **Fix bugs**: Review the existing issues in the repository and submit fixes.

To maintain consistency, ensure that your code follows the existing style guides, and add appropriate tests for new functionality.

