type Blog = {
  id: number;
  title: string;
  summary: string;
  content?: string;  // Assuming content is optional based on your JSON structure
  image: string;      // Optional image field
  publication_date: string;
  last_modification_date: string;
  tags: string[];
  ratings: number;
  user: {
    name: string;
    // Add other user-related fields based on your User model
  };
  sections: {
    id: number;
    title: string;
    content: string;
    image: string[];  // Assuming image is an array of strings based on your JSON structure
    order: number;
  }[];
  comments: {
    id: number;
    text: string;
    date: string;
    user: number;  // Assuming user is a user ID
  }[];

};

type Recipe = {
  id: number;
  title: string;
  cooking_time: number;
  difficulty_level: string;
  description: string,
  image: string,
  video: string,
  meal_type: string,
  ingredients: string[][];
  instructions: string[][];
  tags: string[],
  user: {
    name: string;
    // Add other user-related fields based on your User model
  };

};
export const recipeData: Recipe={
  id: 1,
  title: 'Delicious Pancakes',
  cooking_time: 20,
  difficulty_level: 'Easy',
  description: 'A simple and tasty pancake recipe.',
  image: '/pancake.jpeg',
  video: '', // Empty video field
  meal_type: 'Breakfast',
  ingredients: [['Flour', 'Eggs', 'Milk'], ['Butter', 'Salt', 'Sugar']],
  instructions: [
    ['Mix flour, eggs, and milk in a bowl', 'Heat a pan and add butter'],
    ['Pour the batter into the pan', 'Cook until golden brown on both sides'],
  ],
  tags: ['Pancakes', 'Breakfast'],
  user: {
    name: 'John Doe',
  },



};

type UserDetail = {
  id: number,
  name: string;
  email: string;
  image: string | null;
  date_joined: string;
  last_login: string;
};

export const userDetails: UserDetail = {
  id: 1,
  name: " Asif",
  email: "aba12@gmail.com",
  image: "/logo.png",
  date_joined: "2023-23",
  last_login: "2024-23",

};

export const blogData: Blog = {

  id: 12,
  title: "HOW TO BURN THROUGH FAT IN WINTER?",
  summary: "As the cold sets in, we all know the struggle – the cosy blankets, the comfort foods calling our names. But guess what? Winter doesn’t have to be the enemy of your weight loss goals. In fact, it can be your secret weapon to emerge in spring feeling rejuvenated and lean. In this blog, let’s explore some simple yet effective strategies to own your weight loss journey and burn through fat this winter.",
  image: "https://artofhealthyliving.com/wp-content/uploads/2024/01/How-to-Burn-Through-Fat-in-Winter.jpg",
  publication_date: "2024-01-26T18:17:06.392439Z",
  last_modification_date: "2024-01-26T19:05:44.653028Z",
  tags: [
    "fit",
    "health",
    "winter",
    "exercise"
  ],
  ratings: 0,
  user: {
    "name": "tanveer"
  },
  sections: [
    {
      "id": 18,
      "title": "Revamp Your Winter Diet",
      "content": "Winter brings with it those hearty food cravings. But instead of surrendering to calorie-packed comfort foods, how about we focus on some delicious, nutrient-packed options? Opt for various seasonal vegetables, lean proteins, and whole grains. Soups, stews, and herbal teas can satisfy and support your weight loss journey.",
      "image": ["/user.jpg"],
      "order": 1
    },
    {
      "id": 19,
      "title": "Stay Hydrated",
      "content": "Winter air might make you forget how thirsty you are, but hydration is non-negotiable. Incorporate at least eight glasses of water into your daily routine, aiming to keep your body well-hydrated. And here is a little twist – warm water with lemon or herbal infusions. Not only does this make hydration more enjoyable, but it also provides an extra layer of comfort during the winter season.",
      "image": ["https://artofhealthyliving.com/wp-content/uploads/2024/01/How-to-Burn-Through-Fat-in-Winter.jpg"],
      "order": 2
    },
    {
      "id": 20,
      "title": "Outdoor Workouts",
      "content": "When it is cold outside, we understand that the temptation to snuggle up with a blanket and a warm fire is so strong. But here, let’s not throw our fitness routine out the window. Skiing, snowboarding, or just a brisk walk in the crisp air. The cold can actually rev up your calorie burn, and soaking in that natural light can do wonders for your sleep and metabolism. Winter workouts can be cool – literally.",
      "image": [],
      "order": 3
    },
    {
      "id": 21,
      "title": "Healthy Snacking",
      "content": "Just because the cold season is here doesn’t mean we give in to those not-so-health cravings. Keep a stash of goodies that not only satisfy your hunger but also support your weight loss goals. Nuts like almonds and walnuts aren’t just crunchy delights; they are packed with nutritious fats. Seeds, like pumpkins or sunflowers, add a nutrient boost. Sprinkle them on salads or yoghurt.",
      "image": [],
      "order": 4
    },
    {
      "id": 22,
      "title": "Conclusion",
      "content": "Winter weight loss is not a myth; it is totally doable. Balance your diet, stay active, get good sleep and be mindful of your habits. Consistency is the key, and these simple lifestyle challenges will have you emerging from winter feeling like a champion!",
      "image": [],
      "order": 5
    }
  ],
  comments: [
    {
      "id": 1,
      "text": "Good Post",
      "date": "2024-01-26T18:36:07.768712Z",
      "user": 1
    }
  ]
};
