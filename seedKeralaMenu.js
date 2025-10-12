import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.model.js";
import MenuItem from "./models/Menu.model.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

const categories = [
  "Breakfast",
  "Lunch",
  "Seafood Specials",
  "Biryani & Rice",
  "Snacks & Evening Delights",
  "Desserts & Sweets",
  "Vegetarian Dishes",
  "Beverages",
];

const keralaMenu = [
  {
    name: "Puttu and Kadala Curry",
    description:
      "Steamed rice flour cylinders served with spicy black chickpea curry — a staple Kerala breakfast.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibin_george/Puttu_Kadala_Curry_Kerala.jpg",
    category: "Breakfast",
  },
  {
    name: "Appam with Stew",
    description:
      "Soft lacy rice pancakes paired with mildly spiced coconut milk vegetable or chicken stew.",
    image:
      "https://www.vegrecipesofindia.com/wp-content/uploads/2018/10/appam-recipe-2.jpg",
    category: "Breakfast",
  },
  {
    name: "Kerala Fish Curry (Meen Curry)",
    description:
      "A tangy red fish curry cooked with tamarind, coconut oil, and spices — best enjoyed with rice.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibin_george/kerala_style_fish_curry_with_kudampuli_recipe.jpg",
    category: "Seafood Specials",
  },
  {
    name: "Karimeen Pollichathu",
    description:
      "Pearl spot fish marinated with masala, wrapped in banana leaf, and grilled to perfection.",
    image:
      "https://www.kannammacooks.com/wp-content/uploads/karimeen-pollichathu.jpg",
    category: "Seafood Specials",
  },
  {
    name: "Malabar Chicken Biryani",
    description:
      "Aromatic biryani made with short-grain rice, rich spices, and tender chicken from Malabar region.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Madhu_Govindarajan/Malabar_Chicken_Biryani_Recipe.jpg",
    category: "Biryani & Rice",
  },
  {
    name: "Kerala Veg Thali",
    description:
      "Traditional vegetarian meal with sambar, avial, thoran, olan, pachadi, and payasam served with rice.",
    image:
      "https://www.tasteatlas.com/images/dishes/4d1c90eb8d864a88ad13d4b1c2f87413.jpg",
    category: "Vegetarian Dishes",
  },
  {
    name: "Parotta with Beef Curry",
    description:
      "Layered flaky parotta paired with spicy Kerala-style beef curry — a true street food classic.",
    image:
      "https://www.kannammacooks.com/wp-content/uploads/parotta-beef-curry.jpg",
    category: "Lunch",
  },
  {
    name: "Kappa and Meen Curry",
    description:
      "Boiled tapioca served with fiery Kerala fish curry — a rustic and traditional delicacy.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Anupa_Joseph/Kappa_Vevichathu_Kerala_Style_Mashed_Tapioca_With_Spicy_Fish_Curry.jpg",
    category: "Lunch",
  },
  {
    name: "Banana Fritters (Pazham Pori)",
    description:
      "Ripe plantains dipped in batter and deep fried — a beloved Kerala tea-time snack.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibin_george/Pazham_Pori_Banana_Fritters_Kerala_Recipe.jpg",
    category: "Snacks & Evening Delights",
  },
  {
    name: "Unniyappam",
    description:
      "Small fried rice cakes made with jaggery, banana, and coconut — soft inside and crisp outside.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Jyothi_Rajesh/Kerala_Style_Unniyappam_Recipe.jpg",
    category: "Desserts & Sweets",
  },
  {
    name: "Palada Payasam",
    description:
      "Rich, creamy dessert made with rice ada, milk, and sugar — a must-have in Kerala feasts.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibin_george/Palada_Payasam_Kerala_Style_Rice_Ada_Payasam.jpg",
    category: "Desserts & Sweets",
  },
  {
    name: "Sambaram (Spiced Buttermilk)",
    description:
      "Cool and refreshing drink made with buttermilk, ginger, green chili, and curry leaves.",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sibin_george/Sambaram_Spiced_Buttermilk_Kerala.jpg",
    category: "Beverages",
  },
];

const seedKeralaMenu = async () => {
  try {
    console.log("Clearing old data...");
    await Category.deleteMany({});
    await MenuItem.deleteMany({});

    console.log("Inserting categories...");
    await Category.insertMany(categories.map((name) => ({ name })));

    console.log("Inserting Kerala menu items...");
    await MenuItem.insertMany(keralaMenu);

    console.log("Success! Data seeded.");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding:", err);
    mongoose.disconnect();
  }
};

seedKeralaMenu();
