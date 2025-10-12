// seedMenu.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.model.js";
import MenuItem from "./models/Menu.model.js";


dotenv.config();

const categories = [
  { name: "Breakfast" },
  { name: "Lunch" },
  { name: "Snacks" },
  { name: "Dinner" },
  { name: "Desserts" },
  { name: "Drinks" },
];

const menuItems = [
  // --- Breakfast ---
  {
    name: "Puttu and Kadala Curry",
    category: "Breakfast",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Shaheen_Ali/Puttu_and_Kadala_Curry.jpg",
  },
  {
    name: "Appam with Stew",
    category: "Breakfast",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/03/appam-1.jpg",
  },
  {
    name: "Idiyappam with Egg Curry",
    category: "Breakfast",
    image: "https://www.kannammacooks.com/wp-content/uploads/puttu-kadala-curry-1.jpg",
  },
  {
    name: "Pathiri with Chicken Curry",
    category: "Breakfast",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/Indian_Breads_Puris_Parathas/Pathiri_Recipe_Kerala_Neipathal.jpg",
  },

  // --- Lunch ---
  {
    name: "Kerala Sadhya",
    category: "Lunch",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Onam_Sadya_1.JPG",
  },
  {
    name: "Kappa and Meen Curry",
    category: "Lunch",
    image:
      "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Jyothi_Rajesh/Kappa_Meen_Curry_Recipe_Tapioca_Fish_Curry.jpg",
  },
  {
    name: "Malabar Chicken Biryani",
    category: "Lunch",
    image: "https://www.awesomecuisine.com/wp-content/uploads/2008/06/malabar_chicken_biryani.jpg",
  },
  {
    name: "Kerala Fish Fry",
    category: "Lunch",
    image: "https://www.kannammacooks.com/wp-content/uploads/kerala-meen-fry-recipe-1.jpg",
  },

  // --- Snacks ---
  {
    name: "Parippu Vada",
    category: "Snacks",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/shaheen_ali/Parippu_Vada.jpg",
  },
  {
    name: "Uzhunnu Vada",
    category: "Snacks",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/medu-vada-3.jpg",
  },
  {
    name: "Pazham Pori",
    category: "Snacks",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/shaheen_ali/Pazham_Pori_Recipe_Banana_Fritters.jpg",
  },

  // --- Dinner ---
  {
    name: "Porotta and Beef Curry",
    category: "Dinner",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Jyothi_Rajesh/Porotta_Beef_Curry_Kerala_Style.jpg",
  },
  {
    name: "Nadan Chicken Curry",
    category: "Dinner",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/nadan-chicken-curry.jpg",
  },
  {
    name: "Idiyappam with Veg Kurma",
    category: "Dinner",
    image: "https://www.kannammacooks.com/wp-content/uploads/idiyappam-veg-kurma-1.jpg",
  },

  // --- Desserts ---
  {
    name: "Palada Payasam",
    category: "Desserts",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Jyothi_Rajesh/Palada_Payasam_Kerala_Style_Recipe.jpg",
  },
  {
    name: "Ada Pradhaman",
    category: "Desserts",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/08/ada-pradhaman-1.jpg",
  },
  {
    name: "Unniyappam",
    category: "Desserts",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/smitha_kalluraya/Unniyappam_Recipe.jpg",
  },

  // --- Drinks ---
  {
    name: "Sulaimani Tea",
    category: "Drinks",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Shaheen_Ali/Sulaimani_Tea_Recipe.jpg",
  },
  {
    name: "Tender Coconut Water",
    category: "Drinks",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Coconut_Water.jpg",
  },
  {
    name: "Chukku Kaapi",
    category: "Drinks",
    image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/Shaheen_Ali/Chukku_Kappi_Recipe_Kerala_Herbal_Coffee.jpg",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Category.deleteMany();
    await MenuItem.deleteMany();

    await Category.insertMany(categories);
    console.log("✅ Categories Added");

    await MenuItem.insertMany(menuItems);
    console.log("✅ Menu Items Added");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
